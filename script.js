// ======================
// ELEMENT
// ======================

const inputBar = document.querySelector(".taskbar input");
const addBtn = document.querySelector(".taskbar button");
const taskContainer = document.querySelector(".tasks");
const clearBtn = document.querySelector(".clear");

// ======================
// DATA
// ======================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ======================
// EVENT
// ======================

addBtn.addEventListener("click", addTask);

clearBtn.addEventListener("click", clearTasks);

inputBar.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

// ======================
// FUNCTION
// ======================

// Menambah task
function addTask() {

    const title = inputBar.value.trim();

    if (title === "") return;

    const task = {
        id: Date.now(),
        title: title,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    renderTasks();

    inputBar.value = "";
    inputBar.focus();
}

// Menghapus task
function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();
}

// Checklist task
function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;

    });

    saveTasks();

    renderTasks();
}

// Hapus semua task
function clearTasks() {

    tasks = [];

    saveTasks();

    renderTasks();
}

// Simpan ke LocalStorage
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

// ======================
// RENDER
// ======================

function renderTasks() {

    taskContainer.innerHTML = "";

    tasks.forEach(task => {

        const taskElement = document.createElement("div");

        taskElement.className = "task";

        taskElement.innerHTML = `
            <input type="checkbox" ${task.completed ? "checked" : ""}>
            <span>${task.title}</span>
            <i class="bi bi-trash3"></i>
        `;

        const checkbox = taskElement.querySelector("input");

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });

        const deleteBtn = taskElement.querySelector("i");

        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id);
        });

        taskContainer.appendChild(taskElement);

    });

}

// ======================
// INIT
// ======================

renderTasks();