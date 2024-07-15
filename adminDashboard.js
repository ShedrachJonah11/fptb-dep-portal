import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  set,
  push,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOvjJvw7G_lrYlwxkFFSDOxji1IeqQ2zw",
  authDomain: "authentication-4bf9c.firebaseapp.com",
  projectId: "authentication-4bf9c",
  storageBucket: "authentication-4bf9c.appspot.com",
  messagingSenderId: "26178407898",
  appId: "1:26178407898:web:475f505e40f724eed844e3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Toast function
function showToast(message, type) {
  const toastContainer = document.getElementById("toast-container");
  if (toastContainer) {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("show");
    }, 100);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
}

// Combined DOMContentLoaded listener
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.querySelector(".sidebar");
  const manageUsersButton = document.getElementById("manage-users");
  const loadingOverlay = document.getElementById("loading-overlay");

  hamburger?.addEventListener("click", () => {
    sidebar.classList.toggle("show");
  });

  auth.onAuthStateChanged((user) => {
    if (user) {
      const userRef = ref(database, `users/${user.uid}`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.val();
            document.getElementById("adminName").textContent =
              userData.name || "No name available";
            document.getElementById("adminEmail").textContent =
              user.email || "No email available";
          } else {
            showToast("Could not retrieve user details.", "error");
          }
        })
        .catch((error) => {
          console.error(error);
          showToast("Error fetching user details.", "error");
        });
    } else {
      showToast("No user logged in", "error");
    }
  });

  manageUsersButton?.addEventListener("click", async () => {
    loadingOverlay.style.display = "flex";
    try {
      const usersRef = ref(database, "users");
      const snapshot = await get(usersRef);
      const users = snapshot.val();
      console.log("Users:", users);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      loadingOverlay.style.display = "none";
    }
  });

  document.querySelectorAll(".action-button").forEach((button) => {
    button.addEventListener("click", function (event) {
      event.stopPropagation();
      const modalMenu = this.nextElementSibling;
      const isVisible = modalMenu.style.display === "block";
      document.querySelectorAll(".modal-menu").forEach((menu) => {
        menu.style.display = "none";
      });
      modalMenu.style.display = isVisible ? "none" : "block";
    });
  });

  document.addEventListener(
    "click",
    (event) => {
      const isActionButton = event.target.closest(".action-button");
      const isMenuItem = !isActionButton && event.target.closest(".modal-menu");
      if (!isMenuItem) {
        document.querySelectorAll(".modal-menu").forEach((menu) => {
          menu.style.display = "none";
        });
      }
    },
    true
  );
});
