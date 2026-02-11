const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");
const { Session, User } = require("../models");

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
	console.error(error.message);

	switch (error.name) {
		case "SequelizeValidationError":
			if (error.errors[0].validatorName === "isEmail") {
				return response
					.status(400)
					.json({ error: "Validation isEmail on username failed" });
			}
			else if (error.errors[0].validatorName === "min") {
				return response
					.status(400)
					.json({ error: "Validation min on yearWritten failed" });
			}
			return response.status(400).json({ error: error.message });
		case "SequelizeDatabaseError":
			return response.status(400).send({ error: "malformatted data" });
		case "SequelizeUniqueConstraintError":
			return response.status(400).json({ error: "blog already in reading list" });
		default:
			break;
	}

	next(error);
};

const tokenExtractor = async (req, res, next) => {
	const authorization = req.get("authorization");
	if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
		try {
			const token = authorization.substring(7);
			req.decodedToken = jwt.verify(token, SECRET);
			if (process.env.NODE_ENV !== "production") {
				console.log("Decoded token:", req.decodedToken);
			}

			const session = await Session.findOne({ where: { token } });
			if (!session) {
				return res.status(401).json({ error: "session expired or does not exist, please login again" });
			}

			const user = await User.findByPk(req.decodedToken.id);
			if (user.disabled) {
				await Session.destroy({ where: { userId: user.id } });
				return res.status(401).json({ error: "account disabled" });
			}
		} catch {
			return res.status(401).json({ error: "token invalid" });
		}
	} else {
		return res.status(401).json({ error: "token missing" });
	}
	next();
};

module.exports = {
	unknownEndpoint,
	errorHandler,
	tokenExtractor,
};
