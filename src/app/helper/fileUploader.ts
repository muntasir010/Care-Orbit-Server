import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import config from "../config/config";
import AppError from "../errors/AppError";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadToCloudinary = async (file: Express.Multer.File) => {
  cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
  });

  const uploadResult = await cloudinary.uploader.upload(file.path, {
    public_id: file.filename,
  });

  return uploadResult;
};

const makeUpload = (allowed: string[], maxMB: number) =>
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxMB * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      if (allowed.includes(file.mimetype)) return cb(null, true);
      cb(new AppError(400, `Unsupported file type: ${file.mimetype}`));
    },
  });

const prescriptionUpload = makeUpload(
  ["image/jpeg", "image/png", "image/webp", "application/pdf"],
  5,
);

export const fileUploader = {
  upload,
  uploadToCloudinary,
  prescriptionUpload,
};
