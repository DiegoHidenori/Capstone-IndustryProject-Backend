const { Model } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			// One-to-Many: User has many Bookings
			User.hasMany(models.Booking, {
				foreignKey: "userId",
				as: "bookings",
				onDelete: "CASCADE",
			});

			User.hasMany(models.Invoice, {
				foreignKey: "userId",
				onDelete: "CASCADE",
			});
		}

		async validPassword(password) {
			return bcrypt.compare(password, this.password);
		}
	}

	User.init(
		{
			userId: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			firstName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			middleName: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: { isEmail: true },
			},
			phone: {
				type: DataTypes.STRING,
				allowNull: true,
				validate: {
					isNumeric: {
						msg: "Phone must be numeric",
					}, // Ensure phone contains only numbers
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			billingAddress: {
				type: DataTypes.STRING,
				allowNull: true,
			},
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
						user.password = await bcrypt.hash(user.password, 10);
					}
				},
				beforeUpdate: async (user) => {
					if (user.changed("password")) {
						user.password = await bcrypt.hash(user.password, 10);
					}
				},
			},
		}
	);
	return User;
};
