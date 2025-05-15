const STYLES = {
    liMouseOver: {
        backgroundColor: "#f0f0f0",
    },
    liDefault: {
        backgroundColor: "#fff",
    },
};
const MESSAGES = {
    defaultCounterText : "No symbols entered",
    counterTextPattern : "%count %symbols entered",
}
function applyStyle(element, style) {
    element.style.backgroundColor =  style.backgroundColor;
}

function createTaskElement(taskText) {
    const li = document.createElement("li");
    li.classList.add("task-item");
    li.textContent = taskText;
    li.addEventListener("mouseover", () => applyStyle(li, STYLES.liMouseOver));
    li.addEventListener("mouseout", () => applyStyle(li, STYLES.liDefault));
    return li;
}

function addTaskElement(taskList, taskInput, charCounter) {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        const li = createTaskElement(taskText);
        taskList.appendChild(li);
        taskInput.value = "";
        updateCharCounter(taskInput, charCounter);
    }
}

function updateCharCounter(taskInput, charCounter) {
    if (taskInput.value.length === 0) {
        taskInput.title = charCounter.textContent = MESSAGES.defaultCounterText;
        return;
    }
    taskInput.title = charCounter.textContent = MESSAGES.counterTextPattern
        .replace("%count", taskInput.value.length)
        .replace("%symbols", taskInput.value.length === 1? "symbol" : "symbols");
}

document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const addButton = document.getElementById("addButton");
    const charCounter = document.getElementById("charCounter");

    if (!taskInput || !taskList || !addButton || !charCounter) {
        console.error("DOM elements are not found!");
        return;
    }
    taskInput.title = taskInput.title || MESSAGES.defaultCounterText;
    charCounter.textContent = charCounter.textContent || MESSAGES.defaultCounterText;

    addButton.addEventListener("click",
        () => addTaskElement(taskList, taskInput, charCounter)
    );

    taskInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addTaskElement(taskList, taskInput, charCounter);
        }
    });

    addButton.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        alert("Right-clicking is not available for this button!");
    });

    taskInput.addEventListener("input", () => updateCharCounter(taskInput, charCounter));
});
