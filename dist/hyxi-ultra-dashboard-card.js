class HyxiUltraDashboardCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  setConfig(config) {
    this.config = config || {};
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <ha-card style="
        padding: 24px;
        border-radius: 22px;
        background: linear-gradient(145deg, #020814, #061a32);
        color: #dffbff;
        border: 1px solid rgba(0,200,255,0.8);
        box-shadow: 0 0 20px rgba(0,180,255,0.6);
        font-family: Arial, sans-serif;
      ">
        <h2 style="margin:0 0 12px 0;">🔋 HYXi Ultra Dashboard Card</h2>
        <div>Custom card loaded successfully.</div>
        <div style="margin-top:12px;color:#66ff7a;">
          Serial: ${this.config.serial || "123456789"}
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return 3;
  }

  static getStubConfig() {
    return {
      serial: "123456789"
    };
  }
}

if (!customElements.get("hyxi-ultra-dashboard-card")) {
  customElements.define("hyxi-ultra-dashboard-card", HyxiUltraDashboardCard);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "hyxi-ultra-dashboard-card",
  name: "HYXi Ultra Dashboard Card",
  description: "HYXi test custom card.",
});
