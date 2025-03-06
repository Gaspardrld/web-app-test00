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
  const profileSection = document.getElementById("profile-section");
  const todoSection = document.getElementById("todo-section");

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

  // Rendu des tâches (uniquement si filtre est différent de "profile")
  function renderTasks() {
    if (currentFilter === "profile") return; // Ne pas afficher les tâches en mode profil
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

  // Affichage de la section profil
  function renderProfile() {
    // Exemple de contenu profil (à personnaliser)
    profileSection.innerHTML = `
      <h2>Mon Profil</h2>
      <p>Nom : Utilisateur</p>
      <p>Email : utilisateur@example.com</p>
      <button id="edit-profile-btn">Modifier le profil</button>
    `;
  }

  // Ajout d'une tâche
  function addTask() {
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({ text, completed: false });
      taskInput.value = "";
      saveTasks();
      renderTasks();
      sendNotification(text);
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

  // Gestion des filtres
  filters.forEach(btn => {
    btn.addEventListener("click", () => {
      filters.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      if (currentFilter === "profile") {
        // Masquer la section To-Do et afficher le profil
        todoSection.style.display = "none";
        profileSection.classList.remove("hidden");
        renderProfile();
      } else {
        // Afficher la section To-Do et masquer le profil
        profileSection.classList.add("hidden");
        todoSection.style.display = "block";
        renderTasks();
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

  // Initialisation
  updateDate();
  renderTasks();
  updateProgress();
  requestNotificationPermission();

  // Retirer le splash screen et afficher le contenu principal après 5 secondes
  setTimeout(() => {
    const splash = document.getElementById("splash-screen");
    if (splash) splash.parentNode.removeChild(splash);
    const mainContent = document.getElementById("main-content");
    mainContent.classList.remove("hidden");
  }, 5000);
});
