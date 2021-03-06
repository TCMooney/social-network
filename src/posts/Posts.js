import React, { Component } from "react";
import { list } from "./index";
import { Link } from "react-router-dom";
import DefaultPostPhoto from "../images/DefaultPostPhoto.jpeg";

export default class Posts extends Component {
  constructor() {
    super();

    this.state = {
      posts: [],
      page: 1,
      loading: false,
    };
  }

  loadPosts = (page) => {
    list(page).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data, loading: false });
      }
    });
  };

  loadMore = (number) => {
    this.setState({ page: this.state.page + number });
    this.loadPosts(this.state.page + number);
  };

  loadLess = (number) => {
    this.setState({ page: this.state.page - number });
    this.loadPosts(this.state.page - number);
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.loadPosts(this.state.page);
  }

  renderPosts = (posts) => {
    return (
      <div className="row">
        {posts.map((post, i) => {
          const posterId = post.postedBy ? post.postedBy._id : "";
          const posterName = post.postedBy ? post.postedBy.name : "Unknown";
          return (
            <div className="card col-md-4" key={post._id}>
              <div className="card-body">
                <img
                  src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                  onError={(i) => (i.target.src = `${DefaultPostPhoto}`)}
                  alt=""
                  className="img-thumbnail mb-3"
                  style={{ height: "200px", width: "100%" }}
                />
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.body.substring(0, 100)}</p>
                <br />
                <p className="font-italic mark">
                  Posted by{" "}
                  <Link to={`/profile/${posterId}`}>{posterName} </Link>
                  on {new Date(post.created).toDateString()}
                </p>
                <Link
                  to={`/post/${post._id}`}
                  className="btn btn-raised  btn-sm btn-primary"
                >
                  Read More
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { posts, loading, page } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">{loading ? "Loading" : "Recent Posts"}</h2>
        {this.renderPosts(posts)}
        {page > 1 ? (
          <button
            className="btn btn-raised btn-warning ms-5 mt-5 mb-5"
            onClick={() => this.loadLess(1)}
          >
            Previous ({this.state.page - 1})
          </button>
        ) : (
          ""
        )}
        {posts.length ? (
          <button
            className="btn btn-raised btn-success mt-5 mb-5"
            onClick={() => this.loadMore(1)}
          >
            Next ({page + 1})
          </button>
        ) : (
          ""
        )}
      </div>
    );
  }
}
