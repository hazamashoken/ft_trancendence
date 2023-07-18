# ft_trancendence

The final project in 42 common core.

## Docker

To run to project on local environment

```sh
make
```

to run only `Frontend NextJS`

```sh
make run-frontend
```

to run only `Backend NestJS`

```sh
make run-backend
```

to run only database

```sh
make run-database
```

to stop docker compose service

```sh
make down
```

to restart entire service

```sh
make re
```

## Tools

Database GUI tool for `Postgres`

[pgadmin]

access database from local with `psql` cli by using `dbconnect.sh` in database tools

1. run `./database/tools/dbconnect.sh install`

2. run `./database/tools/dbconnect.sh run`

<!-- reference -->

[pgadmin]: https://www.pgadmin.org/download/
