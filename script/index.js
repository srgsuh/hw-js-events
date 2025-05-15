const STYLES = {
    liMouseOver: {
        backgroundColor: "#f0f0f0",
    },
    liDefault: {
        backgroundColor: "#fff",
    },
};
function applyStyle(element, style) {
    Object.assign(element.style, style);
}

function createTaskElement(taskText) {
    const li = document.createElement("li");
    li.textContent = taskText;
    li.addEventListener("mouseover", () => applyStyle(li, STYLES.liMouseOver));
    li.addEventListener("mouseout", () => applyStyle(li, STYLES.liDefault));
    return li;
}

function addTask(taskList, taskText) {
    if (taskText.trim() !== "") {
        const li = createTaskElement(taskText.trim());
        taskList.appendChild(li);
        return true;
    }
    return false;
}

function updateCharCounter(taskInput, charCounter) {
    const length = taskInput.value.length === 0 ? "No" : "" + taskInput.value.length;
    const symbolText = taskInput.value.length === 1? "symbol" : "symbols";
    charCounter.textContent = `${length} ${symbolText} entered.`;
}

document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const addButton = document.getElementById("addButton");
    const charCounter = document.getElementById("charCounter");

    if (!taskInput || !taskList || !addButton || !charCounter) {
        console.error("DOM elements not found!");
        return;
    }
    addButton.addEventListener("click", () => {
        if (addTask(taskList, taskInput.value)) {
            taskInput.value = "";
            updateCharCounter(taskInput, charCounter)
        }
    });

    taskInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            if (addTask(taskList, taskInput.value)) {
                taskInput.value = "";
                updateCharCounter(taskInput, charCounter)
            }
        }
    });

    addButton.addEventListener("contextmenu", (event    ) => {
        event.preventDefault();
        alert("Right-clicking is not available for this button!");
    });

    taskInput.addEventListener("input", () => updateCharCounter(taskInput, charCounter));
});
