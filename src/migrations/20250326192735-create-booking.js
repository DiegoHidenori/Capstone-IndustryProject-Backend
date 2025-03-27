"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`
            DO $$ BEGIN
                CREATE TYPE "enum_Bookings_paymentStatus" AS ENUM ('pending', 'deposit_paid', 'fully_paid');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await queryInterface.createTable("Bookings", {
            bookingId: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            bookingDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "userId",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            hasOvernight: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            firstMeal: {
                type: Sequelize.ENUM("breakfast", "lunch", "dinner"),
                allowNull: true,
            },
            checkinDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            checkoutDate: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            bookingPrice: {
                type: Sequelize.DECIMAL,
                allowNull: true,
            },
            requirements: {
                type: Sequelize.ARRAY(Sequelize.STRING), // or JSONB if preferred
                allowNull: true,
            },
            staffNotes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            participantsList: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Bookings");
        await queryInterface.sequelize.query(`
            DROP TYPE IF EXISTS "enum_Bookings_paymentStatus";
        `);
    },
};
