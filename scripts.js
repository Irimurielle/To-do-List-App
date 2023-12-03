// Retrieve tasks from local storage or initialize an empty array
const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("taskList");
let currentFilter = "all"; // Default filter

// Iterate through saved tasks and render them on page load
savedTasks.forEach(task => renderTask(task));

// Function to show all tasks
window.showAllTasks = function () {
    currentFilter = "all";
    renderFilteredTasks();
};

// Function to show completed tasks
window.showCompletedTasks = function () {
    currentFilter = "completed";
    renderFilteredTasks();
};

// Function to show deleted tasks
window.showDeletedTasks = function () {
    currentFilter = "deleted";
    renderFilteredTasks();
};

// Function to render a task
function renderTask(task) {
    const listItem = document.createElement("li");
    const checkboxId = `checkbox_${task.id}`;

    // Create HTML for the task item
    listItem.innerHTML = `
        <input type="checkbox" id="${checkboxId}" onchange="toggleCompletion(${task.id})">
        <span id="taskText_${task.id}">${task.text}</span>
        <button onclick="toggleImportance(${task.id})">Important</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
        <button onclick="editTask(${task.id})">Edit</button>
        <input type="text" id="editInput_${task.id}" class="edit-input" style="display: none;">
        <button onclick="saveEditedTask(${task.id})" style="display: none;">Save</button>
    `;

    const checkbox = listItem.querySelector(`#${checkboxId}`);
    const taskText = listItem.querySelector(`#taskText_${task.id}`);

    if (task.isCompleted) {
        checkbox.checked = true;
        listItem.classList.add("completed");
    }

    if (task.isDeleted) {
        listItem.classList.add("deleted");
    }

    if (task.isImportant) {
        listItem.classList.add("important");
    }

    // Insert the task item into the task list
    taskList.insertBefore(listItem, getInsertionPosition(task));
}

// Function to render tasks based on the current filter
function renderFilteredTasks(tasks) {
    taskList.innerHTML = "";

    (tasks || savedTasks).forEach(task => {
        // Check if the task should be displayed based on the current filter
        if (
            (currentFilter === "all" && !task.isDeleted) ||
            (currentFilter === "completed" && task.isCompleted) ||
            (currentFilter === "deleted" && task.isDeleted) ||
            (currentFilter === "important" && task.isImportant) ||
            (currentFilter === task.category) ||
            (currentFilter === "search")
        ) {
            renderTask(task);
        }
    });
}

// Function to edit a task
window.editTask = function (taskId) {
    const taskText = document.getElementById(`taskText_${taskId}`);
    const editInput = document.getElementById(`editInput_${taskId}`);
    const saveButton = document.querySelector(`#taskList li:nth-child(${getTaskPosition(taskId)}) button:last-child`);

    // Hide the task text and display the edit input and save button
    taskText.style.display = "none";
    editInput.value = taskText.innerText;
    editInput.style.display = "inline-block";
    saveButton.style.display = "inline-block";
};

// Function to save edited task
window.saveEditedTask = function (taskId) {
    const taskText = document.getElementById(`taskText_${taskId}`);
    const editInput = document.getElementById(`editInput_${taskId}`);
    const saveButton = document.querySelector(`#taskList li:nth-child(${getTaskPosition(taskId)}) button:last-child`);

    taskText.innerText = editInput.value;
    taskText.style.display = "inline-block";
    editInput.style.display = "none";
    saveButton.style.display = "none";

    const taskIndex = savedTasks.findIndex(task => task.id === taskId);
    savedTasks[taskIndex].text = editInput.value;
    localStorage.setItem("tasks", JSON.stringify(savedTasks));
};

// Function to get the position of a task in the task list
function getTaskPosition(taskId) {
    const tasks = document.querySelectorAll("#taskList li");
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].contains(document.getElementById(`checkbox_${taskId}`))) {
            return i + 1;
        }
    }
    return -1;
}

// Function to toggle completion status of a task
window.toggleCompletion = function (taskId) {
    const taskIndex = savedTasks.findIndex(task => task.id === taskId);
    savedTasks[taskIndex].isCompleted = !savedTasks[taskIndex].isCompleted;
    savedTasks[taskIndex].isDeleted = false;
    localStorage.setItem("tasks", JSON.stringify(savedTasks));

    renderFilteredTasks();
};

// Function to toggle importance status of a task
window.toggleImportance = function (taskId) {
    const taskIndex = savedTasks.findIndex(task => task.id === taskId);
    savedTasks[taskIndex].isImportant = !savedTasks[taskIndex].isImportant;
    localStorage.setItem("tasks", JSON.stringify(savedTasks));

    renderFilteredTasks();
};

// Function to add a new task
window.addTask = function () {
    const taskInput = document.getElementById("item");
    const taskText = taskInput.value.trim();
    const categoryInput = document.getElementById("categoryInput");
    const selectedCategory = categoryInput.value;

    if (taskText !== "") {
        const newTask = {
            id: Date.now(),
            text: taskText,
            isImportant: false,
            isDeleted: false,
            isCompleted: false,
            category: selectedCategory,
        };

        renderTask(newTask);
        savedTasks.unshift(newTask);
        localStorage.setItem("tasks", JSON.stringify(savedTasks));

        taskInput.value = "";
    }
};

// Function to filter tasks by category
window.filterByCategory = function (category) {
    currentFilter = category;
    renderFilteredTasks();
};

// Function to delete a task
window.deleteTask = function (taskId) {
    const taskIndex = savedTasks.findIndex(task => task.id === taskId);
    savedTasks[taskIndex].isDeleted = true;
    localStorage.setItem("tasks", JSON.stringify(savedTasks));

    renderFilteredTasks();
};

// Function to determine the insertion position of a task
function getInsertionPosition(task) {
}

// Function to toggle the visibility of the category submenu
function toggleSubMenu() {
    var subMenu = document.getElementById("categorySubMenu");
    subMenu.style.display = (subMenu.style.display === "none") ? "block" : "none";
}

// Function to display the current date
function displayDate() {
    let date = new Date();
    date = date.toString().split(" ");
    date = date[1] + " " + date[2] + " " + date[3];
    document.querySelector("#date").innerHTML = date;
}

// Execute displayDate function on page load
window.onload = function () {
    displayDate();
    currentFilter = "all";
    renderFilteredTasks();
};

// Function to search tasks based on the search input
window.searchTasks = function () {
    const searchInput = document.getElementById("search").value.toLowerCase();
    const filteredTasks = savedTasks.filter(task => task.text.toLowerCase().includes(searchInput));

    currentFilter = "search";
    renderFilteredTasks(filteredTasks);
};

// Attach the searchTasks function to the keyup event of the search input
document.getElementById("search").addEventListener("keyup", searchTasks);