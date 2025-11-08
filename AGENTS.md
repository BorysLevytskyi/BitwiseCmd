Agent Guidelines for This Repository

Scope
- These instructions apply to the entire repository.

Theme Styling Policy
- Centralize all theme-related CSS (e.g., `.light`, `.dark`, `.midnight`, `.bladerunner`, and future themes) in `src/index.css` only.
- Do NOT place theme-specific rules in component-scoped stylesheets (e.g., files under `src/shell/components/*.css`). Component CSS must remain theme-agnostic.
- If a component needs theme-dependent styling, add/adjust the selectors in `src/index.css` that target the component’s markup (e.g., `.app-root.<theme> .component-selector { ... }`).
- Prefer grouping theme rules together by theme block in `src/index.css` for readability and consistency.

Layout Rules
- Global layout modifiers that affect multiple views (e.g., centered vs. stretched layout) should also live in `src/index.css`.

Examples
- Good: `src/index.css` — `.bladerunner .top-links button { color: #ff7fb0 }`
- Avoid: `src/shell/components/TopLinks.css` — `.bladerunner .top-links button { ... }`

Testing
- After changing theme styles, verify all themes (Light/Dark/Midnight/Bladerunner) render legibly and that component CSS contains no theme-specific selectors.

