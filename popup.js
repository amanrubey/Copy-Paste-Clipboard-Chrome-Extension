document.addEventListener('DOMContentLoaded', function () {
  restoreTodoList();
  document.getElementById('addTaskBtn').addEventListener('click', addTask);
});

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const task = taskInput.value.trim();

  if (task !== '') {
    chrome.storage.sync.get({ todoList: [] }, function (data) {
      const todoList = data.todoList;
      todoList.push(task);

      chrome.storage.sync.set({ todoList: todoList }, function () {
        taskInput.value = '';
        restoreTodoList();
      });
    });
  }
}
document.addEventListener('DOMContentLoaded', function () {
  restoreTodoList();
  
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');

  // Add task when Enter key is pressed
  taskInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      addTask();
    }
  });

  // Add task when the "Add Task" button is clicked
  addTaskBtn.addEventListener('click', addTask);
});


function deleteTask(index) {
  // Ask for confirmation before deletion
  const isConfirmed = confirm('Are you sure you want to delete this task?');

  if (isConfirmed) {
    chrome.storage.sync.get({ todoList: [] }, function (data) {
      const todoList = data.todoList;
      todoList.splice(index, 1);

      chrome.storage.sync.set({ todoList: todoList }, function () {
        restoreTodoList();
      });
    });
  }
}

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);

  alert('Copied to clipboard: ' + text);
}

function showTooltip(event, text) {
  const tooltip = document.getElementById('tooltip');
  tooltip.textContent = text;
  tooltip.style.top = event.clientY + 'px';
  tooltip.style.left = event.clientX + 'px';
  tooltip.style.display = 'block';
}

function hideTooltip() {
  const tooltip = document.getElementById('tooltip');
  tooltip.style.display = 'none';
}

function restoreTodoList() {
  const todoListContainer = document.getElementById('todoList');

  chrome.storage.sync.get({ todoList: [] }, function (data) {
    const todoList = data.todoList;
    todoListContainer.innerHTML = '';

    todoList.forEach(function (task, index) {
      const listItem = document.createElement('li');
      listItem.className = 'task-item';

      const textContainer = document.createElement('div');
      textContainer.className = 'text';

      const text = document.createElement('span');
      text.textContent = task;

      text.addEventListener('mouseenter', function (event) {
        showTooltip(event, task);
      });

      text.addEventListener('mouseleave', function () {
        hideTooltip();
      });

      text.addEventListener('click', function () {
        copyToClipboard(task);
      });

      const buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'buttons';
      todoList.forEach(function (task, index) {
        const listItem = document.createElement('li');
        listItem.textContent = task;
  
        listItem.addEventListener('click', function () {
          copyToClipboard(task);
        });
      })
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; // Trash icon
      deleteButton.addEventListener('click', function (event) {
        event.stopPropagation();
        deleteTask(index);
      });

      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.innerHTML = '<i class="fas fa-copy"></i>'; // Copy icon
      copyButton.addEventListener('click', function (event) {
        event.stopPropagation();
        copyToClipboard(task);
      });

      buttonsContainer.appendChild(deleteButton);
      buttonsContainer.appendChild(copyButton);

      textContainer.appendChild(text);
      listItem.appendChild(textContainer);
      listItem.appendChild(buttonsContainer);
      todoListContainer.appendChild(listItem);
    });
  });
}
document.getElementById('openTodoListBtn').addEventListener('click', function () {
  chrome.tabs.create({ url: 'todo.html' });
});
