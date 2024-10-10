import { Request, Response, Router } from "express";
import { dynamicContentController } from "../controller/db/DynamicContent";

const router = Router();

router.get('/getDynamicContent', (req: Request, res: Response) => {
	dynamicContentController.getDynamicContent().then((data) => {
		res.send(data);
	});
});

router.get('/getDynamicContentByCode', (req: Request, res: Response) => {
	let code = req.query.code.toString()
	dynamicContentController.getDynamicContentByCodeAndActif(code).then((data) => {
		res.send(data);
	});
});

// Route to update a role by ID
router.put('/:id', dynamicContentController.updateDynamicContent);






export = router;