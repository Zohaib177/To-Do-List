// ============================================================
//  STEP 1 — GRAB HTML ELEMENTS
//  We use getElementById() to find elements in our HTML
//  and store them in variables so we can use them later
// ============================================================

const taskInput   = document.getElementById('task-input');     // the text box
const addBtn      = document.getElementById('add-task-btn');   // the + Add button
const taskList    = document.getElementById('task-list');      // the <ul> list
const filterBtns  = document.querySelectorAll('.filter-btn');  // All / Active / Done buttons


// ============================================================
//  STEP 2 — OUR DATA
//  We store all tasks in an array (a list of objects)
//  Each task has 3 properties: id, text, done
// ============================================================

let tasks = [];          // empty array — will hold all task objects
let currentFilter = 'all'; // tracks which filter button is active


// ============================================================
//  STEP 3 — ADD A TASK
//  This function runs when the user clicks "+ Add" or presses Enter
// ============================================================

function addTask() {
    const text = taskInput.value.trim(); // .trim() removes extra spaces

    // If the input is empty, do nothing
    if (text === '') {
        taskInput.focus(); // put cursor back in the box
        return;            // stop the function here
    }

    // Create a new task object
    const newTask = {
        id:   Date.now(),  // unique number using current timestamp
        text: text,        // the task text the user typed
        done: false        // new tasks start as not done
    };

    tasks.push(newTask);   // add the new task to our array

    taskInput.value = '';  // clear the input box
    taskInput.focus();     // put the cursor back in the input

    renderTasks();         // re-draw the list on screen
}


// ============================================================
//  STEP 4 — RENDER (DRAW) TASKS ON SCREEN
//  This function clears the list and redraws it from scratch
//  every time something changes (add, delete, check)
// ============================================================

function renderTasks() {

    // Filter which tasks to show based on currentFilter
    let filteredTasks = tasks.filter(function(task) {
        if (currentFilter === 'active') return task.done === false;
        if (currentFilter === 'done')   return task.done === true;
        return true; // 'all' — show everything
    });

    // If no tasks match, show a friendly message
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<li class="empty-msg">No tasks here!</li>';
        updateFooter();
        return;
    }

    // Build the HTML for each task and inject it into the list
    taskList.innerHTML = filteredTasks.map(function(task) {
        return `
            <li class="task-item ${task.done ? 'done' : ''}" data-id="${task.id}">
                <input type="checkbox" ${task.done ? 'checked' : ''}
                       onchange="toggleTask(${task.id})">
                <span>${task.text}</span>
                <button class="delete-btn" onclick="deleteTask(${task.id})">✕</button>
            </li>
        `;
    }).join(''); // .join('') turns the array of strings into one big string

    updateFooter(); // refresh the "X tasks left" counter
}


// ============================================================
//  STEP 5 — TOGGLE A TASK (mark done / undone)
//  Runs when the user clicks the checkbox
// ============================================================

function toggleTask(id) {
    // Loop through tasks and flip the 'done' value for matching id
    tasks = tasks.map(function(task) {
        if (task.id === id) {
            return { ...task, done: !task.done }; // flip true→false or false→true
        }
        return task; // leave other tasks unchanged
    });

    renderTasks(); // redraw the list
}


// ============================================================
//  STEP 6 — DELETE A TASK
//  Runs when the user clicks the ✕ button
// ============================================================

function deleteTask(id) {
    // Keep only tasks that do NOT match the given id
    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    renderTasks(); // redraw the list
}


// ============================================================
//  STEP 7 — FILTER BUTTONS (All / Active / Done)
// ============================================================

function setFilter(filter, clickedBtn) {
    currentFilter = filter; // update which filter is active

    // Remove 'active' class from ALL filter buttons
    filterBtns.forEach(function(btn) {
        btn.classList.remove('active');
    });

    // Add 'active' class only to the button that was clicked
    clickedBtn.classList.add('active');

    renderTasks(); // redraw with new filter
}


// ============================================================
//  STEP 8 — FOOTER: tasks remaining + clear completed
// ============================================================

function updateFooter() {
    const footer = document.getElementById('footer');
    if (!footer) return;

    const remaining = tasks.filter(t => !t.done).length;
    const completed = tasks.filter(t => t.done).length;

    document.getElementById('count-text').textContent =
        remaining + ' task' + (remaining !== 1 ? 's' : '') + ' left';

    // Show/hide "Clear completed" button
    document.getElementById('clear-btn').style.display =
        completed > 0 ? 'inline' : 'none';
}

function clearCompleted() {
    tasks = tasks.filter(t => !t.done); // remove all done tasks
    renderTasks();
}


// ============================================================
//  STEP 9 — EVENT LISTENERS
//  These "listen" for user actions and call our functions
// ============================================================

// When user clicks the "+ Add" button
addBtn.addEventListener('click', addTask);

// When user presses Enter key inside the input box
taskInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});


// ============================================================
//  STEP 10 — FIRST RENDER
//  Draw the list once when the page loads
// ============================================================

renderTasks();