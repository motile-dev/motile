import Config

config :motile, WalEx,
  url:
    System.get_env("DATABASE_URL") ||
      "postgres://postgres:postgres@host.docker.internal:5432/postgres",
  publication: "events",
  subscriptions: [],
  destinations: [webhooks: [System.get_env("MOTILE_EXEC_URL") <> "/api/event"]],
  webhook_signing_secret: "9da89f5f8f4717099c698a17c0d3a1869ee227de06c27b18",
  name: Motile
