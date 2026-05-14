# AI Agent Instructions

Welcome to the project! This document explains how to interact with this project.

1. This project is an Angular application with a Firebase backend.
2. We use a Dev Container setup (`.devcontainer/devcontainer.json`) for consistency.
3. Firebase Emulators are used for local development, configured in `firebase.json`. They must be started separately via `npm run emulators` before running `npm run start` or `npm run test`.
4. Continuous Integration is managed via GitHub Actions `.github/workflows`. Secrets should be injected correctly before the build.

Always follow best practices and validate your changes!
