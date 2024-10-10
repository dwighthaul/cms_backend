import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Role } from '../../model/dto/db/Role';
import { User } from '../../model/dto/db/User';
import { roleController } from './RoleController';
import { SQLConnection } from './SQLConnection';


class UserController {
	sqlConnection: SQLConnection;

	// Get all users
	getUsers = async (req: Request, res: Response) => {
		try {
			const users = await User.findAll({ include: [{ model: Role, as: 'Role' }] });
			res.status(200).json(users);
		} catch (error) {
			console.log(error)
			res.status(500).json({ error: 'Something went wrong' });
		}
	};

	// Get a specific user by ID
	getUserById = async (req: Request, res: Response) => {
		try {
			const user = await User.findOne({
				where: { id: req.params.id },
				include: [{ model: Role, as: 'role' }]
			});
			if (!user) return res.status(404).json({ error: 'User not found' });
			res.status(200).json(user);
		} catch (error) {
			res.status(500).json({ error: 'Something went wrong' });
		}
	};

	// Create a new user
	createUser = async (req: Request, res: Response) => {

		const roleRequest = req.body.Role;
		var role = await roleController.getRoleByIdNop(roleRequest.id)
		const roleId = role.id

		const { username, passwordHash } = req.body;
		try {
			const newUser = await User.create({
				username,
				passwordHash,
				roleId,
				createdAt: new Date(),
				updatedAt: new Date()
			});
			res.status(201).json(newUser);
		} catch (error) {
			res.status(500).json({ error: 'Failed to create user' });
		}
	};

	// Update a user
	updateUser = async (req: Request, res: Response) => {
		const roleRequest = req.body.Role;
		var role = await roleController.getRoleByIdNop(roleRequest.id)
		const roleId = role.id

		const { username, passwordHash } = req.body;
		try {
			const user = await User.findOne({ where: { id: req.params.id } });
			if (!user) return res.status(404).json({ error: 'User not found' });

			user.username = username || user.username;
			user.passwordHash = passwordHash || user.passwordHash;
			user.roleId = roleId || user.roleId;
			user.updatedAt = new Date();

			await user.save();
			res.status(200).json(user);
		} catch (error) {
			res.status(500).json({ error: 'Failed to update user' });
		}
	};

	// Delete a user
	deleteUser = async (req: Request, res: Response) => {
		try {
			const user = await User.findOne({ where: { id: req.params.id } });
			if (!user) return res.status(404).json({ error: 'User not found' });

			await user.destroy();
			res.status(200).json({ message: 'User deleted successfully' });
		} catch (error) {
			res.status(500).json({ error: 'Failed to delete user' });
		}
	};







	async getUserByUsername(username: string) {
		return await User.findOne({
			where: {
				"username": { [Op.iLike]: username }
			}
		});
	}

	async getUserFromUserNameAndPassword(username: string, password: string) {

		return await User.findOne({
			include: Role,
			attributes: ['id', 'username', 'createdAt'],
			where: {
				[Op.and]: [
					this.sqlConnection.sequelize.where(
						this.sqlConnection.sequelize.fn('lower', this.sqlConnection.sequelize.col('username')),
						this.sqlConnection.sequelize.fn('lower', username)
					),
					this.sqlConnection.sequelize.where(
						this.sqlConnection.sequelize.fn('lower', this.sqlConnection.sequelize.col('passwordHash')),
						this.sqlConnection.sequelize.fn('lower', btoa(password))
					)
				]
			}
		});
	}


}
const userController = new UserController();


export { userController };

