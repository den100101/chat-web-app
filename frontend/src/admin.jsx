import socket from "./socket";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./dashboard";
import Messages from "./Messages";
import Task from "./task";
import Users from "./users";
import "./admin.css";

function AdminPanel() {
  const [Component, setComponent] = useState();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://fabioss.onrender.com/logout", {
        method: "POST",
        credentials: "include",
      });

      socket.disconnect();

      navigate("/");
      window.location.reload();
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  const renderComponent = () => {
    switch (Component) {
      case "Dashboard":
        return <Dashboard />;
      case "Messages":
        return <Messages />;
      case "Task":
        return <Task />;
      case "Users":
        return <Users />;
      default:
        return <Dashboard />;
    }
  };
  return (
    <>
      <div className="admin-panel-container">
        <div className="navigation-container">
          <div className="nav-header">
            <h1>Admin Panel</h1>
          </div>
          <div className="navs">
            <span onClick={() => setComponent("Dashboard")}>Dashboard</span>
            <span onClick={() => setComponent("Messages")}>Messages</span>
            <span onClick={() => setComponent("Users")}>User</span>
            <span onClick={() => setComponent("Task")}>Task</span>
          </div>
          <div className="logout">
            <span onClick={handleLogout}>Logout</span>
          </div>
        </div>

        <div className="main-content">{renderComponent()}</div>
      </div>
    </>
  );
}

export default AdminPanel;
