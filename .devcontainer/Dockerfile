# Nutzt das aktuellste LTS Release von Node (Version 22)
FROM mcr.microsoft.com/devcontainers/typescript-node:22

# Installiere die globalen Pakete explizit als 'node' User.
# Dies verhindert Rechte-Probleme, da der Container später auch als 'node' User läuft.
RUN su node -c "npm install -g @angular/cli firebase-tools"
