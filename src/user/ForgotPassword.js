import React, { Component } from "react";
import { forgotPassword } from "../auth";

export default class ForgotPassword extends Component {
  state = {
    email: "",
    message: "",
    error: "",
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ message: "", err: "" });
    forgotPassword(this.state.email).then((data) => {
      if (data.error) {
        console.log(data.error);
        this.setState({ message: data.message });
      }
    });
  };

  render() {
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Ask for Password Reset</h2>
        {this.state.message && (
          <h4 className="bg-success">{this.state.message}</h4>
        )}
        {this.state.error && <h4 className="bg-warning">{this.state.error}</h4>}
        <form>
          <div className="form-group mt-5">
            <input
              className="form-control mb-5"
              type="email"
              placeholder="Your email address"
              value={this.state.email}
              name="email"
              onChange={(event) =>
                this.setState({
                  email: event.target.value,
                  message: "",
                  error: "",
                })
              }
              autoFocus
            />
          </div>
          <button
            onClick={this.handleSubmit}
            className="btn btn-raised btn-primary"
          >
            Send Password Reset Link
          </button>
        </form>
      </div>
    );
  }
}
