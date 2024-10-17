// Retrieve tasks and completed tasks from local storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

const TaskForm = document.getElementById("TaskForm");
const TaskTitle = document.getElementById("TaskTitle");
const TaskDescription = document.getElementById("TaskDescription");
const AddBtn = document.getElementById("AddTask");
const TaskCounter = document.getElementById("TaskCounter");
const searchIcon = document.getElementById("searchIcon");
const searchInput = document.getElementById("searchInput");

let editingIndex = null;

// Function to add or update a task in the list of tasks
function handleTaskFormSubmission(title, description) {
  if (editingIndex !== null) {
    // Update existing task
    tasks[editingIndex] = { title, description };
    editingIndex = null;
    AddBtn.textContent = "Add Task";
  } else {
    // Add a new task
    tasks.push({ title, description });
  }

  localStorage.setItem("tasks", JSON.stringify(tasks));
  listTasks(tasks, completedTasks);
}

// Function to remove a task from the list
function removeTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  listTasks(tasks, completedTasks);
}

// Function to populate the form for updating a task
function populateFormForUpdate(index) {
  const task = tasks[index];
  TaskTitle.value = task.title;
  TaskDescription.value = task.description;
  AddBtn.textContent = "Update Task";
  editingIndex = index;
}

// Function to mark a task as completed
function completeTask(index) {
  const [completedTask] = tasks.splice(index, 1);
  completedTasks.push(completedTask);

  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  listTasks(tasks, completedTasks);
}

// Function to mark a task as UnCompleted
function unCompleteTask(index) {
  const [uncompletedTask] = completedTasks.splice(index, 1);
  tasks.push(uncompletedTask);

  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));

  listTasks(tasks, completedTasks);
}

// Function to list all tasks
function listTasks(todoTasks, todoCompletedTasks) {
  const taskContainer = document.getElementById("taskContainer");
  taskContainer.innerHTML = "";

  if (todoTasks.length === 0 && todoCompletedTasks.length === 0) {
    const noTaskDiv = document.createElement("div");
    noTaskDiv.textContent = "No tasks found.";
    noTaskDiv.className = "todo__text";
    taskContainer.appendChild(noTaskDiv);
    return;
  }

  // Display active tasks
  const taskElements = displayTasks(todoTasks);
  taskElements.forEach((taskDiv) => taskContainer.appendChild(taskDiv));

  // Display completed tasks
  const completedTaskElements = displayCompletedTasks(todoCompletedTasks);
  completedTaskElements.forEach((completedDiv) =>
    taskContainer.appendChild(completedDiv)
  );
}

// Function to create the task counter
function createTaskCounter() {
  const counterDiv = document.createElement("div");
  counterDiv.className = "counter__container";

  const counters = [
    {
      className: "counter__task",
      text: `Total: <span>${tasks.length + completedTasks.length}</span>`,
    },
    { className: "counter__task", text: `Todo: <span>${tasks.length}</span>` },
    {
      className: "counter__task",
      text: `Completed: <span>${completedTasks.length}</span>`,
    },
  ];

  counters.map(({ className, text }) => {
    const counterElement = document.createElement("div");
    counterElement.className = className;
    counterElement.innerHTML = text;
    counterDiv.appendChild(counterElement);
  });

  return counterDiv;
}

