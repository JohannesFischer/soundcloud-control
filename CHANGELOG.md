# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.0] - 2021-04-06
### Removed
- Option to manage keyboard shortcuts in favor of Firefox shortcut manager
### Added
- Added `test` script running ESLint and web-ext lint
### Changed
- Replaced Webpack with Rollup as bundler
- Replaced ESLint config standard with `recommended/esnext`
- Changed `build:js` sript to `build`
- Changed `ff` script to `start`
