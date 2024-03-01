defmodule Motile.Application do
  use Application

  def start(_type, _args) do
    # List all child processes to be supervised

    children = [
      {WalEx.Supervisor, Application.get_env(:motile, WalEx)},
      {Bandit, scheme: :http, plug: Motile.Api, port: 3377},
      {Motile.SetSubscriptions, []}
    ]

    opts = [strategy: :one_for_one, name: Motile.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
