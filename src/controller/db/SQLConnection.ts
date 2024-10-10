import { Sequelize } from "sequelize";
import { initBlogSchema } from "../../model/dto/db/Blog";
import { initDynamicContentSchema } from "../../model/dto/db/DynamicContent";
import { initRoleSchema, Role } from "../../model/dto/db/Role";
import { initUserSchema, User } from "../../model/dto/db/User";
import { initBlogData, initDynamicContentData, seedRole, seedUser } from "./seeders/seeders";

require('dotenv').config()

class SQLConnection {
	sequelize: Sequelize;

	async connect() {
		this.sequelize = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_ENDPOINT}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB_NAME}`,
			{
				logging: false, // Disables logging
			}
		)

		try {
			await this.sequelize.authenticate();
			//console.log('Connection has been established successfully.');
		} catch (error) {
			console.error('Unable to connect to the database:', error);
		}

	}

	syncDatabase() {
		initRoleSchema(this.sequelize)
		initUserSchema(this.sequelize)
		initBlogSchema(this.sequelize)
		initDynamicContentSchema(this.sequelize)

		// Define the association: Many Users can have one Role

		/*

		User.belongsTo(Role, {
			foreignKey: 'roleId',
			as: 'role'
		});
		Role.hasMany(User, {
			foreignKey: 'roleId',
			as: 'user'
		});
	  */
		User.belongsTo(Role, {
			foreignKey: {
				name: "roleId",
				as: 'user'
			}
		});

		Role.hasMany(User, {
			foreignKey: {
				name: "roleId",
				as: 'Role'
			}
		})

		this.sequelize.sync({ force: true })
			.then(() => {
				seedRole().then(() => {
					seedUser().then(() => {
					})
				})
				initBlogData().then(() => {
				})
				initDynamicContentData().then(() => {
				})

			})
			.catch(err => {
				console.error('Unable to create database and tables', err);
			});
	}
}




export { SQLConnection };

