import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Convert the file URL to a directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads/"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images only (jpeg, jpg, png, gif)");
    }
  },
});

export default upload;
