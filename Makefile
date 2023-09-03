
PWD := $(shell pwd)
all: run-backend run-database run-frontend

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

dev-kill:
	docker compose kill

run-database:
	docker compose up --build --detach database

run-frontend:
	docker compose up --build --detach frontend

seed-database:
	cd database && npm run start

re-backend: clean run-backend

re-frontend: clean run-frontend

re: clean run-backend

stop:
	docker compose stop

down: stop
	docker compose down

clean: down
	-docker rmi -f $$(docker images "ft_trancendence*" | awk 'NR!=1 {print}' | awk '{print $$1}')
	-sudo rm -rf backend/app/dist
	-sudo rm -rf frontend/app/.next
	-sudo rm -rf database/data

fclean: clean
	-sudo rm -rf backend/app/node_modules
	-sudo rm -rf database/node_modules
	-sudo rm -rf frontend/app/node_modules

.PHONY: dev-backend dev-kill run-backend re-backend run-frontend all stop down re clean
