import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import {
  getAuth,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  set,
  push,
  update,
  remove,
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

// Combined DOMContentLoaded listener
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal");
  const openModalButton = document.getElementById("openModalButton");
  const closeModalButton = document.querySelector(".modal .close");
  const cancelModalButton = document.querySelector(".modal-content .cancel");
  const addCourseForm = document.getElementById("addCourseForm");

  openModalButton?.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeModalButton?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  cancelModalButton?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

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

  addCourseForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const courseName = event.target.courseName.value;
    const courseCode = event.target.courseCode.value;
    const courseCredit = event.target.courseCredit.value;
    const courseStudents = event.target.courseStudents.value;
    const courseClass = event.target.courseClass.value;

    try {
      const coursesRef = ref(database, "courses");
      const newCourseRef = push(coursesRef);
      const courseId = newCourseRef.key;

      await set(newCourseRef, {
        name: courseName,
        code: courseCode,
        credit: courseCredit,
        students: courseStudents,
        class: courseClass,
      });

      // Add the course to the specified class
      const classCoursesRef = ref(
        database,
        `classes/${courseClass}/courses/${courseId}`
      );
      await set(classCoursesRef, true);

      showToast("Course added successfully!", "success");
    } catch (error) {
      console.error("Error adding course: ", error);
      showToast("Error adding course.", "error");
    }

    document.getElementById("modal").style.display = "none";
    addCourseForm.reset();
    await displayCourses();
  });

  // Event listener for edit and delete actions
  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("modal-edit-course")) {
      const courseId = event.target.dataset.id;
      editCourse(courseId);
    }

    if (event.target.classList.contains("modal-delete-course")) {
      const courseId = event.target.dataset.id;
      deleteCourse(courseId);
    }
  });

  displayCourses();
});

// Function to fetch and display courses in the table
const displayCourses = async () => {
  const coursesRef = ref(database, "courses");
  try {
    const snapshot = await get(coursesRef);
    const courses = snapshot.val();
    const coursesTableBody = document.getElementById("coursesTableBody");

    // Clear any existing table entries
    coursesTableBody.innerHTML = "";

    // Iterate over the course objects and create table rows
    for (let courseId in courses) {
      const course = courses[courseId];
      const tr = document.createElement("tr");
      tr.innerHTML = `
          <td>${course.code}</td>
          <td>${course.name}</td>
          <td>${course.credit}</td>
          <td>${course.students}</td>
          <td>${course.class}</td>
          <td>
            <div class="menu" data-id="${courseId}">...</div> 
            <div class="modal-menu" id="modal-menu-${courseId}">
              <ul>
                <li class="modal-edit-course" data-id="${courseId}">Edit Course</li>
                <li class="modal-delete-course" data-id="${courseId}">Delete Course</li>
              </ul>
            </div>
          </td>`;
      coursesTableBody.appendChild(tr);
    }

    // Add event listeners to menu buttons
    const menuButtons = document.querySelectorAll('.menu');
    menuButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const id = event.target.dataset.id;
        const modalMenu = document.getElementById(`modal-menu-${id}`);
        modalMenu.style.display = modalMenu.style.display === 'block' ? 'none' : 'block';
      });
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    showToast("Error fetching courses.", "error");
  }
};

function editCourse(courseId) {
  const courseRef = ref(database, `courses/${courseId}`);
  get(courseRef).then((snapshot) => {
    if (snapshot.exists()) {
      const courseData = snapshot.val();
      
      // Populate the modal with current course data
      document.getElementById("courseName").value = courseData.name;
      document.getElementById("courseCode").value = courseData.code;
      document.getElementById("courseCredit").value = courseData.credit;
      document.getElementById("courseStudents").value = courseData.students;
      document.getElementById("courseClass").value = courseData.class;

      // Show the modal
      document.getElementById("modal").style.display = "block";

      // Change form submission handler for updating
      const addCourseForm = document.getElementById("addCourseForm");
      addCourseForm.onsubmit = async (event) => {
        event.preventDefault();

        const updatedCourse = {
          name: document.getElementById("courseName").value,
          code: document.getElementById("courseCode").value,
          credit: document.getElementById("courseCredit").value,
          students: document.getElementById("courseStudents").value,
          class: document.getElementById("courseClass").value,
        };

        try {
          await update(courseRef, updatedCourse);
          showToast("Course updated successfully!", "success");
          document.getElementById("modal").style.display = "none";
          displayCourses();
        } catch (error) {
          console.error("Error updating course:", error);
          showToast("Error updating course.", "error");
        }
      };
    } else {
      showToast("Course not found.", "error");
    }
  }).catch((error) => {
    console.error("Error fetching course:", error);
    showToast("Error fetching course.", "error");
  });
}

function deleteCourse(courseId) {
  if (confirm("Are you sure you want to delete this course?")) {
    const courseRef = ref(database, `courses/${courseId}`);
    remove(courseRef).then(() => {
      showToast("Course deleted successfully!", "success");
      displayCourses();
    }).catch((error) => {
      console.error("Error deleting course:", error);
      showToast("Error deleting course.", "error");
    });
  }
}