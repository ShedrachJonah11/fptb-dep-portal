// adminSignup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
  getDatabase,
  ref,
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
const submitButton = document.getElementById("admin-submit");
const loadingOverlay = document.getElementById("loading-overlay");

submitButton.addEventListener("click", async (event) => {
  event.preventDefault();

  const name = document.getElementById("admin-name").value;
  const email = document.getElementById("admin-email").value;
  const password = document.getElementById("admin-password").value;
  const confirmPassword = document.getElementById(
    "admin-confirm-password"
  ).value;

  if (password !== confirmPassword) {
    showToast("Passwords do not match!", "error");
    return;
  }

  loadingOverlay.style.display = "flex";

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userRef = ref(database, "users/" + user.uid);
    await set(userRef, {
      name: name,
      email: email,
      role: "admin",
    });

    showToast("Admin account created successfully!", "success");
    setTimeout(() => {
      window.location.href = "adminDashboard.html";
    }, 2000);
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    loadingOverlay.style.display = "none";
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
