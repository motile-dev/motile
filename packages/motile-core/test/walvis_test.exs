defmodule MotileTest do
  use ExUnit.Case
  doctest Motile

  test "greets the world" do
    assert Motile.hello() == :world
  end
end
