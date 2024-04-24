import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (req, res) => {
  const token = req.cookies
.accessToken;
if (!token) return res.status(401).json("Not logged in!");

jwt.verify(token, "secretkey", (err, userInfo) => {
if (err) return res.status(403).json("Token is not valid!");
const q = `
  SELECT c.*, u.name, u.profilePic,
  EXISTS(SELECT 1 FROM CommentLikes WHERE userId = ? AND commentId = c.id) AS currentUserLiked,
  (SELECT COUNT(*) FROM CommentLikes WHERE commentId = c.id) AS likeCount
  FROM comments c
  JOIN users u ON u.id = c.userId
  WHERE c.postId = ?
  ORDER BY c.createdAt DESC
`;

db.query(q, [userInfo.id, req.query.postId], (err, data) => {
  if (err) return res.status(500).json(err);
  return res.status(200).json(data);
});
});
};

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "INSERT INTO comments(`desc`, `createdAt`, `userId`, `postId`) VALUES (?)";
    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Comment has been created.");
    });
  });
};

export const deleteComment = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const commentId = req.params.id;
    const q = "DELETE FROM comments WHERE `id` = ? AND `userId` = ?";

    db.query(q, [commentId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.json("Comment has been deleted!");
      return res.status(403).json("You can delete only your comment!");
    });
  });
};
