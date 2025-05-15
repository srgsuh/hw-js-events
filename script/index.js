document.addEventListener("DOMContentLoaded", () => addEventListeners())

function addEventListeners() {
    const addButton = document.getElementById('addButton');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    addButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const taskItem = document.createElement('li');
            taskItem.appendChild(document.createTextNode(taskText));
            taskList.appendChild(taskItem);
            taskInput.value = '';
        }
    });
}