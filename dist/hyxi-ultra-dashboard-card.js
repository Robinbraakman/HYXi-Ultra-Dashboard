class HyxiUltraDashboardCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  setConfig(config) {
    this.config = {
      serial: "123456789",
      language: "en",
      capacity: 9.2,
      investment: 2222.99,
      electricity_price: 0.22568,
      feed_in_price: 0.10,
      extra_benefit: 33.38,
      start_date: "2026-05-01",

      image: "/hacsfiles/HYXi-Ultra-Dashboard/hyxihalopgnnieuw.png",

      charged_correction: 0,
      discharged_correction: 0,

      ...config,
    };
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  getEntityValue(entity, fallback = 0) {
    const state = this._hass?.states?.[entity]?.state;
    const value = parseFloat(state);
    return Number.isFinite(value) ? value : fallback;
  }

  getEntities() {
    const serial = this.config.serial || "123456789";

    return {
      soc: this.config.entities?.soc || `sensor.hyxi_${serial}_batsoc`,
      charged: this.config.entities?.charged || `sensor.hyxi_${serial}_totalechg`,
      discharged: this.config.entities?.discharged || `sensor.hyxi_${serial}_totaledchg`,
      chargingPower: this.config.entities?.charging_power || `sensor.hyxi_${serial}_bat_charging`,
      dischargingPower: this.config.entities?.discharging_power || `sensor.hyxi_${serial}_bat_discharging`,
    };
  }

  getLabels() {
    const nl = this.config.language === "nl";

    return {
      title: nl ? "🔋 HYXI BATTERIJ ULTRA DASHBOARD" : "🔋 HYXI BATTERY ULTRA DASHBOARD",
      mode: nl ? "Modus" : "Mode",
      standby: nl ? "Stand-by" : "Standby",
      charging: nl ? "Laden" : "Charging",
      discharging: nl ? "Ontladen" : "Discharging",
      inBattery: nl ? "In accu" : "In battery",
      max: "Max",
      efficiency: nl ? "Rendement" : "Efficiency",
      score: "Score",
      total: nl ? "💎 TOTAAL" : "💎 TOTAL",
      charged: nl ? "⚡ Geladen" : "⚡ Charged",
      discharged: nl ? "🔌 Ontladen" : "🔌 Discharged",
      live: "⚡ LIVE",
      performance: nl ? "📊 PRESTATIE" : "📊 PERFORMANCE",
      cycles: nl ? "Cycli" : "Cycles",
      loss: nl ? "Verlies" : "Loss",
      savings: nl ? "💰 WINST" : "💰 SAVINGS",
      totalSavings: nl ? "Winst totaal" : "Total savings",
      currentSavings: nl ? "Winst nu/uur indicatie" : "Current savings/hour estimate",
      payback: nl ? "⏳ TERUGVERDIEN" : "⏳ PAYBACK",
      paidBack: nl ? "Terugverdiend" : "Paid back",
      of: nl ? "van" : "of",
      years: nl ? "jaar" : "years",
      currentlyInBattery: nl ? "Actueel in accu" : "Currently in battery",
    };
  }

  render() {
    if (!this._hass || !this.config) return;

    const entities = this.getEntities();
    const labels = this.getLabels();

    const soc = this.getEntityValue(entities.soc);

    const chargedRaw = this.getEntityValue(entities.charged);
    const dischargedRaw = this.getEntityValue(entities.discharged);

    const chargedCorrection = Number(this.config.charged_correction || 0);
    const dischargedCorrection = Number(this.config.discharged_correction || 0);

    const charged = Math.max(0, chargedRaw - chargedCorrection);
    const discharged = Math.max(0, dischargedRaw - dischargedCorrection);

    const chargingPower = this.getEntityValue(entities.chargingPower);
    const dischargingPower = this.getEntityValue(entities.dischargingPower);

    const capacity = Number(this.config.capacity || 9.2);
    const currentKwh = capacity * (soc / 100);

    const loss = Math.max(0, charged - discharged);
    const efficiency = charged > 0 ? Math.min((discharged / charged) * 100, 100) : 0;
    const cycles = capacity > 0 ? discharged / capacity : 0;

    const electricityPrice = Number(this.config.electricity_price || 0);
    const feedInPrice = Number(this.config.feed_in_price || 0);
    const benefit = electricityPrice - feedInPrice;

    const totalSavings = discharged * benefit;
    const currentSavings = (dischargingPower / 1000) * benefit;

    const investment = Number(this.config.investment || 0);
    const extraBenefit = Number(this.config.extra_benefit || 0);
    const paidBack = totalSavings + extraBenefit;
    const paybackPercent = investment > 0 ? Math.max(0, Math.min((paidBack / investment) * 100, 100)) : 0;

    const start = new Date(`${this.config.start_date}T00:00:00`);
    const days = Math.max((new Date() - start) / 86400000, 0);
    const yearlyForecast = days > 0 ? (paidBack / days) * 365 : 0;
    const paybackYears = yearlyForecast > 0 ? investment / yearlyForecast : 0;

    let mode = labels.standby;
    let modeIcon = "⏸️";
    let pulseClass = "idle";

    if (chargingPower > 5) {
      mode = labels.charging;
      modeIcon = "⚡";
      pulseClass = "charging";
    } else if (dischargingPower > 5) {
      mode = labels.discharging;
      modeIcon = "🔌";
      pulseClass = "discharging";
    }

    let score = "C";
    if (efficiency >= 85) score = "A+";
    else if (efficiency >= 75) score = "A";
    else if (efficiency >= 65) score = "B";

    const socSafe = Math.max(0, Math.min(soc, 100));
    const socDeg = socSafe * 3.6;
    const fill = Math.max(8, socSafe);
    const image = this.config.image || "/hacsfiles/HYXi-Ultra-Dashboard/hyxihalopgnnieuw.png";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        ha-card {
          width: 100%;
          box-sizing: border-box;
          border-radius: 26px;
          padding: 22px;
          background: linear-gradient(145deg, rgba(4,8,20,0.98), rgba(8,16,34,0.94));
          border: 1px solid rgba(0,200,255,0.75);
          border-left: 4px solid rgba(102,255,122,0.95);
          box-shadow:
            0 0 16px rgba(0,180,255,0.75),
            inset 0 0 22px rgba(0,80,255,0.32),
            0 0 28px rgba(102,255,122,0.24);
          color: #9eeeff;
          overflow: hidden;
          animation: ultraGlow 4s ease-in-out infinite;
        }

        .title {
          color: #dffbff;
          font-size: 24px;
          font-weight: 900;
          text-transform: uppercase;
          text-shadow: 0 0 10px rgba(0,180,255,0.9);
          margin-bottom: 14px;
        }

        .dashboard {
          display: grid;
          grid-template-columns: minmax(330px, 1.8fr) 1fr 1fr 1fr 1fr 1.1fr 1.05fr;
          gap: 16px;
          align-items: stretch;
          width: 100%;
        }

        .main {
          display: grid;
          grid-template-columns: 170px 1fr;
          gap: 18px;
          align-items: center;
        }

        .hyxi {
          position: relative;
          width: 155px;
          height: 230px;
          margin: 0 auto;
          filter: drop-shadow(0 0 18px rgba(0,180,255,0.55));
        }

        .hyxi-device-img {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 150px;
          height: auto;
          transform: translate(-50%, -50%);
          object-fit: contain;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          z-index: 2;
          filter:
            drop-shadow(0 0 11px rgba(0,180,255,0.42))
            drop-shadow(0 0 18px rgba(102,255,122,0.14));
        }

        .hyxi-logo-led {
          position: absolute;
          z-index: 15;
          left: 30px;
          top: 18px;
          width: 18px;
          height: 19px;
          border-radius: 50%;
          pointer-events: none;
          background:
            conic-gradient(
              from -90deg,
              #66ff7a 0deg ${socDeg}deg,
              rgba(0,229,255,0.24) ${socDeg}deg 360deg
            );
          -webkit-mask:
            radial-gradient(
              farthest-side,
              transparent 0 calc(100% - 3px),
              #000 calc(100% - 2px) calc(100% - 1px),
              transparent 100%
            );
          mask:
            radial-gradient(
              farthest-side,
              transparent 0 calc(100% - 3px),
              #000 calc(100% - 2px) calc(100% - 1px),
              transparent 100%
            );
          filter:
            drop-shadow(0 0 3px rgba(0,229,255,0.95))
            drop-shadow(0 0 5px rgba(102,255,122,0.75));
        }

        .hyxi-logo-led::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 50%;
          background:
            conic-gradient(
              from -90deg,
              transparent 0deg,
              transparent 270deg,
              rgba(255,255,255,1) 300deg,
              #66ff7a 326deg,
              #00e5ff 342deg,
              transparent 360deg
            );
          -webkit-mask:
            radial-gradient(
              farthest-side,
              transparent 0 calc(100% - 4px),
              #000 calc(100% - 3px) calc(100% - 1px),
              transparent 100%
            );
          mask:
            radial-gradient(
              farthest-side,
              transparent 0 calc(100% - 4px),
              #000 calc(100% - 3px) calc(100% - 1px),
              transparent 100%
            );
          opacity: 0;
        }

        .hyxi-logo-led.charging {
          filter:
            drop-shadow(0 0 4px rgba(0,229,255,1))
            drop-shadow(0 0 7px rgba(102,255,122,0.9));
        }

        .hyxi-logo-led.charging::before {
          opacity: 1;
          animation: ledRingClockwise 1.1s linear infinite;
        }

        .hyxi-logo-led.discharging {
          background:
            conic-gradient(
              from -90deg,
              #ff9b35 0deg ${socDeg}deg,
              rgba(255,155,53,0.22) ${socDeg}deg 360deg
            );
          filter:
            drop-shadow(0 0 4px rgba(255,155,53,1))
            drop-shadow(0 0 7px rgba(255,120,0,0.9));
        }

        .hyxi-logo-led.discharging::before {
          opacity: 1;
          background:
            conic-gradient(
              from -90deg,
              transparent 0deg,
              transparent 270deg,
              rgba(255,255,255,1) 300deg,
              #ff9b35 326deg,
              #ff5c00 342deg,
              transparent 360deg
            );
          animation: ledRingCounterClockwise 1.1s linear infinite;
        }

        .hyxi-logo-led.idle {
          opacity: .82;
        }

        .hyxi-soc-overlay {
          position: absolute;
          left: 40%;
          top: 47%;
          transform: translate(-50%, -50%);
          width: 69px;
          height: 52px;
          border-radius: 11px;
          background: rgba(4,8,20,0.58);
          border: 1px solid rgba(158,238,255,0.24);
          box-shadow:
            inset 0 0 14px rgba(0,80,255,0.28),
            0 0 12px rgba(0,180,255,0.34);
          backdrop-filter: blur(2px);
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .hyxi-soc {
          color: #dffbff;
          font-size: 24px;
          font-weight: 900;
          line-height: 1;
          text-shadow: 0 0 14px rgba(0,180,255,0.95);
        }

        .hyxi-label {
          color: #9eeeff;
          font-size: 8px;
          font-weight: 900;
          margin-top: 2px;
        }

        .hyxi-mode {
          color: ${pulseClass === "discharging" ? "#ff9b35" : "#66ff7a"};
          font-size: 7px;
          font-weight: 900;
          margin-top: 3px;
          text-shadow: 0 0 8px ${pulseClass === "discharging" ? "rgba(255,155,53,0.8)" : "rgba(102,255,122,0.8)"};
        }

        .flow-arrow {
          position: absolute;
          top: 96px;
          font-size: 24px;
          font-weight: 900;
          opacity: 0;
          z-index: 10;
        }

        .left-arrow {
          left: -35px;
          color: #66ff7a;
          text-shadow: 0 0 10px rgba(102,255,122,0.95);
        }

        .right-arrow {
          right: -35px;
          color: #00bfff;
          text-shadow: 0 0 10px rgba(0,180,255,0.95);
        }

        .hyxi.charging .left-arrow {
          opacity: 1;
          animation: arrowIn 1.1s linear infinite;
        }

        .hyxi.discharging .right-arrow {
          opacity: 1;
          color: #ff9b35;
          text-shadow: 0 0 10px rgba(255,155,53,0.95);
          animation: arrowOut 1.1s linear infinite;
        }

        .status {
          color: #dffbff;
          line-height: 1.85;
          text-align: left;
          font-size: 14px;
        }

        .section {
          border-left: 1px solid rgba(158,238,255,0.38);
          padding: 8px 14px;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 6px;
        }

        .section-title {
          font-weight: 900;
          color: #9eeeff;
          text-shadow: 0 0 8px rgba(0,180,255,0.75);
        }

        .section-sub {
          color: #9eeeff;
          font-size: 14px;
        }

        .blue,
        .orange,
        .green {
          font-size: 27px;
          font-weight: 900;
        }

        .blue {
          color: #00bfff;
          text-shadow: 0 0 12px rgba(0,180,255,0.9);
        }

        .orange {
          color: #ff9b35;
          text-shadow: 0 0 12px rgba(255,120,0,0.9);
        }

        .green {
          color: #66ff7a;
          text-shadow: 0 0 12px rgba(102,255,122,0.8);
        }

        .small {
          font-size: 21px;
        }

        .divider {
          width: 82%;
          height: 1px;
          background: rgba(158,238,255,0.25);
          margin: 5px auto;
        }

        .battery-graphic {
          width: 88px;
          height: 134px;
          position: relative;
          margin: 0 auto 8px;
          filter: drop-shadow(0 0 16px rgba(102,255,122,0.55));
        }

        .battery-top {
          width: 32px;
          height: 10px;
          border: 2px solid rgba(158,238,255,0.75);
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          margin: 0 auto;
        }

        .battery-body {
          width: 78px;
          height: 118px;
          margin: 0 auto;
          border: 2px solid rgba(158,238,255,0.85);
          border-radius: 14px;
          position: relative;
          overflow: hidden;
          background: rgba(4,8,20,0.92);
          box-shadow: inset 0 0 20px rgba(0,180,255,0.32), 0 0 12px rgba(0,180,255,0.65);
        }

        .battery-fill {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: ${fill}%;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.28), rgba(102,255,122,0.88), rgba(0,255,80,0.64));
          box-shadow: 0 0 18px rgba(102,255,122,0.8);
        }

        .bolt {
          position: absolute;
          top: 32px;
          left: 0;
          right: 0;
          text-align: center;
          color: ${pulseClass === "discharging" ? "#ff9b35" : "#66ff7a"};
          font-size: 44px;
          text-shadow: 0 0 14px currentColor;
        }

        .payback-bar {
          width: 92%;
          height: 14px;
          border-radius: 20px;
          overflow: hidden;
          background: rgba(158,238,255,0.16);
          border: 1px solid rgba(158,238,255,0.35);
          box-shadow: inset 0 0 10px rgba(0,80,255,0.35);
          margin: 4px auto;
        }

        .payback-fill {
          height: 100%;
          width: ${paybackPercent}%;
          background: linear-gradient(90deg,#00bfff,#66ff7a,#ff9b35);
          box-shadow: 0 0 12px rgba(102,255,122,0.8);
          animation: paybackFlow 3s ease-in-out infinite;
        }

        b {
          color: #9eeeff;
          text-shadow: 0 0 8px rgba(0,180,255,0.55);
        }

        @media (max-width: 1300px) {
          .dashboard {
            grid-template-columns: 1fr 1fr;
          }

          .main {
            grid-column: span 2;
          }

          .section {
            border-left: none;
            border-top: 1px solid rgba(158,238,255,0.28);
          }
        }

        @media (max-width: 700px) {
          ha-card {
            padding: 18px;
          }

          .title {
            font-size: 18px;
            text-align: center;
          }

          .dashboard {
            grid-template-columns: 1fr;
          }

          .main {
            grid-template-columns: 1fr;
            grid-column: span 1;
            text-align: center;
          }

          .status {
            text-align: center;
          }

          .section {
            border-left: none;
            border-top: 1px solid rgba(158,238,255,0.28);
          }

          .blue,
          .orange,
          .green {
            font-size: 22px;
          }
        }

        @keyframes ultraGlow {
          0%,100% {
            box-shadow:
              0 0 16px rgba(0,180,255,0.75),
              inset 0 0 22px rgba(0,80,255,0.32),
              0 0 28px rgba(102,255,122,0.24);
          }
          50% {
            box-shadow:
              0 0 30px rgba(0,180,255,1),
              inset 0 0 30px rgba(0,80,255,0.55),
              0 0 42px rgba(102,255,122,0.45);
          }
        }

        @keyframes ledRingClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes ledRingCounterClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        @keyframes arrowIn {
          0% { transform: translateX(-8px); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translateX(8px); opacity: 0; }
        }

        @keyframes arrowOut {
          0% { transform: translateX(-8px); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translateX(8px); opacity: 0; }
        }

        @keyframes paybackFlow {
          0%,100% { filter: brightness(1); }
          50% { filter: brightness(1.35); }
        }
      </style>

      <ha-card>
        <div class="title">${labels.title}</div>

        <div class="dashboard">
          <div class="main">
            <div class="hyxi ${pulseClass}">
              <img class="hyxi-device-img" src="${image}" alt="HYXI battery">

              <div class="hyxi-logo-led ${pulseClass}"></div>

              <div class="hyxi-soc-overlay">
                <div class="hyxi-soc">${soc.toFixed(0)}%</div>
                <div class="hyxi-label">SOC</div>
                <div class="hyxi-mode">${mode.toUpperCase()}</div>
              </div>

              <div class="flow-arrow left-arrow">❯❯</div>
              <div class="flow-arrow right-arrow">❯❯</div>
            </div>

            <div class="status">
              ${modeIcon} ${labels.mode}: <b>${mode}</b><br>
              🟢 ${labels.inBattery}: <b>${currentKwh.toFixed(2)} kWh</b><br>
              🔋 ${labels.max}: <b>${capacity.toFixed(1)} kWh</b><br>
              📈 ${labels.efficiency}: <b>${efficiency.toFixed(1)}%</b><br>
              🏆 ${labels.score}: <b>${score}</b>
            </div>
          </div>

          <div class="section">
            <div class="section-title">${labels.total}</div>
            <div class="section-sub">${labels.charged}</div>
            <div class="blue">${charged.toFixed(1)} kWh</div>
            <div class="divider"></div>
            <div class="section-sub">${labels.discharged}</div>
            <div class="orange">${discharged.toFixed(1)} kWh</div>
          </div>

          <div class="section">
            <div class="section-title">${labels.live}</div>
            <div class="section-sub">${labels.charging}</div>
            <div class="blue">${chargingPower.toFixed(0)} W</div>
            <div class="divider"></div>
            <div class="section-sub">${labels.discharging}</div>
            <div class="orange">${dischargingPower.toFixed(0)} W</div>
          </div>

          <div class="section">
            <div class="section-title">${labels.performance}</div>
            <div class="section-sub">${labels.cycles}</div>
            <div class="blue">${cycles.toFixed(1)}</div>
            <div class="divider"></div>
            <div class="section-sub">${labels.loss}</div>
            <div class="orange">${loss.toFixed(1)} kWh</div>
          </div>

          <div class="section">
            <div class="section-title">${labels.savings}</div>
            <div class="section-sub">${labels.totalSavings}</div>
            <div class="green">€ ${totalSavings.toFixed(0)}</div>
            <div class="divider"></div>
            <div class="section-sub">${labels.currentSavings}</div>
            <div class="green small">€ ${currentSavings.toFixed(2)}</div>
          </div>

          <div class="section">
            <div class="section-title">${labels.payback}</div>
            <div class="section-sub">${labels.paidBack}</div>
            <div class="orange">€ ${paidBack.toFixed(0)}</div>
            <div class="payback-bar"><div class="payback-fill"></div></div>
            <div class="section-sub">${paybackPercent.toFixed(1)}% ${labels.of} € ${investment}</div>
            <div class="orange small">${paybackYears.toFixed(1)} ${labels.years}</div>
          </div>

          <div class="section">
            <div class="battery-graphic">
              <div class="battery-top"></div>
              <div class="battery-body">
                <div class="battery-fill"></div>
                <div class="bolt">⚡</div>
              </div>
            </div>
            <div class="section-sub">${labels.currentlyInBattery}</div>
            <div class="blue">${currentKwh.toFixed(2)} kWh</div>
          </div>
        </div>
      </ha-card>
    `;
  }

  getGridOptions() {
    return {
      columns: 12,
      rows: 4,
      min_columns: 4,
      min_rows: 3,
    };
  }

  getCardSize() {
    return 6;
  }

  static getStubConfig() {
    return {
      serial: "123456789",
      capacity: 9.2,
      investment: 2222.99,
      electricity_price: 0.22568,
      feed_in_price: 0.10,
      extra_benefit: 33.38,
      start_date: "2026-05-01",
      language: "en",
      image: "/hacsfiles/HYXi-Ultra-Dashboard/hyxihalopgnnieuw.png",
      charged_correction: 0,
      discharged_correction: 0,
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
  description: "A neon dashboard card for HYXi HALO battery systems with bundled image, dynamic LED ring and SOC overlay.",
});
