# COMMANDS USED TO SET UP THE BACKEND

## User Model

npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string,password:string,role:string --models-path src/models --config src/config/config.json --migrations-path src/migrations

## Guest Model

npx sequelize-cli model:generate --name Guest --attributes firstName:string,lastName:string,email:string,phone:string --models-path src/models --config src/config/config.json --migrations-path src/migrations

## Room Model

npx sequelize-cli model:generate --name Room --attributes roomName:string,roomType:string,pricePerNight:integer,description:text,maxCapacity:integer,needsCleaning:boolean --models-path src/models --config src/config/config.json --migrations-path src/migrations

### Conference Model

npx sequelize-cli model:generate --name ConferenceRoom --attributes roomId:integer,seatingPlan:string,numChairs:integer,numTables:integer --models-path src/models --config src/config/config.json --migrations-path src/migrations

### Bedroom Model

npx sequelize-cli model:generate --name Bedroom --attributes roomId:integer,bedroomNumber:integer,hasShower:boolean --models-path src/models --config src/config/config.json --migrations-path src/migrations

### DiningRoom Model

npx sequelize-cli model:generate --name DiningRoom --attributes roomId:integer --models-path src/models --config src/config/config.json --migrations-path src/migrations

### Chapel Model

npx sequelize-cli model:generate --name Chapel --attributes roomId:integer --models-path src/models --config src/config/config.json --migrations-path src/migrations

### Kitchen Model

npx sequelize-cli model:generate --name Kitchen --attributes roomId:integer --models-path src/models --config src/config/config.json --migrations-path src/migrations

## Discount Model

npx sequelize-cli model:generate --name Discount --attributes name:string,percentage:decimal,validFrom:date,validTo:date --models-path src/models --config src/config/config.json --migrations-path src/migrations

## Task Model

npx sequelize-cli model:generate --name Task --attributes title:string,description:text,status:string,userId:integer,departmentId:integer --models-path src/models --config src/config/config.json --migrations-path src/migrations

## Reservation Model

npx sequelize-cli model:generate --name Reservation --attributes guestId:integer,roomId:integer,checkIn:date,checkOut:date,totalCost:float --models-path src/models --config src/config/config.json --migrations-path src/migrations

## COMMAND TO APPLY ALL MIGRATIONS

npx sequelize-cli db:migrate --config src/config/config.js --migrations-path src/migrations

## COMMAND FOR GENERATING SEEDER FILES FOR DUMMY DATA

### Room Data - Create Seeder File

npx sequelize-cli seed:generate --name initial-rooms --seeders-path src/seeders

### Room Data - Run Seeder

npx sequelize-cli db:seed:all --config src/config/config.js --seeders-path src/seeders
