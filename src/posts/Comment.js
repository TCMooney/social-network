import React, { Component } from "react";
import { comment, uncomment } from "./index";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/DefaultImage.jpg";

export default class Comment extends Component {
  state = {
    text: "",
    error: "",
  };

  handleChange = (event) => {
    this.setState({ text: event.target.value, error: "" });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (!isAuthenticated()) {
      this.setState({ error: "Please sign in to leave a comment" });
      return false;
    }

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const postId = this.props.postId;
      const token = isAuthenticated().token;
      const newComment = { text: this.state.text };

      comment(userId, token, postId, newComment).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ text: "" });
          this.props.updateComments(data.comments);
        }
      });
    }
  };

  commentsGrammar = (comments) => {
    let grammar = "";
    if (comments === 0 || comments > 1) {
      grammar = "comments";
    } else if (comments === 1) {
      grammar = "comment";
    }
    return grammar;
  };

  isValid = () => {
    const { text } = this.state;
    if (!text.length > 0 || text.length > 150) {
      this.setState({
        error: "Commnent should not be empty and less than 150 characters long",
      });
      return false;
    }
    return true;
  };

  deleteComment = (comment) => {
    const userId = isAuthenticated().user._id;
    const postId = this.props.postId;
    const token = isAuthenticated().token;

    uncomment(userId, token, postId, comment).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.props.updateComments(data.comments);
      }
    });
  };

  deleteConfirmed = (comment) => {
    let answer = window.confirm(
      "Are you sure you want to delete your comment?"
    );
    if (answer) {
      this.deleteComment(comment);
    }
  };

  renderComments = (comments) => {
    if (comments) {
      return comments.map((comment) => {
        return (
          <div key={comment._id}>
            <div>
              <Link to={`/user/$comment.postedBy._id`}>
                <img
                  style={{ borderRadius: "50%", border: "1px solid black" }}
                  className="float-left me-2"
                  height="30px"
                  width="30px"
                  onError={(i) => (i.target.src = `${DefaultProfile}`)}
                  src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                  alt={comment.postedBy.name}
                />
              </Link>
              <div>
                <p className="lead">{comment.text}</p>
                <br />
              </div>
              <div>
                <p className="fst-italic mark">
                  Posted by{" "}
                  <Link to={`/user/${comment.postedBy.name}`}>
                    {comment.postedBy.name}
                  </Link>{" "}
                  on {new Date(comment.created).toDateString()}
                  <span>
                    {isAuthenticated().user &&
                      isAuthenticated().user._id === comment.postedBy._id && (
                        <>
                          {/* <Link
                            to={`/post/edit/${post._id}`}
                            className="btn btn-raised  btn-sm btn-warning me-5"
                          >
                            Update Post
                          </Link> */}
                          <span
                            onClick={() => this.deleteConfirmed(comment)}
                            className="text-danger float-end me-1"
                          >
                            Remove
                          </span>
                        </>
                      )}
                  </span>
                </p>
              </div>
            </div>
          </div>
        );
      });
    }
  };
  render() {
    const { comments } = this.props;
    const { error } = this.state;
    return (
      <div>
        <h2 className="mt-5 mb-5">Leave a comment</h2>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              onChange={this.handleChange}
              className="form-control"
              value={this.state.text}
              placeholder="Leave a comment"
            />
          </div>
          <button
            className="btn btn-raised btn-success mt-2"
            onClick={this.handleSubmit}
          >
            Submit
          </button>
        </form>

        <div
          className="alert alert-danger mt-2"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        <hr />
        <div className="col-md-4">
          <h3 className="text-primary">
            {comments.length} {this.commentsGrammar(comments.length)}
          </h3>
        </div>
        {this.renderComments(comments.reverse())}
      </div>
    );
  }
}
