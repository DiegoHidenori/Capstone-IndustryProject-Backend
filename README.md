# COMMANDS USED TO SET UP THE BACKEND

## User Model

npx sequelize-cli model:generate --name User --attributes firstName:string,middleName:string,lastName:string,email:string,phone:string,password:string,billingAddress:string,role:string --config src/config/config.js --migrations-path src/migrations --models-path src/models

## Booking Model

npx sequelize-cli model:generate --name Booking --attributes bookingDate:date,depositPaid:boolean,depositAmount:decimal,depositPaymentId:string,bookingFullyPaid:boolean,fullPaymentInvoiceId:string,userId:integer,hasOvernight:boolean,firstMeal:string,checkinDate:date,checkoutDate:date,bookingPrice:decimal,requirements:json,paymentStatus:string,staffNotes:text,participantsList:json --config src/config/config.js --migrations-path src/migrations --models-path src/models

## Booking-Room Junction Table (Many-To-Many)

npx sequelize-cli migration:generate --name create-booking-room-junction

## Meal Model

npx sequelize-cli model:generate --name Meal --attributes name:string,price:decimal --config src/config/config.js --migrations-path src/migrations --models-path src/models

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

npx sequelize-cli model:generate --name Discount --attributes name:string,description:text,type:string,value:decimal --models-path src/models --config src/config/config.js --migrations-path src/migrations

## Task Model

npx sequelize-cli model:generate --name Task --attributes title:string,description:text,status:string,userId:integer,departmentId:integer --models-path src/models --config src/config/config.json --migrations-path src/migrations

## Payment Model

npx sequelize-cli model:generate --name Payment --attributes transactionId:string,bookingId:integer,amountPaid:decimal,paymentType:enum,status:enum --models-path src/models --config src/config/config.js --migrations-path src/migrations

## Invoice Model

npx sequelize-cli model:generate --name Invoice --attributes bookingId:integer,totalAmount:decimal,depositRequired:decimal,status:enum --models-path src/models --config src/config/config.js --migrations-path src/migrations

# MIGRATIONS

## GENERATE EMPTY MIGRATION FILE

npx sequelize-cli migration:generate --name <update-bookings-array-fields> --config src/config/config.js --migrations-path src/migrations

## RUN ALL MIGRATIONS

npx sequelize-cli db:migrate --config src/config/config.js --migrations-path src/migrations

## CHANGES AND MIGRATIONS

1. If you are still in dev and don’t mind dropping booking data (Quick and destructive)

    - npx sequelize-cli db:migrate:undo --name <your-create-booking-migration-file>.js --config src/config/config.js --migrations-path src/migrations
    - npx sequelize-cli db:migrate:undo:all --config src/config/config.js --migrations-path src/migrations
    - npx sequelize-cli db:migrate

2. This is what you'd do in a real production app (best practice).
    - Generate a migration:
        - npx sequelize-cli migration:generate --name alter-bookings-requirements-array.
    - Edit the migration file
    - Run the migration

## COMMAND FOR GENERATING SEEDER FILES FOR DUMMY DATA

### Seeder Files

1. npx sequelize-cli seed:generate --name initial-rooms --seeders-path src/seeders
2. npx sequelize-cli seed:generate --name admin-user --seeders-path src/seeders
3. npx sequelize-cli seed:generate --name meals --config src/config/config.js --seeders-path src/seeders

### Room Data - Run Every Seeder

npx sequelize-cli db:seed:all --config src/config/config.js --seeders-path src/seeders

### Run specific seeder

npx sequelize-cli db:seed --seed 20250322205230-meals.js --config src/config/config.js --seeders-path src/seeders

# SETUP GUIDE

1. Run all migrations.
2. Run the seeders, including the admin user seeder.
