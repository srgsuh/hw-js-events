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
    element.style.backgroundColor =  style.backgroundColor || element.style.backgroundColor;
    element.style.textDecoration = style.textDecoration || element.style.textDecoration;
}

function createTaskTextSpan(taskText) {
    const span = document.createElement("span");
    span.textContent = taskText;
    span.classList.add("task-text");
    return span;
}

function createActionIcon(imgPath, imgAlt, onClick) {
    const img = document.createElement("img");
    img.src = imgPath;
    img.alt = img.title = imgAlt;
    img.addEventListener("click", onClick);
    return img;
}

function setCustomContextMenu(event, menuManager, menuId, actions) {
    event.preventDefault();
    event.stopPropagation();
    menuManager.show(menuId, event.pageX, event.pageY, actions);
}

function createTaskElement(taskText, menuManager, menuId) {
    const li = document.createElement("li");
    li.appendChild(createTaskTextSpan(taskText));
    li.appendChild(createActionIcon("../img/pencil.svg",
            "Cross off the list",
            () => toggleCrossedOff(li)
    ));
    li.appendChild(createActionIcon("../img/trash.svg",
        "Remove from the list",
        ()=> li.remove()
    ));
    li.addEventListener("mouseover", () => applyStyle(li, STYLES.liMouseOver));
    li.addEventListener("mouseout", () => applyStyle(li, STYLES.liDefault));
    li.addEventListener("contextmenu",
        (event) => setCustomContextMenu(
            event, menuManager, menuId, [
        {label: "Cross off the list", onClick: () => toggleCrossedOff(li)},
        {label: "Remove from the list", onClick: () => li.remove()},
    ]));
    return li;
}

function addTaskElement(taskList, taskInput, charCounter, menuManager, menuId) {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        const li = createTaskElement(taskText, menuManager, menuId);
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

function toggleCrossedOff(taskElement) {
    if (taskElement.classList.contains("crossed-off")) {
        taskElement.classList.remove("crossed-off");
        taskElement.classList.add("uncrossed-off");
    }
    else {
        taskElement.classList.remove("uncrossed-off");
        taskElement.classList.add("crossed-off");
    }
}

function handleAddBtnRightClick(event, manager, mId, taskInput, charCounter, taskList) {
    setCustomContextMenu(event, manager, mId, [
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
    const menuManager = new MenuManager();
    menuManager.add("button-add", new ContextMenu("button-add", ["custom-menu"]));
    menuManager.add("task-element", new ContextMenu("task-element", ["custom-menu"]));
    initCharCounter(charCounter, taskInput);

    addButton.addEventListener("click",
        () => addTaskElement(taskList, taskInput, charCounter, menuManager.get("task-element"))
    );

    taskInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addTaskElement(taskList, taskInput, charCounter, menuManager, "task-element");
        }
    });

    addButton.addEventListener("contextmenu", (event) => {
        handleAddBtnRightClick(event, menuManager, "button-add", taskInput, charCounter, taskList);
    });

    taskInput.addEventListener("input", () => updateCharCounter(taskInput, charCounter));

    // menus
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            menuManager.hideAll();
        }
    });
    document.addEventListener("click", (event) => {
        if (event.button === 0) {
            menuManager.hideAll();
        }
    });
    document.addEventListener("contextmenu", () => {
        menuManager.hideAll();
    });
    window.addEventListener('resize', () => {
        menuManager.hideAll();
    });
});
