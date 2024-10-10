import { NextFunction, Request, Response } from "express";

// Check if the user has the required permission for a route
const checkPermission = (permission: string) => {

	return (req: Request, res: Response, next: NextFunction) => {
		const userPermissions = req.session.user?.Role?.permissions ? req.session.user.Role.permissions : [];

		if (userPermissions.includes(permission)) {
			return next();
		} else {
			return res.status(403).json({ error: 'Access denied' });
		}
	};
};

export = { checkPermission }