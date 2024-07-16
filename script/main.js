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

const welcomeMessage = document.getElementById("welcome-message");
const userNameElement = document.getElementById("user-name");
const userClassElement = document.getElementById("user-class");
const logoutLink = document.getElementById("logout");
const coursesContainer = document.getElementById("courses-container");
const seeAllCourses = document.getElementById("see-all-courses");
const notificationsContainer = document.getElementById(
  "notifications-container"
);

let allCourses = [];

const updateWelcomeMessage = async (user) => {
  if (user) {
    try {
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      console.log("User data:", userData);

      if (userData) {
        const fullName = userData.name;
        const firstName = fullName.split(" ")[0];
        welcomeMessage.textContent = `Welcome back, ${firstName}!`;
        userNameElement.textContent = fullName;
        userClassElement.textContent = userData.currentClass || "Class not set";
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

const displayCourses = (courses, limit) => {
  coursesContainer.innerHTML = "";
  const coursesToDisplay = limit ? courses.slice(0, limit) : courses;

  coursesToDisplay.forEach((course) => {
    const courseCard = document.createElement("div");
    courseCard.className = "card-container";
    courseCard.innerHTML = `
      <div class="text">
        <p>${course.code}</p>
        <p>${course.name}</p>
        <button>View</button>
      </div>
      <img src="../images/PC.png" alt="">
    `;
    coursesContainer.appendChild(courseCard);
  });
};

const fetchAndDisplayCourses = async (userClass) => {
  if (!userClass) {
    coursesContainer.innerHTML = "<p>Please specify a class.</p>";
    return;
  }

  try {
    // Replace 'courses' with the correct path to the classes in your database structure
    const classCoursesRef = ref(database, `classes/${userClass}/courses`);
    const snapshot = await get(classCoursesRef);
    const courseIds = snapshot.val(); // This should be an object with course IDs as keys if courses are set as true

    if (courseIds) {
      allCourses = [];
      for (const courseId in courseIds) {
        // Now, get the details for each course by its ID
        const courseSnapshot = await get(ref(database, `courses/${courseId}`));
        if (courseSnapshot.exists()) {
          const courseDetails = courseSnapshot.val();
          allCourses.push({
            ...courseDetails, // Spread the course details
            id: courseId, // Add the course ID in case you need to reference it
          });
        }
      }
      displayCourses(allCourses, 4); // Update to display limited courses
    } else {
      coursesContainer.innerHTML =
        "<p>No courses available for this class.</p>";
    }
  } catch (error) {
    console.error("Error fetching class courses:", error.message);
    coursesContainer.innerHTML = "<p>Error loading courses for the class.</p>";
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user);
    updateWelcomeMessage(user).then(() => {
      // Assuming the user's class has been updated in updateWelcomeMessage, fetch and display courses for user's class
      userClassElement.textContent &&
        fetchAndDisplayCourses(userClassElement.textContent);
    });
    fetchAndDisplayNotifications();
  } else {
    // Handle no user signed in case
  }
});

const fetchAndDisplayNotifications = async () => {
  try {
    const notificationsRef = ref(database, "notifications");
    const snapshot = await get(notificationsRef);
    const notifications = snapshot.val();

    notificationsContainer.innerHTML = ""; // Clear previous content

    if (notifications) {
      Object.keys(notifications).forEach((notificationId) => {
        const notification = notifications[notificationId];
        const notificationCard = document.createElement("div");
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
      notificationsContainer.innerHTML = "<p>No available notifications</p>";
    }
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    notificationsContainer.innerHTML = "<p>Error loading notifications</p>";
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
    coursesContainer.innerHTML = "<p>No available courses</p>";
    notificationsContainer.innerHTML = "<p>No available notifications</p>";
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
