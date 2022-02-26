import multer from "multer";
import path from "path";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storageType = {
	local: multer.diskStorage({
		destination: (req, file, cb) => cb(null, path.resolve(__dirname, "..", "..", "tmp", "uploads")),
		filename: (req, file ,cb) => {
			crypto.randomBytes(16, (err, hash) => {
				if(err) {
					cb(err);
				}

				file.key = `${hash.toString("hex")}-${file.originalname}`;

				cb(null, file.key);
			});
		}
	}),
	s3: multerS3({
		s3: new aws.S3(),
		bucket: "uploadExample",
		contentType: multerS3.AUTO_CONTENT_TYPE,
		acl: "public-read",
		key: (req, file, cb) => {
			crypto.randomBytes(16, (err, hash) => {
				if(err) {
					cb(err);
				}

				const fileName = `${hash.toString("hex")}-${file.originalname}`;

				cb(null, fileName);
			});
		}
	})
};

export default {
	dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
	storage: storageType[process.env.STORAGE_TYPE],
	limits: {
		fileSize: 2 * 1024 * 1024
	},
	fileFilter: (req, file, cb) => {
		const allowedMimes = [
			"image/jpeg",
			"image/jpg",
			"image/png"
		];

		if(allowedMimes.includes(file.mimetype)) {
			cb(null, true);
		} else {
			cb(new Error("Invalid file type"));
		}
	}
};
