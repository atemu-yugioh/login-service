#!/bin/bash
IMAGE=$1
NEW_IMAGE=$2

sudo sed -i "s|$IMAGE.*|$NEW_IMAGE|g" docker-compose.yaml
sudo docker compose up -d