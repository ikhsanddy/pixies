FROM oven/bun:1 AS client-build

WORKDIR /client
COPY ./client/package.json ./
RUN bun install
COPY ./client ./
RUN bun run build

FROM oven/bun:1 AS server-build

WORKDIR /pixies

COPY ./server /pixies/server
COPY ./scripts /pixies/scripts
COPY ./package.json /pixies/package.json

RUN bun install
RUN bun run generate-migrations
RUN bun run generate-integrations

FROM oven/bun:1

RUN apt-get update && apt-get install -y --no-install-recommends \
    tzdata ca-certificates openssl \
    && rm -rf /var/lib/apt/lists/*

ENV TZ=Etc/UTC

WORKDIR /pixies

COPY --from=server-build /pixies/server /pixies/server
COPY --from=server-build /pixies/package.json /pixies/package.json
COPY --from=server-build /pixies/node_modules /pixies/node_modules
COPY --from=client-build /client/build /pixies/build

VOLUME ["/pixies/data"]

EXPOSE 5216

CMD ["bun", "run", "server/index.js"]
