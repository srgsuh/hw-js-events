const STYLES = {
    mouseOver: "mouse-over",
    mouseOut: "mouse-out",
    crossed: "crossed-off",
    uncrossed: "uncrossed-off",
};

const MESSAGES = {
    defaultCounterText : "No symbols entered",
    counterTextPattern : "%count %symbols entered",
};

function switchElementStyles(element, styleOne, styleTwo) {
    if (element.classList.contains(styleOne)) {
        element.classList.remove(styleOne);
        element.classList.add(styleTwo);
    }
    else {
        element.classList.remove(styleTwo);
        element.classList.add(styleOne);
    }
}

function createTaskTextSpan(taskText) {
    const span = document.createElement("span");
    span.textContent = taskText;
    span.classList.add("task-text");
    return span;
}

function createActionIcon(imgPath, action) {
    const img = document.createElement("img");
    img.src = imgPath;
    img.alt = img.title = action.label;
    img.addEventListener("click", action.onClick);
    return img;
}

function setCustomContextMenu(event, menuManager, menuId, actions) {
    event.preventDefault();
    event.stopPropagation();
    menuManager.show(menuId, event.pageX, event.pageY, actions);
}

function createTaskElement(taskText, menuManager, menuId) {
    const li = document.createElement("li");
    li.classList.add(STYLES.uncrossed,STYLES.mouseOut);
    li.appendChild(createTaskTextSpan(taskText));
    const actionCross = {label: "Toggle crossed on/off", onClick: () => switchElementStyles(li, STYLES.uncrossed, STYLES.crossed)};
    const actionRemove = {label: "Remove from the list", onClick: () => li.remove()};
    li.appendChild(createActionIcon("../img/pencil.svg",actionCross));
    li.appendChild(createActionIcon("../img/trash.svg", actionRemove));
    const mouseHandler = () => switchElementStyles(li, STYLES.mouseOver, STYLES.mouseOut);
    li.addEventListener("mouseover", mouseHandler);
    li.addEventListener("mouseout", mouseHandler);

    li.addEventListener("contextmenu",
        (event) => setCustomContextMenu(event, menuManager, menuId, [actionCross, actionRemove]));
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
        () => addTaskElement(taskList, taskInput, charCounter, menuManager, "button-add")
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
