import React from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuthenticated, signout } from "./auth";

const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { backgroundColor: "#8181f3" };
  }
};

function Menu({ history }) {
  return (
    <div>
      <ul className="nav nav-tabs bg-light">
        <li className="nav-item">
          <Link
            className="nav-link text-dark"
            style={isActive(history, "/")}
            to="/"
          >
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className="nav-link text-dark"
            style={isActive(history, "/users")}
            to="/users"
          >
            Users
          </Link>
        </li>
        {!isAuthenticated() && (
          <>
            <li className="nav-item">
              <Link
                className="nav-link text-dark"
                style={isActive(history, "/signin")}
                to="/signin"
              >
                Signin
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-dark"
                style={isActive(history, "/signup")}
                to="/signup"
              >
                Signup
              </Link>
            </li>
          </>
        )}
        {isAuthenticated() && (
          <>
            <li className="nav-item">
              <Link
                className="nav-link text-dark"
                to={`/profile/${isAuthenticated().user._id}`}
                style={isActive(
                  history,
                  `/profile/${isAuthenticated().user._id}`
                )}
              >
                {`${isAuthenticated().user.name}'s Profile`}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-dark"
                to={"/findpeople"}
                style={isActive(history, `/findpeople`)}
              >
                Find People
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link text-dark"
                to={"/post/create"}
                style={isActive(history, `/post/create`)}
              >
                New Post
              </Link>
            </li>
            <li className="nav-item">
              <button
                className="nav-link text-dark"
                onClick={() => signout(() => history.push("/"))}
              >
                Sign Out
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default withRouter(Menu);
