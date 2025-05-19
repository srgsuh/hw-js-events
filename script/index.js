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

function createActionIcon(action) {
    const img = document.createElement("img");
    img.src = action.path;
    img.alt = img.title = action.label;
    img.dataset.actionId = action.actionId;
    return img;
}

function createTaskElement(taskText, actions) {
    const li = document.createElement("li");
    li.classList.add(STYLES.uncrossed, STYLES.mouseOut);

    li.appendChild(createTaskTextSpan(taskText));
    actions.forEach(action => li.appendChild(createActionIcon(action)));

    return li;
}

function addTaskElement(taskList, taskInput, charCounter, actions) {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        const li = createTaskElement(taskText, actions);
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

function checkForDomElementsLoaded(elements) {
    const message = elements.filter(([_, element]) => !element)
        .flatMap(([id, _]) => `element with id=${id} is not found`)
        .join(", ");
    if (message !== "") {
        console.error(`There were errors while loading DOM: ${message}`);
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
    const domElements = ["taskInput", "taskList", "addButton", "charCounter"].map(
        str => ([str, document.getElementById(str)]));
    if (!checkForDomElementsLoaded(domElements)) {
        return;
    }
    const [taskInput, taskList, addButton, charCounter]
        = domElements.flatMap(([_, element]) => element);

    const menuManager = new MenuManager();
    menuManager.add("button-add", new ContextMenu("button-add", ["custom-menu"]));
    menuManager.add("task-element", new ContextMenu("task-element", ["custom-menu"]));

    const actions =[
        {
            label: "Toggle crossed on/off",
            actionId: "cross",
            path: "../img/pencil.svg",
            onClick: (event, element) => {switchElementStyles(element, STYLES.uncrossed, STYLES.crossed)},
        },
        {
            label: "Remove from the list",
            actionId: "remove",
            path: "../img/trash.svg",
            onClick: (event, element) => {element.remove()},
        }
    ];
    const actMap = actions.reduce((acc, action) => acc.set(action.actionId, action), new Map());

    initCharCounter(charCounter, taskInput);

    taskList.addEventListener("mouseover", handleMouseOverLi);
    taskList.addEventListener("mouseout", handleMouseOverLi);

    taskList.addEventListener("click", (event) => {
        const li = event.target.closest("li");
        const actionId = event.target.dataset.actionId;
        if (li && actionId && actMap.has(actionId)) {
            actMap.get(actionId).onClick(event, li);
        }
    });

    taskList.addEventListener("contextmenu", (event) => {
        const li = event.target.closest("li");
        if (!li) {
            return;
        }
        const menuActions = actions.map(
            action => (
                {label: action.label, onClick: () => {action.onClick(event, li)}}
            )
        );
        setCustomContextMenu(event, menuManager, "task-element", menuActions);
    })

    addButton.addEventListener("click",
        () => addTaskElement(taskList, taskInput, charCounter, actions)
    );

    taskInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addTaskElement(taskList, taskInput, charCounter, actions);
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
