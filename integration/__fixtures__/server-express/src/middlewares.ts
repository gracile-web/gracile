import type { NextFunction, Request, Response } from 'express';

type Middleware = (req: Request, res: Response, next: NextFunction) => unknown;

export const authentication: Middleware = (req, res, next) => {
	const b64 = req.headers.authorization?.split(' ')?.[1];

	if (b64) {
		const [user, pass] = Buffer.from(b64, 'base64').toString().split(':');

		if (user === 'admin' && pass === 'password') return next();
	}

	res.setHeader('WWW-Authenticate', 'Basic');

	res.statusCode = 401;
	res.statusMessage = 'You are not authenticated!';
	return res.end(res.statusMessage);
};
