const taskFormEl = document.getElementById('TaskForm');
const addTasksInputEl = document.getElementById('AddTasksInput');
const listEl = document.getElementById('list');
const leftItemsNumberEl = document.getElementById('LeftItemsNumber');
const clearCompletedBtn = document.getElementById('ClearCompletedBtn');
const optionsBtns = document.querySelectorAll('.options__button');
const themeToggler = document.getElementById('ThemeToggler');
const getCheckEls = () =>
  document.querySelectorAll('.TaskContainerText__CheckIcon');

let completedElsNumbers = () =>
  document.querySelectorAll('.TaskContainer--isCompleted').length;
let activeElsNumbers = () =>
  document.querySelectorAll('.TaskContainer--isActive').length;
let allElsNumbers = () => document.querySelectorAll('.TaskContainer').length;

let tasksArray = JSON.parse(localStorage.getItem('tasksArray')) || [];

function pushTask(value) {
  tasksArray.push({
    taskTitle: value,
    id: Date.now(),
    isCompleted: false,
  });
}

taskFormEl.addEventListener('submit', (event) => {
  event.preventDefault();
  const taskInputValue = addTasksInputEl.value;
  if (!taskInputValue) {
    return;
  }
  pushTask(taskInputValue);
  saveTasksToLocalStorage('tasksArray', tasksArray);
  displayTasks(tasksArray);
  addTasksInputEl.value = '';
});

function displayTasks(tasksArray) {
  list.innerHTML = '';

  tasksArray.map((task, index) => {
    return (listEl.innerHTML += `
    <li draggable="true" id="${task.id}" class="CustomBar TaskContainer ${
      task.isCompleted
        ? 'TaskContainer--isCompleted'
        : 'TaskContainer--isActive'
    }">
            <div class="TaskContainerText">
              <span 
                class="TaskContainerText__CheckIcon" 
                tabindex="0" 
                onclick="toggleCompletedTask(${index})">  
              </span>
              <p class="TaskContainerText__title">
                ${task.taskTitle}
              </p>
            </div>
            <img
              src="./images/icon-cross.svg"
              alt="Delete task icon"
              class="TaskContainer__crossIcon"
              loading="lazy" 
              onclick="deleteTask(${index})"
            />
        </li>
    `);
  });
  toggleTaskWithKeyboard();
  initDragAndDrop();
}
displayTasks(tasksArray);

function toggleCompletedTask(index) {
  let task = tasksArray[index];
  task.isCompleted = !task.isCompleted;
  saveTasksToLocalStorage('tasksArray', tasksArray);
  displayTasks(tasksArray);
}

function toggleTaskWithKeyboard() {
  getCheckEls().forEach((box, index) => {
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        toggleCompletedTask(index);
      }
    });
  });
}

function deleteTask(index) {
  let taskId = tasksArray[index];

  tasksArray = tasksArray.filter((task) => task.id !== taskId.id);
  saveTasksToLocalStorage('tasksArray', tasksArray);
  displayTasks(tasksArray);
}

clearCompletedBtn.addEventListener('click', (event) => {
  tasksArray = tasksArray.filter((task) => !Object.values(task).every(Boolean));

  saveTasksToLocalStorage('tasksArray', tasksArray);
  displayTasks(tasksArray);
});

const optionsArray = ['all', 'active', 'completed'];

function toggleOptionsBtns(btn, optionValue) {
  localStorage.setItem('option', optionValue);
  toggleOptionsValues();
  if (localStorage.getItem('option') === btn.getAttribute('value')) {
    optionsBtns.forEach((btn) =>
      btn.classList.remove('options__button--active')
    );

    btn.classList.add('options__button--active');
  }
}

function toggleOptionsValues() {
  if (localStorage.getItem('option') === 'all') {
    list.classList.remove('ListContainer--isCompleted');
    list.classList.remove('ListContainer--isActive');
    leftItemsNumberEl.textContent = allElsNumbers();
  } else if (localStorage.getItem('option') === 'active') {
    list.classList.remove('ListContainer--isCompleted');
    list.classList.add('ListContainer--isActive');
    leftItemsNumberEl.textContent = activeElsNumbers();
  } else if (localStorage.getItem('option') === 'completed') {
    list.classList.remove('ListContainer--isActive');
    list.classList.add('ListContainer--isCompleted');

    leftItemsNumberEl.textContent = completedElsNumbers();
  }
}
toggleOptionsValues();

optionsBtns.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    if (event.currentTarget.classList.contains(btn.getAttribute('value'))) {
      toggleOptionsBtns(btn, btn.getAttribute('value'));
    }
  });

  if (localStorage.getItem('option') === btn.getAttribute('value')) {
    optionsBtns.forEach((btn) =>
      btn.classList.remove('options__button--active')
    );

    btn.classList.add('options__button--active');
  }
});

function saveTasksToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

let mode = 'sun';

themeToggler.addEventListener('click', (event) => {
  if (mode === 'sun') {
    mode = 'moon';
    localStorage.setItem('mode', 'moon');
    toggleTheme();
  } else if (mode === 'moon') {
    mode = 'sun';
    localStorage.setItem('mode', 'sun');
    toggleTheme();
  }
});

function toggleTheme() {
  if (localStorage.getItem('mode') === null) {
    themeToggler.src = `../images/icon-sun.svg`;
  } else if (localStorage.getItem('mode') === 'moon') {
    document.body.classList.add('LightTheme');
    themeToggler.src = `../images/icon-${localStorage.getItem('mode')}.svg`;
  } else {
    document.body.classList.remove('LightTheme');
    themeToggler.src = `../images/icon-${localStorage.getItem('mode')}.svg`;
  }
}
toggleTheme();

