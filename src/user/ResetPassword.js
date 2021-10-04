import React, { Component } from "react";
import { resetPassword } from "../auth";

export default class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: "",
      message: "",
      error: "",
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ message: "", error: "" });

    resetPassword({
      newPassword: this.state.newPassword,
      resetPasswordLink: this.props.match.params.resetPasswordToken,
    }).then((data) => {
      if (data.error) {
        console.log(data.error);
        this.setState({ error: data.error });
      } else {
        console.log(data.message);
        this.setState({ message: data.message, newPassword: "" });
      }
    });
  };
  render() {
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Reset your Password</h2>
        {this.state.message && (
          <h4 className="bg-success">{this.state.message}</h4>
        )}
        {this.state.error && <h4 className="bg-warning">{this.state.error}</h4>}

        <form>
          <div className="form-group mt-5">
            <input
              type="password"
              className="form-control"
              placeholder="Your new password"
              value={this.state.newPassword}
              name="password"
              onChange={(event) =>
                this.setState({
                  newPassword: event.target.value,
                  message: "",
                  error: "",
                })
              }
              autoFocus
            />
            <button
              onClick={this.handleSubmit}
              className="btn btn-raised btn-primary"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    );
  }
}
