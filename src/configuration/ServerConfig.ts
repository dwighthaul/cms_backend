import bodyParser from 'body-parser';
import express, { Express, NextFunction, Request, Response } from "express";

import session from 'express-session';
import { SQLConnection } from '../controller/db/SQLConnection';
import blog from '../routes/blog';
import cookieManager from '../routes/cookieManager';
import dynamicContent from '../routes/dynamicContent';
import role from '../routes/role';
import user from '../routes/user';



class ServerConfig {
	// Change en une class
	app: Express;

	// Construction a partir des configurations
	constructor(app: Express) {
		this.app = app;
	}

	initMiddlewares() {
		this.app.use(express.static('public'));
		this.app.use(bodyParser.urlencoded({ extended: false }));
		this.app.use(bodyParser.json());
		console.log("Auth depuis le chemin suivant : ", process.env.CLIENT_ENDPOINT)
		this.app.use((req: Request, res: Response, next: NextFunction) => {
			res.setHeader('Access-Control-Allow-Origin', `${process.env.CLIENT_ENDPOINT}`);
			res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
			res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
			res.setHeader('Access-Control-Allow-Credentials', 'true'); // true boolean n'est pas valide
			next();
		});

		this.app.set('trust proxy', 1);
	}

	initSession() {
		this.app.use(session({
			secret: 'APODAJDSDAJDLFHELSJCPJZXPR',
			resave: false,
			saveUninitialized: true,
			cookie: {
				httpOnly: false,
				secure: (process.env.NODE_ENV === "production"),
				sameSite: (process.env.NODE_ENV === "production") ? 'none' : 'strict',
				maxAge: 86400000 // 1 day
			}
		}));

		this.app.use((req: Request, res: Response, next: NextFunction) => {
			if (req.session?.cookie &&
				typeof req.session.cookie.expires !== 'boolean' &&
				req.session.cookie.expires instanceof Date &&
				req.session.cookie.expires.getTime() > Date.now()) {
				// Votre logique ici

				// TODO : DelUser existe pas
				// userRuntimeDataHandler.delUser();
			}
			next();
		});
	}


	initRoutes() {
		this.app.use('/user/', user);
		this.app.use('/role/', role);
		this.app.use('/cookie/', cookieManager);
		this.app.use('/blog/', blog);
		this.app.use('/dynamicContent/', dynamicContent);


		this.app.get('/', (req: Request, res: Response) => {
			res.send(req.session);
		});

		this.app.get('/test', (req: Request, res: Response) => {
			res.send({ hello: "world" });
		});
	}

	initDatabase() {
		const c = new SQLConnection();
		c.connect().then(() => {
			c.syncDatabase();
		});
	}


};

export = ServerConfig;
