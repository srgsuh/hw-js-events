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

const customMenuManager = new MenuManager();

function applyStyle(element, style) {
    element.style.backgroundColor =  style.backgroundColor;
}

function createTaskTextSpan(taskText) {
    const span = document.createElement("span");
    span.textContent = taskText;
    span.classList.add("task-text");
    return span;
}

function createSvg(imgPath, imgAlt) {
    const img = document.createElement("img");
    img.src = imgPath;
    img.alt = img.title = imgAlt;
    return img;
}

function createTaskElement(taskText) {
    const li = document.createElement("li");
    li.appendChild(createTaskTextSpan(taskText));
    li.appendChild(createSvg("../img/pencil.svg", "Cross off the list"));
    li.appendChild(createSvg("../img/trash.svg", "Remove from the list"));
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

function clearInput(taskInput, charCounter) {
    taskInput.value = "";
    updateCharCounter(taskInput, charCounter);
}

function showTasksCount(taskList) {
    alert(`There are ${taskList.childElementCount} tasks in the list.`);
}

function handleAddBtnRightClick(event, menuToShow, taskInput, charCounter, taskList) {
    event.preventDefault();
    event.stopPropagation();
    menuToShow.show(event.pageX, event.pageY,[
        {   label: "Clear input",
            onClick: () => clearInput(taskInput, charCounter),
            className: "menu-item",
        },
        {
            label: "Count tasks",
            onClick: () => showTasksCount(taskList),
            className: "menu-item",
        },
    ]);
}

customMenuManager.add("button-add", new ContextMenu("button-add", ["custom-menu"]));

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
        handleAddBtnRightClick(event, customMenuManager.get("button-add"), taskInput, charCounter, taskList);
    });

    // menus
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            customMenuManager.hideAll();
        }
    });
    document.addEventListener("click", (event) => {
        if (event.button === 0) {
            customMenuManager.hideAll();
        }
    });
    document.addEventListener("contextmenu", (event) => {
        customMenuManager.hideAll();
    });
    window.addEventListener('resize', () => {
        customMenuManager.hideAll();
    });

    taskInput.addEventListener("input", () => updateCharCounter(taskInput, charCounter));
});
