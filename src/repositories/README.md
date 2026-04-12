# Repositories Module

This directory contains the repository layer for managing access to external resources and data sources.

## Overview

The repository module acts as an abstraction layer between the application logic and the underlying data or asset sources. It provides a clean API for retrieving resources without exposing the details of how they are stored or imported.

## Main Files

- `assetRepository.ts`: Manages access to static assets (images, textures, icons). It maps logical names (e.g., "Gale") to actual imported asset URLs, allowing components to retrieve assets dynamically.

## Architectural Role

Repositories serve several key purposes:
1. **Abstraction**: Hiding the complexity of asset imports or database queries.
2. **Centralization**: Providing a single place to update resource paths or retrieval logic.
3. **Decoupling**: Allowing the domain and UI layers to request data by "what it is" rather than "where it is".

In a larger application, this directory would also include repositories for API data fetching, local storage management, and database interactions.
