.PHONY: help build up start down stop clean logs restart ps rebuild lint

help: ## Show available commands
	@grep -E '^[a-zA-Z0-9_-]+:.*##' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

build: ## Build images
	docker compose build

up: ## Start all services (foreground)
	docker compose up

start: ## Start all services (background)
	docker compose up -d

down: ## Stop containers
	docker compose down

stop: down ## Alias for down

clean: ## Stop containers, remove volumes (including database data) and orphans
	docker compose down -v --remove-orphans

logs: ## Follow service logs
	docker compose logs -f

restart: ## Restart all services
	docker compose restart

ps: ## List running containers
	docker compose ps

rebuild: ## Rebuild images from scratch and start in background
	docker compose build --no-cache
	docker compose up -d

lint: ## Run flake8 (backend) and ESLint (frontend)
	cd backend && python3 -m pip install -q -r requirements-dev.txt && python3 -m flake8 app/
	cd frontend && npm run lint
