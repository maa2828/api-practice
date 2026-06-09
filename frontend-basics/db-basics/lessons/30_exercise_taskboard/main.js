const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const totalCount = document.querySelector("#totalCount");
const openCount = document.querySelector("#openCount");
const taskError = document.querySelector("#taskError");
const clearAllBtn = document.querySelector("#clearAllBtn");
const filterButtons = document.querySelectorAll(".chip");

let tasks = [];
let currentFilter = "all"; // all | open | done

function createTask(title) {
  return { id: crypto.randomUUID(), title, done: false, createdAt: Date.now() };
}

function validateTitle(title) {
  const t = title.trim();
  return t.length >= 1 && t.length <= 30;
}

function setErrorVisible(visible) {
  if (visible) taskError.classList.remove("hidden");
  else taskError.classList.add("hidden");
}

function getFilteredTasks() {
  if (currentFilter === "open") return tasks.filter((t) => t.done === false);
  if (currentFilter === "done") return tasks.filter((t) => t.done === true);
  return tasks;
}

function render() {
  totalCount.textContent = String(tasks.length);
  openCount.textContent = String(tasks.filter((t) => t.done === false).length);

  taskList.innerHTML = "";
  const list = getFilteredTasks().slice().sort((a, b) => {
  if (a.done === b.done) return 0;
  return a.done ? 1 : -1;
});

  for (const task of list) {
    const li = document.createElement("li");
    li.className = "item" + (task.done ? " is-done" : "");

    const left = document.createElement("div");
    left.className = "item-left";

    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = task.done ? "完了" : "未完了";

    const title = document.createElement("span");
    title.className = "item-title";
    title.textContent = task.title;

    title.addEventListener("click", () => {
      tasks = tasks.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t));
      render();
    });

    left.appendChild(badge);
    left.appendChild(title);

const deleteBtn = document.createElement("button");
deleteBtn.type = "button";
deleteBtn.className = "button danger";
deleteBtn.textContent = "削除";

deleteBtn.addEventListener("click", () => {
  if (confirm("削除しますか？")) {
    tasks = tasks.filter((t) => t.id !== task.id);
    render();
  }
});

    li.appendChild(left);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  }
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateTitle(taskInput.value)) {
    setErrorVisible(true);
    return;
  }
  setErrorVisible(false);
  tasks = [createTask(taskInput.value.trim()), ...tasks];
  taskInput.value = "";
  render();
});

clearAllBtn.addEventListener("click", () => {
  tasks = [];
  render();
});

for (const btn of filterButtons) {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    for (const b of filterButtons) b.classList.remove("is-active");
    btn.classList.add("is-active");
    render();
  });
}

render();
