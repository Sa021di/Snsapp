import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import moment from 'moment';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import { AuthContext } from '../../context/authContext';
import './comments.scss';
import Replies from './Replies';

const Comments = ({ postId, onCommentAdded }) => {
  const [desc, setDesc] = useState('');
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [likedComments, setLikedComments] = useState({});
  const [commentLikes, setCommentLikes] = useState({});
  const [openReplies, setOpenReplies] = useState({});
  const [repliedComments, setRepliedComments] = useState({});

  const { data: comments, isLoading, error } = useQuery(['comments', postId], () =>
    makeRequest.get(`/comments?postId=${postId}`).then((res) => res.data)
  );

  useEffect(() => {
    if (comments) {
      const newLikedComments = {};
      const newCommentLikes = {};
      const fetchLikesPromises = comments.map(comment =>
        makeRequest.get(`/commentLikes/${comment.id}/likes`).then(res => {
          newLikedComments[comment.id] = comment.currentUserLiked;
          newCommentLikes[comment.id] = res.data;
        })
      );
      Promise.all(fetchLikesPromises).then(() => {
        setLikedComments(newLikedComments);
        setCommentLikes(newCommentLikes);
      });

      const storedRepliedComments = localStorage.getItem('repliedComments');
      if (storedRepliedComments) {
        setRepliedComments(JSON.parse(storedRepliedComments));
      }
    }
  }, [comments]);

  const addCommentMutation = useMutation(
    newComment => makeRequest.post('/comments', newComment),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', postId]);
        setDesc('');
        if (onCommentAdded) {
          onCommentAdded();
        }
      },
    }
  );

  const likeCommentMutation = useMutation(
    commentId => makeRequest.post(`/commentLikes/${commentId}/likes`),
    {
      onSuccess: (_, commentId) => {
        queryClient.invalidateQueries(['comments', postId]);
        setLikedComments(prev => ({
          ...prev,
          [commentId]: true
        }));
        setCommentLikes(prev => ({
          ...prev,
          [commentId]: (prev[commentId] || 0) + 1
        }));
      },
    }
  );

  const unlikeCommentMutation = useMutation(
    commentId => makeRequest.delete(`/commentLikes/${commentId}/likes`),
    {
      onSuccess: (_, commentId) => {
        queryClient.invalidateQueries(['comments', postId]);
        setLikedComments(prev => ({
          ...prev,
          [commentId]: false
        }));
        setCommentLikes(prev => ({
          ...prev,
          [commentId]: Math.max((prev[commentId] || 1) - 1, 0)
        }));
      },
    }
  );

  const handleAddComment = () => {
    if (!desc.trim() || desc.length > 140) return;
    addCommentMutation.mutate({
      postId,
      desc: desc.trim(),
      userId: currentUser.id,
    });
    setDesc('');
  };

  const handleLike = (commentId) => {
    if (likedComments[commentId]) {
      unlikeCommentMutation.mutate(commentId);
      setLikedComments(prev => ({ ...prev, [commentId]: false }));
    } else {
      likeCommentMutation.mutate(commentId);
      setLikedComments(prev => ({ ...prev, [commentId]: true }));
    }
  };

  const toggleReplies = (commentId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  return (
    <div className="comments">
      <div className="writeComment">
        <img src={currentUser?.profilePic ? `/upload/${currentUser.profilePic}` : "/upload/default.png"} alt="User profile" className="userImage" />
        <div className="inputWrapper">
          <input
            type="text"
            placeholder="Write a comment..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="commentInput"
            maxLength={140}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddComment();
              }
            }}
          />
          {/* <span className="charCounter">{desc.length}/140</span> */}
        </div>
        <IconButton
          onClick={handleAddComment}
          className="sendButton"
          disabled={!desc.trim() || desc.length > 140}
        >
          <SendIcon />
        </IconButton>
      </div>
      {error && <p className="errorMessage">Something went wrong</p>}
      {isLoading ? (
        <p className="loadingMessage">Loading comments...</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="commentContainer">
            <div className="commentHeader">
              <img src={comment.profilePic ? `/upload/${comment.profilePic}` : (currentUser?.profilePic ? `/upload/${currentUser.profilePic}` : "/upload/default.png")} alt="User profile" className="userImage" />
              <div className="commentInfo">
                <span className="userName">{comment.name}</span>
                <span className="commentDate">{moment(comment.createdAt).fromNow()}</span>
              </div>
            </div>
            <div className="commentBody">
              <p className="commentText">{comment.desc}</p>
            </div>
            <div className="commentActions">
              {likedComments[comment.id] ? (
                <FavoriteBorderOutlinedIcon onClick={() => handleLike(comment.id)} style={{ color: 'red' }} />
              ) : (
                <FavoriteBorderOutlinedIcon onClick={() => handleLike(comment.id)} />
              )}
              <span>{commentLikes[comment.id] || 0}</span>
              <ChatBubbleOutlineIcon
                className="replyIcon"
                onClick={() => toggleReplies(comment.id)}
                style={{ color: repliedComments[comment.id] ? 'rgb(36, 167, 36)' : 'inherit' }}
              />

            </div>
            {openReplies[comment.id] && (
              <Replies
                commentId={comment.id}
                onReplyAdded={() => {
                  setRepliedComments((prev) => {
                    const newRepliedComments = {
                      ...prev,
                      [comment.id]: true,
                    };
                    localStorage.setItem('repliedComments', JSON.stringify(newRepliedComments));
                    return newRepliedComments;
                  });
                }}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;
