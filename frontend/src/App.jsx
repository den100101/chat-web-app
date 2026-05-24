import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navigation from "./components/nav";
import Hero from "./components/hero";
import AdminPanel from "./admin";

function App() {
  const [isLoggedin, setisLoggedin] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.API_URL}/check_session`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setisLoggedin(data.loggedIn);
        setUsername(data.username || "");
        setRole(data.role || "");
      })
      .catch(() => {
        setisLoggedin(false);
        setUsername("");
        setRole("");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="loading">
        <div className="loading-container">
          <div>
            <img src="/Images/logo.png" alt="" className="loading-logo" />
          </div>
          <div className="loading-text">
            Loading
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </div>
        </div>
      </div>
    );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navigation
                isLoggedin={isLoggedin}
                setisLoggedin={setisLoggedin}
              />
              <Hero isLoggedin={isLoggedin} username={username} />
            </>
          }
        />

        <Route
          path="/admin"
          element={
            isLoggedin && role === "admin" ? (
              <AdminPanel />
            ) : (
              <div>Not allowed</div>
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
