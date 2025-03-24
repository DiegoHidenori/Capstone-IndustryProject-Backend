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
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            bookingDate: {
                type: Sequelize.DATE,
            },
            depositAmount: {
                type: Sequelize.DECIMAL,
                allowNull: false,
            },
            depositPaid: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            depositPaymentId: {
                type: Sequelize.STRING,
            },
            finalPaymentId: {
                type: Sequelize.STRING,
            },
            bookingFullyPaid: {
                type: Sequelize.BOOLEAN,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            hasOvernight: {
                type: Sequelize.BOOLEAN,
            },
            firstMeal: {
                type: Sequelize.ENUM("breakfast", "lunch", "dinner"),
                allowNull: true,
            },
            checkinDate: {
                type: Sequelize.DATE,
            },
            checkoutDate: {
                type: Sequelize.DATE,
            },
            bookingPrice: {
                type: Sequelize.DECIMAL,
            },
            requirements: {
                type: Sequelize.ARRAY(Sequelize.STRING), // or JSONB if preferred
                allowNull: true,
            },
            paymentStatus: {
                type: Sequelize.ENUM("pending", "deposit_paid", "fully_paid"),
                allowNull: false,
                defaultValue: "pending",
            },
            staffNotes: {
                type: Sequelize.TEXT,
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
