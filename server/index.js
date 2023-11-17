import express from "express";
import bodyParser from "body-parser";//is used for parsing request bodies.
import mongoose from "mongoose";// Object Data Modeling (ODM) library for MongoDB.
import cors from "cors";//middleware for handling Cross-Origin Resource Sharing.
import dotenv from "dotenv";//to load environment variables from a .env file.
import multer from "multer";//middleware for handling file uploads.
import helmet from "helmet";//used to enhance the application's security by setting HTTP headers.
import morgan from "morgan";// request logger middleware.
import path from "path";//Properly set the path when we configure directories.
import { fileURLToPath } from "url";//Properly set the path when we configure directories. //function from the url module to convert file URLs to file paths.
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/*CONFIGURATIONS*/ //All the middleware configurations 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json()); // is used to parse JSON request bodies.
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);//upload picture locally into the public/assets folder 
app.post("/posts", verifyToken, upload.single("picture"), createPost);//This route is for creating posts and also allows uploading a picture.

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    //  User.insertMany(users);
    //  Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));