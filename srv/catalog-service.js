import cds from '@sap/cds'

/**
 * Spelregels van de etalage (W4).
 */
export class CatalogService extends cds.ApplicationService { init() {

  const { Games, Reviews } = this.entities
  const { OrderItems } = cds.entities('levelup')

  // ---------------------------------------------------------------
  // 1. Review: rating 1-5 staat declaratief in het model (@assert.range),
  //    de inhoud van het commentaar controleren we hier
  // ---------------------------------------------------------------
  this.before(['CREATE', 'UPDATE'], Reviews, (req) => {
    const { comment } = req.data
    if (comment !== undefined && (comment ?? '').trim().length < 10)
      req.error(400, 'Een review heeft minstens 10 tekens commentaar nodig.', 'comment')
  })

  // Side quest B: enkel klanten die de game kochten, mogen een review schrijven
  this.before('CREATE', Reviews, async (req) => {
    const { game_ID, customer_ID } = req.data
    const gekocht = await SELECT.one.from(OrderItems)
      .where`game_ID = ${game_ID} and order.customer_ID = ${customer_ID}`
    if (!gekocht) req.error(403, 'Enkel klanten die deze game kochten, kunnen een review schrijven.', 'customer_ID')
  })

  // ---------------------------------------------------------------
  // 2. Unbound function: top N games op gemiddelde rating
  // ---------------------------------------------------------------
  this.on('topGames', async (req) => {
    const limit = req.data.limit ?? 5
    return SELECT.from(Reviews)
      .columns('game.ID as ID', 'game.title as title', 'round(avg(rating), 2) as avgRating', 'count(*) as reviews')
      .groupBy('game.ID', 'game.title')
      .orderBy('avgRating desc', 'reviews desc')
      .limit(limit)
  })

  // ---------------------------------------------------------------
  // 3. Side quest: virtueel veld isNew (release minder dan 30 dagen geleden)
  // ---------------------------------------------------------------
  this.after('READ', Games, (games) => {
    const grens = new Date(Date.now() - 30 * 24 * 3600 * 1000)
    for (const g of Array.isArray(games) ? games : [games])
      if (g?.releaseDate) g.isNew = new Date(g.releaseDate) >= grens
  })

  return super.init()
}}
