document.addEventListener("DOMContentLoaded", () => {
  // Sélection des éléments
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const voiceBtn = document.getElementById("voice-btn");
  const taskList = document.getElementById("task-list");
  const clearAllBtn = document.getElementById("clear-all");
  const filters = document.querySelectorAll(".filter-btn");
  const dateElement = document.getElementById("date");
  const progressBar = document.querySelector(".progress-bar");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentFilter = "all";

  // Affichage de la date
  function updateDate() {
    const options = { weekday: "long", day: "numeric", month: "long" };
    dateElement.innerText = new Date().toLocaleDateString("fr-FR", options);
  }

  // Mise à jour de la barre de progression
  function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    progressBar.style.width = percent + "%";
  }

  // Sauvegarde des tâches
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateProgress();
  }

  // Rendu des tâches selon le filtre
  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      if ((currentFilter === "active" && task.completed) || (currentFilter === "completed" && !task.completed)) return;
      
      const li = document.createElement("li");
      li.className = "task-item" + (task.completed ? " completed" : "");
      li.innerHTML = `<span>${task.text}</span>`;
      
      // Bouton de basculement état
      const toggleBtn = document.createElement("button");
      toggleBtn.innerHTML = "✅";
      toggleBtn.onclick = (e) => {
        e.stopPropagation();
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
      };

      // Bouton de suppression
      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "❌";
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
      };

      li.appendChild(toggleBtn);
      li.appendChild(deleteBtn);
      li.onclick = () => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
      };

      taskList.appendChild(li);
    });
  }

  // Ajout d'une tâche
  function addTask() {
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({ text, completed: false });
      taskInput.value = "";
      saveTasks();
      renderTasks();
    }
  }

  // Suppression de toutes les tâches
  function clearAllTasks() {
    tasks = [];
    saveTasks();
    renderTasks();
  }

    // Attendre que l'écran d'ouverture disparaisse avant de charger le contenu principal
  window.onload = function () {
    setTimeout(function () {
      // Cacher l'écran d'ouverture
      document.getElementById("splash-screen").style.display = "none";
      // Afficher le contenu principal
      document.getElementById("main-content").style.display = "block";
    }, 3000); // Temps en millisecondes avant de changer d'écran (3 secondes)
  };

  // Reconnaissance vocale
  function startSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window)) {
      alert("La reconnaissance vocale n'est pas supportée par votre navigateur.");
      return;
    }
    const recognition = new webkitSpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();
    recognition.onresult = (event) => {
      taskInput.value = event.results[0][0].transcript;
    };
    recognition.onerror = (event) => {
      console.error("Erreur de reconnaissance vocale :", event.error);
    };
  }

  // Gestion des filtres
  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      filters.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  // Événements
  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });
  clearAllBtn.addEventListener("click", clearAllTasks);
  voiceBtn.addEventListener("click", startSpeechRecognition);

  // Initialisation
  updateDate();
  renderTasks();
  updateProgress();
});
