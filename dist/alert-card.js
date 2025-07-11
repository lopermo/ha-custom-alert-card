import{LitElement as t,html as e,css as i}from"https://unpkg.com/lit-element/lit-element.js?module";customElements.define("alert-card-editor",class extends t{setConfig(t){this._config=t,this._currentTab=0}static get properties(){return{hass:{attribute:!1},_config:{state:!0}}}_deleteStateEntity(t){this._config&&(this._config.entities.splice(t,1),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config}})))}_moveStateEntity(t,e){this._config&&([this._config.entities[t],this._config.entities[t+e]]=[this._config.entities[t+e],this._config.entities[t]],this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config}})))}_addEntityState(){this._config&&(this._config.entities.push({type:"template"}),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config}})))}_valueChanged(t){if(!this._config||!this.hass)return;const e=new CustomEvent("config-changed",{detail:{config:t.detail.value},bubbles:!0,composed:!0});this.dispatchEvent(e)}_valueChangedEntity(t,e){if(!this._config||!this.hass)return;const i=[...this._config.entities];i[t]=e.detail.value,this._config.entities=i;const n=new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0});this.dispatchEvent(n)}_getEntitySchema(t){let e=[{name:"type",label:"State Type",selector:{select:{multiple:!1,mode:"dropdown",options:[{label:"Entity",value:"entity"},{label:"Template",value:"template"}]}}},{type:"grid",name:"",schema:[{name:"icon",label:"Icon On",required:!0,selector:{icon:{}},context:{icon_entity:"entity"}},{name:"icon_off",label:"Icon Off",selector:{icon:{}},context:{icon_entity:"entity"}}]},{type:"grid",name:"",schema:[{name:"color_on",label:"Color On",selector:{text:{}}},{name:"color_off",label:"Color Off",selector:{text:{}}}]}];const i=[{name:"condition",label:"Template Condition",required:!0,selector:{template:{}}}],n=[{name:"entity",label:"Entity",required:!0,selector:{entity:{}}},{name:"on_state",label:"On State",required:!0,selector:{text:{}}}];"template"===t.type&&e.push(...i),"entity"===t.type&&e.push(...n);return[{type:"expandable",expanded:"template"==t.type&&null==t.condition||"entity"==t.type&&null==t.entity,name:"",title:`State: ${t.type}`,schema:e}]}_renderEntities(){return void 0===this._config.entities&&(this._config.entities=[]),e`
      ${this._config.entities?.map((t,i)=>e`
          <div class="box">
            <div class="toolbar">
              <mwc-icon-button
                .disabled=${0===i}
                @click=${()=>this._moveStateEntity(i,-1)}>
                <ha-icon .icon=${"mdi:arrow-up"}></ha-icon>
              </mwc-icon-button>
              <mwc-icon-button
                .disabled=${i===this._config.entities.length-1}
                @click=${()=>this._moveStateEntity(i,1)}>
                <ha-icon .icon=${"mdi:arrow-down"}></ha-icon>
              </mwc-icon-button>
              <mwc-icon-button @click=${()=>this._deleteStateEntity(i)}>
                <ha-icon .icon=${"mdi:close"}></ha-icon>
              </mwc-icon-button>

              <ha-form
                .hass=${this.hass}
                .schema=${this._getEntitySchema(t)}
                .data=${t}
                .computeLabel=${t=>t.label??t.name}
                @value-changed=${t=>this._valueChangedEntity(i,t)}></ha-form>
            </div>
          </div>
        `)}
    `}render(){return e`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${[{name:"entity",label:"Entity",required:!0,selector:{entity:{}}},{type:"expandable",title:"Content",expanded:!0,schema:[{name:"title",label:"Title",required:!0,selector:{text:{}}},{name:"image",label:"Image URL",required:!0,selector:{text:{}}},{name:"icon_bg_color",label:"Icon background color",selector:{text:{}},default:"#f5f3eb"},{name:"state_field",label:"State Field",selector:{select:{mode:"dropdown",options:[{value:"state",label:"State"},{value:"last_changed",label:"Last Changed"},{value:"last_updated",label:"Last Updated"},{value:"entity_id",label:"Entity ID"}]}}}]},{type:"expandable",title:"Interactions",expanded:!1,schema:[{name:"tap_action",label:"Tap Action",selector:{"ui-action":{}}},{name:"hold_action",label:"Hold Action",selector:{"ui-action":{}}},{name:"double_tap_action",label:"Double Tap Action",selector:{"ui-action":{}}}]}]}
        .computeLabel=${t=>t.label??t.name}
        @value-changed=${this._valueChanged}></ha-form>
    `}}),window.customCards=window.customCards||[],window.customCards.push({type:"alert-card",name:"Alert Card",preview:!1,description:"Display the state of a room at a glance",documentationURL:"https://github.com/patrickfnielsen/hass-alert-card"});customElements.define("alert-card",class extends t{getCardSize(){return 1}static get properties(){return{hass:{attribute:!1},_config:{state:!0}}}constructor(){super(),this._config={}}setConfig(t){if(!t.entity)throw new Error("You need to define an entity");if(!t.title)throw new Error("You need to define a title");if(!t.image)throw new Error("You need to define an image");this._config={...t}}render(){if(!this._config||!this.hass)return e``;const t=this.hass.states[this._config.entity];let i="unknown";if(t){const n=this._config.state_field||"state";if("last_changed"===n||"last_updated"===n){const a=t[n];a&&(i=window.customElements&&customElements.get("ha-relative-time")?e`<ha-relative-time
              .hass=${this.hass}
              .datetime=${a}></ha-relative-time>`:new Date(a).toLocaleString())}else i=t[n]??t.state,"state"!==n&&this._config.state_field||!t.attributes||!t.attributes.unit_of_measurement||(i=`${i} ${t.attributes.unit_of_measurement}`)}const n=window.actionHandler?window.actionHandler({hasHold:!!this._config.hold_action,hasDoubleClick:!!this._config.double_tap_action}):void 0;return e`
      <ha-card @action=${this._handleAction} .actionHandler=${n} tabindex="0">
        <div class="container">
          <div class="circle" style="background-color: ${this._config.icon_bg_color||"#f5f3eb"};">
            <img class="image" src="${this._config.image}" />
          </div>
          <div class="content">
            <span class="title">${this._config.title}</span>
            <span class="state">${i}</span>
          </div>
        </div>
      </ha-card>
    `}_handleAction(t){if(!this._config||!this.hass)return;const e=t.detail.action;let i;"tap"===e?i=this._config.tap_action:"hold"===e?i=this._config.hold_action:"double_tap"===e&&(i=this._config.double_tap_action),i&&(window.handleAction?window.handleAction(this,this.hass,this._config,e):this.dispatchEvent(new CustomEvent("hass-action",{detail:{config:this._config,action:e},bubbles:!0,composed:!0})))}static get styles(){return i`
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
    `}static getConfigElement(){return document.createElement("alert-card-editor")}static getStubConfig(){return{entity:"",title:"",image:""}}}),console.log("%c Notification Card %c 0.0.1","color: white; background: #039be5; font-weight: 700;","color: #039be5; background: white; font-weight: 700;");
//# sourceMappingURL=alert-card.js.map
