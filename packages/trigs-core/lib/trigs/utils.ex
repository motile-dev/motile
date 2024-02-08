defmodule Trigs.Utils do
  
  def set_subscriptions(tables) do
    current_subscriptions = WalEx.Config.get_configs(Trigs, :subscriptions)

    to_remove = current_subscriptions -- tables |> IO.inspect(label: "to_remove")
    to_add = tables -- current_subscriptions |> IO.inspect(label: "to_add")

    to_remove |> Enum.each(fn table ->
      WalEx.Config.remove_config(Trigs, :subscriptions, table)
    end)

    to_add |> Enum.each(fn table ->
      WalEx.Config.add_config(Trigs, :subscriptions, table)
    end)
  end
end

