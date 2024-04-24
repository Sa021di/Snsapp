import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const checkBookmark = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const checkQuery = "SELECT * FROM bookmarks WHERE `userId` = ? AND `postId` = ?";
      db.query(checkQuery, [userInfo.id, req.params.postId], (err, data) => {
        if (err) return res.status(500).json(err);
  
        const isBookmarked = data.length > 0;
        return res.status(200).json({isBookmarked});
      });
    });
  };
  
export const addBookmark = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const checkQuery = "SELECT * FROM bookmarks WHERE `userId` = ? AND `postId` = ?";
    db.query(checkQuery, [userInfo.id, req.body.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length > 0) {
        return res.status(409).json("Bookmark already exists.");
      } else {
        const insertQuery = "INSERT INTO bookmarks (`userId`,`postId`) VALUES (?)";
        const values = [userInfo.id, req.body.postId];
        db.query(insertQuery, [values], (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json("Bookmark has been added.");
        });
      }
    });
  });
};

export const deleteBookmark = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q = "DELETE FROM bookmarks WHERE `userId` = ? AND `postId` = ?";
    db.query(q, [userInfo.id, req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Bookmark has been removed.");
    });
  });
};

export const getUserBookmarks = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const q = `
            SELECT p.*, u.name, u.profilePic
            FROM bookmarks b
            JOIN posts p ON b.postId = p.id
            JOIN users u ON p.userId = u.id
            WHERE b.userId = ?
        `;
        db.query(q, [userInfo.id], (err, posts) => {
            if (err) return res.status(500).json(err);
            res.status(200).json(posts);
        });
    });
};