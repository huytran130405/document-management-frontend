# Base UI — approved scope

React + JavaScript + Vite + Tailwind CSS. Black empty main area, dark 260px
collapsible sidebar with Your App branding and no account buttons. Header has
Log in and Sign up. Mobile uses a modal sidebar, closed initially.

Shared Button, Header, Sidebar, AppLayout, AuthModal and AuthForm components.
The native dialog handles focus containment and Escape. Restore trigger focus
after closing. Close with X or backdrop. Switch login/signup inside the dialog.
Both forms contain labeled Email and Password fields, inline required/email
validation and demo-only submission feedback. No backend, credential storage,
OAuth or extra navigation. Clear password after submission and fields on mode switch.

1. Configure Vite, React, Tailwind and a small behavioral test suite.
2. Build the responsive shell and reusable components.
3. Implement accessible dialogs and both form modes.
4. Run tests and production build; inspect desktop/mobile and keyboard behavior.

Implementation stays in the requested empty directory; it is not a Git repository.

## Completion

- All four implementation steps completed.
- `npm test`: 5 tests passed. `npm run build`: passed.
- Independent static review completed; mobile mode-switch focus concern reproduced
  in Chrome, covered with a failing regression test, fixed and verified.
- Browser QA: Escape, X, backdrop, focus return, mobile drawer, inactive background,
  and no horizontal overflow at widths 320, 375, 768, 1440px.
- Chrome may move Tab focus into browser chrome; background page controls remain inert.
- UI checked against Vercel Web Interface Guidelines. No blocking findings remain.
- Screenshots in output/ (ignored). Development server: http://127.0.0.1:5173/.

## Motion refinement

- Desktop sidebar uses grid-column reflow plus translate/opacity transitions (280ms).
  Collapsed content becomes inert and hidden from assistive technology immediately.
- Native auth/mobile dialogs use opacity/transform transitions, starting styles,
  and discrete display/overlay transitions (220ms), including the backdrop.
- Form content remains mounted for the exit transition. Fields reset on close and
  mode changes; credentials are not retained after closing.
- Browser QA passed: measured intermediate entry/exit opacity; active sidebar
  transitions; rapid toggle reversal; focus restoration; mobile drawer and mode
  switching; no animations when reduced-motion is enabled.
