import { Router } from "express";
import { roleController } from "../controller/db/RoleController";

const router = Router();

// Route to create a role
router.post('/', roleController.createRole);

// Route to get all roles
router.get('/', roleController.getRoles);

// Route to get a role by ID
router.get('/:id', roleController.getRoleById);

// Route to update a role by ID
router.put('/:id', roleController.updateRole);

// Route to delete a role by ID
router.delete('/:id', roleController.deleteRole);




export = router;