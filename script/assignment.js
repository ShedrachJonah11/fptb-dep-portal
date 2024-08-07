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


// Function to display assignments
async function displayAssignments() {
  const assignmentsRef = ref(database, "assignments");
  try {
    const snapshot = await get(assignmentsRef);
    const assignments = snapshot.val();
    const assignmentContainer = document.querySelector(".assignment-container");
    assignmentContainer.innerHTML = ""; // Clear existing assignments

    for (let id in assignments) {
      const assignment = assignments[id];
      const assignmentElement = document.createElement("div");
      assignmentElement.className = "assignment-item";
      assignmentElement.innerHTML = `
        <h3 class="course-code">${assignment.courseCode}</h3>
        <p>${assignment.description}</p>
        <div class="date">${assignment.dueDate}</div>
      `;
      assignmentContainer.appendChild(assignmentElement);
    }
  } catch (error) {
    console.error("Error fetching assignments:", error.message);
    // Handle error
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is logged in, fetch and display assignments
      displayAssignments();
    } else {
      // User is not logged in, redirect to login page
      window.location.href = "login.html";
    }
  });
});