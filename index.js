console.log("App is working");

// Retrieve tasks and completed tasks from local storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

const TaskForm = document.getElementById("TaskForm");
const TaskTitle = document.getElementById("TaskTitle");
const TaskDescription = document.getElementById("TaskDescription");
const Add_btn = document.getElementById("AddTask");

let editingIndex = null;

// Function to add or update a task in the list of tasks
function handleTaskFormSubmission(title, description) {
  if (editingIndex !== null) {
    // Update existing task
    tasks[editingIndex] = { title, description };
    editingIndex = null;
    Add_btn.textContent = "Add Task"; 
  } else {
    // Add a new task
    tasks.push({ title, description });
  }
  
  localStorage.setItem("tasks", JSON.stringify(tasks)); 
  listTasks(); 
}

// Function to mark a task as completed
function completeTask(index) {
  const [completedTask] = tasks.splice(index, 1);
  completedTasks.push(completedTask);
  
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
  listTasks();
}

// Function to list all tasks
function listTasks() {
  const taskContainer = document.getElementById("taskContainer");
  taskContainer.innerHTML = "";

  if (tasks.length === 0 && completedTasks.length === 0) {
    const noTaskDiv = document.createElement("div");
    noTaskDiv.textContent = "No tasks found.";
    taskContainer.appendChild(noTaskDiv);
  } else {
    // Task counter
    const TotalCounter = document.createElement("div");
    TotalCounter.className = "Total-counter";
    const TaskCounter = document.createElement("div");
    TaskCounter.className = "task-counter";
    const CompletedCounter = document.createElement("div");
    CompletedCounter.className = "completed-counter";
    TotalCounter.textContent = `Total tasks: ${tasks.length + completedTasks.length}`;
    TaskCounter.textContent = `Task: ${tasks.length}`;
    CompletedCounter.textContent = `Completed: ${completedTasks.length}`;
    taskContainer.appendChild(TotalCounter);
    taskContainer.appendChild(TaskCounter);
    taskContainer.appendChild(CompletedCounter);

    // Display each task
    tasks.forEach((task, i) => {
      const taskDiv = document.createElement("div");
      taskDiv.className = "task-item";

      // Checkbox to mark as completed
      const completeCheckbox = document.createElement("input");
      completeCheckbox.type = "checkbox";
      completeCheckbox.className = "complete-checkbox";
      completeCheckbox.onclick = () => completeTask(i);
      taskDiv.appendChild(completeCheckbox);

      const taskTitle = document.createElement("p");
      taskTitle.innerHTML = `Title: ${task.title}`;
      taskTitle.className = "task-title";
      taskDiv.appendChild(taskTitle);

      const taskDescription = document.createElement("p");
      taskDescription.innerHTML = `Description: ${task.description}`;
      taskDescription.className = "task-description";
      taskDiv.appendChild(taskDescription);

      // Create delete and update buttons
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete-button";
      deleteButton.onclick = () => removeTask(i);
      taskDiv.appendChild(deleteButton);

      const updateButton = document.createElement("button");
      updateButton.textContent = "Update";
      updateButton.className = "update-button";
      updateButton.onclick = (event) => {
        event.preventDefault();
        populateFormForUpdate(i);
      };
      taskDiv.appendChild(updateButton);

      taskContainer.appendChild(taskDiv);
    });

    // Display completed tasks at the bottom
    completedTasks.forEach((completeTask, i) => {
      const completedTaskDiv = document.createElement("div");
      completedTaskDiv.className = "task-item completed";
      completedTaskDiv.innerHTML = `<strong>Completed:</strong> <s>Title: ${completeTask.title}, Description: ${completeTask.description}</s>`;
      taskContainer.appendChild(completedTaskDiv);
    });
  }
}

// Function to remove a task from the list
function removeTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  listTasks();
}

// Function to populate the form for updating a task
function populateFormForUpdate(index) {
  const task = tasks[index];
  TaskTitle.value = task.title;
  TaskDescription.value = task.description;
  Add_btn.textContent = "Update Task"; 
  editingIndex = index;
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
    console.log("Please fill in both title and description.");
  }
}

Add_btn.addEventListener("click", formSubmit,false);
listTasks(); 
