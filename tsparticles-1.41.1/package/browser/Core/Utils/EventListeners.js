import { isSsr, itemFromArray } from "../../Utils";
import { Constants } from "./Constants";
function manageListener(element, event, handler, add, options) {
    if (add) {
        let addOptions = { passive: true };
        if (typeof options === "boolean") {
            addOptions.capture = options;
        }
        else if (options !== undefined) {
            addOptions = options;
        }
        element.addEventListener(event, handler, addOptions);
    }
    else {
        const removeOptions = options;
        element.removeEventListener(event, handler, removeOptions);
    }
}
/**
 * Particles container event listeners manager
 * @category Utils
 */
export class EventListeners {
    /**
     * Events listener constructor
     * @param container the calling container
     */
    constructor(container) {
        this.container = container;
        this.canPush = true;
        this.mouseMoveHandler = (e) => this.mouseTouchMove(e);
        this.touchStartHandler = (e) => this.mouseTouchMove(e);
        this.touchMoveHandler = (e) => this.mouseTouchMove(e);
        this.touchEndHandler = () => this.mouseTouchFinish();
        this.mouseLeaveHandler = () => this.mouseTouchFinish();
        this.touchCancelHandler = () => this.mouseTouchFinish();
        this.touchEndClickHandler = (e) => this.mouseTouchClick(e);
        this.mouseUpHandler = (e) => this.mouseTouchClick(e);
        this.mouseDownHandler = () => this.mouseDown();
        this.visibilityChangeHandler = () => this.handleVisibilityChange();
        this.themeChangeHandler = (e) => this.handleThemeChange(e);
        this.oldThemeChangeHandler = (e) => this.handleThemeChange(e);
        this.resizeHandler = () => this.handleWindowResize();
    }
    /**
     * Adding all listeners
     */
    addListeners() {
        this.manageListeners(true);
    }
    /**
     * Removing all listeners
     */
    removeListeners() {
        this.manageListeners(false);
    }
    /**
     * Initializing event listeners
     */
    manageListeners(add) {
        var _a;
        const container = this.container;
        const options = container.actualOptions;
        const detectType = options.interactivity.detectsOn;
        let mouseLeaveEvent = Constants.mouseLeaveEvent;
        /* events target element */
        if (detectType === "window" /* window */) {
            container.interactivity.element = window;
            mouseLeaveEvent = Constants.mouseOutEvent;
        }
        else if (detectType === "parent" /* parent */ && container.canvas.element) {
            const canvasEl = container.canvas.element;
            container.interactivity.element = (_a = canvasEl.parentElement) !== null && _a !== void 0 ? _a : canvasEl.parentNode;
        }
        else {
            container.interactivity.element = container.canvas.element;
        }
        const mediaMatch = !isSsr() && typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)");
        if (mediaMatch) {
            if (mediaMatch.addEventListener !== undefined) {
                manageListener(mediaMatch, "change", this.themeChangeHandler, add);
            }
            else if (mediaMatch.addListener !== undefined) {
                if (add) {
                    mediaMatch.addListener(this.oldThemeChangeHandler);
                }
                else {
                    mediaMatch.removeListener(this.oldThemeChangeHandler);
                }
            }
        }
        const interactivityEl = container.interactivity.element;
        /* detect mouse pos - on hover / click event */
        if (!interactivityEl) {
            return;
        }
        const html = interactivityEl;
        if (options.interactivity.events.onHover.enable || options.interactivity.events.onClick.enable) {
            /* el on mousemove */
            manageListener(interactivityEl, Constants.mouseMoveEvent, this.mouseMoveHandler, add);
            /* el on touchstart */
            manageListener(interactivityEl, Constants.touchStartEvent, this.touchStartHandler, add);
            /* el on touchmove */
            manageListener(interactivityEl, Constants.touchMoveEvent, this.touchMoveHandler, add);
            if (!options.interactivity.events.onClick.enable) {
                /* el on touchend */
                manageListener(interactivityEl, Constants.touchEndEvent, this.touchEndHandler, add);
            }
            else {
                manageListener(interactivityEl, Constants.touchEndEvent, this.touchEndClickHandler, add);
                manageListener(interactivityEl, Constants.mouseUpEvent, this.mouseUpHandler, add);
                manageListener(interactivityEl, Constants.mouseDownEvent, this.mouseDownHandler, add);
            }
            /* el on onmouseleave */
            manageListener(interactivityEl, mouseLeaveEvent, this.mouseLeaveHandler, add);
            /* el on touchcancel */
            manageListener(interactivityEl, Constants.touchCancelEvent, this.touchCancelHandler, add);
        }
        if (container.canvas.element) {
            container.canvas.element.style.pointerEvents = html === container.canvas.element ? "initial" : "none";
        }
        if (options.interactivity.events.resize) {
            if (typeof ResizeObserver !== "undefined") {
                if (this.resizeObserver && !add) {
                    if (container.canvas.element) {
                        this.resizeObserver.unobserve(container.canvas.element);
                    }
                    this.resizeObserver.disconnect();
                    delete this.resizeObserver;
                }
                else if (!this.resizeObserver && add && container.canvas.element) {
                    this.resizeObserver = new ResizeObserver((entries) => {
                        const entry = entries.find((e) => e.target === container.canvas.element);
                        if (!entry) {
                            return;
                        }
                        this.handleWindowResize();
                    });
                    this.resizeObserver.observe(container.canvas.element);
                }
            }
            else {
                manageListener(window, Constants.resizeEvent, this.resizeHandler, add);
            }
        }
        if (document) {
            manageListener(document, Constants.visibilityChangeEvent, this.visibilityChangeHandler, add, false);
        }
    }
    handleWindowResize() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
            delete this.resizeTimeout;
        }
        this.resizeTimeout = setTimeout(async () => { var _a; return await ((_a = this.container.canvas) === null || _a === void 0 ? void 0 : _a.windowResize()); }, 500);
    }
    handleVisibilityChange() {
        const container = this.container;
        const options = container.actualOptions;
        this.mouseTouchFinish();
        if (!options.pauseOnBlur) {
            return;
        }
        if (document === null || document === void 0 ? void 0 : document.hidden) {
            container.pageHidden = true;
            container.pause();
        }
        else {
            container.pageHidden = false;
            if (container.getAnimationStatus()) {
                container.play(true);
            }
            else {
                container.draw(true);
            }
        }
    }
    mouseDown() {
        const interactivity = this.container.interactivity;
        if (interactivity) {
            const mouse = interactivity.mouse;
            mouse.clicking = true;
            mouse.downPosition = mouse.position;
        }
    }
    /**
     * Mouse/Touch move event
     * @param e the event arguments
     */
    mouseTouchMove(e) {
        var _a, _b, _c, _d, _e, _f, _g;
        const container = this.container;
        const options = container.actualOptions;
        if (((_a = container.interactivity) === null || _a === void 0 ? void 0 : _a.element) === undefined) {
            return;
        }
        container.interactivity.mouse.inside = true;
        let pos;
        const canvas = container.canvas.element;
        if (e.type.startsWith("mouse")) {
            this.canPush = true;
            const mouseEvent = e;
            if (container.interactivity.element === window) {
                if (canvas) {
                    const clientRect = canvas.getBoundingClientRect();
                    pos = {
                        x: mouseEvent.clientX - clientRect.left,
                        y: mouseEvent.clientY - clientRect.top,
                    };
                }
            }
            else if (options.interactivity.detectsOn === "parent" /* parent */) {
                const source = mouseEvent.target;
                const target = mouseEvent.currentTarget;
                const canvasEl = container.canvas.element;
                if (source && target && canvasEl) {
                    const sourceRect = source.getBoundingClientRect();
                    const targetRect = target.getBoundingClientRect();
                    const canvasRect = canvasEl.getBoundingClientRect();
                    pos = {
                        x: mouseEvent.offsetX + 2 * sourceRect.left - (targetRect.left + canvasRect.left),
                        y: mouseEvent.offsetY + 2 * sourceRect.top - (targetRect.top + canvasRect.top),
                    };
                }
                else {
                    pos = {
                        x: (_b = mouseEvent.offsetX) !== null && _b !== void 0 ? _b : mouseEvent.clientX,
                        y: (_c = mouseEvent.offsetY) !== null && _c !== void 0 ? _c : mouseEvent.clientY,
                    };
                }
            }
            else {
                if (mouseEvent.target === container.canvas.element) {
                    pos = {
                        x: (_d = mouseEvent.offsetX) !== null && _d !== void 0 ? _d : mouseEvent.clientX,
                        y: (_e = mouseEvent.offsetY) !== null && _e !== void 0 ? _e : mouseEvent.clientY,
                    };
                }
            }
        }
        else {
            this.canPush = e.type !== "touchmove";
            const touchEvent = e;
            const lastTouch = touchEvent.touches[touchEvent.touches.length - 1];
            const canvasRect = canvas === null || canvas === void 0 ? void 0 : canvas.getBoundingClientRect();
            pos = {
                x: lastTouch.clientX - ((_f = canvasRect === null || canvasRect === void 0 ? void 0 : canvasRect.left) !== null && _f !== void 0 ? _f : 0),
                y: lastTouch.clientY - ((_g = canvasRect === null || canvasRect === void 0 ? void 0 : canvasRect.top) !== null && _g !== void 0 ? _g : 0),
            };
        }
        const pxRatio = container.retina.pixelRatio;
        if (pos) {
            pos.x *= pxRatio;
            pos.y *= pxRatio;
        }
        container.interactivity.mouse.position = pos;
        container.interactivity.status = Constants.mouseMoveEvent;
    }
    /**
     * Mouse/Touch event finish
     */
    mouseTouchFinish() {
        const interactivity = this.container.interactivity;
        if (interactivity === undefined) {
            return;
        }
        const mouse = interactivity.mouse;
        delete mouse.position;
        delete mouse.clickPosition;
        delete mouse.downPosition;
        interactivity.status = Constants.mouseLeaveEvent;
        mouse.inside = false;
        mouse.clicking = false;
    }
    /**
     * Mouse/Touch click/tap event
     * @param e the click event arguments
     */
    mouseTouchClick(e) {
        const container = this.container;
        const options = container.actualOptions;
        const mouse = container.interactivity.mouse;
        mouse.inside = true;
        let handled = false;
        const mousePosition = mouse.position;
        if (mousePosition === undefined || !options.interactivity.events.onClick.enable) {
            return;
        }
        for (const [, plugin] of container.plugins) {
            if (plugin.clickPositionValid !== undefined) {
                handled = plugin.clickPositionValid(mousePosition);
                if (handled) {
                    break;
                }
            }
        }
        if (!handled) {
            this.doMouseTouchClick(e);
        }
        mouse.clicking = false;
    }
    /**
     * Mouse/Touch click/tap event implementation
     * @param e the click event arguments
     */
    doMouseTouchClick(e) {
        const container = this.container;
        const options = container.actualOptions;
        if (this.canPush) {
            const mousePos = container.interactivity.mouse.position;
            if (mousePos) {
                container.interactivity.mouse.clickPosition = {
                    x: mousePos.x,
                    y: mousePos.y,
                };
            }
            else {
                return;
            }
            container.interactivity.mouse.clickTime = new Date().getTime();
            const onClick = options.interactivity.events.onClick;
            if (onClick.mode instanceof Array) {
                for (const mode of onClick.mode) {
                    this.handleClickMode(mode);
                }
            }
            else {
                this.handleClickMode(onClick.mode);
            }
        }
        if (e.type === "touchend") {
            setTimeout(() => this.mouseTouchFinish(), 500);
        }
    }
    handleThemeChange(e) {
        const mediaEvent = e;
        const themeName = mediaEvent.matches
            ? this.container.options.defaultDarkTheme
            : this.container.options.defaultLightTheme;
        const theme = this.container.options.themes.find((theme) => theme.name === themeName);
        if (theme && theme.default.auto) {
            this.container.loadTheme(themeName);
        }
    }
    handleClickMode(mode) {
        const container = this.container;
        const options = container.actualOptions;
        const pushNb = options.interactivity.modes.push.quantity;
        const removeNb = options.interactivity.modes.remove.quantity;
        switch (mode) {
            case "push" /* push */: {
                if (pushNb > 0) {
                    const pushOptions = options.interactivity.modes.push;
                    const group = itemFromArray([undefined, ...pushOptions.groups]);
                    const groupOptions = group !== undefined ? container.actualOptions.particles.groups[group] : undefined;
                    container.particles.push(pushNb, container.interactivity.mouse, groupOptions, group);
                }
                break;
            }
            case "remove" /* remove */:
                container.particles.removeQuantity(removeNb);
                break;
            case "bubble" /* bubble */:
                container.bubble.clicking = true;
                break;
            case "repulse" /* repulse */:
                container.repulse.clicking = true;
                container.repulse.count = 0;
                for (const particle of container.repulse.particles) {
                    particle.velocity.setTo(particle.initialVelocity);
                }
                container.repulse.particles = [];
                container.repulse.finish = false;
                setTimeout(() => {
                    if (!container.destroyed) {
                        container.repulse.clicking = false;
                    }
                }, options.interactivity.modes.repulse.duration * 1000);
                break;
            case "attract" /* attract */:
                container.attract.clicking = true;
                container.attract.count = 0;
                for (const particle of container.attract.particles) {
                    particle.velocity.setTo(particle.initialVelocity);
                }
                container.attract.particles = [];
                container.attract.finish = false;
                setTimeout(() => {
                    if (!container.destroyed) {
                        container.attract.clicking = false;
                    }
                }, options.interactivity.modes.attract.duration * 1000);
                break;
            case "pause" /* pause */:
                if (container.getAnimationStatus()) {
                    container.pause();
                }
                else {
                    container.play();
                }
                break;
        }
        for (const [, plugin] of container.plugins) {
            if (plugin.handleClickMode) {
                plugin.handleClickMode(mode);
            }
        }
    }
}
