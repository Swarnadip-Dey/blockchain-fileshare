import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import OpenRoute from "./components/Auth/OpenRoute";
import PrivateRoute from "./components/Auth/PrivateRoute";
import StudentDashboard from "./components/StudentDashboard/StudentDashboard";
import GuestDashboard from "./components/GuestDashboard/GuestDashboard";
import TeacherDashboard from "./components/TeacherDashboard/TeacherDashboard";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import { useSelector } from "react-redux";

function App() {
  const { type } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <OpenRoute>
            <Login />
          </OpenRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <OpenRoute>
            <Signup />
          </OpenRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      >
        {type === "student" && (
          <Route path="my-dashboard" index element={<StudentDashboard />} />
        )}
        {type === "teacher" && (
          <Route path="my-dashboard" index element={<AdminDashboard />} />
        )}
        {type === "guest" && (
          <Route path="my-dashboard" index element={<GuestDashboard />} />
        )}
        {/* {type === "admin" && (
          <Route path="my-dashboard" index element={<AdminDashboard />} />
        )} */}
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
