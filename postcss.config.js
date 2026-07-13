// Tailwind CSS v4 is wired up through the `@tailwindcss/vite` plugin (see
// vite.config.ts), which handles the CSS transform directly and no longer
// needs a PostCSS pipeline. This file is intentionally left with no plugins
// so any leftover PostCSS processing in the toolchain is a no-op.
export default {
  plugins: {},
}
