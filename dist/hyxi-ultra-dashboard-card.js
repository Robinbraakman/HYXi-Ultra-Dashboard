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
    const charged = this.getEntityValue(entities.charged);
    const discharged = this.getEntityValue(entities.discharged);
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
          grid-template-columns: 180px 1fr;
          gap: 22px;
          align-items: center;
        }

        .hyxi {
          position: relative;
          width: 172px;
          height: 238px;
          margin: 0 auto;
          transform: perspective(480px) rotateY(-9deg);
          filter:
            drop-shadow(0 0 18px rgba(0,180,255,0.58))
            drop-shadow(0 0 24px rgba(102,255,122,0.18));
        }

        .hyxi.charging {
          animation: haloChargePulse 1.8s ease-in-out infinite;
        }

        .hyxi.discharging {
          animation: haloDischargePulse 1.8s ease-in-out infinite;
        }

        .halo-shadow {
          position: absolute;
          left: 16px;
          right: 14px;
          bottom: -8px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(0,180,255,0.35), transparent 70%);
          filter: blur(5px);
          z-index: 0;
        }

        .side {
          position: absolute;
          right: 9px;
          top: 13px;
          width: 44px;
          height: 215px;
          border-radius: 0 10px 16px 0;
          background:
            linear-gradient(90deg, rgba(28,34,36,1), rgba(73,82,84,0.98) 44%, rgba(21,25,27,1));
          border: 1px solid rgba(130,150,150,0.28);
          box-shadow:
            inset -10px 0 16px rgba(0,0,0,0.55),
            inset 4px 0 8px rgba(255,255,255,0.05),
            0 0 12px rgba(0,180,255,0.22);
          z-index: 1;
        }

        .side::before {
          content: "";
          position: absolute;
          top: 18px;
          right: 7px;
          width: 10px;
          height: 176px;
          border-radius: 8px;
          background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(0,0,0,0.18));
          opacity: .55;
        }

        .front {
          position: absolute;
          left: 0;
          top: 0;
          width: 138px;
          height: 238px;
          border-radius: 7px 7px 16px 16px;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.08), transparent 18%, transparent 78%, rgba(0,0,0,0.33)),
            linear-gradient(180deg, rgba(73,82,84,0.98), rgba(41,49,52,0.99) 38%, rgba(24,29,31,1));
          border: 1px solid rgba(170,190,190,0.30);
          box-shadow:
            0 0 19px rgba(0,180,255,0.48),
            inset 10px 0 16px rgba(255,255,255,0.06),
            inset -14px 0 18px rgba(0,0,0,0.46),
            0 0 26px rgba(102,255,122,0.14);
          overflow: hidden;
          z-index: 3;
        }

        .front::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 50px;
          height: 64px;
          background: repeating-linear-gradient(
            180deg,
            rgba(6,8,9,0.86) 0px,
            rgba(6,8,9,0.86) 3px,
            rgba(95,110,110,0.25) 5px,
            rgba(95,110,110,0.25) 8px
          );
          box-shadow:
            inset 0 0 16px rgba(0,0,0,0.65),
            0 1px 0 rgba(255,255,255,0.04);
        }

        .front::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(120deg, rgba(255,255,255,0.14), transparent 16%, transparent 80%, rgba(255,255,255,0.04)),
            radial-gradient(circle at 28% 18%, rgba(102,255,122,0.12), transparent 20%);
          pointer-events: none;
          z-index: 12;
        }

        .logo-ring {
          position: absolute;
          left: 16px;
          top: 15px;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background:
            radial-gradient(circle at center, rgba(32,42,44,1) 0 44%, transparent 45%),
            conic-gradient(from -90deg, #66ff7a 0 ${socDeg}deg, rgba(0,229,255,0.18) ${socDeg}deg 360deg);
          box-shadow:
            0 0 14px rgba(102,255,122,0.85),
            0 0 18px rgba(0,229,255,0.45),
            inset 0 0 8px rgba(0,0,0,0.5);
          z-index: 10;
        }

        .logo {
          position: absolute;
          inset: 7px;
          border-radius: 50%;
          background: rgba(24,34,36,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #dffbff;
          font-size: 10px;
          font-weight: 900;
          text-shadow: 0 0 6px rgba(0,200,255,0.9);
        }

        .grille {
          position: absolute;
          left: 10px;
          right: 10px;
          top: 58px;
          height: 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          z-index: 7;
          opacity: .86;
        }

        .grille span {
          height: 2px;
          border-radius: 2px;
          background: rgba(5,7,8,0.86);
          box-shadow:
            0 1px 0 rgba(130,145,145,0.18),
            0 0 3px rgba(0,0,0,0.5);
        }

        .screen {
          position: absolute;
          left: 25px;
          right: 25px;
          bottom: 62px;
          height: 84px;
          border-radius: 9px;
          background:
            linear-gradient(180deg, rgba(5,9,14,0.98), rgba(7,13,18,0.99));
          border: 1px solid rgba(150,230,255,0.18);
          box-shadow:
            inset 0 0 16px rgba(0,0,0,0.72),
            0 0 12px rgba(0,180,255,0.18);
          z-index: 9;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .soc {
          color: #e8fbff;
          font-size: 31px;
          line-height: 1;
          font-weight: 950;
          text-shadow: 0 0 14px rgba(0,180,255,0.95);
        }

        .soc-label {
          color: #dffbff;
          font-size: 12px;
          font-weight: 850;
          margin-top: 4px;
        }

        .mode-label {
          color: ${pulseClass === "discharging" ? "#ff9b35" : "#66ff7a"};
          font-size: 11px;
          font-weight: 950;
          text-shadow: 0 0 8px ${pulseClass === "discharging" ? "rgba(255,155,53,0.8)" : "rgba(102,255,122,0.8)"};
          margin-top: 3px;
        }

        .halo-label {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 24px;
          color: #b7c5c9;
          text-align: center;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: .9px;
          z-index: 10;
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

        .blue, .orange, .green {
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
          filter: drop-shadow(0 0 16px rgba(102,255,122,0.65));
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
          height: ${Math.max(8, socSafe)}%;
          background: linear-gradient(180deg, rgba(255,255,255,0.28), rgba(102,255,122,0.88), rgba(0,255,80,0.64));
          box-shadow: 0 0 18px rgba(102,255,122,0.8);
          animation: energyFlow 2.4s ease-in-out infinite;
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

          .blue, .orange, .green {
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

        @keyframes haloChargePulse {
          0%,100% {
            filter:
              drop-shadow(0 0 18px rgba(0,180,255,0.58))
              drop-shadow(0 0 24px rgba(102,255,122,0.18));
          }
          50% {
            filter:
              drop-shadow(0 0 26px rgba(0,180,255,0.9))
              drop-shadow(0 0 28px rgba(102,255,122,0.55));
          }
        }

        @keyframes haloDischargePulse {
          0%,100% {
            filter:
              drop-shadow(0 0 18px rgba(0,180,255,0.58))
              drop-shadow(0 0 24px rgba(255,155,53,0.16));
          }
          50% {
            filter:
              drop-shadow(0 0 26px rgba(0,180,255,0.9))
              drop-shadow(0 0 28px rgba(255,155,53,0.48));
          }
        }

        @keyframes energyFlow {
          0%,100% { filter: brightness(1); }
          50% { filter: brightness(1.38); }
        }
      </style>

      <ha-card>
        <div class="title">${labels.title}</div>

        <div class="dashboard">
          <div class="main">
            <div class="hyxi ${pulseClass}">
              <div class="halo-shadow"></div>
              <div class="side"></div>
              <div class="front">
                <div class="logo-ring">
                  <div class="logo">HYXi</div>
                </div>

                <div class="grille">
                  ${Array.from({ length: 13 }).map(() => "<span></span>").join("")}
                </div>

                <div class="screen">
                  <div class="soc">${soc.toFixed(0)}%</div>
                  <div class="soc-label">SOC</div>
                  <div class="mode-label">${mode.toUpperCase()}</div>
                </div>

                <div class="halo-label">HALO</div>
              </div>
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
      start_date: "2026-05-01",
      language: "en",
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
  description: "A neon dashboard card for HYXi HALO battery systems.",
});
