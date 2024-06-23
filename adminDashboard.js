// adminDashboard.js
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

// DOM elements
const manageUsersButton = document.getElementById("manage-users");
const addCourseButton = document.getElementById("add-course");
const loadingOverlay = document.getElementById("loading-overlay");

manageUsersButton.addEventListener("click", async () => {
  loadingOverlay.style.display = "flex";
  try {
    const usersRef = ref(database, "users");
    const snapshot = await get(usersRef);
    const users = snapshot.val();

    // Display user management interface here
    console.log("Users:", users);
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    loadingOverlay.style.display = "none";
  }
});

addCourseButton.addEventListener("click", async () => {
  const courseName = prompt("Enter course name:");
  if (courseName) {
    loadingOverlay.style.display = "flex";
    try {
      const coursesRef = ref(database, "courses");
      const newCourseRef = coursesRef.push();
      await set(newCourseRef, {
        name: courseName,
        // Add more course details as needed
      });

      showToast("Course added successfully!", "success");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      loadingOverlay.style.display = "none";
    }
  }
});

function showToast(message, type) {
  const toastContainer = document.getElementById("toast-container");
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
