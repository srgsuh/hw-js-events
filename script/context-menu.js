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