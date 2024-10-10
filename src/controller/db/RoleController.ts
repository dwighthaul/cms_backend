import { Request, Response } from "express";
import { Role } from "../../model/dto/db/Role";



class RoleController {

	createRole = async (req: Request, res: Response) => {
		try {
			const { rolename, permissions } = req.body;
			const newRole = await Role.create({
				rolename,
				permissions,
			});
			res.status(201).json(newRole);
		} catch (error) {
			res.status(500).json({ error: 'Failed to create role' });
		}
	};

	getRoles = async (req: Request, res: Response) => {
		try {
			const roles = await Role.findAll();
			res.status(200).json(roles);
		} catch (error) {
			res.status(500).json({ error: 'Failed to fetch roles' });
		}
	};


	// Get role by ID
	getRoleByIdNop = async (id: string) => {
		try {
			const role = await Role.findByPk(id);
			return role
		} catch (error) {
		}
	};


	// Get role by ID
	getRoleById = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const role = await Role.findByPk(id);
			if (!role) {
				return res.status(404).json({ error: 'Role not found' });
			}
			res.status(200).json(role);
		} catch (error) {
			res.status(500).json({ error: 'Failed to fetch role' });
		}
	};

	// Update a role
	async updateRole(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { rolename, permissions } = req.body;
			const role = await Role.findByPk(id);

			if (!role) {
				return res.status(404).json({ error: 'Role not found' });
			}

			role.rolename = rolename || role.rolename;
			role.permissions = permissions || role.permissions;

			await role.save();
			res.status(200).json(role);
		} catch (error) {
			res.status(500).json({ error: 'Failed to update role' });
		}
	};

	// Delete a role
	deleteRole = async (req: Request<{ id: string }>, res: Response) => {
		try {
			const { id } = req.params;
			const role = await Role.findByPk(id);

			if (!role) {
				return res.status(404).json({ error: 'Role not found' });
			}

			await role.destroy();
			res.status(200).json({ message: 'Role deleted successfully' });
		} catch (error) {
			res.status(500).json({ error: 'Failed to delete role' });
		}
	};



	async getRoleByName(rolename: string) {
		return await Role.findOne({
			where: {
				"rolename": rolename
			}
		});
	}




}
const roleController = new RoleController();


export { roleController };

