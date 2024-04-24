import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getReplies = (req, res) => {
  const q = `
    SELECT r.*, u.name, u.profilePic
    FROM comment_replies AS r
    JOIN users AS u ON u.id = r.userId
    WHERE r.commentId = ?
    ORDER BY r.createdAt DESC
  `;
  db.query(q, [req.query.commentId], (err, data) => {
    if (err) {
      console.error(err); 
      return res.status(500).json(err);
    }
    res.status(200).json(data);
  });
};
export const addReply = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = "INSERT INTO comment_replies (commentId, userId, replyText, createdAt) VALUES (?,?,?,?)";
    const values = [
      req.body.commentId,
      userInfo.id,
      req.body.replyText,
      moment().format("YYYY-MM-DD HH:mm:ss")
    ];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json("Reply has been added.");
    });
  });
};


