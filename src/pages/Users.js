import React, { Component } from "react";
import { list } from "../user";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/DefaultImage.jpg";

export default class Users extends Component {
  constructor() {
    super();

    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    list().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    });
  }

  renderUsers = (users) => (
    <div className="row">
      {users.map((user) => (
        <div className="card col-md-4" key={user._id}>
          <img
            src={`${process.env.REACT_APP_API_URL}/user/photo/${
              user._id
            }?${new Date().getTime()}`}
            alt={user.name}
            style={{ height: "150px", width: "150px" }}
            className="img-thumbnail"
            onError={(i) => (i.target.src = `${DefaultProfile}`)}
          />

          <div className="card-body">
            <h5 className="card-title">{user.name}</h5>
            <p className="card-text">{user.email}</p>
            <Link
              to={`/profile/${user._id}`}
              className="btn btn-raised  btn-sm btn-primary"
            >
              View Profile
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  render() {
    const { users } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Users</h2>
        {this.renderUsers(users)}
      </div>
    );
  }
}
