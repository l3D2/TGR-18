FROM oven/bun:1 AS base
WORKDIR /sourcecode

FROM base AS install
COPY package.json /sourcecode/
RUN bun install

FROM base AS build
COPY . /sourcecode/
CMD ["bun", "run", "start"]