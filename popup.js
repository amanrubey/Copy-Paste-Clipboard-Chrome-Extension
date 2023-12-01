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

function restoreTodoList() {
  const todoListContainer = document.getElementById('todoList');

  chrome.storage.sync.get({ todoList: [] }, function (data) {
    const todoList = data.todoList;
    todoListContainer.innerHTML = '';

    todoList.forEach(function (task, index) {
      const listItem = document.createElement('li');
      listItem.textContent = task;

      listItem.addEventListener('click', function () {
        copyToClipboard(task);
      });

      const buttonsContainer = document.createElement('div');
      buttonsContainer.className = 'buttons';

      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', function (event) {
        event.stopPropagation();
        deleteTask(index);
      });

      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.textContent = 'Copy';
      copyButton.addEventListener('click', function (event) {
        event.stopPropagation();
        copyToClipboard(task);
      });
      
      buttonsContainer.appendChild(copyButton);
      buttonsContainer.appendChild(deleteButton);

      listItem.appendChild(buttonsContainer);
      todoListContainer.appendChild(listItem);
    });
  });
}
