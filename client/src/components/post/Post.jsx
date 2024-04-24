import React, { useState, useContext } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import Comments from "../comments/Comments";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import "./post.scss";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedDesc, setEditedDesc] = useState(post.desc);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [userCommented, setUserCommented] = useState(false);

  const handleDescChange = (e) => {
    setEditedDesc(e.target.value);
  };

  const { data: bookmarkData } = useQuery(["bookmarks", post.id], () =>
    makeRequest.get(`/bookmarks/check/${post.id}`).then((res) => res.data)
  );

  const addBookmarkMutation = useMutation(() => makeRequest.post('/bookmarks/add', { postId: post.id }), {
    onSuccess: () => {
      queryClient.invalidateQueries(["bookmarks", post.id]);
    },
  });

  const deleteBookmarkMutation = useMutation(() => makeRequest.delete(`/bookmarks/delete?postId=${post.id}`), {
    onSuccess: () => {
      queryClient.invalidateQueries(["bookmarks", post.id]);
    },
  });

  const handleBookmarkClick = () => {
    if (bookmarkData?.isBookmarked) {
      deleteBookmarkMutation.mutate();
    } else {
      addBookmarkMutation.mutate();
    }
  };

  const { isLoading, data } = useQuery(["likes", post.id], () =>
    makeRequest.get("/likes?postId=" + post.id).then((res) => res.data)
  );

  const likeMutation = useMutation(
    (liked) => {
      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", { postId: post.id });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );

  const deleteMutation = useMutation(
    () => makeRequest.delete("/posts/" + post.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const editMutation = useMutation(
    () => makeRequest.put("/posts/" + post.id, { desc: editedDesc }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const { data: commentsData } = useQuery(["comments", post.id], () =>
    makeRequest.get(`/comments?postId=${post.id}`).then((res) => {
      const userHasCommented = res.data.some(comment => comment.userId === currentUser.id);
      setUserCommented(userHasCommented);
      return res.data;
    }),
    {
      enabled: !!post.id,
    }
  );

  const handleLike = () => {
    likeMutation.mutate(data.includes(currentUser.id));
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleSave = () => {
    editMutation.mutate();
    setEditing(false);
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
          <img src={post.profilePic ? `/upload/${post.profilePic}` : "/upload/default.png"} alt="ProfPic" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          {currentUser.id === post.userId && (
            <>
              <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { setEditing(true); handleClose(); }}>Edit</MenuItem>
                <MenuItem onClick={() => { handleDelete(); handleClose(); }}>Delete</MenuItem>
              </Menu>
            </>
          )}
        </div>
        <div className="content">
          {editing ? (
            <textarea
              value={editedDesc}
              onChange={handleDescChange}
              maxLength="140"
            />
          ) : (
            <>
              <p>{post.desc}</p>
              <img src={"/upload/" + post.img} alt="" />
            </>
          )}
          {editing && <button onClick={handleSave}>Save</button>}
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "loading"
            ) : (
              <FavoriteBorderOutlinedIcon
                className={`grey-heart ${data.includes(currentUser.id) ? 'liked-heart' : ''}`}
                onClick={handleLike}
              />
            )}
            {data?.length}
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon className={userCommented ? 'green-comment' : 'grey-comment'} />
          </div>
          <div className="item" onClick={handleBookmarkClick}>
            {bookmarkData?.isBookmarked ? (
              <BookmarkBorderIcon className="bookmark-icon bookmarked" />
            ) : (
              <BookmarkBorderIcon className="bookmark-icon" />
            )}
          </div>

        </div>
        {commentOpen && (
          <Comments
            postId={post.id}
            onCommentAdded={() => setUserCommented(true)}
          />
        )}

      </div>
    </div>
  );
};

export default Post;