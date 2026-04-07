APP_PATH := /Applications/Shelbz Web Manager.app

.PHONY: build

build:
	@if [ -d "$(APP_PATH)" ]; then \
		echo "Removing $(APP_PATH)..."; \
		rm -rf "$(APP_PATH)"; \
	else \
		echo "$(APP_PATH) not found, skipping removal."; \
	fi
	yarn launcher:build
