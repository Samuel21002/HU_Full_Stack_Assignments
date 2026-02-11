const router = require("express").Router();
const { User, Blog, Session } = require("../models");

const userFinder = async (req, res, next) => {
	let user = await User.findByPk(req.params.id);
	if (!user) {
		return res.status(404).json({ error: "user not found" });
	}
	req.user = user;
	next();
};

router.get("/", async (req, res) => {
	const users = await User.findAll({
		include: {
			model: Blog,
			attributes: { exclude: ["userId"] },
		},
	});
	res.json(users);
});

router.post("/", async (req, res, next) => {
	try {
		const user = await User.create(req.body);
		res.json(user);
	} catch (error) {
		next(error);
	}
});

router.put("/:username", async (req, res) => {
	try {
		const user = await User.findOne({
			where: { username: req.params.username },
		});
		if (!user) {
			return res.status(404).json({ error: "user not found" });
		}
		if (!req.body.username) {
			return res.status(400).json({ error: "username missing" });
		}
		user.username = req.body.username;
		await user.save();
		res.json(user);
	} catch (error) {
		return res.status(400).json({ error: error.message });
	}
});

router.get("/:id", async (req, res) => {
	const where = {};
	
	if (req.query.read !== undefined) {
		where.isRead = req.query.read === 'true';
	}

	const user = await User.findByPk(req.params.id, {
		attributes: { exclude: ["id", "createdAt", "updatedAt"] },
		include: [
			{
				model: Blog,
				as: "readings",
				attributes: { exclude: ["userId", "createdAt", "updatedAt"] },
				through: {
					attributes: ["id", "isRead"],
					where,
				},
			},
		],
	});
	if (user) {
		res.json(user);
	} else {
		res.status(404).end();
	}
});

router.delete("/:id", userFinder, async (req, res) => {
	const user = req.user;
	if (user) {
		await user.destroy();
		res.status(204).end();
	} else {
		res.status(404).end();
	}
});

/* Admin routes for disabling/enabling users. 

In production, these would be protected by an admin role check, 
but for simplicity, they are left open here. */
router.put("/:id/disable", userFinder, async (req, res) => {
	const user = req.user;
	if (user && user.disabled === false) {
		user.disabled = true;
		await user.save();
		res.json(user);
	} else {
		res.status(404).end();
	}
});

router.put("/:id/enable", userFinder, async (req, res) => {
	const user = req.user;
	if (user && user.disabled === true) {
		user.disabled = false;
		await user.save();
		res.json(user);
	} else {
		res.status(404).end();
	}
});

router.delete("/:id/session-revoke", userFinder, async (req, res) => {
	const user = req.user;
	if (user) {
		await Session.destroy({ where: { userId: user.id } });
		res.status(204).end();
	} else {
		res.status(404).end();
	}
});

module.exports = router;
