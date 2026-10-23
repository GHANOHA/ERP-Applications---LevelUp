import cds from '@sap/cds'

/**
 * Spelregels van de kassa (W4).
 * before = controleren, on = zelf uitvoeren, after = nabewerken.
 */
export class OrderService extends cds.ApplicationService { init() {

  const { Orders } = this.entities
  const { Games } = cds.entities('levelup')   // rechtstreeks de databasetabel

  // ---------------------------------------------------------------
  // 1. Een nieuwe order controleren en aanvullen
  // ---------------------------------------------------------------
  this.before('CREATE', Orders, async (req) => {
    const { items } = req.data

    if (!items?.length)
      return req.reject(400, 'Een order heeft minstens één orderregel nodig.', 'items')

    // Prijzen en voorraad halen we uit de database, niet uit de request
    const ids = items.map(i => i.game_ID)
    const games = await SELECT.from(Games).columns('ID', 'title', 'price', 'stock').where({ ID: { in: ids } })

    let total = 0
    for (const [i, item] of items.entries()) {
      const game = games.find(g => g.ID === item.game_ID)
      if (!game) { req.error(400, `Game ${item.game_ID} bestaat niet.`, `items/${i}/game_ID`); continue }
      if (!(item.quantity > 0)) { req.error(400, `Aantal voor "${game.title}" moet groter zijn dan 0.`, `items/${i}/quantity`); continue }
      if (item.quantity > game.stock) { req.error(409, `Onvoldoende voorraad voor "${game.title}" (nog ${game.stock}).`, `items/${i}/quantity`); continue }

      item.unitPrice = game.price                 // server bepaalt de prijs
      total += game.price * item.quantity
    }

    req.data.totalAmount = Math.round(total * 100) / 100
    req.data.status_code = 'OPEN'
  })

  // ---------------------------------------------------------------
  // 2. Na het aanmaken: voorraad verminderen
  // ---------------------------------------------------------------
  this.after('CREATE', Orders, async (_, req) => {
    // Let op: het resultaat van een CREATE bevat de items niet altijd → gebruik req.data
    for (const item of req.data.items)
      await UPDATE(Games, item.game_ID).with({ stock: { '-=': item.quantity } })
  })

  // ---------------------------------------------------------------
  // 3. Bound action: order annuleren en voorraad terugzetten
  // ---------------------------------------------------------------
  this.on('cancel', Orders, async (req) => {
    const { ID } = req.params[0]
    const order = await SELECT.one.from(Orders, ID).columns(o => { o.status_code, o.items(i => { i.game_ID, i.quantity }) })

    if (!order) return req.reject(404, 'Order niet gevonden.')
    if (order.status_code === 'CANCELLED') return req.reject(409, 'Deze order is al geannuleerd.')
    if (order.status_code === 'PAID') return req.reject(409, 'Een betaalde order kan je niet annuleren.')

    for (const item of order.items)
      await UPDATE(Games, item.game_ID).with({ stock: { '+=': item.quantity } })
    await UPDATE(Orders, ID).with({ status_code: 'CANCELLED' })

    return SELECT.one.from(Orders, ID)
  })

  // ---------------------------------------------------------------
  // Side quest C: order betalen
  // ---------------------------------------------------------------
  this.on('pay', Orders, async (req) => {
    const { ID } = req.params[0]
    const order = await SELECT.one.from(Orders, ID).columns('status_code')
    if (!order) return req.reject(404, 'Order niet gevonden.')
    if (order.status_code !== 'OPEN') return req.reject(409, `Enkel een open order kan je betalen (status: ${order.status_code}).`)
    await UPDATE(Orders, ID).with({ status_code: 'PAID' })
    return SELECT.one.from(Orders, ID)
  })

  return super.init()
}}
