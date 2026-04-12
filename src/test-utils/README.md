# Test Utilities

This directory contains helper scripts and mocks used to facilitate testing across the application.

## Overview

Test utilities provide shared infrastructure for unit, integration, and end-to-end tests, ensuring that tests run reliably in different environments (e.g., Node.js vs. Browser).

## Main Files

- `exodus-bytes-mock.cjs`: A CommonJS mock for text encoding utilities (`TextEncoder`, `TextDecoder`). This is often required when running tests in Node.js environments where these globals might behave differently or be missing from certain library contexts.

## Architectural Role

The Test Utils directory is responsible for:
1. **Mocking Globals**: Providing consistent mocks for browser APIs or third-party libraries that are not available during testing.
2. **Shared Helpers**: Housing reusable test data factories or assertion helpers (future).
3. **Environment Setup**: Configuring the test runner to handle specific project quirks.

By centralizing these utilities, we reduce duplication in test files and make the testing infrastructure more maintainable.
