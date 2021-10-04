import React, { useEffect, useState } from "react";
import { isAuthenticated } from "../auth";
import { Redirect, Link } from "react-router-dom";
import { read } from "../user";
import DefaultProfile from "../images/DefaultImage.jpg";
import DeleteUser from "../user/DeleteUser";
import FollowProfileButton from "../user/FollowProfileButton";
import ProfileTabs from "../user/ProfileTabs";
import { postsByUser } from "../posts/index";

export default function Profile(props) {
  const [user, setUser] = useState({});
  const [redirectToSigin, setRedirectToSignin] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState([]);

  const checkFollow = (user) => {
    const jwt = isAuthenticated();
    let match = user.followers.find((follower) => {
      // one id has many other ids (followers) and vice versa
      return follower._id === jwt.user._id;
    });
    if (match === undefined) {
      match = false;
    }
    return match;
  };

  const clickFollowButton = (callApi) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    callApi(userId, token, user._id).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setUser(data);
        setIsFollowing(!isFollowing);
      }
    });
  };

  const loadPosts = () => {
    const token = isAuthenticated().token;
    const userId = props.match.params.userId;
    postsByUser(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setPosts(data);
      }
    });
  };

  const init = () => {
    const token = isAuthenticated().token;
    const userId = props.match.params.userId;
    read(userId, token).then((data) => {
      if (data.error) {
        setRedirectToSignin(true);
      } else {
        let followCheck = checkFollow(data);
        setIsFollowing(followCheck);
        setUser(data);
      }
    });
    loadPosts(userId, token);
  };

  useEffect(() => {
    init();
  }, [props.match.params.userId]);

  const { name, email, created, _id, followers, following } = user;

  if (redirectToSigin) return <Redirect to="/signin" />;

  const photoUrl = _id
    ? `${
        process.env.REACT_APP_API_URL
      }/user/photo/${_id}?${new Date().getTime()}`
    : DefaultProfile;
  return (
    <div className="container">
      <h2 className="mt-5 mb-5">Profile</h2>
      <div className="row">
        <div className="col-md-4">
          <img
            src={photoUrl}
            alt={name}
            style={{ height: "200px", width: "auto" }}
            className="img-thumbnail"
            onError={(i) => (i.target.src = `${DefaultProfile}`)}
          />
        </div>
        <div className="col-md-8">
          <div className="lead">
            <p>Hello {name}</p>
            <p>Email: {email}</p>
            <p>{`Joined ${new Date(created).toDateString()}`}</p>
          </div>
          {isAuthenticated().user && isAuthenticated().user._id === user._id ? (
            <div className="d-inline-block">
              <Link
                className="btn btn-raised btn-info me-5"
                to={`/post/create`}
              >
                Create New Post
              </Link>
              <Link
                className="btn btn-raised btn-success me-5"
                to={`/user/edit/${user._id}`}
              >
                Edit Profile
              </Link>
              <DeleteUser userId={user._id} />
            </div>
          ) : (
            <FollowProfileButton
              onButtonClick={clickFollowButton}
              isFollowing={isFollowing}
            />
          )}
        </div>
      </div>
      <div className="row">
        <div className="col md-12 mt-5 mb-5">
          <hr />
          <p className="lead">{user.about}</p>
          <hr />
          <ProfileTabs
            followers={followers}
            following={following}
            posts={posts}
          />
        </div>
      </div>
    </div>
  );
}
