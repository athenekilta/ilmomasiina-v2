export const routes = {
  landingPage: "/",
  auth: {
    _root: "/auth",
    login: "/auth/login",
    signup: "/auth/signup",
    password: {
      _root: "/auth/password",
      change: "/auth/password/change",
      changed: "/auth/password/changed",
      request: "/auth/password/request",
      requested: "/auth/password/requested",
    },
    email: {
      _root: "/auth/email",
      requestVerification: "/auth/email/request-verification",
      requestedVerification: "/auth/email/requested-verification",
      verify: "/auth/email/verify",
    },
  },
  app: {
    _root: "/",
    events: {
      root: "/events",
      create: "/events/create",
      event: (id: number) => `/events/${id}`,
      edit: (id: number) => `/events/${id}/edit`,
    },
    settings: {
      user: "/settings/user",
    },
  },
} as const;