// Function to display active tasks
function displayTasks(tasksList) {
  return tasksList.map((task, i) => {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task__item";

    // Checkbox for completion
    const checkboxContainer = document.createElement("div");
    checkboxContainer.className = "task__checkbox-container";
    checkboxContainer.onclick = () => completeTask(i);
    checkboxContainer.onkeypress = () => completeTask(i);

    const completeCheckbox = document.createElement("input");
    completeCheckbox.type = "checkbox";
    completeCheckbox.className = "task__checkbox";
    completeCheckbox.id = `task-checkbox-${i}`;

    const checkboxMark = document.createElement("span");
    checkboxMark.className = "task__checkbox-mark";

    checkboxContainer.appendChild(completeCheckbox);
    checkboxContainer.appendChild(checkboxMark);
    taskDiv.appendChild(checkboxContainer);

    // Task Title and Description
    const todoTitle = document.createElement("label");
    todoTitle.htmlFor = completeCheckbox.id;
    todoTitle.className = "task__title";
    todoTitle.textContent = task.title;

    const todoDescription = document.createElement("p");
    todoDescription.className = "task__description";
    todoDescription.textContent = task.description;

    taskDiv.appendChild(todoTitle);
    taskDiv.appendChild(todoDescription);

    // Delete and Update buttons
    const taskButton = document.createElement("div");
    const deleteButton = document.createElement("span");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    deleteButton.className = "task__button";
    deleteButton.tabIndex = 0;
    deleteButton.onclick = () => removeTask(i);
    deleteButton.onkeypress = () => removeTask(i);

    const updateButton = document.createElement("span");
    updateButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    updateButton.className = "task__button";
    updateButton.tabIndex = 0;
    updateButton.onclick = (event) => {
      event.preventDefault();
      populateFormForUpdate(i);
    };
    updateButton.onkeypress = () => populateFormForUpdate(i);

    taskButton.appendChild(deleteButton);
    taskButton.appendChild(updateButton);
    taskDiv.appendChild(taskButton);

    return taskDiv;
  });
}

// Function to display completed tasks
function displayCompletedTasks(completedList) {
  return completedList.map((completeTask, i) => {
    const completedTaskDiv = document.createElement("div");
    completedTaskDiv.className = "task__item--completed";

    // Checkbox for un-completing task
    const completedTasksCheckMark = document.createElement("div");
    completedTasksCheckMark.className = "task__checkbox-container";
    completedTasksCheckMark.onclick = () => unCompleteTask(i);
    completedTasksCheckMark.onkeypress = () => unCompleteTask(i);

    const completeCheckbox = document.createElement("input");
    completeCheckbox.type = "checkbox";
    completeCheckbox.id = `task-checkbox-${i}`;
    completeCheckbox.checked = true;
    completeCheckbox.className = "task__checkbox";

    const checkboxMark = document.createElement("span");
    checkboxMark.className = "task__checkbox-mark--completed";

    completedTasksCheckMark.appendChild(completeCheckbox);
    completedTasksCheckMark.appendChild(checkboxMark);
    completedTaskDiv.appendChild(completedTasksCheckMark);

    // Completed Task Title and Description
    const completedTasksTextContainer = document.createElement("div");
    completedTasksTextContainer.className = "text__container";
    completedTasksTextContainer.innerHTML = `
      <label for="${completeCheckbox.id}" class="task__title--completed">${completeTask.title}</label>
      <p class="task__description--completed">${completeTask.description}</p>
    `;

    completedTaskDiv.appendChild(completedTasksTextContainer);

    return completedTaskDiv;
  });
}

// Toggle visibility of search input on icon click
searchIcon.addEventListener("click", () => {
  if (searchInput.style.display === "none") {
    searchInput.style.display = "inline";
    searchInput.focus();
  } else {
    searchInput.style.display = "none";
    searchInput.value = "";
    listTasks(tasks, completedTasks);
  }
});

// Toggle visibility with Enter or Space key
searchIcon.tabIndex = 0;
searchIcon.addEventListener("keypress", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    if (searchInput.style.display === "none") {
      searchInput.style.display = "inline";
      searchInput.focus();
    } else {
      searchInput.style.display = "none";
      searchInput.value = "";
      listTasks(tasks, completedTasks);
    }
  }
});

// Add keypress event to search input
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  searchTasks(query);
});

// Function to filter and display tasks based on search query
function searchTasks(query) {
  if (query === "") {
    listTasks(tasks, completedTasks);
    return;
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
  );

  const filteredCompletedTasks = completedTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
  );

  listTasks(filteredTasks, filteredCompletedTasks);
}

// Function to handle form submission (add or update task)
function formSubmit(event) {
  event.preventDefault();
  const title = TaskTitle.value.trim();
  const description = TaskDescription.value.trim();

  if (title && description) {
    handleTaskFormSubmission(title, description);
    TaskForm.reset();
  } else {
    console.alert("Please fill in both title and description.");
  }
}

AddBtn.addEventListener("click", formSubmit, false);
listTasks(tasks, completedTasks);
TaskCounter.append(createTaskCounter());
