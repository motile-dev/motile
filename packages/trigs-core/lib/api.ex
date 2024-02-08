defmodule Trigs.Api do
  use Plug.Router

  plug(:match)

  plug(Plug.Parsers,
    parsers: [:urlencoded, :json],
    json_decoder: Jason
  )

  plug(:dispatch)

  post "/deploy" do
    tables = conn.body_params["tables"]

    Trigs.Utils.set_subscriptions(["_trigs_ddl_log"] ++ tables)
    IO.puts(conn.body_params["code"])

    File.write("/app/runner/src/handlers.js", conn.body_params["code"])

    send_resp(conn, 200, "OK")
  end

  get "/schema" do
    case File.read("/app/runner/drizzle/schema.ts") do
      {:ok, schema} ->
        send_resp(conn, 200, schema)

      {:error, reason} ->
        # Handle the error case. Could send a different status code/message
        send_resp(conn, 500, "Error reading schema: #{reason}")
    end
  end

  post "/refresh" do
    case Req.post("http://127.0.0.1:4020/api/schema/refresh") do
      {:ok, _} ->
        send_resp(conn, 200, ~c"OK")

      {:error, reason} ->
        # Handle the error case. Could send a different status code/message
        send_resp(conn, 500, "Error refreshing schema: #{reason}")
    end
  end
end
