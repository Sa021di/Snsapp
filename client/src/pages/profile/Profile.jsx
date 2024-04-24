import React, { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import Update from '../../components/update/Update';
import Posts from '../../components/posts/Posts';
import { makeRequest } from '../../axios';
import "./profile.scss";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const userId = parseInt(location.pathname.split("/")[2]);
  const { isLoading, error, data } = useQuery(['user'], () =>
    makeRequest.get("/users/find/" + userId).then((res) => res.data)
  );
  const isCurrentUserProfile = userId === currentUser?.id;

  return (
    <div className="profile">
      {isLoading ? (
        "Loading..."
      ) : error ? (
        <p>Something went wrong!</p>
      ) : (
        <>
          <div className="images">
            <img src={"/upload/"+data.profilePic} alt="" className="profilePic" />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="center">
                <span>{data.name}</span>
                <div className="info"></div>
                {isCurrentUserProfile && (
                  <button onClick={() => setOpenUpdate(true)}>Manage Account</button>
                )}
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
