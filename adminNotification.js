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

function openNotificationModal() {
  document.getElementById("notificationModal").style.display = "block";
}

function closeNotificationModal() {
  document.getElementById("notificationModal").style.display = "none";
}

function addNotification(event) {
  event.preventDefault();

  const title = document.getElementById("notificationTitle").value;
  const message = document.getElementById("notificationMessage").value;
  const date = document.getElementById("notificationDate").value;

  const notificationsRef = ref(database, "notifications");
  const newNotificationRef = push(notificationsRef);

  set(newNotificationRef, {
    title: title,
    message: message,
    date: date,
    createdAt: new Date().toISOString(),
  })
    .then(() => {
      showToast("Notification added successfully", "success");
      closeNotificationModal();
      displayNotifications();
    })
    .catch((error) => {
      showToast("Error adding notification: " + error.message, "error");
    });
}

async function displayNotifications() {
  const notificationsRef = ref(database, "notifications");
  try {
    const snapshot = await get(notificationsRef);
    const notifications = snapshot.val();
    const container = document.querySelector(".container");
    container.innerHTML = ""; // Clear existing notifications

    for (let id in notifications) {
      const notification = notifications[id];
      const notificationElement = document.createElement("div");
      notificationElement.className = "notification";
      notificationElement.innerHTML = `
        <div class="notification-head">
          <h2>${notification.title}</h2>
          <div class="menu" data-id="${id}">•••</div>
          <div class="modal-menu" id="modal-menu-${id}">
            <ul>
              <li class="edit-notification" data-id="${id}">Edit Notification</li>
              <li class="delete-notification" data-id="${id}">Delete Notification</li>
            </ul>
          </div>
        </div>
        <p>${notification.message}</p>
        <div class="date">${notification.date}</div>
      `;
      container.appendChild(notificationElement);
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

    // Add event listeners to edit and delete buttons
    const editButtons = document.querySelectorAll('.edit-notification');
    const deleteButtons = document.querySelectorAll('.delete-notification');

    editButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const id = event.target.dataset.id;
        editNotification(id);
      });
    });

    deleteButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const id = event.target.dataset.id;
        deleteNotification(id);
      });
    });
  } catch (error) {
    showToast("Error fetching notifications: " + error.message, "error");
  }
}

function editNotification(id) {
  const notificationsRef = ref(database, `notifications/${id}`);
  get(notificationsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const notification = snapshot.val();
        document.getElementById("notificationTitle").value = notification.title;
        document.getElementById("notificationMessage").value = notification.message;
        document.getElementById("notificationDate").value = notification.date;
        openNotificationModal();

        const updateButton = document.getElementById("updateNotificationButton");
        updateButton.style.display = "block";
        const addButton = document.getElementById("addNotificationButton");
        addButton.style.display = "none";

        updateButton.onclick = function (event) {
          event.preventDefault();
          const updatedTitle = document.getElementById("notificationTitle").value;
          const updatedMessage = document.getElementById("notificationMessage").value;
          const updatedDate = document.getElementById("notificationDate").value;

          update(notificationsRef, {
            title: updatedTitle,
            message: updatedMessage,
            date: updatedDate,
            updatedAt: new Date().toISOString(),
          })
            .then(() => {
              showToast("Notification updated successfully", "success");
              closeNotificationModal();
              displayNotifications();
            })
            .catch((error) => {
              showToast("Error updating notification: " + error.message, "error");
            });
        };
      } else {
        showToast("Notification not found", "error");
      }
    })
    .catch((error) => {
      showToast("Error fetching notification: " + error.message, "error");
    });
}

function deleteNotification(id) {
  const notificationsRef = ref(database, `notifications/${id}`);
  remove(notificationsRef)
    .then(() => {
      showToast("Notification deleted successfully", "success");
      displayNotifications();
    })
    .catch((error) => {
      showToast("Error deleting notification: " + error.message, "error");
    });
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

  const openModalButton = document.getElementById("openNotificationModalButton");
  const modal = document.getElementById("notificationModal");
  const closeButton = modal.querySelector(".close");
  const addNotificationForm = document.getElementById("addNotificationForm");

  openModalButton.addEventListener("click", openNotificationModal);
  closeButton.addEventListener("click", closeNotificationModal);
  addNotificationForm.addEventListener("submit", addNotification);

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeNotificationModal();
    }
  });

  displayNotifications();
});
