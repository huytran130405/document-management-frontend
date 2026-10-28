# Base UI

Minimal React + JavaScript + Tailwind CSS application, built with Vite.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL shown in the terminal.

```sh
npm test
npm run build
npm run preview
```

- Desktop: collapsible 260px sidebar. Mobile: modal sidebar, initially closed.
- Sidebar slides in/out (280ms); account dialogs fade and lift gently (220ms),
  including their backdrop. System reduced-motion preferences disable transitions.
- Log in / Sign up open a shared, accessible native dialog.
- Close with X, Escape or the backdrop; keyboard focus returns to the trigger.
- Both forms validate required email/password and email format.
- Submission is a UI demo only. No backend, authentication, storage or network
  request handles credentials. The password is cleared after a valid submission;
  form values reset on switching modes or closing the dialog.

Components live in `src/components/`; theme values and shared styles in
`src/styles.css`. The main content area is intentionally empty.
