import { LitElement, html, css } from "https://unpkg.com/lit-element/lit-element.js?module";
import { actionHandler } from "./action-handler.js";
import "./alert-card-editor.js";

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
    this.addEventListener("action", this._handleAction.bind(this));
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
    return html`
      <ha-card
        @click=${(e) => {
          console.log("ha-card clicked");
          // Fallback: manually dispatch action event if actionHandler is not working
          if (!e.detail || !e.detail.action) {
            this.dispatchEvent(
              new CustomEvent("action", {
                detail: { action: "tap" },
                bubbles: true,
                composed: true,
              }),
            );
          }
        }}
        .actionHandler=${actionHandler({
          hasHold: !!this._config.hold_action,
          hasDoubleClick: !!this._config.double_tap_action,
        })}
        tabindex="0">
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
    console.log("Action event received", ev);
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
      // Use Home Assistant's handleAction helper if available
      if (window.handleAction) {
        window.handleAction(this, this.hass, this._config, action);
      } else {
        // Fallback for more-info
        if (configAction.action === "more-info" && this._config.entity) {
          this.dispatchEvent(
            new CustomEvent("hass-more-info", {
              detail: { entityId: this._config.entity },
              bubbles: true,
              composed: true,
            }),
          );
        } else if (configAction.action === "call-service" && configAction.service) {
          const [domain, service] = configAction.service.split(".");
          this.hass.callService(domain, service, configAction.data || {}, configAction.target);
        } else {
          // fallback: fire hass-action event for other custom actions
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
  }

  static get styles() {
    return css`
      :host,
      .type-custom-alert-card {
        overflow: hidden;
      }

      .title {
        font-size: 1.2rem;
        font-weight: 800;
        letter-spacing: 0.5px;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
        line-height: 1;
        color: var(--primary-text-color, #241d21);
        white-space: inherit;
      }

      .state {
        font-size: 16px;
        font-weight: 400;
        line-height: 1;
      }

      .container {
        display: flex;
        flex-direction: column;
        padding: 20px 26px;
        border-radius: var(--ha-card-border-radius, 14px);
        background-color: var(--ha-card-background, #f3ebf5);
      }
      .container:hover {
        background-color: var(--secondary-background-color, rgb(239, 226, 243));
        cursor: pointer;
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
        pointer-events: none;
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
  `%c Notification Card %c ${__CARD_VERSION__}`,
  "color: white; background: #039be5; font-weight: 700;",
  "color: #039be5; background: white; font-weight: 700;",
);
