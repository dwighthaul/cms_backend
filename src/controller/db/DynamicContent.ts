import { Request, Response } from "express";
import { DynamicContent } from "../../model/dto/db/DynamicContent";
import { SQLConnection } from "./SQLConnection";


class DynamicContentController {
	sqlConnection: SQLConnection;

	async getDynamicContent() {
		return await DynamicContent.findAll();
	}

	async getDynamicContentByCode(code: string) {
		return await DynamicContent.findOne({
			attributes: ["content"],
			where: {
				"code": code
			}
		});
	}

	async getDynamicContentByCodeAndActif(code: string) {
		return await DynamicContent.findOne({
			attributes: ["content"],
			where: {
				"code": code,
				"is_actif": true
			}
		});
	}

	async updateDynamicContent(req: Request, res: Response) {
		try {
			const { id } = req.params;
			const { name, content, is_actif } = req.body;

			const dynamicContent = await DynamicContent.findByPk(id);

			if (!dynamicContent) {
				return res.status(404).json({ error: 'DynamicContent not found' });
			}

			dynamicContent.name = name
			dynamicContent.content = content
			dynamicContent.is_actif = is_actif

			await dynamicContent.save();
			res.status(200).json();
		} catch (error) {
			res.status(500).json({ error: 'Failed to update role' });
		}
	};

}
const dynamicContentController = new DynamicContentController();

export { dynamicContentController };

