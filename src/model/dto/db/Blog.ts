import { DataTypes, Sequelize } from "sequelize";

const { Model } = require("sequelize");

class Blog extends Model {

}

const initBlogSchema = (sequelize: Sequelize) => {
	Blog.init(
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
			is_actif: {
				type: DataTypes.BOOLEAN,
				default: true
			}
		},
		{ sequelize: sequelize },
	)
}

export { Blog, initBlogSchema };

