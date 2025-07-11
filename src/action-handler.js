// Copied from custom-card-helpers/dist/action-handler.js
export const ACTION_HANDLER_EVENT = "action";

export function actionHandler(options) {
  return (element) => {
    if (element.actionHandler) {
      element.actionHandler.update(options);
      return;
    }
    element.actionHandler = new ActionHandler(element, options);
  };
}

class ActionHandler {
  constructor(element, options) {
    this.element = element;
    this.options = options;
    this.handleEvent = this.handleEvent.bind(this);
    this.startKeyPressTimer = this.startKeyPressTimer.bind(this);
    this.cancel = this.cancel.bind(this);
    this.element.addEventListener("touchstart", this.startKeyPressTimer, { passive: true });
    this.element.addEventListener("touchend", this.cancel, { passive: true });
    this.element.addEventListener("touchcancel", this.cancel, { passive: true });
    this.element.addEventListener("mousedown", this.startKeyPressTimer, { passive: true });
    this.element.addEventListener("mouseup", this.cancel, { passive: true });
    this.element.addEventListener("mouseleave", this.cancel, { passive: true });
    this.element.addEventListener("click", this.handleEvent, { passive: false });
    this.element.addEventListener("contextmenu", this.handleEvent, { passive: false });
    this.element.addEventListener("keydown", this.handleEvent, { passive: false });
    this.element.addEventListener("keyup", this.cancel, { passive: true });
  }

  update(options) {
    this.options = options;
  }

  handleEvent(ev) {
    if (ev.type === "click" && ev.detail === 2) {
      this.fire("double_tap", ev);
    } else if (
      ev.type === "contextmenu" ||
      (ev.type === "keydown" && ev.key === "Enter" && ev.shiftKey)
    ) {
      this.fire("hold", ev);
    } else if (ev.type === "click") {
      this.fire("tap", ev);
    }
  }

  startKeyPressTimer(ev) {
    if (this.keyPressTimer) {
      clearTimeout(this.keyPressTimer);
    }
    this.keyPressTimer = setTimeout(() => {
      this.fire("hold", ev);
    }, 500);
  }

  cancel() {
    if (this.keyPressTimer) {
      clearTimeout(this.keyPressTimer);
      this.keyPressTimer = null;
    }
  }

  fire(action, ev) {
    this.element.dispatchEvent(
      new CustomEvent(ACTION_HANDLER_EVENT, {
        detail: { action },
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
    ev.preventDefault();
  }
}
