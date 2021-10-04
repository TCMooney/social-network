import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { signin, authenticate } from "../auth";
import SocialLogin from "../user/SocialLogin";

export default class Signin extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      error: "",
      redirectToReferer: false,
      loading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({
      loading: true,
    });
    const { email, password } = this.state;
    const user = {
      email,
      password,
    };
    signin(user).then((data) => {
      if (data.error) {
        this.setState({
          error: data.error,
          loading: false,
        });
      } else {
        //authenticate
        authenticate(data, () => {
          this.setState({
            redirectToReferer: true,
          });
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

  signinForm = (email, password) => {
    return (
      <form>
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
    const { email, password, error, redirectToReferer, loading } = this.state;

    if (redirectToReferer) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Signin</h2>
        <hr />
        <SocialLogin />
        <hr />
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
        {this.signinForm(email, password)}
        <p>
          <Link to="/forgot-password" className="text-danger">
            {" "}
            Forgot Password
          </Link>
        </p>
      </div>
    );
  }
}
