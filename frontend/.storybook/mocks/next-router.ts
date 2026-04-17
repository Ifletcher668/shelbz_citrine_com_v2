// Mock for next/router (Pages Router) — used by older components.

export function useRouter() {
  return {
    pathname: "/",
    query: {},
    asPath: "/",
    push: () => Promise.resolve(true),
    replace: () => Promise.resolve(true),
    back: () => {},
    prefetch: () => Promise.resolve(),
    events: {
      on: () => {},
      off: () => {},
      emit: () => {},
    },
  };
}

export default { useRouter };
