document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("add-task-btn");
    const voiceBtn = document.getElementById("voice-btn");
    const taskList = document.getElementById("task-list");
    const clearAllBtn = document.getElementById("clear-all");
    const filters = document.querySelectorAll(".filter-btn");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function renderTasks(filter = "all") {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            if (filter === "active" && task.completed) return;
            if (filter === "completed" && !task.completed) return;

            const li = document.createElement("li");
            li.className = "task";
            if (task.completed) li.classList.add("completed");
            li.innerHTML = `
                <span>${task.text}</span>
                <button onclick="toggleTask(${index})">✅</button>
                <button onclick="deleteTask(${index})">❌</button>
            `;
            taskList.appendChild(li);
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text, completed: false });
            taskInput.value = "";
            renderTasks();
        }
    }

    function toggleTask(index) {
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
    }

    function deleteTask(index) {
        tasks.splice(index, 1);
        renderTasks();
    }

    function clearAll() {
        tasks = [];
        renderTasks();
    }

    function handleSpeech() {
        const recognition = new webkitSpeechRecognition();
        recognition.lang = "fr-FR";
        recognition.start();
        recognition.onresult = (event) => {
            taskInput.value = event.results[0][0].transcript;
        };
    }

    addTaskBtn.addEventListener("click", addTask);
    clearAllBtn.addEventListener("click", clearAll);
    voiceBtn.addEventListener("click", handleSpeech);
    filters.forEach(btn => btn.addEventListener("click", () => {
        filters.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderTasks(btn.dataset.filter);
    }));

    renderTasks();
});
