# Projektspecifika regler för PWA Tester Pro

## Versionering och Ändringslogg
Vid varje förändring eller uppdatering av appen skall versionen **alltid höjas med 0.0.01** (till exempel från `0.9.01` till `0.9.02`).

### Checklista vid varje ändring:
1. Uppdatera `"version"` i `package.json`.
2. Uppdatera versionstexten i App-headern i `src/App.tsx` (`vers X.XX.XX`).
3. Lägg till en ny post högst upp i `VERSION_HISTORY` i `src/App.tsx` med den nya versionen (t.ex. `v0.9.02`), dagens datum samt punktlista över genomförda ändringar.
