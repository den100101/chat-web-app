import { useState } from "react";

function NewTask({ closeModal, refreshTasks }) {
  const [Task, setTask] = useState("");
  const [Description, setDescription] = useState("");
  const [Due, setDue] = useState("");
  const [Priority, setPriority] = useState("");
  const [Message, setMessage] = useState("");

  async function Submit(e) {
    e.preventDefault();

    if (!Task || !Description || !Due || !Priority) {
      setMessage("Please fill out all fields!");
      return;
    }

    const payload = {
      tasks: Task,
      description: Description,
      due_date: Due,
      priority: Priority,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/add_tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.message);
        return;
      }

      setMessage(result.message);

      await refreshTasks();

      setTask("");
      setDescription("");
      setDue("");
      setPriority("");

      closeModal();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(error.message || "Network error");
    }
  }

  return (
    <div className="task-modal-background">
      <div className="task-modal-container">
        <div className="task-modal-header">
          <div className="task-header">
            <h1>New Task</h1>
            <h1 onClick={closeModal}>X</h1>
          </div>

          <form onSubmit={Submit}>
            <div className="input-containers">
              <div className="input-label">
                <label className="label">Task</label>
                <input
                  type="text"
                  className="inputs"
                  value={Task}
                  onChange={(e) => setTask(e.target.value)}
                  required
                />
              </div>

              <div className="input-label">
                <label className="label">Description</label>
                <input
                  type="text"
                  className="inputs"
                  value={Description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="input-label">
                <label className="label">Due Date</label>
                <input
                  type="date"
                  className="inputs"
                  value={Due}
                  onChange={(e) => setDue(e.target.value)}
                  required
                />
              </div>

              <div className="input-label">
                <label className="label">Priority</label>
                <select
                  className="inputs"
                  value={Priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <p className="Message">{Message}</p>
            </div>

            <div>
              <button className="task-modal-button" type="submit">
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewTask;
