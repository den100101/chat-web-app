import { useState, useEffect } from "react";
import NewTask from "./addtask";
import UpdateTask from "./updateModal";

function Task() {
  const [openModal, setOpenModal] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [view, setView] = useState("all"); // all | completed

  const now = new Date();

  async function fetchTasks() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/get_tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.log("Fetch error:", error);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTasks();
  }, []);

  async function handleDelete(id) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/delete_tasks/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        console.log(result.error || result.message);
        return;
      }

      fetchTasks();
    } catch (error) {
      console.log("Delete error:", error);
    }
  }

  async function handleComplete(id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/completed_tasks/${id}`,
        { method: "PATCH" },
      );

      const result = await response.json();

      if (!response.ok) {
        console.log(result.error || result.message);
        return;
      }

      fetchTasks();
    } catch (error) {
      console.log("Complete error:", error);
    }
  }

  const pendingTasks = tasks.filter(
    (t) => (t.status || "").toLowerCase().trim() !== "completed",
  );

  const completedTasks = tasks.filter(
    (t) => (t.status || "").toLowerCase().trim() === "completed",
  );

  const displayedTasks = view === "completed" ? completedTasks : pendingTasks;

  return (
    <>
      <div className="main-header">
        <div className="header-accesories">Admin Panel</div>
        <div className="date">{now.toDateString()}</div>
      </div>

      <div className="task">
        <div className="task-header">
          <h1>To Do List</h1>
        </div>

        {/* BUTTONS */}
        <div className="task-buttons">
          <button className="buttons" onClick={() => setOpenModal(true)}>
            Add Task
          </button>

          <div className="task-buttons-2">
            <button className="buttons" onClick={() => setView("all")}>
              All
            </button>
            <button className="buttons" onClick={() => setView("completed")}>
              Completed
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="task-container">
          <table className="table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Description</th>
                <th>Due</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {displayedTasks.length === 0 ? (
                <tr>
                  <td colSpan="5" className="table-data">
                    No tasks found
                  </td>
                </tr>
              ) : (
                displayedTasks.map((t) => (
                  <tr key={t.id}>
                    <td className="table-data">{t.tasks}</td>
                    <td className="table-data">{t.description}</td>
                    <td className="table-data">{t.due_date}</td>
                    <td className="table-data">{t.priority}</td>

                    <td>
                      <div className="todo-button-container">
                        {/* UPDATE */}
                        <button
                          className="todo-buttons"
                          onClick={() => {
                            setSelectedTask(t);
                            setOpenUpdate(true);
                          }}
                        >
                          <img
                            src="/Images/update.png"
                            alt="update"
                            title="Update"
                            className="todo-logo"
                          />
                        </button>

                        {/* DELETE */}
                        <button
                          className="todo-buttons"
                          onClick={() => handleDelete(t.id)}
                        >
                          <img
                            src="/Images/delete.png"
                            alt="delete"
                            title="Delete"
                            className="todo-logo"
                          />
                        </button>

                        {/* COMPLETE */}
                        <button
                          className="todo-buttons"
                          onClick={() => handleComplete(t.id)}
                        >
                          <img
                            src="/Images/completed.png"
                            alt="complete"
                            title="Completed"
                            className="todo-logo"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      {openModal && (
        <NewTask
          closeModal={() => setOpenModal(false)}
          refreshTasks={fetchTasks}
        />
      )}

      {openUpdate && (
        <UpdateTask
          task={selectedTask}
          closeModal={() => setOpenUpdate(false)}
          refreshTasks={fetchTasks}
        />
      )}
    </>
  );
}

export default Task;
