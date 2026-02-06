const router = require("express").Router();
const { Blog, User } = require("../models");
const { Op } = require("sequelize");
const { tokenExtractor } = require("../util/middleware");

const blogFinder = async (req, res, next) => {
	req.blog = await Blog.findByPk(req.params.id);
	next();
};

router.get("/", async (req, res, next) => {
	let where = {};
	if (req.query.search) {
		where = {
			[Op.or]: [
				{
					title: {
						[Op.like]: `%${req.query.search}%`,
					},
				},
				{
					author: {
						[Op.like]: `%${req.query.search}%`,
					},
				},
			],
		};
	}

	try {
		const blogs = await Blog.findAll({
			attributes: { exclude: ["userId"] },
			include: {
				model: User,
				attributes: ["name"],
			},
			where,
			order: [["likes", "DESC"]],
		});
		res.json(blogs);
	} catch (error) {
		next(error);
	}
});

router.get("/:id", blogFinder, async (req, res, next) => {
	try {
		if (req.blog) {
			console.log(req.blog.toJSON());
			res.json(req.blog);
		} else {
			res.status(404).end();
		}
	} catch (error) {
		next(error);
	}
});

router.post("/", tokenExtractor, async (req, res, next) => {
	try {
		const user = await User.findByPk(req.decodedToken.id);
		const blog = await Blog.create({
			...req.body,
			userId: user.id,
			date: new Date(),
		});
		res.json(blog);
	} catch (error) {
		return res.status(400).json({ error });
	}
});

router.put("/:id", blogFinder, async (req, res, next) => {
	try {
		if (req.blog) {
			req.blog.likes += 1;
			await req.blog.save();
			res.json({ likes: req.blog.likes });
		} else {
			res.status(404).end();
		}
	} catch (error) {
		next(error);
	}
});

router.delete("/:id", tokenExtractor, blogFinder, async (req, res, next) => {
	try {
		if (req.blog.userId !== req.decodedToken.id) {
			return res
				.status(401)
				.json({ error: "only the creator can delete a blog" });
		}
		if (req.blog) {
			await req.blog.destroy();
			res.status(204).end();
		} else {
			res.status(404).end();
		}
	} catch (error) {
		next(error);
	}
});

module.exports = router;
