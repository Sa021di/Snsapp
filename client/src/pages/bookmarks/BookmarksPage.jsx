import React from 'react';
import Bookmarks from '../../components/bookmarks/Bookmarks.jsx';
import './BookmarksPage.scss';

const BookmarksPage = () => {
  return (
    <div className="bookmarks-page">
      <h1>My Bookmarks</h1>
      <Bookmarks />
    </div>
  );
};

export default BookmarksPage;
