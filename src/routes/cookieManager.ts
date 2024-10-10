import { Request, Response, Router } from "express";
const router = Router();


router.get('/get-cookie', (req: Request, res: Response) => {
	console.log('=============');
	console.log(req.session);
	console.log('=============');

	const user = req.session;

	res.json(user);
});

router.get('/set-cookie', (req: Request, res: Response) => {
	req.session.test = "IIIII"

	const user = req.session;

	res.json(user);
});

router.get('/set-cookie-authorisation', (req: Request, res: Response) => {
	req.session.user = {
		id: 1,
		permissions: "read_users,update_user"
	}

	const user = req.session;

	res.json(user);
});

export = router