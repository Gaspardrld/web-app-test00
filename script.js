document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
    const clearAllBtn = document.getElementById("clear-all");

    function loadTasks() {
        taskList.innerHTML = "";
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => addTask(task.text, task.completed));
    }

    function saveTasks() {
        const tasks = Array.from(document.querySelectorAll("li")).map(li => ({
            text: li.querySelector("span").innerText,
            completed: li.classList.contains("completed")
        }));
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function addTask(text, completed = false) {
        if (text.trim() === "") return;

        const li = document.createElement("li");
        const span = document.createElement("span");
        span.innerText = text;

        if (completed) {
            li.classList.add("completed");
        }

        li.appendChild(span);

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "❌";
        deleteBtn.onclick = () => {
            li.remove();
            saveTasks();
        };

        li.onclick = () => {
            li.classList.toggle("completed");
            saveTasks();
        };

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
        saveTasks();
    }

    addTaskBtn.addEventListener("click", () => {
        addTask(taskInput.value);
        taskInput.value = "";
    });

    clearAllBtn.addEventListener("click", () => {
        localStorage.removeItem("tasks");
        taskList.innerHTML = "";
    });

    loadTasks();
});
