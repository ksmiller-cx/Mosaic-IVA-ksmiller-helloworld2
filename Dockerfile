# syntax = docker/dockerfile:1.2

# Uses BuildKit to secure secrets -- set the env var DOCKER_BUILDKIT=1.
# Pass the file location of your user-specific npmrc with a personal access
# token in the userconfig secret.
# For example:
# DOCKER_BUILDKIT=1 docker build --secret id=userconfig,src=$HOME/.npmrc ...

FROM us-docker.pkg.dev/ivr-divasp-prod-01/iva-product/node:lts-buster-slim AS local_builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY .npmrc ./.npmrc
RUN --mount=type=secret,id=userconfig,dst=/userconfig npm_config_userconfig=/userconfig npm ci

FROM us-docker.pkg.dev/ivr-divasp-prod-01/iva-product/node:lts-buster-slim AS local_final
CMD ["node", "index.js"]
WORKDIR /usr/src/app
COPY index.js ./
COPY env.json ./
COPY package*.json ./
COPY --from=local_builder /usr/src/app/node_modules/ ./node_modules/
COPY apis ./apis/
COPY vxml ./vxml/