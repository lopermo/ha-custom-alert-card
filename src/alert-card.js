import { LitElement, html, css } from "https://unpkg.com/lit-element/lit-element.js?module";
import "./alert-card-editor.js";
const packageInfo = { version: "0.0.1" };

class AlertCard extends LitElement {
  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 1;
  }

  static get properties() {
    return {
      hass: { attribute: false },
      _config: { state: true },
    };
  }

  constructor() {
    super();
    this._config = {};
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error("You need to define an entity");
    }
    if (!config.title) {
      throw new Error("You need to define a title");
    }
    if (!config.image) {
      throw new Error("You need to define an image");
    }
    this._config = { ...config };
  }

  render() {
    if (!this._config || !this.hass) return html``;
    const entityObj = this.hass.states[this._config.entity];
    let state = "unknown";
    if (entityObj) {
      const field = this._config.state_field || "state";
      if (field === "last_changed" || field === "last_updated") {
        const dateStr = entityObj[field];
        if (dateStr) {
          // Use Home Assistant's relativeTime if available
          if (window.customElements && customElements.get("ha-relative-time")) {
            state = html`<ha-relative-time
              .hass=${this.hass}
              .datetime=${dateStr}></ha-relative-time>`;
          } else {
            // Fallback: show raw date string
            state = new Date(dateStr).toLocaleString();
          }
        }
      } else {
        state = entityObj[field] ?? entityObj.state;
        if (
          (field === "state" || !this._config.state_field) &&
          entityObj.attributes &&
          entityObj.attributes.unit_of_measurement
        ) {
          state = `${state} ${entityObj.attributes.unit_of_measurement}`;
        }
      }
    }
    const actionHandlerDirective = window.actionHandler
      ? window.actionHandler({
          hasHold: !!this._config.hold_action,
          hasDoubleClick: !!this._config.double_tap_action,
        })
      : undefined;

    return html`
      <ha-card @action=${this._handleAction} .actionHandler=${actionHandlerDirective} tabindex="0">
        <div class="container">
          <div class="circle" style="background-color: ${this._config.icon_bg_color || "#f5f3eb"};">
            <img class="image" src="${this._config.image}" />
          </div>
          <div class="content">
            <span class="title">${this._config.title}</span>
            <span class="state">${state}</span>
          </div>
        </div>
      </ha-card>
    `;
  }

  _handleAction(ev) {
    if (!this._config || !this.hass) return;
    const action = ev.detail.action;
    let configAction;
    if (action === "tap") {
      configAction = this._config.tap_action;
    } else if (action === "hold") {
      configAction = this._config.hold_action;
    } else if (action === "double_tap") {
      configAction = this._config.double_tap_action;
    }
    if (configAction) {
      // Home Assistant's handleAction helper
      if (window.handleAction) {
        window.handleAction(this, this.hass, this._config, action);
      } else {
        // fallback: fire hass-action event
        this.dispatchEvent(
          new CustomEvent("hass-action", {
            detail: { config: this._config, action },
            bubbles: true,
            composed: true,
          }),
        );
      }
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        overflow: hidden;
      }

      .title {
        font-size: 1.3rem;
        font-weight: 800;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        line-height: 1;
        color: #241d21;
        white-space: inherit;
      }

      .state {
        font-size: 18px;
        font-weight: 400;
      }

      .container {
        display: flex;
        flex-direction: column;
        padding: 20px 26px;
        border-radius: 14px;
        background-color: #f3ebf5;
        min-height: 80px;
      }
      .content {
        padding-left: 80px;
        display: flex;
        flex-direction: column;
        z-index: 4;
      }

      .circle {
        z-index: 0;
        height: 120px;
        width: 120px;
        border-radius: 100%;
        justify-self: center;
        grid-area: bubble;
        position: absolute;
        top: -20px;
        left: -70px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .image {
        height: 80%;
        width: 80%;
        z-index: 1;
        margin-left: 30px;
      }
    `;
  }

  static getConfigElement() {
    return document.createElement("alert-card-editor");
  }

  static getStubConfig() {
    return {
      entity: "",
      title: "",
      image: "",
    };
  }
}

customElements.define("alert-card", AlertCard);

console.log(
  `%c AlertCard %c ${packageInfo.version}`,
  "color: white; background: #039be5; font-weight: 700;",
  "color: #039be5; background: white; font-weight: 700;",
);
