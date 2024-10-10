import { DataTypes, Sequelize } from "sequelize";
import { Role } from "./Role";

const { Model } = require("sequelize");

class User extends Model {
}

const initUserSchema = (sequelize: Sequelize) => {
	User.init(
		{
			username: {
				type: DataTypes.STRING,
				unique: true,
				notNull: true,
				notEmpty: true
			},
			passwordHash: {
				type: DataTypes.STRING,
				notNull: true,
				notEmpty: true
			},
			roleId: { // Foreign key to reference the Role
				type: DataTypes.INTEGER,
				references: {
					model: Role,
					key: 'id'
				},
				allowNull: false
			},
		},
		{ sequelize: sequelize },
	)
}


export { initUserSchema, User };

