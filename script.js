/* Reset */
* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }

body {
  background: linear-gradient(135deg, #1f1c2c, #928DAB);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
}

/* Splash Screen */
#splash-screen {
  position: fixed;
  width: 100%;
  height: 100%;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  z-index: 9999;
}

#splash-logo {
  width: 150px;
  cursor: pointer;
  transition: transform 0.3s;
}

#splash-logo:hover { transform: scale(1.1); }

#splash-text {
  margin-top: 10px;
  font-size: 1.2em;
  animation: blink 1.5s infinite;
}

@keyframes blink { 50% { opacity: 0.3; } }

/* Conteneur principal */
.container {
  width: 90%;
  max-width: 500px;
  background: rgba(20, 20, 30, 0.7);
  padding: 20px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  text-align: center;
}

/* Mode sombre */
.dark-mode { background: #111 !important; color: white !important; }

