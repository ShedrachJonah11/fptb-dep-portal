// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

// Your web app's Firebase configuration
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

// Password validation
const passwordInput = document.getElementById("password");
const lengthRequirement = document.getElementById("length");
const uppercaseRequirement = document.getElementById("uppercase");
const lowercaseRequirement = document.getElementById("lowercase");
const numberRequirement = document.getElementById("number");
const specialRequirement = document.getElementById("special");

passwordInput.addEventListener("input", () => {
  const value = passwordInput.value;
  lengthRequirement.classList.toggle("valid", value.length >= 8);
  lengthRequirement.classList.toggle("invalid", value.length < 8);

  uppercaseRequirement.classList.toggle("valid", /[A-Z]/.test(value));
  uppercaseRequirement.classList.toggle("invalid", !/[A-Z]/.test(value));

  lowercaseRequirement.classList.toggle("valid", /[a-z]/.test(value));
  lowercaseRequirement.classList.toggle("invalid", !/[a-z]/.test(value));

  numberRequirement.classList.toggle("valid", /[0-9]/.test(value));
  numberRequirement.classList.toggle("invalid", !/[0-9]/.test(value));

  specialRequirement.classList.toggle(
    "valid",
    /[!@#$%^&*(),.?":{}|<>]/.test(value)
  );
  specialRequirement.classList.toggle(
    "invalid",
    !/[!@#$%^&*(),.?":{}|<>]/.test(value)
  );
});

// Toast message function
const showToast = (message, type) => {
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
    toastContainer.removeChild(toast);
  }, 4000);
};

// Submit button click event
const submit = document.getElementById("submit");
const loadingOverlay = document.getElementById("loading-overlay");
submit.addEventListener("click", async function (event) {
  event.preventDefault();

  // Get email and password
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Show loading overlay
  loadingOverlay.style.display = "flex";

  // Firebase authentication
  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Signed up successfully
    const user = userCredential.user;
    showToast("Account created successfully!", "success");
    loadingOverlay.style.display = "none";
    setTimeout(() => {
      window.location.href = "Dashboard.html";
    }, 2000);
  } catch (error) {
    // Handle errors
    const errorCode = error.code;
    const errorMessage = error.message;
    showToast(errorMessage, "error");
    loadingOverlay.style.display = "none";
  }
});
