// A full page load instead of a client-side navigation. Used after signing in:
// the client router may still hold the proxy's "go to /login" redirects cached
// while signed out, and the new session needs a fresh store and fresh pages.
export function navigateWithReload(url: string) {
  window.location.assign(url);
}
