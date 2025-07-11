import { LitElement, html, css } from "https://unpkg.com/lit-element/lit-element.js?module";

class AlertCardEditor extends LitElement {
  setConfig(config) {
    this._config = config;
    this._currentTab = 0;
  }

  static get properties() {
    return {
      hass: { attribute: false },
      _config: { state: true },
    };
  }

  _deleteStateEntity(idx) {
    if (!this._config) return;

    this._config.entities.splice(idx, 1);
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
  }

  _moveStateEntity(idx, pos) {
    if (!this._config) return;

    [this._config.entities[idx], this._config.entities[idx + pos]] = [
      this._config.entities[idx + pos],
      this._config.entities[idx],
    ];
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
  }

  _addEntityState() {
    if (!this._config) return;

    this._config.entities.push({ type: "template" });
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config } }));
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) {
      return;
    }

    const event = new CustomEvent("config-changed", {
      detail: { config: ev.detail.value },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  _valueChangedEntity(entity, ev) {
    if (!this._config || !this.hass) {
      return;
    }

    const entities = [...this._config.entities];
    entities[entity] = ev.detail.value;
    this._config.entities = entities;

    const event = new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  _getEntitySchema(item) {
    let baseSchema = [
      {
        name: "type",
        label: "State Type",
        selector: {
          select: {
            multiple: false,
            mode: "dropdown",
            options: [
              { label: "Entity", value: "entity" },
              { label: "Template", value: "template" },
            ],
          },
        },
      },
      {
        type: "grid",
        name: "",
        schema: [
          {
            name: "icon",
            label: "Icon On",
            required: true,
            selector: { icon: {} },
            context: { icon_entity: "entity" },
          },
          {
            name: "icon_off",
            label: "Icon Off",
            selector: { icon: {} },
            context: { icon_entity: "entity" },
          },
        ],
      },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "color_on", label: "Color On", selector: { text: {} } },
          { name: "color_off", label: "Color Off", selector: { text: {} } },
        ],
      },
    ];
    const templateSchema = [
      {
        name: "condition",
        label: "Template Condition",
        required: true,
        selector: { template: {} },
      },
    ];

    const entitySchema = [
      { name: "entity", label: "Entity", required: true, selector: { entity: {} } },
      { name: "on_state", label: "On State", required: true, selector: { text: {} } },
    ];

    if (item.type === "template") {
      baseSchema.push(...templateSchema);
    }

    if (item.type === "entity") {
      baseSchema.push(...entitySchema);
    }

    const shouldExpand =
      (item.type == "template" && item.condition == undefined) ||
      (item.type == "entity" && item.entity == undefined);
    return [
      {
        type: "expandable",
        expanded: shouldExpand,
        name: "",
        title: `State: ${item.type}`,
        schema: baseSchema,
      },
    ];
  }

  _renderEntities() {
    if (this._config.entities === undefined) {
      this._config.entities = [];
    }

    return html`
      ${this._config.entities?.map(
        (entity, entity_idx) => html`
          <div class="box">
            <div class="toolbar">
              <mwc-icon-button
                .disabled=${entity_idx === 0}
                @click=${() => this._moveStateEntity(entity_idx, -1)}>
                <ha-icon .icon=${"mdi:arrow-up"}></ha-icon>
              </mwc-icon-button>
              <mwc-icon-button
                .disabled=${entity_idx === this._config.entities.length - 1}
                @click=${() => this._moveStateEntity(entity_idx, 1)}>
                <ha-icon .icon=${"mdi:arrow-down"}></ha-icon>
              </mwc-icon-button>
              <mwc-icon-button @click=${() => this._deleteStateEntity(entity_idx)}>
                <ha-icon .icon=${"mdi:close"}></ha-icon>
              </mwc-icon-button>

              <ha-form
                .hass=${this.hass}
                .schema=${this._getEntitySchema(entity)}
                .data=${entity}
                .computeLabel=${(s) => s.label ?? s.name}
                @value-changed=${(ev) => this._valueChangedEntity(entity_idx, ev)}></ha-form>
            </div>
          </div>
        `,
      )}
    `;
  }

  // The render() function of a LitElement returns the HTML of your card, and any time one or the
  // properties defined above are updated, the correct parts of the rendered html are magically
  // replaced with the new values.  Check https://lit.dev for more info.
  render() {
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${[
          { name: "entity", label: "Entity", required: true, selector: { entity: {} } },
          {
            type: "expandable",
            title: "Content",
            expanded: true,
            schema: [
              { name: "title", label: "Title", required: true, selector: { text: {} } },
              { name: "image", label: "Image URL", required: true, selector: { text: {} } },
              {
                name: "icon_bg_color",
                label: "Icon background color",
                selector: { text: {} },
                default: "#f5f3eb",
              },
              {
                name: "state_field",
                label: "State Field",
                selector: {
                  select: {
                    mode: "dropdown",
                    options: [
                      { value: "state", label: "State" },
                      { value: "last_changed", label: "Last Changed" },
                      { value: "last_updated", label: "Last Updated" },
                      { value: "entity_id", label: "Entity ID" },
                    ],
                  },
                },
              },
            ],
          },
          {
            type: "expandable",
            title: "Interactions",
            expanded: false,
            schema: [
              { name: "tap_action", label: "Tap Action", selector: { "ui-action": {} } },
              { name: "hold_action", label: "Hold Action", selector: { "ui-action": {} } },
              {
                name: "double_tap_action",
                label: "Double Tap Action",
                selector: { "ui-action": {} },
              },
            ],
          },
        ]}
        .computeLabel=${(s) => s.label ?? s.name}
        @value-changed=${this._valueChanged}></ha-form>
    `;
  }
}

customElements.define("alert-card-editor", AlertCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "alert-card",
  name: "Alert Card",
  preview: false, // Optional - defaults to false
  description: "Display the state of a room at a glance", // Optional
  documentationURL: "https://github.com/patrickfnielsen/hass-alert-card", // Adds a help link in the frontend card editor
});
