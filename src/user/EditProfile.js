import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { read, update, updateUser } from "../user";
import DefaultProfile from "../images/DefaultImage.jpg";

export default class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      name: "",
      email: "",
      password: "",
      about: "",
      redirectToProfile: false,
      error: "",
      loading: false,
      fileSize: 0,
    };
  }

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({
          error: data.error,
        });
      } else {
        this.setState({
          id: data._id,
          name: data.name,
          email: data.email,
          about: data.about,
        });
      }
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });
    if (this.isValid()) {
      const userId = this.props.match.params.userId;
      const token = isAuthenticated().token;
      update(userId, token, this.userData).then((data) => {
        if (data.error) {
          this.setState({
            error: data.error,
          });
        } else {
          updateUser(data, () => {
            this.setState({
              redirectToProfile: true,
            });
          });
        }
      });
    }
  };

  handleChange = (name) => (event) => {
    this.setState({
      error: "",
    });
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.userData.set(name, value);
    this.setState({
      [name]: value,
      fileSize,
    });
  };

  componentDidMount() {
    this.userData = new FormData();
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  isValid = () => {
    const { name, email, password, fileSize } = this.state;
    if (name.length === 0) {
      this.setState({ error: "Name is required", loading: false });
      return false;
    }
    if (!/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      this.setState({ error: "A valid email is required", loading: false });
      return false;
    }
    if (password.length >= 1 && password.length <= 5) {
      this.setState({
        error: "Password must be at least 6 characters long",
        loading: false,
      });
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

  signupForm = (name, email, password, about) => {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted">Profile Photo</label>
          <input
            onChange={this.handleChange("photo")}
            type="file"
            accept="image/*"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            onChange={this.handleChange("name")}
            type="text"
            className="form-control"
            value={name}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Email</label>
          <input
            onChange={this.handleChange("email")}
            type="email"
            className="form-control"
            value={email}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Password</label>
          <input
            onChange={this.handleChange("password")}
            type="password"
            className="form-control"
            value={password}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">About</label>
          <textarea
            onChange={this.handleChange("about")}
            type="text"
            className="form-control"
            value={about}
          />
        </div>
        <button
          className="btn btn-raised btn-primary"
          onClick={this.handleSubmit}
        >
          Update
        </button>
      </form>
    );
  };

  render() {
    const {
      name,
      email,
      password,
      about,
      redirectToProfile,
      id,
      error,
      loading,
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/profile/${id}`} />;
    }

    const photoUrl = id
      ? `${
          process.env.REACT_APP_API_URL
        }/user/photo/${id}?${new Date().getTime()}`
      : DefaultProfile;

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
          alt={name}
          style={{ height: "200px", width: "auto" }}
          className="img-thumbnail"
          onError={(i) => (i.target.src = `${DefaultProfile}`)}
        />
        {this.signupForm(name, email, password, about)}
      </div>
    );
  }
}
