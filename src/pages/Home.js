import React from "react";
import Posts from "../posts/Posts";

export default function Home() {
  return (
    <div>
      <div className="container">
        <h2 className="mt-5 mb-5">Home</h2>
        <p>Welcome to React Frontend</p>
        <div className="container">
          <Posts />
        </div>
      </div>
    </div>
  );
}
