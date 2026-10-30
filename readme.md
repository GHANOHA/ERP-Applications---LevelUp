# LevelUp – referentieoplossing W5 (Beheerder Mode: Fiori Elements)

Bouwt verder op W4. Nieuw:

- `srv/admin-service.cds`: AdminService (/odata/v4/admin) met `@odata.draft.enabled` op Games
- `db/schema.cds`: berekend veld `stockCriticality` en CDS-view `GameLeaderboard` (group by, avg, count)
- `app/admin-games`: List Report + Object Page voor Games (annotaties in `annotations.cds`)
- `app/leaderboard`: List Report met sterrenrating, standaard gesorteerd
- `app/services.cds`: laadt de annotaties van beide apps

```bash
npm install
cds watch
```

Open daarna http://localhost:4004 en kies een app onder "Web Applications", of de "Fiori preview" bij AdminService.
`test.http`: queries 30–34 zijn nieuw in W5. Backend getest met @sap/cds 10.1 (23 oktober 2026); de UI5-apps laden SAPUI5 van ui5.sap.com.
