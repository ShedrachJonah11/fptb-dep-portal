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

// Your firebaseConfig object
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

// Define a variable for the courses container outside the DOMContentLoaded listener
let coursesContainer;

document.addEventListener("DOMContentLoaded", () => {
  coursesContainer = document.getElementById("courses-container");
  const logoutLink = document.getElementById("logout");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      fetchUserClass(user.uid).then((userClass) => {
        if (userClass) {
          fetchAndDisplayCourses(userClass);
        } else {
          console.error("User class not found.");
          coursesContainer.innerHTML = "<p>User class not set.</p>";
        }
      });
    } else {
      console.log("No user is signed in.");
      // Potentially redirect to login or show a message requiring the user to sign in.
    }
  });

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

  // Additional event handlers and logic as necessary
});

async function fetchUserClass(uid) {
  try {
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const userData = snapshot.val();
      return userData.currentClass;
    }
  } catch (error) {
    console.error("Error fetching user's class:", error.message);
  }
}

async function fetchAndDisplayCourses(userClass) {
  try {
    const classCoursesRef = ref(database, `classes/${userClass}/courses`);
    const snapshot = await get(classCoursesRef);
    if (snapshot.exists()) {
      const courseIds = snapshot.val();
      displayCourses(courseIds);
    } else {
      coursesContainer.innerHTML =
        "<p>No courses available for this class.</p>";
    }
  } catch (error) {
    console.error("Error fetching class courses:", error.message);
    coursesContainer.innerHTML = "<p>Error loading courses.</p>";
  }
}

function displayCourses(courseIds) {
  coursesContainer.innerHTML = ""; // Clear any existing content

  const courseDetailsPromises = Object.keys(courseIds).map((courseId) => {
    // Assuming your individual course details are stored at `courses/${courseId}`
    const courseDetailsRef = ref(database, `courses/${courseId}`);
    return get(courseDetailsRef);
  });

  Promise.all(courseDetailsPromises)
    .then((courseSnapshots) => {
      courseSnapshots.forEach((snapshot) => {
        if (snapshot.exists()) {
          const course = snapshot.val();
          const courseCard = document.createElement("div");
          courseCard.className = "card-container";
          courseCard.innerHTML = `
            <div class="text">
              <p>${course.code}</p>
              <p>${course.name}</p>
              <button>View</button>
            </div>
            <img src="../images/PC.png" alt="Course Image">
          `;
          coursesContainer.appendChild(courseCard);
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching course details:", error.message);
      coursesContainer.innerHTML = "<p>Error loading course details.</p>";
    });
}
