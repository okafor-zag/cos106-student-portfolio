/* ==========================================================================
   COS 106 Term Project - Student Portfolio & Academic Management Website
   External JavaScript (js/script.js)
   Demonstrates: Event handling, DOM manipulation, Form validation,
                 Dynamic content updates, Arrays & functions, Task management
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNavigation();
  initFooterYear();
  initProjectFilter();
  initAcademicPlanner();
  initContactFormValidation();
});

/* 1. Responsive Mobile Navigation Toggle */
function initMobileNavigation() {
  const toggleBtn = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }
}

/* 2. Dynamic Footer Year */
function initFooterYear() {
  const yearSpan = document.getElementById("currentYear");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/* 3. Projects Page Category Filter (Arrays & DOM Manipulation) */
function initProjectFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active button state
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const selectedCategory = button.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category");
        if (selectedCategory === "all" || cardCategory === selectedCategory) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

/* 4. Interactive Academic Planner (Task Management System) */
let academicTasks = [
  {
    id: 1,
    title: "Complete COS 106 Web Technologies Term Project",
    course: "COS 106",
    dueDate: "2026-11-28",
    completed: false
  },
  {
    id: 2,
    title: "Revise Data Structures & Algorithms Lecture Notes",
    course: "COS 104",
    dueDate: "2026-11-25",
    completed: true
  },
  {
    id: 3,
    title: "Submit Discrete Mathematics Problem Set 4",
    course: "MTH 102",
    dueDate: "2026-11-30",
    completed: false
  }
];

function initAcademicPlanner() {
  const taskForm = document.getElementById("taskForm");
  const taskListEl = document.getElementById("taskList");

  if (!taskForm || !taskListEl) return;

  // Load saved tasks from localStorage if available
  const savedTasks = localStorage.getItem("miva_cos106_tasks");
  if (savedTasks) {
    academicTasks = JSON.parse(savedTasks);
  }

  renderTasks();

  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const titleInput = document.getElementById("taskTitle");
    const courseInput = document.getElementById("taskCourse");
    const dateInput = document.getElementById("taskDate");

    const title = titleInput.value.trim();
    const course = courseInput.value.trim() || "General";
    const dueDate = dateInput.value || "No due date";

    if (title === "") {
      alert("Please enter a task description.");
      return;
    }

    addTask(title, course, dueDate);
    taskForm.reset();
  });
}

function saveTasksToStorage() {
  localStorage.setItem("miva_cos106_tasks", JSON.stringify(academicTasks));
}

function addTask(title, course, dueDate) {
  const newTask = {
    id: Date.now(),
    title,
    course,
    dueDate,
    completed: false
  };
  academicTasks.unshift(newTask);
  saveTasksToStorage();
  renderTasks();
}

function toggleTaskStatus(taskId) {
  academicTasks = academicTasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  saveTasksToStorage();
  renderTasks();
}

function deleteTask(taskId) {
  academicTasks = academicTasks.filter((task) => task.id !== taskId);
  saveTasksToStorage();
  renderTasks();
}

function renderTasks() {
  const taskListEl = document.getElementById("taskList");
  const totalCountEl = document.getElementById("totalTasks");
  const completedCountEl = document.getElementById("completedTasks");
  const pendingCountEl = document.getElementById("pendingTasks");

  if (!taskListEl) return;

  // Update dashboard metrics dynamically
  const total = academicTasks.length;
  const completed = academicTasks.filter((t) => t.completed).length;
  const pending = total - completed;

  if (totalCountEl) totalCountEl.textContent = total;
  if (completedCountEl) completedCountEl.textContent = completed;
  if (pendingCountEl) pendingCountEl.textContent = pending;

  taskListEl.innerHTML = "";

  if (academicTasks.length === 0) {
    taskListEl.innerHTML =
      '<li class="card">No academic tasks added yet. Use the form above to schedule a task!</li>';
    return;
  }

  academicTasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    const infoDiv = document.createElement("div");
    infoDiv.innerHTML = `
      <strong class="task-title">${escapeHTML(task.title)}</strong>
      <div class="task-meta">Course: <strong>${escapeHTML(task.course)}</strong> | Due: ${escapeHTML(task.dueDate)}</div>
    `;

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "task-actions";

    const completeBtn = document.createElement("button");
    completeBtn.type = "button";
    completeBtn.className = "btn-sm btn-complete";
    completeBtn.textContent = task.completed ? "Undo" : "Complete";
    completeBtn.addEventListener("click", () => toggleTaskStatus(task.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn-sm btn-delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    actionsDiv.appendChild(completeBtn);
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(infoDiv);
    li.appendChild(actionsDiv);
    taskListEl.appendChild(li);
  });
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* 5. Contact Form JavaScript Validation */
function initContactFormValidation() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("emailAddress");
    const phoneInput = document.getElementById("phoneNumber");
    const messageInput = document.getElementById("messageBox");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const phoneError = document.getElementById("phoneError");
    const messageError = document.getElementById("messageError");
    const feedbackEl = document.getElementById("formFeedback");

    // Reset previous messages
    nameError.textContent = "";
    emailError.textContent = "";
    phoneError.textContent = "";
    messageError.textContent = "";
    feedbackEl.className = "form-feedback";
    feedbackEl.textContent = "";

    let isValid = true;

    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const phoneVal = phoneInput.value.trim();
    const messageVal = messageInput.value.trim();

    // Rule 1: No field is empty
    if (nameVal === "") {
      nameError.textContent = "Full name is required.";
      isValid = false;
    }

    // Rule 2: No field empty + Email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailVal === "") {
      emailError.textContent = "Email address is required.";
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      emailError.textContent = "Please enter a valid email address (e.g., student@miva.edu.ng).";
      isValid = false;
    }

    // Rule 3: No field empty + Phone number contains only digits
    const digitsOnlyRegex = /^\d+$/;
    if (phoneVal === "") {
      phoneError.textContent = "Phone number is required.";
      isValid = false;
    } else if (!digitsOnlyRegex.test(phoneVal)) {
      phoneError.textContent = "Phone number must contain digits only (0-9, no spaces or symbols).";
      isValid = false;
    }

    if (messageVal === "") {
      messageError.textContent = "Please enter your message.";
      isValid = false;
    }

    if (isValid) {
      feedbackEl.classList.add("success");
      feedbackEl.textContent = `Thank you, ${nameVal}! Your message has been validated and sent successfully.`;
      contactForm.reset();
    } else {
      feedbackEl.classList.add("error");
      feedbackEl.textContent = "Please fix the highlighted errors above before submitting.";
    }
  });
}
