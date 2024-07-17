// Initialize Firebase and necessary services
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAOvjJvw7G_lrYlwxkFFSDOxji1IeqQ2zw",
  authDomain: "authentication-4bf9c.firebaseapp.com",
  projectId: "authentication-4bf9c",
  storageBucket: "authentication-4bf9c.appspot.com",
  messagingSenderId: "26178407898",
  appId: "1:26178407898:web:475f505e40f724eed844e3",
  databaseURL: "https://authentication-4bf9c-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const logoutLink = document.getElementById("logout");

// Logout functionality
logoutLink.addEventListener("click", async (event) => {
  event.preventDefault();
  try {
    await signOut(auth);
    console.log("User signed out successfully.");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error signing out:", error.message);
  }
});

// Menu toggle functionality
const navMenu = document.getElementById("nav-menu");
const toggleMenu = document.getElementById("nav-toggle");
const closeMenu = document.getElementById("nav-close");

toggleMenu.addEventListener("click", () => {
  navMenu.classList.toggle("show-menu");
});

closeMenu.addEventListener("click", () => {
  navMenu.classList.remove("show-menu");
});

// Close menu when a navigation link is clicked
const navLinks = document.querySelectorAll(".nav__link");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
});
