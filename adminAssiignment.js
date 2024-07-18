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
  push,
  set,
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

// Add these functions
function openAssignmentModal() {
  document.getElementById("assignmentModal").style.display = "block";
}

function closeAssignmentModal() {
  document.getElementById("assignmentModal").style.display = "none";
}

function addAssignment(event) {
  event.preventDefault();

  const courseCode = document.getElementById("courseCode").value;
  const assignmentClass = document.getElementById("assignmentClass").value;
  const description = document.getElementById("assignmentDescription").value;
  const dueDate = document.getElementById("dueDate").value;

  const assignmentsRef = ref(database, "assignments");
  const newAssignmentRef = push(assignmentsRef);

  set(newAssignmentRef, {
    courseCode: courseCode,
    class: assignmentClass,
    description: description,
    dueDate: dueDate,
    createdAt: new Date().toISOString(),
  })
    .then(() => {
      showToast("Assignment added successfully", "success");
      closeAssignmentModal();
      displayAssignments();
    })
    .catch((error) => {
      showToast("Error adding assignment: " + error.message, "error");
    });
}

async function displayAssignments() {
  const assignmentsRef = ref(database, "assignments");
  try {
    const snapshot = await get(assignmentsRef);
    const assignments = snapshot.val();
    const container = document.querySelector(".container");
    container.innerHTML = ""; // Clear existing assignments

    for (let id in assignments) {
      const assignment = assignments[id];
      const assignmentElement = document.createElement("div");
      assignmentElement.className = "assignment";
      assignmentElement.innerHTML = `
        <div class="assignment-head">
          <h2>${assignment.courseCode}</h2>
          <div class="menu">•••</div>
        </div>
        <h3>${assignment.class}</h3>
        <p>${assignment.description}</p>
        <div class="date">${assignment.dueDate}</div>
      `;
      container.appendChild(assignmentElement);
    }
  } catch (error) {
    showToast("Error fetching assignments: " + error.message, "error");
  }
}

document.addEventListener("DOMContentLoaded", () => {
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

  const openModalButton = document.getElementById("openModalButton");
  const modal = document.getElementById("assignmentModal");
  const closeButton = modal.querySelector(".close");
  const addAssignmentForm = document.getElementById("addAssignmentForm");

  openModalButton.addEventListener("click", openAssignmentModal);
  closeButton.addEventListener("click", closeAssignmentModal);
  addAssignmentForm.addEventListener("submit", addAssignment);

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeAssignmentModal();
    }
  });

  displayAssignments();
});
