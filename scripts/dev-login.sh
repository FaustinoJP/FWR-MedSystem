#!/bin/bash

echo "A fazer login..."

TOKEN=$(curl -s -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@faustware.com","password":"123456"}' \
  | jq -r '.accessToken')

export TOKEN

echo ""
echo "TOKEN carregado:"
echo $TOKEN
echo ""

