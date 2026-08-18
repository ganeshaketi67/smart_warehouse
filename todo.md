# Inventory receive persistence fix

- [x] Trace why received stock resets when leaving or reloading Inventory.
- [x] Persist inventory records and receive mutations in browser storage.
- [x] Hydrate Inventory from saved state and keep available-stock calculations synchronized.
- [x] Preserve activity history entries for receive events without duplicate logging on reload.
- [x] Verify navigation, reload behavior, calculations, TypeScript, production build, and responsive Inventory UI.
- [x] Save a new checkpoint and deliver the persistence fix.
