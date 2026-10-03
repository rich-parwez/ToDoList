const inputBar = document.querySelector(".taskbar input");
const addForm = document.querySelector(".taskbar");
const taskContainer = document.querySelector(".tasks");
const clearBtn = document.querySelector(".clear");
const taskSummary = document.querySelector("#task-summary");
const progressLabel = document.querySelector("#progress-label");
const progressBar = document.querySelector(".progress-track");
const progressFill = document.querySelector(".progress-fill");
const today = document.querySelector("#today");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

today.textContent = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric"
}).format(new Date());

addForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTask();
});

clearBtn.addEventListener("click", clearTasks);

function addTask() {
  const title = inputBar.value.trim();

  if (title === "") return;

  tasks.push({
    id: Date.now(),
    title,
    completed: false
  });

  saveTasks();
  renderTasks();
  inputBar.value = "";
  inputBar.focus();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      task.completed = !task.completed;
    }

    return task;
  });

  saveTasks();
  renderTasks();
}

function clearTasks() {
  tasks = [];
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskContainer.replaceChildren();

  const completedCount = tasks.filter((task) => task.completed).length;
  const taskCount = tasks.length;
  const completion = taskCount === 0 ? 0 : Math.round((completedCount / taskCount) * 100);
  const taskWord = taskCount === 1 ? "task" : "tasks";

  taskSummary.textContent = `${taskCount} ${taskWord}`;
  progressLabel.textContent = taskCount === 0
    ? "Ready when you are"
    : completedCount === taskCount
      ? "Everything is done — nice work!"
      : `${completedCount} of ${taskCount} completed`;
  progressBar.setAttribute("aria-valuenow", String(completion));
  progressFill.style.width = `${completion}%`;
  clearBtn.disabled = taskCount === 0;

  if (taskCount === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";

    const icon = document.createElement("i");
    icon.className = "bi bi-check2-circle";
    icon.setAttribute("aria-hidden", "true");

    const title = document.createElement("strong");
    title.textContent = "Your list is clear";

    const message = document.createElement("span");
    message.textContent = "Add a task to get your day moving.";

    emptyState.append(icon, title, message);
    taskContainer.appendChild(emptyState);
    return;
  }

  tasks.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.className = "task";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.title} as ${task.completed ? "not completed" : "completed"}`);
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const title = document.createElement("span");
    title.textContent = task.title;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-task";
    deleteButton.setAttribute("aria-label", `Delete ${task.title}`);
    deleteButton.innerHTML = '<i class="bi bi-trash3" aria-hidden="true"></i>';
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    taskElement.append(checkbox, title, deleteButton);
    taskContainer.appendChild(taskElement);
  });
}

renderTasks();
