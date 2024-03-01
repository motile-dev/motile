defmodule Motile.Api do
  use Plug.Router

  plug(:match)

  plug(Plug.Parsers,
    parsers: [:urlencoded, :json],
    json_decoder: Jason
  )

  plug(:dispatch)

  post "/deploy" do
    tables = conn.body_params["tables"]
    code = conn.body_params["code"]

    Motile.Utils.set_subscriptions(["_motile_ddl_log"] ++ tables)
    # IO.puts(conn.body_params["code"])

    # File.write("/app/runner/src/handlers.js", conn.body_params["code"])
    url = System.get_env("MOTILE_EXEC_URL") <> "/api/handlers"
    IO.puts("Deploy")

    case Req.post(
           url,
           json: %{
             code: code,
             tables: tables
           }
         ) do
      {:ok, data} ->
        send_resp(conn, 200, data.body)

      {:error, reason} ->
        send_resp(conn, 500, "Error updating handlers: #{reason}")
    end

    send_resp(conn, 200, "OK")
  end

  get "/schema" do
    case Req.get(System.get_env("MOTILE_EXEC_URL") <> "/api/schema") do
      {:ok, data} ->
        send_resp(conn, 200, data.body)

      {:error, reason} ->
        # Handle the error case. Could send a different status code/message
        send_resp(conn, 500, "Error reading schema: #{reason}")
    end
  end

  post "/refresh" do
    case Req.post(System.get_env("MOTILE_EXEC_URL") <> "/api/schema/refresh") do
      {:ok, _} ->
        send_resp(conn, 200, ~c"OK")

      {:error, reason} ->
        # Handle the error case. Could send a different status code/message
        send_resp(conn, 500, "Error refreshing schema: #{reason}")
    end
  end
end
