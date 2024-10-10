import { DataTypes, Sequelize } from "sequelize";

const { Model } = require("sequelize");

class DynamicContent extends Model {
}


const initDynamicContentSchema = (sequelize: Sequelize) => {
	DynamicContent.init(
		{
			name: {
				type: DataTypes.STRING,
				unique: true,
				notNull: true,
				notEmpty: true
			},
			content: {
				type: DataTypes.TEXT,
				notNull: true,
				notEmpty: true
			},
			code: {
				type: DataTypes.TEXT,
				notNull: true,
				notEmpty: true
			},
			is_actif: {
				type: DataTypes.BOOLEAN,
				default: true
			}
		},
		{ sequelize: sequelize },
	)
}


export { DynamicContent, initDynamicContentSchema };

