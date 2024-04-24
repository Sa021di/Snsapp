import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import moment from 'moment';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import './replies.scss';

const Replies = ({ commentId, onReplyAdded }) => {
  const [replyText, setReplyText] = useState('');
  const [charCount, setCharCount] = useState(0);
  const queryClient = useQueryClient();

  const { data: replies, isLoading, isError } = useQuery(['replies', commentId], () =>
    makeRequest.get(`/replies?commentId=${commentId}`).then((res) => res.data)
  );

  const addReplyMutation = useMutation(
    (newReply) => makeRequest.post('/replies', newReply),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['replies', commentId]);
        setReplyText('');
        setCharCount(0);
      },
    }
  );

  const handleAddReply = () => {
    if (replyText.trim() && charCount <= 140) {
      addReplyMutation.mutate(
        { commentId, replyText },
        {
          onSuccess: () => {
            if (onReplyAdded) {
              onReplyAdded();
            }
          },
        }
      );
      setReplyText('');
      setCharCount(0);
    }
  };

  const handleReplyTextChange = (e) => {
    setReplyText(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddReply();
    }
  };

  return (
    <div className="replies">
      {isLoading ? (
        <p>Loading replies...</p>
      ) : isError ? (
        <p>Error loading replies.</p>
      ) : (
        replies?.map((reply) => (
          <div key={reply.id} className="reply">
            <div className="replyHeader">
            <img src={reply.profilePic ? `/upload/${reply.profilePic}` : "/upload/default.png"} alt={reply.name} className="userImage" />
              <div className="userInfo">
                <span className="userName">{reply.name}</span>
                <span className="replyDate">{moment(reply.createdAt).fromNow()}</span>
              </div>
            </div>
            <p className="replyText">{reply.replyText}</p>
          </div>
        ))
      )}
      <div className="writeReply">
        <input
          type="text"
          placeholder="Write a reply..."
          value={replyText}
          onChange={handleReplyTextChange}
          onKeyPress={handleKeyPress}
          maxLength={140}
          className={`replyInput ${replyText.trim() ? 'active' : ''}`}
        />
        <IconButton
          onClick={handleAddReply}
          className={`replyButton ${!replyText.trim() || charCount > 140 ? 'disabled' : ''}`}
          disabled={!replyText.trim() || charCount > 140}
        >
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Replies;