// Function to initialize drag and drop functionality
function initDragAndDrop() {
  // Find all HTML elements with the class 'TaskContainer'
  const taskContainers = document.querySelectorAll('.TaskContainer');

  // For each 'TaskContainer' found, set up event listeners for drag and touch events
  taskContainers.forEach((taskContainer) => {
    taskContainer.addEventListener('dragstart', handleDragStart);
    taskContainer.addEventListener('dragover', handleDragOver);
    taskContainer.addEventListener('dragend', handleDragEnd);
    taskContainer.addEventListener('dragleave', handleDragLeave);
    taskContainer.addEventListener('drop', handleDrop);

    // Add touch events for mobile devices
    taskContainer.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    taskContainer.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    });
    taskContainer.addEventListener('touchend', handleTouchEnd);
  });
}

function handleDragStart(e) {
  // Set the element being dragged
  drag = e.target;
  // Add the 'dragging' class to visually indicate that it's being dragged
  e.target.classList.add('dragging');
}

function handleDragOver(e) {
  // Prevent the default behavior to enable dropping
  e.preventDefault();
  // Get the element over which the dragged item is currently positioned
  const overElement = e.target;

  // If it's a 'TaskContainer', add the 'DragOver' class for visual indication
  if (overElement.classList.contains('TaskContainer')) {
    overElement.classList.add('DragOver');
  }
}

function handleDragEnd(e) {
  // Remove the 'dragging' class when the drag ends
  e.target.classList.remove('dragging');
  // Remove 'DragOver' class from all containers
  const dragoverElements = document.querySelectorAll('.DragOver');
  dragoverElements.forEach((element) => element.classList.remove('DragOver'));
}

function handleDragLeave(e) {
  // Prevent the default behavior to enable dropping
  e.preventDefault();
  // Get the element from which the drag has left
  const overElement = e.target;

  // If it's a 'TaskContainer', remove the 'DragOver' class
  if (overElement.classList.contains('TaskContainer')) {
    overElement.classList.remove('DragOver');
  }
}

function handleDrop(e) {
  // Prevent the default behavior to enable dropping
  e.preventDefault();
  // Get the element where the item is dropped
  const overElement = e.target;

  // If it's a 'TaskContainer'
  if (overElement.classList.contains('TaskContainer')) {
    // Remove 'DragOver' class
    overElement.classList.remove('DragOver');

    // Get the index of the dropped task and the dragged task
    const targetIndex = Array.from(overElement.parentNode.children).indexOf(
      overElement
    );
    const dragIndex = Array.from(overElement.parentNode.children).indexOf(drag);

    // If the positions are different, rearrange the tasks
    if (targetIndex !== dragIndex) {
      const tempArray = [...tasksArray];
      const [dragItem] = tempArray.splice(dragIndex, 1);
      tempArray.splice(targetIndex, 0, dragItem);

      // Update tasksArray and perform necessary actions (e.g., saving to localStorage)
      tasksArray = tempArray;
      saveTasksToLocalStorage('tasksArray', tasksArray);
      displayTasks(tasksArray);
    }
  }
}

let touchStartTarget = null;

function handleTouchStart(e) {
  // Store the initial touch target
  touchStartTarget = e.target;
  // Get touch details
  const touch = e.touches[0];
  // Find the element at the touch position
  drag = document.elementFromPoint(touch.clientX, touch.clientY);
  // Add 'dragging' class for visual indication
  drag.classList.add('dragging');
}

function handleTouchMove(e) {
  // Prevent the default behavior of touch events to enable dropping
  e.preventDefault();

  // Get the details of the touch (position, etc.)
  const touch = e.touches[0];

  // Find the HTML element at the current touch position
  const overElement = document.elementFromPoint(touch.clientX, touch.clientY);

  // Remove 'DragOver' class from all elements
  const allElements = document.querySelectorAll('.TaskContainer');
  allElements.forEach((element) => element.classList.remove('DragOver'));

  // If the element at the touch position is a 'TaskContainer', add the 'DragOver' class for visual indication
  if (overElement && overElement.classList.contains('TaskContainer')) {
    overElement.classList.add('DragOver');
  }
}

function handleTouchEnd(e) {
  // Check if the touch started on a 'TaskContainer'
  if (
    touchStartTarget &&
    touchStartTarget.classList.contains('TaskContainer')
  ) {
    // Find the element at the touch end position
    const touchEndTarget = document.elementFromPoint(
      e.changedTouches[0].clientX,
      e.changedTouches[0].clientY
    );

    // If it's a 'TaskContainer'
    if (touchEndTarget && touchEndTarget.classList.contains('TaskContainer')) {
      // Get the index of the dropped task and the dragged task
      const targetIndex = Array.from(
        touchEndTarget.parentNode.children
      ).indexOf(touchEndTarget);
      const dragIndex = Array.from(drag.parentNode.children).indexOf(drag);

      // If the positions are different, rearrange the tasks
      if (targetIndex !== dragIndex) {
        // Create a temporary array to manipulate task order
        const tempArray = [...tasksArray];
        // Remove the dragged item from its original position
        const [dragItem] = tempArray.splice(dragIndex, 1);
        // Insert the dragged item at the target position
        tempArray.splice(targetIndex, 0, dragItem);

        // Update tasksArray and perform necessary actions
        tasksArray = tempArray;
        saveTasksToLocalStorage('tasksArray', tasksArray);
        displayTasks(tasksArray);
      }
    }

    // Remove 'dragging' class and reset touchStartTarget
    drag.classList.remove('dragging');
    touchStartTarget = null;

    // Remove 'DragOver' class from all containers
    const dragoverElements = document.querySelectorAll('.DragOver');
    dragoverElements.forEach((element) => element.classList.remove('DragOver'));
  }
}
