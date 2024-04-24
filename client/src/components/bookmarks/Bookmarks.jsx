import React, { useEffect, useState } from 'react';
import { makeRequest } from '../../axios';
import Post from '../post/Post';
import "./bookmarks.scss";
const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const result = await makeRequest.get('/bookmarks/user');
        setBookmarks(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBookmarks();
  }, []);
  return (
    <div>
      {bookmarks.map((bookmark) => (
        <Post key={bookmark.id} post={bookmark} />
      ))}
    </div>
  );
};

export default Bookmarks;
