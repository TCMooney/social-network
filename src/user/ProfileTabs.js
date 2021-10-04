import React, { Component } from "react";
import { Link } from "react-router-dom";

import DefaultProfile from "../images/DefaultImage.jpg";

export default class ProfileTabs extends Component {
  showFollowers = (followers) => {
    if (followers) {
      return followers.map((follower) => {
        return (
          <div key={follower._id}>
            <div className="row">
              <div>
                <Link to={`/profile/${follower._id}`}>
                  <img
                    style={{ borderRadius: "50%", border: "1px solid black" }}
                    className="float-left me-2"
                    height="30px"
                    width="30px"
                    onError={(i) => (i.target.src = `${DefaultProfile}`)}
                    src={`${process.env.REACT_APP_API_URL}/user/photo/${follower._id}`}
                    alt={follower.name}
                  />
                  <div>
                    <p className="lead">{follower.name}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        );
      });
    } else {
      return <div>loading...</div>;
    }
  };

  showPosts = (posts) => {
    if (posts) {
      return posts.map((post) => {
        return (
          <div key={post._id}>
            <div className="row">
              <div>
                <Link to={`/post/${post._id}`}>
                  <div>
                    <p className="lead">{post.title}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        );
      });
    } else {
      return <div>loading...</div>;
    }
  };
  render() {
    const { following, followers, posts } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            <h3 className="text-primary">Followers</h3>
            <hr />
            {this.showFollowers(followers)}
          </div>
          <div className="col-md-4">
            <h3 className="text-primary">Following</h3>
            <hr />
            {this.showFollowers(following)}
          </div>
          <div className="col-md-4">
            <h3 className="text-primary">Posts</h3>
            <hr />
            {this.showPosts(posts)}
          </div>
        </div>
      </div>
    );
  }
}
