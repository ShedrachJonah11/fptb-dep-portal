import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
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
  projectId: "authentication-4bf9c",
  storageBucket: "authentication-4bf9c.appspot.com",
  messagingSenderId: "26178407898",
  appId: "1:26178407898:web:475f505e40f724eed844e3",
  databaseURL: "https://authentication-4bf9c-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// DOM elements
const welcomeMessage = document.getElementById("welcome-message");

const updateWelcomeMessage = async (user) => {
  if (user) {
    try {
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      console.log("User data:", userData); // Check if userData is fetched correctly

      if (userData && userData.name) {
        welcomeMessage.textContent = `Welcome back, ${userData.name}!`;
      } else {
        welcomeMessage.textContent = `Welcome back!`;
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      // Handle error as needed
    }
  } else {
    welcomeMessage.textContent = `Welcome!`;
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    console.log("User is signed in:", user);
    updateWelcomeMessage(user);
  } else {
    // No user is signed in
    console.log("No user is signed in.");
    updateWelcomeMessage(null);
  }
});

// Menu toggle functionality
const navMenu = document.getElementById("nav-menu");
const toggleMenu = document.getElementById("nav-toggle");
const closeMenu = document.getElementById("nav-close");

toggleMenu.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

closeMenu.addEventListener("click", () => {
  navMenu.classList.remove("show");
});

// Close menu when a navigation link is clicked
const navLinks = document.querySelectorAll(".nav__link");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show");
  });
});
