import { DataTypes, Sequelize } from "sequelize";

const { Model } = require("sequelize");

class Role extends Model {

}

const initRoleSchema = (sequelize: Sequelize) => {
	Role.init(
		{
			rolename: {
				type: DataTypes.STRING,
				unique: true,
				notNull: true,
				notEmpty: true
			},
			permissions: {
				type: DataTypes.STRING,
				notNull: true,
				notEmpty: true
			}
		},
		{ sequelize: sequelize },
	)
}

export { initRoleSchema, Role };

