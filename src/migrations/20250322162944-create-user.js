/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Users", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            firstName: {
                type: Sequelize.STRING,
            },
            middleName: {
                type: Sequelize.STRING,
            },
            lastName: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            phone: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            billingAddress: {
                type: Sequelize.STRING,
            },
            role: {
                type: Sequelize.ENUM("guest", "staff", "admin"),
                allowNull: false,
                defaultValue: "guest",
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
        await queryInterface.dropTable("Users");
    },
};
