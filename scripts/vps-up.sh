#!/bin/sh
set -eu
cd /opt/projects/ecommerce_mysql_db
docker compose up -d --build
docker compose ps
