defmodule Trigs.SetSubscriptions do
  use Task, restart: :transient

  def start_link(_) do
    Task.start_link(fn -> fetch_and_set_subscriptions() end)
  end

  defp fetch_and_set_subscriptions do
    IO.puts("Fetching and setting subscriptions from " <> System.get_env("TRIGS_EXEC_URL"))

    case Req.get(System.get_env("TRIGS_EXEC_URL") <> "/api/handlers/tables") do
      {:ok, data} ->
        Trigs.Utils.set_subscriptions(["_trigs_ddl_log"] ++ data.body["tables"])

      {:error, reason} ->
        :timer.sleep(2000)
        raise(reason)
    end
  end
end
