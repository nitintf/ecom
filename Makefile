.PHONY: install start-dev build start-auth-dev start-orders-dev start-products-dev start-stores-dev start-payment-dev start-notifications-dev build-auth build-orders build-products build-stores build-payment build-notifications docker-up docker-down docker-restart docker-logs docker-ps clean clean-all list-services help

# Default target
help:
	@echo "Available commands:"
	@echo "Development:"
	@echo "  install          - Install dependencies"
	@echo "  dev-setup       - Setup development environment (install deps, docker up, migrations)"
	@echo "  start-dev        - Start all services in development mode"
	@echo "  build            - Build all services"
	@echo "  watch-logs       - Watch logs from all services in development"
	@echo "  health-check     - Check health of all services"
	@echo ""
	@echo "Docker:"
	@echo "  docker-up        - Start Docker containers"
	@echo "  docker-down      - Stop Docker containers"
	@echo "  docker-restart   - Restart Docker containers"
	@echo "  docker-logs      - View Docker container logs"
	@echo "  docker-ps        - List running Docker containers"
	@echo ""
	@echo "Database:"
	@echo "  db-migrate       - Run database migrations"
	@echo "  db-seed         - Seed database with sample data"
	@echo ""
	@echo "Testing:"
	@echo "  test            - Run all tests"
	@echo "  test-unit       - Run unit tests"
	@echo "  test-integration - Run integration tests"
	@echo "  test-e2e        - Run end-to-end tests"
	@echo "  test-coverage   - Generate test coverage report"
	@echo ""
	@echo "Code Quality:"
	@echo "  format          - Format code"
	@echo "  lint            - Run linter"
	@echo "  gen-docs        - Generate API documentation"
	@echo ""
	@echo "Utilities:"
	@echo "  clean           - Remove build artifacts and node_modules"
	@echo "  clean-all       - Clean everything including Docker volumes"
	@echo "  list-services   - List available microservices"
	@echo "  gen-certs       - Generate development SSL certificates"

install:
	pnpm install

# Development targets for individual services
start-auth-dev:
	nest start auth --watch

start-orders-dev:
	nest start orders --watch

start-products-dev:
	nest start products --watch

start-stores-dev:
	nest start stores --watch

start-payment-dev:
	nest start payment --watch

start-notifications-dev:
	nest start notifications --watch

# Build targets for individual services
build-auth:
	nest build auth

build-orders:
	nest build orders

build-products:
	nest build products

build-stores:
	nest build stores

build-payment:
	nest build payment

build-notifications:
	nest build notifications

# Combined targets
start-dev: start-auth-dev start-orders-dev start-products-dev start-stores-dev start-payment-dev start-notifications-dev

build: build-auth build-orders build-products build-stores build-payment build-notifications

# Development utilities
format:
	pnpm run format

lint:
	pnpm run lint

test:
	pnpm run test

test-e2e:
	pnpm run test:e2e

# Docker commands
docker-up:
	docker-compose up -d

# Stop and remove containers
docker-down:
	docker-compose down

# Restart all containers
docker-restart: docker-down docker-up

# View container logs
docker-logs:
	docker-compose logs -f

# List running containers
docker-ps:
	docker-compose ps

# Cleanup commands
clean:
	rm -rf dist
	rm -rf node_modules

# Clean everything including Docker volumes
clean-all: clean docker-down
	docker-compose down -v

# List available services
list-services:
	@echo "Available services:"
	@echo "  - auth"
	@echo "  - orders"
	@echo "  - products"
	@echo "  - stores"
	@echo "  - payment"
	@echo "  - notifications"
