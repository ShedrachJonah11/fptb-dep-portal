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
  child,
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
const userNameElement = document.getElementById("user-name");
const logoutLink = document.getElementById("logout");
const coursesContainer = document.getElementById("courses-container");
const notificationsContainer = document.getElementById("notifications-container");

const updateWelcomeMessage = async (user) => {
  if (user) {
    try {
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      console.log("User data:", userData); // Check if userData is fetched correctly

      if (userData && userData.name) {
        const fullName = userData.name;
        const firstName = fullName.split(" ")[0];
        welcomeMessage.textContent = `Welcome back, ${firstName}!`;
        userNameElement.textContent = fullName;
      } else {
        welcomeMessage.textContent = `Welcome back!`;
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  } else {
    welcomeMessage.textContent = `Welcome!`;
  }
};

const fetchAndDisplayCourses = async () => {
  try {
    const coursesRef = ref(database, 'courses');
    const snapshot = await get(coursesRef);
    const courses = snapshot.val();

    coursesContainer.innerHTML = ''; // Clear previous content

    if (courses) {
      Object.keys(courses).forEach((courseId) => {
        const course = courses[courseId];
        const courseCard = document.createElement('div');
        courseCard.className = 'card-container';
        courseCard.innerHTML = `
          <div class="text">
            <p>${course.name}</p>
            <button>View</button>
          </div>
          <img src="../images/PC.png" alt="">
        `;
        coursesContainer.appendChild(courseCard);
      });
    } else {
      coursesContainer.innerHTML = '<p>No available courses</p>';
    }
  } catch (error) {
    console.error('Error fetching courses:', error.message);
    coursesContainer.innerHTML = '<p>Error loading courses</p>';
  }
};

const fetchAndDisplayNotifications = async () => {
  try {
    const notificationsRef = ref(database, 'notifications');
    const snapshot = await get(notificationsRef);
    const notifications = snapshot.val();

    notificationsContainer.innerHTML = ''; // Clear previous content

    if (notifications) {
      Object.keys(notifications).forEach((notificationId) => {
        const notification = notifications[notificationId];
        const notificationCard = document.createElement('div');
        notificationCard.innerHTML = `
          <span>
            <h3>${notification.title}</h3>
            <p>${notification.message}</p>
            <p class="see-more">See more</p>
          </span>
        `;
        notificationsContainer.appendChild(notificationCard);
      });
    } else {
      notificationsContainer.innerHTML = '<p>No available notifications</p>';
    }
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    notificationsContainer.innerHTML = '<p>Error loading notifications</p>';
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user);
    updateWelcomeMessage(user);
    fetchAndDisplayCourses();
    fetchAndDisplayNotifications();
  } else {
    console.log("No user is signed in.");
    updateWelcomeMessage(null);
    coursesContainer.innerHTML = '<p>No available courses</p>';
    notificationsContainer.innerHTML = '<p>No available notifications</p>';
  }
});

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
