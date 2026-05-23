import { useEffect, useState } from "react";
import "./admin.css";

function Users() {
  const now = new Date();
  const [users, setUsers] = useState([]);

  async function fetchUsers() {
    try {
      const response = await fetch("http://fabioss.onrender.com/get_users");
      const data = await response.json();

      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function deleteUser(id) {
    try {
      const response = await fetch(`http://fabioss.onrender.com/delete_users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      console.log(data);

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  }

  const filteredUsers = users.filter(
    (user) => user.roles?.toLowerCase() !== "admin",
  );

  return (
    <>
      <div className="main-header">
        <div className="header-accesories">Admin Panel</div>
        <div className="date">{now.toDateString()}</div>
      </div>

      <div className="users-background">
        <h1 className="user-header">Users List</h1>
        <h3 className="total-users">Total Users: {filteredUsers.length}</h3>

        <div className="task-container-users">
          <table className="users-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Username</th>
                <th>Roles</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users
                .filter((user) => user.roles?.toLowerCase() !== "admin")
                .map((user) => (
                  <tr key={user.id}>
                    <td className="users-table-data">{user.email}</td>

                    <td className="users-table-data">{user.username}</td>

                    <td className="users-table-data">{user.roles}</td>

                    <td>
                      <button
                        className="users-todo-buttons"
                        onClick={() => deleteUser(user.id)}
                      >
                        <img
                          src="/Images/delete.png"
                          alt="Delete"
                          className="users-todo-logo"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Users;
