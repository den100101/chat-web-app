import { useState, useEffect } from "react";

function UpdateTask({ task, closeModal, refreshTasks }) {
  const [tasks, setTasks] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");

  useEffect(() => {
    if (task) {
      setTasks(task.tasks || "");
      setDescription(task.description || "");
      setDueDate(task.due_date || "");
      setPriority(task.priority || "");
    }
  }, [task]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/update_tasks/${task.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tasks,
            description,
            due_date: dueDate,
            priority,
          }),
        },
      );

      if (!response.ok) {
        console.log("Update failed");
        return;
      }

      await refreshTasks?.();
      closeModal();
    } catch (error) {
      console.log("Update error:", error);
    }
  }

  return (
    <div className="task-modal-background">
      <div className="task-modal-container">
        <div className="task-modal-header">
          <div className="task-header">
            <h1>Update Task</h1>

            <h1 onClick={closeModal} style={{ cursor: "pointer" }}>
              X
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-containers">
              <div className="input-label">
                <label className="label">Task</label>
                <input
                  type="text"
                  className="inputs"
                  value={tasks}
                  onChange={(e) => setTasks(e.target.value)}
                  required
                />
              </div>

              <div className="input-label">
                <label className="label">Description</label>
                <input
                  type="text"
                  className="inputs"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="input-label">
                <label className="label">Due Date</label>
                <input
                  type="date"
                  className="inputs"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>

              <div className="input-label">
                <label className="label">Priority</label>
                <select
                  className="inputs"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <button className="task-modal-button" type="submit">
              Update Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateTask;
