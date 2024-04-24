import React, { useState, useContext } from 'react';
import './share.scss';
import { AuthContext } from '../../context/authContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from '../../axios';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

const Share = () => {
  const [desc, setDesc] = useState('');
  const [charCount, setCharCount] = useState(0);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const mutation = useMutation(newPost => makeRequest.post('/posts', newPost), {
    onSuccess: () => {
      queryClient.invalidateQueries(['posts']);
    },
  });

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!desc.trim() || charCount > 140) return;
    
    mutation.mutate({ desc: desc.trim() });
    setDesc('');
    setCharCount(0);
  };

  const handleDescChange = (e) => {
    const inputValue = e.target.value;
    setDesc(inputValue);
    setCharCount(inputValue.length);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div className="share">
      <div className="input-container">
      <img className="avatar" src={currentUser?.profilePic ? `/upload/${currentUser.profilePic}` : "/upload/default.png"} alt={currentUser.name} />
        <input
          type="text"
          placeholder={`Type something...`}
          value={desc}
          onChange={handleDescChange}
          onKeyPress={handleKeyPress}
          maxLength={140}
        />
        <span className="charCounter">{charCount}/140</span>
      </div>
      <IconButton 
        onClick={handleClick} 
        className="send-button"
        disabled={desc.trim().length === 0 || charCount > 140}
      >
        <SendIcon />
      </IconButton>
    </div>
  );
};

export default Share;