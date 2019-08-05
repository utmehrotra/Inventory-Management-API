# Inventory Management API
Test REPO


## Setup

This project needs this enviroment variables:

| Variable         | Description                              |
|------------------|------------------------------------------|
| DEBUG            | Flag to activate debug mode (true|false) |
| APP_PORT         | Port to run app                          |
| MONGO_HOST       | MongoDB hostname                         |
| MONGO_USER       | MongoDB username                         |
| MONGO_PASS       | MongoDB password                         |
| MONGO_PORT       | MongoDB port                             |
| MONGO_DB         | MongoDB db name                          |
| MONGO_SRV        | MongoDB srv (true|false)                 |
| TOKEN_EXPIRES_IN | JWT token expiries in (1d)               |
| JWT_PASSWORD     | JWT token password                       |



## Installation Steps
Go to your project
```bash
npm run build
docker build
docker-compose up
```