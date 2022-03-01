import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer.mjs";
import Post from "./models/Posts.mjs";

const route = Router();


route.get("/posts", async (req, res) => {

	const posts = await Post.find();

	return res.json(posts);
});

route.post("/posts", multer(multerConfig).single("file") , async(req, res) => {
	console.log(req.file);
	const { originalname: name, size, key, location: url = "" } = req.file;

	const post = await Post.create({
		name,
		size,
		key,
		url
	});

	return res.json(post);
});

route.delete("/posts/:id", async (req, res) => {
	const post = await Post.findById(req.params.id);

	await post.remove();

	return res.send();
});

export default route;
