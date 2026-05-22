import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Task from "./task";
import Users from "./users";
import "./admin.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch("http://localhost:5000/get_tasks");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchTasks();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:5000/get_users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchUsers();
  }, []);

  // ✅ ADDED: unread fetch
  useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await fetch("http://localhost:5000/unread_counts", {
          credentials: "include",
        });

        const data = await res.json();

        const mapped = {};
        data.forEach((item) => {
          mapped[item.sender_id] = item.unread;
        });

        setUnreadCounts(mapped);
      } catch (err) {
        console.log(err);
      }
    }

    fetchUnread();
  }, []);

  useEffect(() => {
    if (!tasks.length) return;

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthly = months.map((m) => ({
      month: m,
      orders: 0,
    }));

    tasks.forEach((task) => {
      if (!task.due_date) return;

      const date = new Date(task.due_date);
      const monthIndex = date.getMonth();

      monthly[monthIndex].orders += 1;
    });

    setChartData(monthly);
  }, [tasks]);

  const filteredUsers = users.filter(
    (user) => user.roles?.toLowerCase() !== "admin",
  );

  const completedTasks = tasks.filter((t) => t.status === "completed");

  const pendingTasks = tasks.filter(
    (t) => (t.status || "").toLowerCase().trim() !== "completed",
  );

  const totalOrders = tasks.length;
  const totalPendingTask = pendingTasks.length;
  const totalUsers = filteredUsers.length;

  // ✅ ADDED: total unread
  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  return (
    <>
      <div className="main-header">
        <div className="header-accesories">Admin Panel</div>
      </div>

      <div className="header-note">
        <div className="welcome-note">
          <h1 className="title">Dashboard</h1>
          <p className="pharagraph">
            Welcome back, Admin! Here's what's happening with your bussiness
            today.
          </p>
        </div>

        <div className="cards-container">
          {/* ✅ UPDATED: Messages card */}
          <div className="logo-cards">
            <img src="/Images/messages.png" alt="" className="logo" />
            <div>
              <h1 className="title">New Messages</h1>
              <p className="pharagraph">{totalUnread}</p>
            </div>
          </div>

          <div className="logo-cards">
            <img src="/Images/users.png" alt="" className="logo" />
            <div>
              <h1 className="title">Total Users</h1>
              <p className="pharagraph">{totalUsers}</p>
            </div>
          </div>

          <div className="logo-cards">
            <img src="/Images/pending.png" alt="" className="logo" />
            <div>
              <h1 className="title">Pending Orders</h1>
              <p className="pharagraph">{totalPendingTask}</p>
            </div>
          </div>

          <div className="logo-cards">
            <img src="/Images/orders.png" alt="" className="logo" />
            <div>
              <h1 className="title">Total Orders</h1>
              <p className="pharagraph">{totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="chart">
          <div>
            <h2 className="chart-title">Monthly Orders (2026)</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#6b4a3a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="todo">
          <div className="todo-header">
            <h1>Completed Orders</h1>
          </div>

          <div className="completed-list">
            {completedTasks.length === 0 ? (
              <p className="list-indicator">No completed tasks yet</p>
            ) : (
              completedTasks.map((t) => (
                <div key={t.id} className="completed-item">
                  <h3>{t.tasks}</h3>
                  <p>{t.description}</p>
                  <small>{t.due_date}</small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
