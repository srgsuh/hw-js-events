class MenuManager {
    _menus;
    constructor() {
        this._menus = new Map();
    }
    get(menuId) {
        return this._menus.get(menuId);
    }
    add(menuId, menu) {
        this._menus.set(menuId, menu);
    }
    hideAll() {
        this._menus.forEach(menu => menu.hide());
    }
    show(menuId, x, y, actions) {
        const menu = this._menus.get(menuId);
        if (menu) {
            this.hideAll();
            menu.show(x, y, actions);
        }
    }
    hide(menuId) {
        const menu = this._menus.get(menuId);
        if (menu) {
            menu.hide();
        }
    }
}

class ContextMenu {
    constructor(menuId, classList) {
        if (!menuId) {
            throw new Error("Menu id is not defined!");
        }
        this.menuId = menuId;
        this.menu = this._initContextMenu(menuId, classList);
    }

    _initContextMenu(menuId, classList) {
        let menu = document.getElementById(menuId);
        if (!menu) {
            menu = document.createElement("div");
            menu.id = menuId;
            if (classList) {
                classList.forEach(className => menu.classList.add(className));
            }
            menu.hidden = true;
            document.body.appendChild(menu);
        }
        return menu;
    }

    hide() {
        this.menu.hidden = true;
    }

    show(x, y, actions) {
        let menu = this.menu;
        menu.innerHTML = "";
        actions.forEach(action => {
            const button = document.createElement("button");
            button.textContent = action.label;
            button.addEventListener("click", () => {
                action.onClick();
                this.hide();
            });
            button.className = action.className;
            menu.appendChild(button);
        });
        menu.hidden = false;
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
    }
}