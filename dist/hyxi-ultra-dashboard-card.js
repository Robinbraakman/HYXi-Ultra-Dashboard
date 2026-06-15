class HyxiUltraDashboardCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._layout = "compact";
    this.setAttribute("layout", "compact");
  }

  connectedCallback() {
    this._resizeObserver = new ResizeObserver((entries) => {
      const width = entries?.[0]?.contentRect?.width || this.offsetWidth || 0;

      let layout = "compact";

      if (width >= 1350) {
        layout = "wide";
      } else if (width >= 760) {
        layout = "medium";
      }

      if (this._layout !== layout) {
        this._layout = layout;
        this.setAttribute("layout", layout);
      }
    });

    this._resizeObserver.observe(this);
  }

  disconnectedCallback() {
    this._resizeObserver?.disconnect();
  }

  setConfig(config) {
    this.config = {
      serial: "123456789",
      language: null,
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
    const hassLanguage =
      this._hass?.locale?.language ||
      this._hass?.language ||
      "en";

    const language = this.config.language || hassLanguage;
    const nl = String(language).toLowerCase().startsWith("nl");

    return {
      title: nl ? "HYXI BATTERIJ ULTRA DASHBOARD" : "HYXI BATTERY ULTRA DASHBOARD",
      mode: nl ? "Modus" : "Mode",
      standby: nl ? "Stand-by" : "Standby",
      charging: nl ? "Laden" : "Charging",
      discharging: nl ? "Ontladen" : "Discharging",
      inBattery: nl ? "In accu" : "In battery",
      max: "Max",
      efficiency: nl ? "Rendement" : "Efficiency",
      score: "Score",
      total: nl ? "TOTAAL" : "TOTAL",
      charged: nl ? "Geladen" : "Charged",
      discharged: nl ? "Ontladen" : "Discharged",
      live: "LIVE",
      performance: nl ? "PRESTATIE" : "PERFORMANCE",
      cycles: nl ? "Cycli" : "Cycles",
      loss: nl ? "Verlies" : "Loss",
      savings: nl ? "WINST" : "SAVINGS",
      totalSavings: nl ? "Winst totaal" : "Total savings",
      currentSavings: nl ? "Winst nu/uur" : "Current savings/hour",
      payback: nl ? "TERUGVERDIEN" : "PAYBACK",
      paidBack: nl ? "Terugverdiend" : "Paid back",
      of: nl ? "van" : "of",
      years: nl ? "jaar" : "years",
      batteryNow: nl ? "Actueel in accu" : "Currently in battery",
      noSensors: nl ? "Geen HYXi-sensoren gevonden" : "No HYXi sensors found",
    };
  }

  formatNumber(value, decimals = 1) {
    const number = Number(value);
    return Number.isFinite(number) ? number.toFixed(decimals) : "0";
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
    const fill = Math.max(8, socSafe);

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
          border-radius: 28px;
          padding: 0;
          overflow: hidden;
          color: #dffbff;
          background:
            radial-gradient(circle at 18% 8%, rgba(0, 200, 255, 0.16), transparent 32%),
            radial-gradient(circle at 92% 88%, rgba(0, 255, 130, 0.09), transparent 30%),
            linear-gradient(145deg, rgba(2, 8, 20, 0.99), rgba(4, 14, 32, 0.97));
          border: 1px solid rgba(0, 210, 255, 0.90);
          box-shadow:
            0 0 18px rgba(0, 200, 255, 0.72),
            0 0 42px rgba(0, 140, 255, 0.26),
            inset 0 0 26px rgba(0, 80, 255, 0.24);
        }

        .wrap {
          position: relative;
          width: 100%;
          box-sizing: border-box;
          padding: 24px;
        }

        .wrap::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(90deg, transparent, rgba(0, 200, 255, 0.05), transparent),
            repeating-linear-gradient(
              90deg,
              transparent 0,
              transparent 86px,
              rgba(0, 200, 255, 0.022) 88px
            );
          opacity: .55;
        }

        .title {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 22px;
          color: #e9fbff;
          font-weight: 950;
          letter-spacing: .4px;
          text-transform: uppercase;
          font-size: clamp(21px, 2vw, 34px);
          line-height: 1.15;
          text-shadow:
            0 0 10px rgba(0, 200, 255, 0.95),
            0 0 26px rgba(0, 130, 255, 0.72);
        }

        .title-battery {
          width: 18px;
          height: 32px;
          border-radius: 5px;
          border: 2px solid rgba(190, 255, 255, 0.92);
          background: linear-gradient(180deg, #caffd6, #24ff68);
          box-shadow: 0 0 13px rgba(102, 255, 122, 0.82);
          position: relative;
          flex: 0 0 auto;
        }

        .title-battery::before {
          content: "";
          position: absolute;
          top: -7px;
          left: 5px;
          width: 7px;
          height: 5px;
          border-radius: 3px 3px 0 0;
          background: rgba(190, 255, 255, 0.92);
        }

        .content {
          position: relative;
          z-index: 2;
          display: grid;
          gap: 18px;
          min-width: 0;
        }

        .hero {
          min-width: 0;
          display: grid;
          align-items: center;
          gap: 20px;
          padding: 18px;
          border-radius: 22px;
          background: rgba(0, 18, 38, 0.34);
          border: 1px solid rgba(0, 200, 255, 0.23);
          box-shadow:
            inset 0 0 22px rgba(0, 90, 160, 0.16),
            0 0 18px rgba(0, 180, 255, 0.12);
        }

        .halo-device {
          position: relative;
          width: 156px;
          height: 238px;
          margin: 0 auto;
          transform: perspective(450px) rotateY(-8deg);
          filter:
            drop-shadow(0 0 16px rgba(0, 190, 255, 0.45))
            drop-shadow(0 0 22px rgba(0, 255, 120, 0.14));
        }

        .halo-device.charging {
          animation: haloChargePulse 1.8s ease-in-out infinite;
        }

        .halo-device.discharging {
          animation: haloDischargePulse 1.8s ease-in-out infinite;
        }

        .halo-side {
          position: absolute;
          right: 5px;
          top: 10px;
          width: 40px;
          height: 220px;
          border-radius: 4px 14px 16px 4px;
          background: linear-gradient(90deg, #20272b, #3c4448 45%, #151a1d);
          border: 1px solid rgba(140, 170, 170, 0.22);
          box-shadow:
            inset -10px 0 14px rgba(0, 0, 0, 0.52),
            0 0 14px rgba(0, 180, 255, 0.22);
          z-index: 1;
        }

        .halo-front {
          position: absolute;
          left: 0;
          top: 0;
          width: 130px;
          height: 238px;
          border-radius: 7px 7px 16px 16px;
          background:
            linear-gradient(180deg, rgba(68, 78, 80, 0.98), rgba(35, 42, 45, 0.99) 34%, rgba(24, 28, 31, 1));
          border: 1px solid rgba(170, 190, 190, 0.28);
          box-shadow:
            inset 10px 0 15px rgba(255, 255, 255, 0.05),
            inset -12px 0 15px rgba(0, 0, 0, 0.42),
            0 0 22px rgba(0, 200, 255, 0.34);
          overflow: hidden;
          z-index: 3;
        }

        .halo-front::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 52px;
          height: 56px;
          background: repeating-linear-gradient(
            180deg,
            rgba(7, 9, 10, .82) 0,
            rgba(7, 9, 10, .82) 3px,
            rgba(105, 120, 120, .25) 5px,
            rgba(105, 120, 120, .25) 8px
          );
          box-shadow: inset 0 0 16px rgba(0, 0, 0, .62);
        }

        .logo-ring {
          position: absolute;
          left: 16px;
          top: 15px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background:
            radial-gradient(circle at center, rgba(30, 42, 44, 1) 0 45%, transparent 46%),
            conic-gradient(from -90deg, #68ff7e 0 ${socDeg}deg, rgba(0, 229, 255, 0.16) ${socDeg}deg 360deg);
          box-shadow:
            0 0 18px rgba(102, 255, 122, 0.82),
            0 0 22px rgba(0, 220, 255, 0.42),
            inset 0 0 10px rgba(0, 0, 0, 0.5);
          z-index: 8;
        }

        .logo-ring span {
          position: absolute;
          inset: 7px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(25, 34, 36, 0.92);
          color: #dffbff;
          font-size: 10px;
          font-weight: 950;
          text-shadow: 0 0 8px rgba(0, 200, 255, 0.9);
        }

        .device-screen {
          position: absolute;
          left: 23px;
          right: 23px;
          bottom: 60px;
          height: 84px;
          border-radius: 9px;
          background: linear-gradient(180deg, rgba(5, 9, 14, 0.96), rgba(8, 15, 22, 0.98));
          border: 1px solid rgba(150, 230, 255, 0.18);
          box-shadow:
            inset 0 0 16px rgba(0, 0, 0, 0.64),
            0 0 14px rgba(0, 180, 255, 0.14);
          z-index: 7;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .soc-big {
          font-size: 29px;
          line-height: 1;
          font-weight: 950;
          color: #e8fbff;
          text-shadow: 0 0 12px rgba(0, 190, 255, 0.9);
        }

        .soc-text {
          font-size: 11px;
          font-weight: 800;
          color: #dffbff;
          margin-top: 3px;
        }

        .mode-text {
          font-size: 11px;
          font-weight: 950;
          color: ${pulseClass === "discharging" ? "#ff9135" : "#66ff7a"};
          text-shadow: 0 0 8px currentColor;
          margin-top: 3px;
        }

        .halo-label {
          position: absolute;
          bottom: 16px;
          left: 0;
          right: 0;
          text-align: center;
          color: #b7c5c9;
          font-size: 14px;
          letter-spacing: .8px;
          z-index: 9;
        }

        .status {
          min-width: 0;
          color: #e8fbff;
          font-size: clamp(13px, .85vw, 17px);
          line-height: 1.75;
        }

        .status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 4px 0;
          border-bottom: 1px solid rgba(120, 235, 255, 0.13);
          min-width: 0;
        }

        .status-row:last-child {
          border-bottom: none;
        }

        .status-label {
          color: #e8fbff;
          white-space: nowrap;
        }

        .status-value {
          color: #00c8ff;
          font-weight: 950;
          text-align: right;
          white-space: nowrap;
          text-shadow: 0 0 8px rgba(0, 190, 255, 0.9);
        }

        .metrics {
          display: grid;
          gap: 14px;
          min-width: 0;
        }

        .tile {
          min-width: 0;
          box-sizing: border-box;
          border-radius: 20px;
          padding: 18px;
          background: linear-gradient(145deg, rgba(0, 15, 35, 0.60), rgba(0, 8, 20, 0.48));
          border: 1px solid rgba(0, 200, 255, 0.22);
          box-shadow:
            inset 0 0 20px rgba(0, 90, 180, 0.16),
            0 0 18px rgba(0, 180, 255, 0.10);
          text-align: center;
          overflow: hidden;
        }

        .tile-title {
          color: #86efff;
          font-weight: 950;
          font-size: clamp(14px, .9vw, 19px);
          text-transform: uppercase;
          margin-bottom: 14px;
          text-shadow: 0 0 10px rgba(0, 200, 255, 0.75);
          white-space: nowrap;
        }

        .tile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          align-items: stretch;
          min-width: 0;
        }

        .tile-line {
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;
        }

        .tile-line + .tile-line {
          border-left: 1px solid rgba(120, 235, 255, 0.24);
        }

        .sub {
          color: #d8fbff;
          font-size: clamp(12px, .72vw, 16px);
          white-space: nowrap;
        }

        .value {
          font-size: clamp(22px, 1.55vw, 34px);
          font-weight: 950;
          line-height: 1.1;
          white-space: nowrap;
        }

        .value.blue {
          color: #00bfff;
          text-shadow: 0 0 14px rgba(0, 180, 255, 0.95);
        }

        .value.orange {
          color: #ff8f2f;
          text-shadow: 0 0 14px rgba(255, 120, 20, 0.95);
        }

        .value.green {
          color: #62ff70;
          text-shadow: 0 0 14px rgba(80, 255, 100, 0.9);
        }

        .payback-progress {
          width: 100%;
          height: 13px;
          border-radius: 999px;
          border: 1px solid rgba(85, 210, 255, .85);
          background: rgba(0, 20, 40, .74);
          overflow: hidden;
          box-shadow:
            inset 0 0 10px rgba(0, 120, 255, .4),
            0 0 10px rgba(0, 190, 255, .18);
          margin: 7px 0;
        }

        .payback-fill {
          height: 100%;
          width: ${paybackPercent}%;
          background: linear-gradient(90deg, #62ff70, #00c8ff);
          box-shadow: 0 0 12px rgba(80, 255, 120, .85);
        }

        .battery-tile {
          display: grid;
          align-items: center;
          gap: 16px;
        }

        .battery-icon {
          width: 60px;
          height: 104px;
          border-radius: 17px;
          border: 2px solid rgba(145, 255, 255, 0.92);
          position: relative;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.20), rgba(102, 255, 122, 0.88) ${100 - fill}%, rgba(0, 185, 80, 0.95));
          box-shadow:
            0 0 17px rgba(102, 255, 122, 0.72),
            0 0 25px rgba(0, 200, 255, 0.45),
            inset 0 0 16px rgba(0, 60, 40, 0.45);
          margin: 6px auto;
        }

        .battery-icon::before {
          content: "";
          position: absolute;
          top: -12px;
          left: 19px;
          width: 20px;
          height: 12px;
          border: 2px solid rgba(145, 255, 255, 0.92);
          border-bottom: none;
          border-radius: 8px 8px 0 0;
        }

        .battery-icon::after {
          content: "⚡";
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff8f2f;
          font-size: 40px;
          text-shadow: 0 0 12px rgba(255, 120, 20, .95);
        }

        :host([layout="wide"]) .content {
          grid-template-columns: minmax(360px, 430px) minmax(0, 1fr);
        }

        :host([layout="wide"]) .hero {
          grid-template-columns: 160px minmax(0, 1fr);
        }

        :host([layout="wide"]) .metrics {
          grid-template-columns: repeat(6, minmax(130px, 1fr));
        }

        :host([layout="wide"]) .tile {
          min-height: 228px;
        }

        :host([layout="wide"]) .tile-grid {
          grid-template-columns: 1fr;
        }

        :host([layout="wide"]) .tile-line + .tile-line {
          border-left: none;
          border-top: 1px solid rgba(120, 235, 255, 0.24);
          padding-top: 12px;
        }

        :host([layout="wide"]) .battery-tile {
          grid-template-columns: 1fr;
        }

        :host([layout="medium"]) .content {
          grid-template-columns: 1fr;
        }

        :host([layout="medium"]) .hero {
          grid-template-columns: 190px minmax(0, 1fr);
        }

        :host([layout="medium"]) .metrics {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        :host([layout="medium"]) .battery-tile {
          grid-template-columns: 86px 1fr;
        }

        :host([layout="compact"]) .wrap {
          padding: 18px;
        }

        :host([layout="compact"]) .title {
          font-size: 21px;
          margin-bottom: 18px;
        }

        :host([layout="compact"]) .content,
        :host([layout="compact"]) .hero,
        :host([layout="compact"]) .metrics {
          grid-template-columns: 1fr;
        }

        :host([layout="compact"]) .hero {
          text-align: center;
        }

        :host([layout="compact"]) .status {
          width: 100%;
        }

        :host([layout="compact"]) .tile-grid {
          grid-template-columns: 1fr;
        }

        :host([layout="compact"]) .tile-line + .tile-line {
          border-left: none;
          border-top: 1px solid rgba(120, 235, 255, 0.24);
          padding-top: 12px;
        }

        :host([layout="compact"]) .battery-tile {
          grid-template-columns: 1fr;
        }

        @keyframes haloChargePulse {
          0%, 100% {
            filter:
              drop-shadow(0 0 16px rgba(0, 190, 255, 0.45))
              drop-shadow(0 0 22px rgba(0, 255, 120, 0.14));
          }
          50% {
            filter:
              drop-shadow(0 0 24px rgba(0, 190, 255, 0.80))
              drop-shadow(0 0 28px rgba(102, 255, 122, 0.52));
          }
        }

        @keyframes haloDischargePulse {
          0%, 100% {
            filter:
              drop-shadow(0 0 16px rgba(0, 190, 255, 0.45))
              drop-shadow(0 0 22px rgba(255, 145, 53, 0.12));
          }
          50% {
            filter:
              drop-shadow(0 0 24px rgba(0, 190, 255, 0.80))
              drop-shadow(0 0 28px rgba(255, 145, 53, 0.45));
          }
        }
      </style>

      <ha-card>
        <div class="wrap">
          <div class="title">
            <div class="title-battery"></div>
            <div>${labels.title}</div>
          </div>

          <div class="content">
            <div class="hero">
              <div class="halo-device ${pulseClass}">
                <div class="halo-side"></div>
                <div class="halo-front">
                  <div class="logo-ring"><span>HYXi</span></div>
                  <div class="device-screen">
                    <div class="soc-big">${this.formatNumber(soc, 0)}%</div>
                    <div class="soc-text">SOC</div>
                    <div class="mode-text">${mode.toUpperCase()}</div>
                  </div>
                  <div class="halo-label">HALO</div>
                </div>
              </div>

              <div class="status">
                <div class="status-row">
                  <span class="status-label">${modeIcon} ${labels.mode}</span>
                  <span class="status-value">${mode}</span>
                </div>
                <div class="status-row">
                  <span class="status-label">🟢 ${labels.inBattery}</span>
                  <span class="status-value">${this.formatNumber(currentKwh, 2)} kWh</span>
                </div>
                <div class="status-row">
                  <span class="status-label">🔋 ${labels.max}</span>
                  <span class="status-value">${this.formatNumber(capacity, 1)} kWh</span>
                </div>
                <div class="status-row">
                  <span class="status-label">📈 ${labels.efficiency}</span>
                  <span class="status-value">${this.formatNumber(efficiency, 1)}%</span>
                </div>
                <div class="status-row">
                  <span class="status-label">🏆 ${labels.score}</span>
                  <span class="status-value">${score}</span>
                </div>
              </div>
            </div>

            <div class="metrics">
              <div class="tile">
                <div class="tile-title">💎 ${labels.total}</div>
                <div class="tile-grid">
                  <div class="tile-line">
                    <div class="sub">⚡ ${labels.charged}</div>
                    <div class="value blue">${this.formatNumber(charged, 1)} kWh</div>
                  </div>
                  <div class="tile-line">
                    <div class="sub">🔌 ${labels.discharged}</div>
                    <div class="value orange">${this.formatNumber(discharged, 1)} kWh</div>
                  </div>
                </div>
              </div>

              <div class="tile">
                <div class="tile-title">⚡ ${labels.live}</div>
                <div class="tile-grid">
                  <div class="tile-line">
                    <div class="sub">${labels.charging}</div>
                    <div class="value blue">${this.formatNumber(chargingPower, 0)} W</div>
                  </div>
                  <div class="tile-line">
                    <div class="sub">${labels.discharging}</div>
                    <div class="value orange">${this.formatNumber(dischargingPower, 0)} W</div>
                  </div>
                </div>
              </div>

              <div class="tile">
                <div class="tile-title">📊 ${labels.performance}</div>
                <div class="tile-grid">
                  <div class="tile-line">
                    <div class="sub">${labels.cycles}</div>
                    <div class="value blue">${this.formatNumber(cycles, 1)}</div>
                  </div>
                  <div class="tile-line">
                    <div class="sub">${labels.loss}</div>
                    <div class="value orange">${this.formatNumber(loss, 1)} kWh</div>
                  </div>
                </div>
              </div>

              <div class="tile">
                <div class="tile-title">💰 ${labels.savings}</div>
                <div class="tile-grid">
                  <div class="tile-line">
                    <div class="sub">${labels.totalSavings}</div>
                    <div class="value green">€ ${this.formatNumber(totalSavings, 0)}</div>
                  </div>
                  <div class="tile-line">
                    <div class="sub">${labels.currentSavings}</div>
                    <div class="value green">€ ${this.formatNumber(currentSavings, 2)}</div>
                  </div>
                </div>
              </div>

              <div class="tile">
                <div class="tile-title">⏳ ${labels.payback}</div>
                <div class="tile-grid">
                  <div class="tile-line">
                    <div class="sub">${labels.paidBack}</div>
                    <div class="value orange">€ ${this.formatNumber(paidBack, 0)}</div>
                  </div>
                  <div class="tile-line">
                    <div class="payback-progress">
                      <div class="payback-fill"></div>
                    </div>
                    <div class="sub">${this.formatNumber(paybackPercent, 1)}% ${labels.of} € ${this.formatNumber(investment, 2)}</div>
                    <div class="value orange">${this.formatNumber(paybackYears, 1)} ${labels.years}</div>
                  </div>
                </div>
              </div>

              <div class="tile battery-tile">
                <div class="battery-icon"></div>
                <div>
                  <div class="tile-title">🔋 ACCU</div>
                  <div class="sub">${labels.batteryNow}</div>
                  <div class="value blue">${this.formatNumber(currentKwh, 2)} kWh</div>
                </div>
              </div>
            </div>
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

customElements.define("hyxi-ultra-dashboard-card", HyxiUltraDashboardCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "hyxi-ultra-dashboard-card",
  name: "HYXi Ultra Dashboard Card",
  description: "Adaptive neon dashboard card for HYXi HALO battery systems.",
  preview: true,
});
