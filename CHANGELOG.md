# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [0.0.5]

### Added

-   Add typings.
-   Support props without attribute, which can be any type.
-   Add prop setter functions. These functions don't trigger a render, but they can dispatch events.

### Changed

-   **Breaking:** The list of props is now passed to `makeWebComponents` as the second argument instead of being a property on the function.
-   **Breaking:** `props` are not mirrored to attributes anymore. Use `attrs` for this usecase, but note that these can only hold strings.

## [0.0.4]

### Fixed

-   Minified version was broken. The generated element wasn't a `class extends HTMLElement`.

## [0.0.3] BROKEN

### Added

-   Minified published files.
-   Publish main (CommonJS) and module (ES module) version.

### Fixed

-   Fixed example of `useState` in readme.

## [0.0.2]

### Fixed

-   Fixed install instructions in readme.

## 0.0.1

-   First release.

[unreleased]: https://github.com/frigus02/kyml/compare/v0.0.5...HEAD
[0.0.5]: https://github.com/frigus02/kyml/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/frigus02/kyml/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/frigus02/kyml/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/frigus02/kyml/compare/v0.0.1...v0.0.2
