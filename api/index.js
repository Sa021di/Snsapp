import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import bookmarkRoutes from "./routes/bookmarks.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import replyRoutes from "./routes/reply.js";
import commentLikesRoutes from './routes/commentLikes.js'; 
const app = express();

// Middlewares
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
}));
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/logout", (req, res) => {
  res.clearCookie('accessToken');
  res.status(200).json({ message: "Successfully logged out" });
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json({
    filename: req.file.filename
  });
});


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/replies', replyRoutes);
app.use('/api/commentLikes', commentLikesRoutes);



app.listen(8800, () => {
  console.log("API working!");
});
