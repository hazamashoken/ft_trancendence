all: run-backend run-database run-frontend

run-backend:
	docker compose up --build --detach backend

run-database:
	docker compose up --build --detach database

run-frontend:
	docker compose up --build --detach frontend

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

.PHONY: run-backend re-backend run-frontend all stop down re clean
