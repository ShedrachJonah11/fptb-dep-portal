// Login.js

// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAOvjJvw7G_lrYlwxkFFSDOxji1IeqQ2zw",
  authDomain: "authentication-4bf9c.firebaseapp.com",
  projectId: "authentication-4bf9c",
  storageBucket: "authentication-4bf9c.appspot.com",
  messagingSenderId: "26178407898",
  appId: "1:26178407898:web:475f505e40f724eed844e3",
};
const app = initializeApp(firebaseConfig);

const submit = document.getElementById("submit");
const loadingOverlay = document.getElementById("loading-overlay");

submit.addEventListener("click", async function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Show loading overlay
  loadingOverlay.style.display = "flex";

  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    showToastMessage("success", "Login successful!"); // Show success toast
    setTimeout(() => {
      window.location.href = "Dashboard.html";
    }, 2000); // Redirect after 2 seconds
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    showToastMessage("error", errorMessage); // Show error toast
  } finally {
    // Hide loading overlay regardless of success or failure
    loadingOverlay.style.display = "none";
  }
});

function showToastMessage(type, message) {
  const toastContainer = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.classList.add("toast", type);
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
  }, 3000); // Adjust timing as needed for toast display
}
