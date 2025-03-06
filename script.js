document.addEventListener("DOMContentLoaded", () => {
  // Sélection des éléments
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const voiceBtn = document.getElementById("voice-btn");
  const taskList = document.getElementById("task-list");
  const clearAllBtn = document.getElementById("clear-all");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const tabBtns = document.querySelectorAll(".tab-btn");
  const dateElement = document.getElementById("date");
  const progressBar = document.querySelector(".progress-bar");
  const todoSection = document.getElementById("todo-section");
  const profileSection = document.getElementById("profile-section");
  const settingsSection = document.getElementById("settings-section");
  const themeToggle = document.getElementById("theme-toggle");
  const notifToggle = document.getElementById("notif-toggle");
  const resetDataBtn = document.getElementById("reset-data-btn");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentFilter = "all";

  // Demande de permission pour les notifications
  function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then(permission => {
        console.log("Permission notifications :", permission);
      });
    }
  }

  // Envoi d'une notification locale
  function sendNotification(taskText) {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Nouvelle tâche ajoutée", {
        body: taskText,
        icon: "icons/icon-512.png"
      });
    }
  }

  // Mise à jour de la date
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

  // Rendu des tâches (pour la section To-Do)
  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      if ((currentFilter === "active" && task.completed) ||
          (currentFilter === "completed" && !task.completed)) return;
      
      const li = document.createElement("li");
      li.className = "task-item" + (task.completed ? " completed" : "");
      li.innerHTML = `<span>${task.text}</span>`;
      
      // Bouton de basculement d'état
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

  // Rendu de la section Profil
  function renderProfile() {
    profileSection.innerHTML = `
      <h2>Mon Profil</h2>
      <p>Nom : Utilisateur</p>
      <p>Email : utilisateur@example.com</p>
      <button id="edit-profile-btn">Modifier le profil</button>
    `;
  }

  // Gestion du mode (Nuit/Jour)
  function toggleTheme() {
    if (document.body.classList.contains("dark-mode")) {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    }
  }

  // Appliquer le thème sauvegardé
  function applyTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      if (themeToggle) themeToggle.checked = true;
    } else {
      document.body.classList.remove("dark-mode");
      if (themeToggle) themeToggle.checked = false;
    }
  }

  // Réinitialiser les données
  function resetData() {
    if (confirm("Voulez-vous vraiment réinitialiser toutes les données ?")) {
      localStorage.clear();
      location.reload();
    }
  }

  // Ajout d'une tâche
  function addTask() {
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({ text, completed: false });
      taskInput.value = "";
      saveTasks();
      renderTasks();
      if (notifToggle.checked) sendNotification(text);
    }
  }

  // Suppression de toutes les tâches
  function clearAllTasks() {
    tasks = [];
    saveTasks();
    renderTasks();
  }

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

  // Gestion des filtres To-Do
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  // Gestion des onglets de navigation
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      // Masquer toutes les sections
      document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
      // Afficher la section correspondante
      if (tab === "todo") {
        document.getElementById("todo-section").classList.remove("hidden");
        renderTasks();
      } else if (tab === "profile") {
        document.getElementById("profile-section").classList.remove("hidden");
        renderProfile();
      } else if (tab === "settings") {
        document.getElementById("settings-section").classList.remove("hidden");
      }
    });
  });

  // Événements
  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });
  clearAllBtn.addEventListener("click", clearAllTasks);
  voiceBtn.addEventListener("click", startSpeechRecognition);
  if (themeToggle) themeToggle.addEventListener("change", toggleTheme);
  if (resetDataBtn) resetDataBtn.addEventListener("click", resetData);

  // Initialisation
  updateDate();
  renderTasks();
  updateProgress();
  requestNotificationPermission();
  applyTheme();

  // Afficher l'onglet To-Do par défaut
  document.getElementById("todo-section").classList.remove("hidden");

  // Retirer le splash screen et afficher le contenu principal après 5 secondes
  setTimeout(() => {
    const splash = document.getElementById("splash-screen");
    if (splash) splash.parentNode.removeChild(splash);
    const mainContent = document.getElementById("main-content");
    mainContent.classList.remove("hidden");
  }, 2000);
});
