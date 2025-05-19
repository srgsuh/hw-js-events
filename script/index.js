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

function setCustomContextMenu(event, menuManager, menuId, actions) {
    event.preventDefault();
    event.stopPropagation();
    menuManager.show(menuId, event.pageX, event.pageY, actions);
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
    return img;
}

function createTaskElement(taskText) {
    const li = document.createElement("li");
    li.classList.add(STYLES.uncrossed, STYLES.mouseOut);

    const btnCross = li.appendChild(createActionIcon("../img/pencil.svg",{label: "Toggle crossed on/off"}));
    btnCross.dataset.action = "cross";
    const btnRemove = li.appendChild(createActionIcon("../img/trash.svg", {label: "Remove from the list"}));
    btnRemove.dataset.action = "remove";

    li.appendChild(createTaskTextSpan(taskText));
    li.appendChild(btnCross);
    li.appendChild(btnRemove);

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

function handleAddBtnRightClick(event, manager, mId, taskInput, charCounter, taskList) {
    setCustomContextMenu(event, manager, mId, [
        {label: "Clear input", onClick: () => clearInput(taskInput, charCounter)},
        {label: "Count tasks", onClick: () => showTasksCount(taskList)},
    ]);
}

function handleMouseOverLi(event) {
    const li = event.target.closest("li");
    if (!li) return;
    switchElementStyles(li, STYLES.mouseOut, STYLES.mouseOver);
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

    taskList.addEventListener("mouseover", handleMouseOverLi);

    taskList.addEventListener("mouseout", handleMouseOverLi);

    taskList.addEventListener("click", (event) => {
        const li = event.target.closest("li");
        if (!li) {
            return;
        }
        const action = event.target.dataset.action;
        switch (action) {
            case "cross": {
                switchElementStyles(li, STYLES.uncrossed, STYLES.crossed);
                break;
            }
            case "remove": {
                li.remove();
                break;
            }
        }
    });

    addButton.addEventListener("click",
        () => addTaskElement(taskList, taskInput, charCounter)
    );

    taskInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addTaskElement(taskList, taskInput, charCounter);
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
