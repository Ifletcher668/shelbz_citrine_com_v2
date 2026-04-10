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
	@cp -r "launcher/src-tauri/target/release/bundle/macos/Shelbz Web Manager.app" "/Applications/"
	@echo "Installed to $(APP_PATH)"
