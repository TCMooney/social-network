import React, { Component } from "react";
import { signup } from "../auth";
import { Link } from "react-router-dom";

export default class Signup extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
      open: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { name, email, password } = this.state;
    const user = {
      name,
      email,
      password,
    };
    signup(user).then((data) => {
      if (data.error) {
        this.setState({
          error: data.error,
        });
      } else {
        this.setState({
          error: "",
          name: "",
          email: "",
          password: "",
          open: true,
        });
      }
    });
  }

  handleChange(event) {
    this.setState({
      error: "",
      [event.target.name]: event.target.value,
    });
  }

  signupForm = (name, email, password) => {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted">Name</label>
          <input
            onChange={this.handleChange}
            type="text"
            name="name"
            className="form-control"
            value={name}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Email</label>
          <input
            onChange={this.handleChange}
            type="email"
            name="email"
            className="form-control"
            value={email}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Password</label>
          <input
            onChange={this.handleChange}
            type="password"
            name="password"
            className="form-control"
            value={password}
          />
        </div>
        <button
          className="btn btn-raised btn-primary"
          onClick={this.handleSubmit}
        >
          Submit
        </button>
      </form>
    );
  };

  render() {
    const { name, email, password, error, open } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Signup</h2>
        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>
        <div
          className="alert alert-info"
          style={{ display: open ? "" : "none" }}
        >
          New account is successfully created. Please{" "}
          <Link to="/signin">sign in</Link>.
        </div>
        {this.signupForm(name, email, password)}
      </div>
    );
  }
}
