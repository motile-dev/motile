# Find eligible builder and runner images on Docker Hub. We use Ubuntu/Debian instead of
# Alpine to avoid DNS resolution issues in production.
#
# https://hub.docker.com/r/hexpm/elixir/tags?page=1&name=ubuntu
# https://hub.docker.com/_/ubuntu?tab=tags
#
#
# This file is based on these images:
#
#   - https://hub.docker.com/r/hexpm/elixir/tags - for the build image
#   - https://hub.docker.com/_/debian?tab=tags&page=1&name=bullseye-20221004-slim - for the release image
#   - https://pkgs.org/ - resource for finding needed packages
#   - Ex: hexpm/elixir:1.14.2-erlang-25.1.2-debian-bullseye-20221004-slim
#

ARG BUILDER_IMAGE="1.15.7-erlang-24.3.4.15-alpine-3.18.4"

FROM "hexpm/elixir:${BUILDER_IMAGE}" as elixir_builder

# install build dependencies
# RUN apt-get update -y && apt-get install -y build-essential git \
#   && apt-get clean && rm -f /var/lib/apt/lists/*_*

# set workdir
WORKDIR /app

# install hex
RUN mix local.hex --force

# set build ENV
ENV MIX_ENV="prod"

# install mix dependencies
COPY mix.exs mix.lock ./
RUN mix deps.get --only $MIX_ENV
RUN mkdir config

# copy compile-time config files before we compile dependencies
# to ensure any relevant config change will trigger the dependencies
# to be re-compiled.
COPY config/config.exs config/${MIX_ENV}.exs config/
RUN mix deps.compile

COPY lib lib

# Compile the release
RUN mix compile

# Changes to config/runtime.exs don't require recompiling the code
COPY config/runtime.exs config/

# COPY rel rel
RUN mix release

# start a new build stage so that the final image will only contain
# the compiled release and other runtime necessities
FROM alpine:3.18.4

RUN apk add --no-cache libncursesw

ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

WORKDIR /app

# set runner ENV
ENV MIX_ENV="prod"

# Only copy the final release from the build stage
COPY --from=elixir_builder /app/_build/${MIX_ENV}/rel/motile ./

EXPOSE 3377

CMD ["bin/motile", "start"]
