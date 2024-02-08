defmodule Trigs.Application do
  use Application

  def start(_type, _args) do
    # List all child processes to be supervised

    children = [
      {WalEx.Supervisor, Application.get_env(:trigs, WalEx)},
      {Bandit, scheme: :http, plug: Trigs.Api, port: 3377},
      {Trigs.SetSubscriptions, []}
    ]

    opts = [strategy: :one_for_one, name: Trigs.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
