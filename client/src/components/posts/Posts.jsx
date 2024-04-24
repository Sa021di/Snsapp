import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import Post from '../post/Post';
import './posts.scss';

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery(['posts', userId], () => 
    makeRequest.get(userId ? `/posts/${userId}` : "/posts").then((res) => {
      return res.data;
    })
  );

  return (
    <div className="posts">
      {error ? (
        "Something went wrong!"
      ) : isLoading ? (
        "Loading..."
      ) : (
        data.map((post) => {
          return <Post post={post} key={post.id} />;
        })
      )}
    </div>
  );
};

export default Posts;
