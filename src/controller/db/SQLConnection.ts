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

		const isProduction = process.env.NODE_ENV === 'production';

		this.sequelize = new Sequelize({
			database: process.env.POSTGRES_DB_NAME,
			username: process.env.POSTGRES_USER,
			password: process.env.POSTGRES_PASSWORD,
			host: process.env.POSTGRES_ENDPOINT,
			port: parseInt(process.env.POSTGRES_PORT),
			dialect: "postgres",
			dialectOptions: isProduction ? {
				ssl: {
					require: true,
					rejectUnauthorized: false
				}
			} : undefined,
			logging: false
		});

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

