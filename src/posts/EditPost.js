import React, { Component } from "react";
import { singlePost, update } from "./index";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router";
import DefaultPostPhoto from "../images/DefaultPostPhoto.jpeg";

export default class EditPost extends Component {
  constructor() {
    super();

    this.state = {
      id: "",
      title: "",
      body: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false,
    };
  }

  init = (postId) => {
    singlePost(postId).then((data) => {
      if (data.error) {
        this.setState({ error: data.error, redirectToProfile: true });
      } else {
        this.setState({
          id: data._id,
          title: data.title,
          body: data.body,
          error: "",
        });
      }
    });
  };

  componentDidMount() {
    this.postData = new FormData();
    const postId = this.props.match.params.postId;
    this.init(postId);
  }

  handleChange = (name) => (event) => {
    this.setState({
      error: "",
    });
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.postData.set(name, value);
    this.setState({
      [name]: value,
      fileSize,
    });
  };

  isValid = () => {
    const { title, body, fileSize } = this.state;
    if (title.length === 0 || body.length === 0) {
      this.setState({ error: "All fields are required", loading: false });
      return false;
    }
    if (fileSize > 100000) {
      this.setState({
        error: "File size should be less than 100kb",
        loading: false,
      });
      return false;
    }
    return true;
  };

  editPostForm = (title, body) => {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted">Post Photo</label>
          <input
            onChange={this.handleChange("photo")}
            type="file"
            accept="image/*"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            onChange={this.handleChange("title")}
            type="text"
            className="form-control"
            value={title}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Body</label>
          <textarea
            onChange={this.handleChange("body")}
            type="text"
            className="form-control"
            value={body}
          />
        </div>
        <button
          className="btn btn-raised btn-primary"
          onClick={this.handleSubmit}
        >
          Update Post
        </button>
      </form>
    );
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    if (this.isValid()) {
      const postId = this.state.id;
      const token = isAuthenticated().token;
      update(postId, token, this.postData).then((data) => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          this.setState({
            loading: false,
            title: "",
            body: "",
            photo: "",
            redirectToProfile: true,
          });
        }
      });
    }
  };

  render() {
    const { id, title, body, redirectToProfile, error, loading } = this.state;
    const userId = isAuthenticated().user._id;
    if (redirectToProfile) {
      return <Redirect to={`/profile/${userId}`} />;
    }

    const photoUrl = id
      ? `${
          process.env.REACT_APP_API_URL
        }/post/photo/${id}?${new Date().getTime()}`
      : DefaultPostPhoto;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Edit Profile</h2>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>
        {loading ? (
          <div className="bg-light text-center">
            <h2>Loading...</h2>
          </div>
        ) : null}
        <img
          src={photoUrl}
          alt={title}
          style={{ height: "200px", width: "auto" }}
          className="img-thumbnail"
          onError={(i) => (i.target.src = `${DefaultPostPhoto}`)}
        />
        <h2 className="mt-5 mb-5">{title}</h2>
        {this.editPostForm(title, body)}
      </div>
    );
  }
}
