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
        taskInput.title = charCounter.textContent = charCounter.defaultValue;
        return;
    }
    taskInput.title = charCounter.textContent = charCounter.counterTextPattern
        .replace("%count", taskInput.value.length)
        .replace("%symbols", taskInput.value.length === 1? "symbol" : "symbols");
}

function checkForDomElementsLoaded(...elements) {
    if (elements.some(element => !element)) {
        console.error("DOM elements are not found!");
        return false;
    }
    return true;
}

function initCharCounter(charCounter, taskInput) {
    charCounter.defaultValue = MESSAGES.defaultCounterText;
    charCounter.counterTextPattern = MESSAGES.counterTextPattern;
    taskInput.title = charCounter.textContent = charCounter.defaultValue;
}

function handleRightClick(event, taskInput, charCounter, taskList) {
    function showContextMenu(x, y, actions) {
        let menu = getContextMenu();
        menu.innerHTML = "";
        actions.forEach(action => {
            const button = document.createElement("button");
            button.textContent = action.label;
            button.addEventListener("click", action.onClick);
            menu.appendChild(button);
        });
        menu.hidden = false;
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
    }

    function getContextMenu() {
        let menu = document.getElementById("contextMenu");
        if (!menu) {
            menu = document.createElement("div");
            menu.id = "contextMenu";
            menu.classList.add("context-menu");
            menu.hidden = true;
            document.body.appendChild(menu);
        }
        return menu;
    }

    function clearInput(taskInput, charCounter) {
        taskInput.value = "";
        updateCharCounter(taskInput, charCounter);
        hideContextMenu();
    }

    function showTasksCount(taskList) {
        alert(`There are ${taskList.childElementCount} tasks in the list.`);
        hideContextMenu();
    }

    function hideContextMenu() {
        let menu = getContextMenu();
        menu.hidden = true;
    }

    event.preventDefault();
    showContextMenu(event.pageX, event.pageY,[
        {label: "Clear input", onClick: () => clearInput(taskInput, charCounter)},
        {label: "Count tasks", onClick: () => showTasksCount(taskList)},
    ]);
}

document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const addButton = document.getElementById("addButton");
    const charCounter = document.getElementById("charCounter");

    if (!checkForDomElementsLoaded(taskInput, taskList, addButton, charCounter)) {
        return;
    }

    initCharCounter(charCounter, taskInput);

    addButton.addEventListener("click",
        () => addTaskElement(taskList, taskInput, charCounter)
    );

    taskInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addTaskElement(taskList, taskInput, charCounter);
        }
    });

    addButton.addEventListener("contextmenu", (event) => {
        handleRightClick(event, taskInput, charCounter, taskList);
    });

    taskInput.addEventListener("input", () => updateCharCounter(taskInput, charCounter));
});
