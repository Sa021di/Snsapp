import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getCommentLikes = (req, res) => {
  const query = "SELECT COUNT(userId) AS likeCount FROM CommentLikes WHERE commentId = ?";
  db.query(query, [req.params.commentId], (err, data) => {
    if (err) {
      console.error('Error fetching likes:', err);
      return res.status(500).json(err);
    }
    return res.status(200).json(data[0].likeCount);
  });
};


export const addCommentLike = (req, res) => {
  console.log(`Attempting to add like with params:`, req.params);
  const token = req.cookies.accessToken;
  if (!token) {
    console.error('No token provided');
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json("Token is invalid!");
    }
    const checkQuery = "SELECT * FROM CommentLikes WHERE userId = ? AND commentId = ?";
    db.query(checkQuery, [userInfo.id, req.params.commentId], (err, data) => {
      if (err) {
        console.error('Error checking like:', err);
        return res.status(500).json(err);
      }

      if (data.length > 0) {
        return res.status(400).json("Comment already liked by this user.");
      } else {
        const insertQuery = "INSERT INTO CommentLikes (userId, commentId) VALUES (?, ?)";
        db.query(insertQuery, [userInfo.id, req.params.commentId], (err, data) => {
          if (err) {
            console.error('Error inserting like:', err);
            return res.status(500).json(err);
          }
          console.log('Like added:', data);
          return res.status(200).json("Comment has been liked.");
        });
      }
    });
  });
};

export const deleteCommentLike = (req, res) => {
  console.log(`Attempting to remove like for commentId: ${req.params.commentId}`);
  const token = req.cookies.accessToken;
  if (!token) {
    console.error('No token provided');
    return res.status(401).json("Not authenticated!");
  }

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) {
      console.error('Token verification error:', err);
      return res.status(403).json("Token is invalid!");
    }

    const query = "DELETE FROM CommentLikes WHERE userId = ? AND commentId = ?";
    console.log(`Running query: ${query} with userId: ${userInfo.id} and commentId: ${req.params.commentId}`);

    db.query(query, [userInfo.id, req.params.commentId], (err, data) => {
      if (err) {
        console.error('Error deleting like:', err);
        return res.status(500).json(err);
      }
      console.log('Like removed:', data);
      return res.status(200).json("Comment like has been removed.");
    });
  });
};
