// Admin dashboard
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOvjJvw7G_lrYlwxkFFSDOxji1IeqQ2zw",
  authDomain: "authentication-4bf9c.firebaseapp.com",
  databaseURL: "https://authentication-4bf9c-default-rtdb.firebaseio.com",
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

// Function to fetch and display users
async function displayUsers() {
  const usersRef = ref(database, "users");
  const loadingOverlay = document.getElementById("loading-overlay");
  loadingOverlay.style.display = "flex";

  try {
    const snapshot = await get(usersRef);
    if (snapshot.exists()) {
      const users = snapshot.val();
      const usersTableBody = document.querySelector(".users-table tbody");
      usersTableBody.innerHTML = ""; // Clear current table rows

      // Generate new table rows
      Object.keys(users).forEach((userId) => {
        const user = users[userId];
        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `
          <td>${user.regNo || "N/A"}</td>
          <td>${user.name || "N/A"}</td>
          <td>${user.currentClass || "N/A"}</td>
          <td>${user.email || "N/A"}</td>
          <td>${user.contact || "N/A"}</td>
        
        `;
        usersTableBody.appendChild(tableRow);
      });

      // Attach click event listeners to action buttons
      attachActionButtonsEventListeners();
    } else {
      showToast("No users found", "error");
    }
  } catch (error) {
    showToast("Error fetching user data: " + error.message, "error");
  } finally {
    loadingOverlay.style.display = "none";
  }
}

// Function to attach click event listeners to action buttons
function attachActionButtonsEventListeners() {
  const actionButtons = document.querySelectorAll(".action-button");
  actionButtons.forEach((button) => {
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
}

// Function to fetch counts and update the dashboard
async function updateDashboardCounts() {
  try {
    const coursesRef = ref(database, "courses");
    const assignmentsRef = ref(database, "assignments");
    const notificationsRef = ref(database, "notifications");

    const [coursesSnapshot, assignmentsSnapshot, notificationsSnapshot] =
      await Promise.all([
        get(coursesRef),
        get(assignmentsRef),
        get(notificationsRef),
      ]);

    const coursesCount = coursesSnapshot.exists()
      ? Object.keys(coursesSnapshot.val()).length
      : 0;
    const assignmentsCount = assignmentsSnapshot.exists()
      ? Object.keys(assignmentsSnapshot.val()).length
      : 0;
    const notificationsCount = notificationsSnapshot.exists()
      ? Object.keys(notificationsSnapshot.val()).length
      : 0;

    document.querySelector(".courses-item h3").textContent = coursesCount;
    document.querySelector(".assignments-item h3").textContent =
      assignmentsCount;
    document.querySelector(".notifications-item h3").textContent =
      notificationsCount;
  } catch (error) {
    console.error("Error fetching counts:", error);
    showToast("Error fetching dashboard data.", "error");
  }
}

// Combined DOMContentLoaded listener
document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.querySelector(".sidebar");

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

  displayUsers();
  // Update dashboard counts on page load
  updateDashboardCounts();
});
