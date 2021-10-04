import React, { Component } from "react";
import { follow, unfollow } from "./index";

export default class FollowProfileButton extends Component {
  followClick = () => {
    this.props.onButtonClick(follow);
  };

  unfollowClick = () => {
    this.props.onButtonClick(unfollow);
  };

  render() {
    return (
      <div className="d-inline-block">
        {!this.props.isFollowing ? (
          <button
            onClick={this.followClick}
            className="btn btn-success btn-raised me-5"
          >
            Follow
          </button>
        ) : (
          <button
            onClick={this.unfollowClick}
            className="btn btn-warning btn-raised"
          >
            Unfollow
          </button>
        )}
      </div>
    );
  }
}
