import React, { Component } from "react";
import { singlePost, remove, like, unlike } from "./index";
import DefaultPostPhoto from "../images/DefaultPostPhoto.jpeg";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth/index";
import Comment from "./Comment";

export default class SinglePost extends Component {
  state = {
    post: "",
    loading: false,
    redirectToHome: false,
    like: false,
    likes: 0,
    redirectToSignin: false,
    hover: false,
    comments: [],
  };

  updateComments = (comments) => {
    this.setState({ comments });
  };

  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;
    remove(postId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectToHome: true });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm("Are you sure you want to delete your post?");
    if (answer) {
      this.deletePost();
    }
  };

  checkLike = (likes) => {
    const userId = isAuthenticated() && isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  };

  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    this.setState({ loading: true });
    singlePost(postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          post: data,
          loading: false,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
          comments: data.comments,
        });
      }
    });
  };

  toggleHover = () => {
    this.setState({
      hover: !this.state.hover,
    });
  };

  likeToggle = () => {
    if (!isAuthenticated()) {
      this.setState({
        redirectToSignin: true,
      });
      return false;
    }
    let callApi = this.state.like ? unlike : like;
    const userId = isAuthenticated().user._id;
    const postId = this.state.post._id;
    const token = isAuthenticated().token;
    callApi(userId, token, postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length,
        });
      }
    });
  };

  likesGrammar = (likes) => {
    let grammar = "";
    if (likes === 0 || likes > 1) {
      grammar = "likes";
    } else if (likes === 1) {
      grammar = "like";
    }
    return grammar;
  };

  renderPost = (post) => {
    const posterId = post.postedBy ? post.postedBy._id : "";
    const posterName = post.postedBy ? post.postedBy.name : "Unknown";
    const { likes, like } = this.state;
    return (
      <div className="card-body">
        <img
          src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
          onError={(i) => (i.target.src = `${DefaultPostPhoto}`)}
          alt=""
          className="img-thumbnail mb-3"
          style={{ height: "300px", width: "100%", objectFit: "cover" }}
        />
        {like ? (
          <h3
            onClick={this.likeToggle}
            onMouseEnter={this.toggleHover}
            onMouseLeave={this.toggleHover}
            style={
              this.state.hover ? { cursor: "pointer" } : { cursor: "default" }
            }
          >
            <i
              className="fa fa-thumbs-up text-success bg-dark"
              style={{ padding: "10px", borderRadius: "50%" }}
            />
            {likes} {this.likesGrammar(likes)}
          </h3>
        ) : (
          <h3
            onClick={this.likeToggle}
            onMouseEnter={this.toggleHover}
            onMouseLeave={this.toggleHover}
            style={
              this.state.hover ? { cursor: "pointer" } : { cursor: "default" }
            }
          >
            <i
              className="fa fa-thumbs-up text-danger bg-dark"
              style={{ padding: "10px", borderRadius: "50%" }}
            />
            {likes} {this.likesGrammar(likes)}
          </h3>
        )}
        <p className="card-text">{post.body}</p>
        <br />
        <p className="font-italic mark">
          Posted by <Link to={`/profile/${posterId}`}>{posterName} </Link>
          on {new Date(post.created).toDateString()}
        </p>
        <div className="d-inline-block">
          <Link to={`/`} className="btn btn-raised  btn-sm btn-primary me-5">
            Back to posts
          </Link>

          {isAuthenticated().user &&
            isAuthenticated().user._id === post.postedBy && (
              <>
                <Link
                  to={`/post/edit/${post._id}`}
                  className="btn btn-raised  btn-sm btn-warning me-5"
                >
                  Update Post
                </Link>
                <button
                  onClick={this.deleteConfirmed}
                  className="btn btn-raised  btn-sm btn-danger me-5"
                >
                  Delete Post
                </button>
              </>
            )}
        </div>
      </div>
    );
  };
  render() {
    const { post, loading, redirectToHome, redirectToSignin, comments } =
      this.state;

    if (redirectToHome) {
      return <Redirect to={`/`} />;
    }

    if (redirectToSignin) {
      return <Redirect to={"/signin"} />;
    }

    return (
      <div className="container">
        <h2 className="display-2 mt-5 mb-5">Single Post</h2>
        {loading ? (
          <div className="bg-light text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderPost(post)
        )}
        <Comment
          postId={post._id}
          comments={comments}
          updateComments={this.updateComments}
        />
      </div>
    );
  }
}
