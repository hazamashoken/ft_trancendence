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

cloudflare-install:
	wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64 -O cloudflared
	chmod +x cloudflared
	./cloudflared tunnel --url localhost:3000

cloudflare-run:
	@echo "Remember to set new url inside the .env.local and inside the intra uri redirect"
	./cloudflared tunnel --url localhost:3000



PHONY: run build start lint
