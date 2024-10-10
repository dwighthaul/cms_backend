import { Request, Response, Router } from "express";
import { authentication } from "../controller/Authentication";
import { userController } from "../controller/db/UserController";
import rbacMiddleware from "../middleware/rbacMiddleware";

const router = Router();


// Route to create a user
router.post('/', userController.createUser);

// Route to get all users
router.get('/', userController.getUsers);

// Route to get a user by ID
router.get('/:id', userController.getUserById);

// Route to update a user by ID
router.put('/:id', userController.updateUser);

// Route to delete a user by ID
router.delete('/:id', userController.deleteUser);



router.get('/getUsersSecure', rbacMiddleware.checkPermission("read_users"), (req: Request, res: Response) => {
	userController.getUsers(req, res)
});





router.post('/login', (req: Request, res: Response) => {
	authentication.verifyLogin(req.body.username, req.body.password, (result: any) => { // Ameliorer ce any
		if (result.status === "KO") {
			res.sendStatus(401).send(result.data)
			return;
		}
		if (result.status === "OK") {
			let user = result.data;
			req.session.user = user;
			res.send(result.data);

		}
	});
});




router.post('/logout', (req: Request, res: Response) => {
	delete req.session.user
	res.sendStatus(200)

});


router.get('/getSession', (req: Request, res: Response) => {
	const user = req.session;
	res.json(user);
});





export = router;