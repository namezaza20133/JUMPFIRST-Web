# Release Notes

## v1.1.0 - 2026-08-07

### Highlights
- Added robust light mode behavior and automatic logo swap for theme changes.
- Upgraded theme control to a slider-style toggle with subtle animation and accessibility states.
- Added Thai and English language switching with localStorage persistence.
- Reworked header information architecture and compact spacing for better clarity.
- Added back-to-top button and refined scroll behavior.

### Refactor and Maintainability
- Extracted bilingual copy and selector bindings into a dedicated content store: js/content.js.
- Refactored runtime logic in js/app.js into clearer sections:
	- DOM references
	- Content binding helpers
	- Theme/language state management
	- Bootstrap initialization
	- Event handlers
- Updated script load order in index.html so content store loads before app logic.

### Validation
- No diagnostics reported in:
	- index.html
	- css/styles.css
	- js/app.js
	- js/content.js
	- js/animations.js

### Notes
- Commit included in this release: 52e132d

## GitHub Release Draft (Short)

### Title
v1.1.0 - UI Polish and i18n Content Store Refactor

### Body
This release improves usability and long-term maintainability of the JUMPFIRST landing experience.

What is new:
- Light mode improvements with automatic logo switching.
- Slider-style theme toggle with subtle animation and better accessibility state handling.
- Thai and English language switch with persistence.
- Header/nav structure polish and back-to-top interaction.

Engineering improvements:
- Introduced centralized bilingual content store in js/content.js.
- Simplified and reorganized js/app.js for clearer responsibilities.
- Adjusted script load order to ensure content store initializes before app logic.

## Next Milestone Checklist (v1.1.1)

- [ ] Add responsive regression pass for 320px, 768px, 1024px, and 1440px breakpoints.
- [ ] Add keyboard-only navigation QA for modal flows and all top controls.
- [ ] Add fallback text for any missing translation key at runtime.
- [ ] Add small smoke checklist in README for theme, language, and modal sanity checks.
- [ ] Resolve environment warning about credential-manager-core setup.