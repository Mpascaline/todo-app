// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const registerScreen = document.getElementById('register-screen');
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const taskDetailScreen = document.getElementById('task-detail-screen');

const getStartedBtn = document.getElementById('get-started-btn');
const goToLoginBtn = document.getElementById('go-to-login');
const goToRegisterBtn = document.getElementById('go-to-register');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const addTaskBtn = document.getElementById('add-task-btn');
const backToDashboardBtn = document.getElementById('back-to-dashboard');
const submitTasksBtn = document.getElementById('submit-tasks');
const tasksContainer = document.getElementById('tasks-container');
const detailTasksContainer = document.getElementById('detail-tasks-container');
const userName = document.getElementById('user-name');
const detailUserName = document.getElementById('detail-user-name');

const toast = document.getElementById('toast');
const toastTitle = document.getElementById('toast-title');
const toastDescription = document.getElementById('toast-description');

// User and Task Interfaces
/**
 * @typedef {Object} User
 * @property {string} name - User's name
 * @property {string} email - User's email
 * @property {string} password - User's password
 */

/**
 * @typedef {Object} Task
 * @property {string} id - Task's unique ID
 * @property {string} title - Task's title
 * @property {string} time - Time to complete the task
 * @property {boolean} completed - Whether the task is completed
 * @property {string} category - Task's category
 */

// Navigation Functions
function showScreen(screen) {
    // Hide all screens
    welcomeScreen.classList.add('hidden');
    registerScreen.classList.add('hidden');
    loginScreen.classList.add('hidden');
    dashboardScreen.classList.add('hidden');
    taskDetailScreen.classList.add('hidden');
    
    // Show the requested screen
    screen.classList.remove('hidden');
    
    // Add slide-in animation for task detail
    if (screen === taskDetailScreen) {
        screen.classList.add('slide-in');
    } else {
        taskDetailScreen.classList.remove('slide-in');
    }
}

// Check if user is already logged in
function checkLoggedInUser() {
    const savedUser = localStorage.getItem('todoUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        userName.textContent = user.name;
        detailUserName.textContent = user.name;
        showScreen(dashboardScreen);
        renderTasks();
    } else {
        showScreen(welcomeScreen);
    }
}

// Toast notification
function showToast(title, description, type = 'success', duration = 3000) {
    toastTitle.textContent = title;
    toastDescription.textContent = description;
    
    // Remove all toast classes
    toast.classList.remove('success', 'info', 'warning', 'error');
    
    // Add appropriate class
    toast.classList.add(type);
    toast.classList.remove('hidden');
    
    // Automatically hide toast after duration
    setTimeout(() => {
        toast.classList.add('hidden');
    }, duration);
}

// User Management Functions
/**
 * Register a new user
 * @param {User} user - User to register
 */
function registerUser(user) {
    localStorage.setItem('todoUser', JSON.stringify(user));
}

/**
 * Login a user
 * @param {string} name - User's name
 * @param {string} password - User's password
 * @returns {User|null} - User if login successful, null otherwise
 */
function loginUser(name, password) {
    const userJson = localStorage.getItem('todoUser');
    if (!userJson) return null;
    
    const user = JSON.parse(userJson);
    if (user.name === name && user.password === password) {
        return user;
    }
    
    return null;
}

/**
 * Get the current logged in user
 * @returns {User|null} - Current user if logged in, null otherwise
 */
function getCurrentUser() {
    const userJson = localStorage.getItem('todoUser');
    if (!userJson) return null;
    
    return JSON.parse(userJson);
}

/**
 * Log out the current user
 */
function logoutUser() {
    localStorage.removeItem('todoUser');
}

// Task Management Functions
/**
 * Get all tasks
 * @returns {Task[]} - Array of tasks
 */
function getTasks() {
    const tasksJson = localStorage.getItem('todoTasks');
    if (!tasksJson) return defaultTasks();
    
    return JSON.parse(tasksJson);
}

/**
 * Add a new task
 * @param {Omit<Task, 'id'>} task - Task to add without ID
 * @returns {Task} - Added task with ID
 */
function addTask(task) {
    const tasks = getTasks();
    const newTask = { ...task, id: Date.now().toString() };
    
    tasks.push(newTask);
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
    
    return newTask;
}

/**
 * Update a task
 * @param {string} taskId - ID of task to update
 * @param {Partial<Task>} updates - Updates to apply to task
 * @returns {Task|null} - Updated task, or null if task not found
 */
function updateTask(taskId, updates) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return null;
    
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
    
    return tasks[taskIndex];
}

/**
 * Delete a task
 * @param {string} taskId - ID of task to delete
 * @returns {boolean} - Whether deletion was successful
 */
