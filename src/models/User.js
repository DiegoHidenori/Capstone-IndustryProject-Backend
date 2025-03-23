const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // One-to-Many: User has many Bookings
            User.hasMany(models.Booking, {
                foreignKey: "userId",
                as: "bookings",
            });
        }
        validPassword(password) {
            return bcrypt.compare(password, this.password);
        }
    }
    User.init(
        {
            firstName: DataTypes.STRING,
            middleName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            phone: DataTypes.STRING,
            password: DataTypes.STRING,
            billingAddress: DataTypes.STRING,
            role: {
                type: DataTypes.ENUM("guest", "staff", "admin"),
                allowNull: false,
                defaultValue: "guest",
            },
        },
        {
            sequelize,
            modelName: "User",
            hooks: {
                beforeCreate: async (user) => {
                    if (user.password) {
                        const salt = await bcrypt.genSalt(10);
                        user.password = await bcrypt.hash(user.password, salt);
                    }
                },
                beforeUpdate: async (user) => {
                    if (user.changed("password")) {
                        const salt = await bcrypt.genSalt(10);
                        user.password = await bcrypt.hash(user.password, salt);
                    }
                },
            },
        }
    );
    return User;
};
