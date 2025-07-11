import{LitElement as e,html as t,css as i}from"https://unpkg.com/lit-element/lit-element.js?module";class n{constructor(e,t){this.element=e,this.options=t,this.handleEvent=this.handleEvent.bind(this),this.startKeyPressTimer=this.startKeyPressTimer.bind(this),this.cancel=this.cancel.bind(this),this.element.addEventListener("touchstart",this.startKeyPressTimer,{passive:!0}),this.element.addEventListener("touchend",this.cancel,{passive:!0}),this.element.addEventListener("touchcancel",this.cancel,{passive:!0}),this.element.addEventListener("mousedown",this.startKeyPressTimer,{passive:!0}),this.element.addEventListener("mouseup",this.cancel,{passive:!0}),this.element.addEventListener("mouseleave",this.cancel,{passive:!0}),this.element.addEventListener("click",this.handleEvent,{passive:!1}),this.element.addEventListener("contextmenu",this.handleEvent,{passive:!1}),this.element.addEventListener("keydown",this.handleEvent,{passive:!1}),this.element.addEventListener("keyup",this.cancel,{passive:!0})}update(e){this.options=e}handleEvent(e){"click"===e.type&&2===e.detail?this.fire("double_tap",e):"contextmenu"===e.type||"keydown"===e.type&&"Enter"===e.key&&e.shiftKey?this.fire("hold",e):"click"===e.type&&this.fire("tap",e)}startKeyPressTimer(e){this.keyPressTimer&&clearTimeout(this.keyPressTimer),this.keyPressTimer=setTimeout(()=>{this.fire("hold",e)},500)}cancel(){this.keyPressTimer&&(clearTimeout(this.keyPressTimer),this.keyPressTimer=null)}fire(e,t){this.element.dispatchEvent(new CustomEvent("action",{detail:{action:e},bubbles:!0,composed:!0,cancelable:!0})),t.preventDefault()}}customElements.define("alert-card-editor",class extends e{setConfig(e){this._config=e,this._currentTab=0}static get properties(){return{hass:{attribute:!1},_config:{state:!0}}}_deleteStateEntity(e){this._config&&(this._config.entities.splice(e,1),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config}})))}_moveStateEntity(e,t){this._config&&([this._config.entities[e],this._config.entities[e+t]]=[this._config.entities[e+t],this._config.entities[e]],this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config}})))}_addEntityState(){this._config&&(this._config.entities.push({type:"template"}),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config}})))}_valueChanged(e){if(!this._config||!this.hass)return;const t=new CustomEvent("config-changed",{detail:{config:e.detail.value},bubbles:!0,composed:!0});this.dispatchEvent(t)}_valueChangedEntity(e,t){if(!this._config||!this.hass)return;const i=[...this._config.entities];i[e]=t.detail.value,this._config.entities=i;const n=new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0});this.dispatchEvent(n)}_getEntitySchema(e){let t=[{name:"type",label:"State Type",selector:{select:{multiple:!1,mode:"dropdown",options:[{label:"Entity",value:"entity"},{label:"Template",value:"template"}]}}},{type:"grid",name:"",schema:[{name:"icon",label:"Icon On",required:!0,selector:{icon:{}},context:{icon_entity:"entity"}},{name:"icon_off",label:"Icon Off",selector:{icon:{}},context:{icon_entity:"entity"}}]},{type:"grid",name:"",schema:[{name:"color_on",label:"Color On",selector:{text:{}}},{name:"color_off",label:"Color Off",selector:{text:{}}}]}];const i=[{name:"condition",label:"Template Condition",required:!0,selector:{template:{}}}],n=[{name:"entity",label:"Entity",required:!0,selector:{entity:{}}},{name:"on_state",label:"On State",required:!0,selector:{text:{}}}];"template"===e.type&&t.push(...i),"entity"===e.type&&t.push(...n);return[{type:"expandable",expanded:"template"==e.type&&null==e.condition||"entity"==e.type&&null==e.entity,name:"",title:`State: ${e.type}`,schema:t}]}_renderEntities(){return void 0===this._config.entities&&(this._config.entities=[]),t`
      ${this._config.entities?.map((e,i)=>t`
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
                .schema=${this._getEntitySchema(e)}
                .data=${e}
                .computeLabel=${e=>e.label??e.name}
                @value-changed=${e=>this._valueChangedEntity(i,e)}></ha-form>
            </div>
          </div>
        `)}
    `}render(){return t`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${[{name:"entity",label:"Entity",required:!0,selector:{entity:{}}},{type:"expandable",title:"Content",expanded:!0,schema:[{name:"title",label:"Title",required:!0,selector:{text:{}}},{name:"image",label:"Image URL",required:!0,selector:{text:{}}},{name:"icon_bg_color",label:"Icon background color",selector:{text:{}},default:"#f5f3eb"},{name:"state_field",label:"State Field",selector:{select:{mode:"dropdown",options:[{value:"state",label:"State"},{value:"last_changed",label:"Last Changed"},{value:"last_updated",label:"Last Updated"},{value:"entity_id",label:"Entity ID"}]}}}]},{type:"expandable",title:"Interactions",expanded:!1,schema:[{name:"tap_action",label:"Tap Action",selector:{"ui-action":{}}},{name:"hold_action",label:"Hold Action",selector:{"ui-action":{}}},{name:"double_tap_action",label:"Double Tap Action",selector:{"ui-action":{}}}]}]}
        .computeLabel=${e=>e.label??e.name}
        @value-changed=${this._valueChanged}></ha-form>
    `}}),window.customCards=window.customCards||[],window.customCards.push({type:"alert-card",name:"Alert Card",preview:!1,description:"Display the state of a room at a glance",documentationURL:"https://github.com/patrickfnielsen/hass-alert-card"});customElements.define("alert-card",class extends e{getCardSize(){return 1}static get properties(){return{hass:{attribute:!1},_config:{state:!0}}}constructor(){super(),this._config={},this.addEventListener("action",this._handleAction.bind(this))}setConfig(e){if(!e.entity)throw new Error("You need to define an entity");if(!e.title)throw new Error("You need to define a title");if(!e.image)throw new Error("You need to define an image");this._config={...e}}render(){if(!this._config||!this.hass)return t``;const e=this.hass.states[this._config.entity];let i="unknown";if(e){const n=this._config.state_field||"state";if("last_changed"===n||"last_updated"===n){const s=e[n];s&&(i=window.customElements&&customElements.get("ha-relative-time")?t`<ha-relative-time
              .hass=${this.hass}
              .datetime=${s}></ha-relative-time>`:new Date(s).toLocaleString())}else i=e[n]??e.state,"state"!==n&&this._config.state_field||!e.attributes||!e.attributes.unit_of_measurement||(i=`${i} ${e.attributes.unit_of_measurement}`)}return t`
      <ha-card
        @click=${e=>{console.log("ha-card clicked"),e.detail&&e.detail.action||this.dispatchEvent(new CustomEvent("action",{detail:{action:"tap"},bubbles:!0,composed:!0}))}}
        .actionHandler=${s={hasHold:!!this._config.hold_action,hasDoubleClick:!!this._config.double_tap_action},e=>{e.actionHandler?e.actionHandler.update(s):e.actionHandler=new n(e,s)}}
        tabindex="0">
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
    `;var s}_handleAction(e){if(console.log("Action event received",e),!this._config||!this.hass)return;const t=e.detail.action;let i;if("tap"===t?i=this._config.tap_action:"hold"===t?i=this._config.hold_action:"double_tap"===t&&(i=this._config.double_tap_action),i)if(window.handleAction)window.handleAction(this,this.hass,this._config,t);else if("more-info"===i.action&&this._config.entity)this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:this._config.entity},bubbles:!0,composed:!0}));else if("call-service"===i.action&&i.service){const[e,t]=i.service.split(".");this.hass.callService(e,t,i.data||{},i.target)}else this.dispatchEvent(new CustomEvent("hass-action",{detail:{config:this._config,action:t},bubbles:!0,composed:!0}))}static get styles(){return i`
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
    `}static getConfigElement(){return document.createElement("alert-card-editor")}static getStubConfig(){return{entity:"",title:"",image:""}}}),console.log("%c Notification Card %c 0.1.0","color: white; background: #039be5; font-weight: 700;","color: #039be5; background: white; font-weight: 700;");
//# sourceMappingURL=alert-card.js.map
