import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Menu from "./Menu";
import Profile from "./pages/Profile";
import Users from "./pages/Users";
import EditProfile from "./user/EditProfile";
import PrivateRoute from "./auth/PrivateRoute";
import FindPeople from "./user/FindPeople";
import NewPost from "./posts/NewPost";
import SinglePost from "./posts/SinglePost";
import EditPost from "./posts/EditPost";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";
import Admin from "./admin/Admin";

export default function MainRouter() {
  return (
    <div>
      <Menu />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={Signin} />
        <Route
          exact
          path="/reset-password/:resetPasswordToken"
          component={ResetPassword}
        />
        <PrivateRoute path="/profile/:userId" component={Profile} />
        <Route path="/users" component={Users} />
        <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
        <PrivateRoute path="/findpeople" component={FindPeople} />
        <PrivateRoute path="/post/create" component={NewPost} />
        <Route exact path="/post/:postId" component={SinglePost} />
        <PrivateRoute exact path="/post/edit/:postId" component={EditPost} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <PrivateRoute path="/admin" component={Admin} />
      </Switch>
    </div>
  );
}