function deleteTask(taskId) {
    const tasks = getTasks();
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    
    if (updatedTasks.length === tasks.length) return false;
    
    localStorage.setItem('todoTasks', JSON.stringify(updatedTasks));
    return true;
}

/**
 * Create default tasks if none exist
 * @returns {Task[]} - Default tasks
 */
function defaultTasks() {
    const tasks = [
        { id: '1', title: 'Learning programming', time: '2 PM', completed: true, category: 'Personal' },
        { id: '2', title: 'Learn how to cook', time: '3 PM', completed: false, category: 'Personal' },
        { id: '3', title: 'Have lunch', time: '4 PM', completed: false, category: 'Personal' },
        { id: '4', title: 'Playing Cricket', time: '5 PM', completed: false, category: 'Health' },
        { id: '5', title: 'Going to Travel', time: '6 PM', completed: false, category: 'Personal' }
    ];
    
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
    return tasks;
}

// Categories
const categories = [
    { id: 'work', name: 'Work', icon: 'briefcase', color: 'text-gray-800' },
    { id: 'personal', name: 'Personal', icon: 'user', color: 'text-blue-500' },
    { id: 'shopping', name: 'Shopping', icon: 'shopping-cart', color: 'text-yellow-500' },
    { id: 'health', name: 'Health', icon: 'heart', color: 'text-red-500' }
];

// Render Functions
function renderTasks() {
    const tasks = getTasks();
    
    // Clear containers
    tasksContainer.innerHTML = '';
    detailTasksContainer.innerHTML = '';
    
    // Render tasks in dashboard
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <div class="task-item-left">
                <div class="task-circle ${task.completed ? 'completed' : ''}" data-id="${task.id}"></div>
                <span>${task.title}</span>
            </div>
            <span class="task-time">${task.time}</span>
        `;
        tasksContainer.appendChild(taskElement);
        
        // Add event listener to task circle
        const taskCircle = taskElement.querySelector('.task-circle');
        taskCircle.addEventListener('click', () => {
            toggleTaskCompletion(task.id);
        });
    });
    
    // Render tasks in detail screen
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'detail-task-item';
        taskElement.innerHTML = `
            <div class="task-circle ${task.completed ? 'completed' : ''}" data-id="${task.id}"></div>
            <label>${task.title} by ${task.time}</label>
        `;
        detailTasksContainer.appendChild(taskElement);
        
        // Add event listener to task circle
        const taskCircle = taskElement.querySelector('.task-circle');
        taskCircle.addEventListener('click', () => {
            toggleTaskCompletion(task.id);
        });
    });
}

function toggleTaskCompletion(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
        updateTask(taskId, { completed: !task.completed });
        renderTasks();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    checkLoggedInUser();
    
    // Welcome Screen
    getStartedBtn.addEventListener('click', () => {
        showScreen(registerScreen);
    });
    
    // Navigation between login and register
    goToLoginBtn.addEventListener('click', () => {
        showScreen(loginScreen);
    });
    
    goToRegisterBtn.addEventListener('click', () => {
        showScreen(registerScreen);
    });
    
    // Register Form
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        
        // Validation
        if (name.length < 2) {
            showToast('Registration failed', 'Name must be at least 2 characters', 'error');
            return;
        }
        
        if (!email.includes('@')) {
            showToast('Registration failed', 'Please enter a valid email', 'error');
            return;
        }
        
        if (password.length < 6) {
            showToast('Registration failed', 'Password must be at least 6 characters', 'error');
            return;
        }
        
        // Register user
        registerUser({ name, email, password });
        userName.textContent = name;
        detailUserName.textContent = name;
        
        showToast('Account created!', 'You can now login with your credentials');
        showScreen(dashboardScreen);
        renderTasks();
    });
    
    // Login Form
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('login-name').value;
        const password = document.getElementById('login-password').value;
        
        const user = loginUser(name, password);
        
        if (user) {
            userName.textContent = user.name;
            detailUserName.textContent = user.name;
            showToast('Login successful!', 'Welcome back to your ToDos');
            showScreen(dashboardScreen);
            renderTasks();
        } else {
            showToast('Login failed', 'Invalid name or password', 'error');
        }
    });
    
    // Logout Button
    logoutBtn.addEventListener('click', () => {
        logoutUser();
        showToast('Logged out', 'You have been logged out successfully');
        showScreen(loginScreen);
    });
    
    // Add Task Button
    addTaskBtn.addEventListener('click', () => {
        showScreen(taskDetailScreen);
    });
    
    backToDashboardBtn.addEventListener('click', () => {
        showScreen(dashboardScreen);
    });
    
    submitTasksBtn.addEventListener('click', () => {
        showToast('Tasks updated', 'Your tasks have been updated successfully');
        showScreen(dashboardScreen);
    });
    
    renderTasks();
});