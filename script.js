document.addEventListener("DOMContentLoaded", function () {
  const splashScreen = document.getElementById("splash-screen");
  const splashLogo = document.getElementById("splash-logo");
  const mainContent = document.getElementById("main-content");

  splashLogo.addEventListener("click", function () {
    splashScreen.style.display = "none";
    mainContent.style.display = "block";
  });

  // Mode Sombre
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  darkModeToggle.addEventListener("change", function () {
    document.body.classList.toggle("dark-mode", darkModeToggle.checked);
  });

  // Ajouter une tâche
  const taskInput = document.getElementById("task-input");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");

  addTaskBtn.addEventListener("click", function () {
    if (taskInput.value.trim() !== "") {
      const li = document.createElement("li");
      li.textContent = taskInput.value;
      taskList.appendChild(li);
      taskInput.value = "";
    }
    if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(reg => {
      console.log("Service Worker enregistré", reg);

      // Vérifier si un nouveau SW est disponible
      if (reg.waiting) {
        showUpdateNotification();
      }

      reg.onupdatefound = () => {
        const newWorker = reg.installing;
        newWorker.onstatechange = () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            showUpdateNotification();
          }
        };
      };
    })
    .catch(err => console.error("Erreur SW:", err));
}

function showUpdateNotification() {
  const updateBanner = document.createElement("div");
  updateBanner.innerHTML = `
    <div class="update-banner">
      Une mise à jour est dispo ! <button id="reload">Recharger</button>
    </div>
  `;
  document.body.appendChild(updateBanner);

  document.getElementById("reload").addEventListener("click", () => {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg.waiting) {
        reg.waiting.postMessage({ type: "SKIP_WAITING" });
      }
    });
    window.location.reload();
  });
}

  });

});
