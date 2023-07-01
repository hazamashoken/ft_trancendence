run:
	cd app && \
	npm run dev

build:
	cd app && \
	npm run build


start: build
	cd app && \
	npm run start

lint:
	cd app && \
	npm run lint

init-git:
	git config core.filemode false
	git config --global --add safe.directory /workspaces/frontend

docker-build:
	docker build -t frontend-main:latest .

docker-run:
	docker run -it --rm -p 3005:3000 frontend-main:latest


PHONY: run build start lint
