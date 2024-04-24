import React, { useState, useContext } from "react";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./update.scss";
import { AuthContext } from "../../context/authContext";

const Update = ({ setOpenUpdate, user }) => {
  const [profile, setProfile] = useState(null);
  const [texts, setTexts] = useState({
    email: user.email,
    password: user.password,
    name: user.name,
  });

  const queryClient = useQueryClient();
  const { logout } = useContext(AuthContext);

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data.filename;
    } catch (err) {
      console.error("Failed to upload file:", err);
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const mutation = useMutation(
    (newUserData) => {
      return makeRequest.put("/users", newUserData);
    },
    {
      onSuccess: () => {
        if (window.confirm("Please re-login to your account. Do you want to log out now?")) {
          logout();
        }
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    let profileUrl = user.profilePic;

    if (profile) {
      const uploadedProfileUrl = await upload(profile);
      if (uploadedProfileUrl) {
        profileUrl = uploadedProfileUrl;
      }
    }
    
    mutation.mutate({ ...texts, profilePic: profileUrl });
    setOpenUpdate(false);
    setProfile(null);
  };

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Manage Profile</h1>
        <form>
          <div className="files">
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img src={profile? URL.createObjectURL(profile) : "/upload/" + user.profilePic} alt="" />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input type="file"id="profile" style={{ display: "none" }}
              onChange={(e) => setProfile(e.target.files[0])}
            />
          </div>
          <label>Email</label>
          <input
            type="text"
            value={texts.email}
            name="email"
            onChange={handleChange}
            disabled
          />
          <label>Password</label>
          <input
            type="text"
            value={texts.password}
            name="password"
            onChange={handleChange}
          />
          <label>Name</label>
          <input
            type="text"
            value={texts.name}
            name="name"
            onChange={handleChange}
          />
          <button type="submit" onClick={handleClick}>Update</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Update;