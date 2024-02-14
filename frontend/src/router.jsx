import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./views/Login";
import { SignUp } from "./views/SignUp";
import { Home } from "./views/Home";
import {
  NotAllowForConnectedPeople,
  NotAllowForDisconnectedPeople,
} from "./utils/middleware";
import { Profile } from "./views/Profile";

export const RouterManager = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/login"
          element={
            <NotAllowForConnectedPeople>
              <Login />
            </NotAllowForConnectedPeople>
          }
        ></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route
          path="/profile"
          element={
            <NotAllowForDisconnectedPeople>
              <Profile />
            </NotAllowForDisconnectedPeople>
          }
        ></Route>
      </Routes>
    </BrowserRouter>
  );
};
