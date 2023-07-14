
run-backend:
	docker compose -f docker-compose.dev.yml up --build -V

re-backend: clean run-backend

clean:
	-docker rmi -f $$(docker images "ft_trancendence*" | awk 'NR!=1 {print}' | awk '{print $$1}')