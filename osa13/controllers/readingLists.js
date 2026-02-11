const router = require("express").Router();
const { Blog, User, ReadingList } = require("../models");
const { tokenExtractor } = require("../util/middleware");

router.post("/", tokenExtractor, async (req, res, next) => {
	try {
		const user = await User.findByPk(req.decodedToken.id);
		if (!user) {
			return res.status(404).json({ error: "user not found" });
		}

		const blog = await Blog.findByPk(req.body.blogId);
		if (!blog) {
			return res.status(404).json({ error: "blog not found" });
		}

		const readingListEntry = await ReadingList.create({
			userId: user.id,
			blogId: req.body.blogId,
		});
		res.status(201).json(readingListEntry);
	} catch (error) {
		next(error);
	}
});

router.put("/:id", tokenExtractor, async (req, res, next) => {
	try {
		const readingListEntry = await ReadingList.findOne({
			where: {
				blogId: req.params.id,
				userId: req.decodedToken.id,
			},
		});
		if (!readingListEntry) {
			return res.status(404).json({ error: "reading list entry not found" });
		}
		readingListEntry.isRead = req.body.isRead;
		await readingListEntry.save();
		res.json(readingListEntry);
	} catch (error) {
		next(error);
	}
});

router.get("/:id", async (req, res) => {
	const user = await User.findByPk(req.params.id, {
		attributes: { exclude: ["id", "createdAt", "updatedAt"] },
		include: {
			model: Blog,
			as: "readings",
			attributes: { exclude: ["userId"] },
			through: {
				attributes: [],
			},
			include: {
				model: User,
				attributes: [],
			},
		},
	});

	if (user) {
		res.json(user);
	} else {
		res.status(404).end();
	}
});

module.exports = router;
