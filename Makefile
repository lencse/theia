.PHONY: build dev lint format check-types test verify

BIN=node_modules/.bin
TURBO=$(BIN)/turbo

default: build

build: node_modules
	$(TURBO) run build

dev: node_modules
	$(TURBO) run dev

lint: node_modules
	$(BIN)/biome check

format: node_modules
	$(BIN)/biome check --write

check-types: node_modules
	$(TURBO) run check-types

verify: lint check-types test

test: node_modules
	$(TURBO) test

node_modules:
	pnpm install --frozen-lockfile

.PHONY: dev format test build
