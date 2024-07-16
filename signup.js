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

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOvjJvw7G_lrYlwxkFFSDOxji1IeqQ2zw",
  authDomain: "authentication-4bf9c.firebaseapp.com",
  projectId: "authentication-4bf9c",
  storageBucket: "authentication-4bf9c.appspot.com",
  messagingSenderId: "26178407898",
  appId: "1:26178407898:web:475f505e40f724eed844e3",
  databaseURL: "https://authentication-4bf9c-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
console.log("Initializing Firebase...");
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
console.log("Firebase initialized successfully.");

// Password validation
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
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

  // Get input values
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const name = document.getElementById("name").value;
  const regNo = document.getElementById("reg-no").value;
  const currentClass = document.getElementById("current-class").value;
  const contact = document.getElementById("contact").value;

  // Check if passwords match
  if (password !== confirmPassword) {
    showToast("Passwords do not match!", "error");
    return;
  }

  // Show loading overlay
  loadingOverlay.style.display = "flex";

  try {
    console.log("Creating user with email and password...");
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("User created successfully:", user);

    // Save user data to the Realtime Database
    const userRef = ref(database, "users/" + user.uid);
    await set(userRef, {
      name: name,
      email: email,
      regNo: regNo,
      currentClass: currentClass,
      contact: contact,
    });
    console.log("User data saved to database successfully.");

    showToast("Account created successfully!", "success");
    loadingOverlay.style.display = "none";
    setTimeout(() => {
      window.location.href = "Dashboard.html";
    }, 2000);
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error creating user:", errorCode, errorMessage);
    showToast(errorMessage, "error");
    loadingOverlay.style.display = "none";
  }
});
