
PWD := $(shell pwd)
all: run-backend run-database run-frontend

dev: 
	npm install --prefix frontend/app
	npm install --prefix backend
	docker compose run \
		--detach \
		--rm \
		--build \
		--name nextjs \
		--publish 8080:8080 \
		--volume $(PWD)/frontend/app:/app \
		--volume $(PWD)/backend:/usr/src/app \
		frontend

run-backend:
	docker compose up --build --detach backend

dev-backend:
	npm install --prefix backend
	echo $(PWD)
	docker compose run \
		--detach \
		--rm \
		--build \
		--name nestjs \
		--publish 3000:3000 \
		--publish 9229:9229 \
		--volume $(PWD)/backend:/usr/src/app \
		backend

dev-frontend:
	npm install --prefix frontend/app
	docker compose run \
		--detach \
		--rm \
		--build \
		--name nextjs \
		--publish 8080:8080 \
		--volume $(PWD)/frontend/app:/app \
		frontend

backend-start-dev:
	docker exec -ti nestjs npm run start:dev

dev-kill:
	docker compose kill

run-database:
	docker compose up --build --detach database

run-frontend:
	docker compose up --build --detach frontend

seed-database:
	cd database && npm install && npm run start

re-backend: clean run-backend

re-frontend: clean run-frontend

re: clean run-backend

stop:
	docker compose stop

down: stop
	docker compose down

clean: down
	-docker rmi -f $$(docker images "ft_trancendence*" | awk 'NR!=1 {print}' | awk '{print $$1}')
	-sudo rm -rf backend/dist
	-sudo rm -rf backend/node_modules
	-sudo rm -rf backend/data
	-sudo rm -rf frontend/app/.next
	-sudo rm -rf database/data

fclean: clean
	-sudo rm -rf backend/app/node_modules
	-sudo rm -rf database/node_modules
	-sudo rm -rf frontend/app/node_modules

.PHONY: dev-backend dev-kill run-backend re-backend run-frontend all stop down re clean
