all: run-backend

run-backend:
	docker compose up --build --detach

re-backend: clean run-backend

re: clean run-backend

stop:
	docker compose stop

down: stop
	docker compose down

clean: down
	-docker rmi -f $$(docker images "ft_trancendence*" | awk 'NR!=1 {print}' | awk '{print $$1}')

.PHONY: run-backend re-backend all stop down re clean