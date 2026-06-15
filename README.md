<img width="1634" height="309" alt="HYXi Ultra Dashboard" src="https://github.com/user-attachments/assets/6cebe4d4-317d-4428-b49d-44632513c485" />

# 🔋 HYXi Ultra Dashboard

Community Home Assistant dashboard card for HYXi battery systems with live monitoring, performance analysis, savings indication, and payback calculations.

This project provides a custom Lovelace card for Home Assistant, designed as a wide neon-style HYXi battery dashboard.

---

## ✨ Features

* 📊 Live charging and discharging power
* 🔋 Battery percentage / SOC
* ⚡ Total charged and discharged energy
* 📈 Efficiency calculation
* 🔄 Battery cycle calculation
* 🔍 Loss analysis
* 💰 Savings indication
* ⏳ Payback calculation
* 🎨 Neon HYXi dashboard design
* 🌍 English and Dutch language support
* 📱 Responsive layout for desktop, tablet, and mobile

---

## 📸 Screenshot

<img width="1631" height="314" alt="HYXi Ultra Dashboard Screenshot" src="https://github.com/user-attachments/assets/2880ed57-3229-4b08-bec7-d3cd4c4df70f" />

<img width="1666" height="316" alt="HYXi Ultra Dashboard Screenshot" src="https://github.com/user-attachments/assets/8dc0f8ec-26ef-4370-aa05-79250a0f749c" />

---

## 📋 Requirements

### Home Assistant

* Home Assistant 2024.6 or newer
* HACS
* HYXi Cloud integration by Veldkornet:
  https://github.com/Veldkornet/ha-hyxi-cloud

This dashboard card uses sensor entities provided by the HYXi Cloud integration.

---

## 🔧 Required sensors

By default, the card expects the following HYXi sensor names.

Replace `123456789` with your own HYXi serial number.

```yaml
sensor.hyxi_123456789_batsoc
sensor.hyxi_123456789_totalechg
sensor.hyxi_123456789_totaledchg
sensor.hyxi_123456789_bat_charging
sensor.hyxi_123456789_bat_discharging
```

Example:

```yaml
serial: "123456789"
```

The card will automatically use:

```yaml
sensor.hyxi_123456789_batsoc
sensor.hyxi_123456789_totalechg
sensor.hyxi_123456789_totaledchg
sensor.hyxi_123456789_bat_charging
sensor.hyxi_123456789_bat_discharging
```

---

## ⚙️ Default settings

```text
Capacity: 9.2 kWh
Investment: €2222.99
Electricity price: €0.22568 per kWh
Feed-in tariff: €0.10 per kWh
Start date: 2026-05-01
```

Adjust these values to match your own situation.

---

## 🚀 HACS installation

### 1. Add this repository to HACS

1. Open Home Assistant.
2. Go to **HACS**.
3. Click the three dots in the top-right corner.
4. Choose **Custom repositories**.
5. Add this repository URL:

```text
https://github.com/Robinbraakman/HYXi-Ultra-Dashboard
```

6. Select category/type: **Dashboard**.
7. Click **Add**.
8. Install **HYXi Ultra Dashboard Card**.
9. Refresh your browser or restart Home Assistant.

---

## 🖥️ Recommended Panel View setup

The HYXi Ultra Dashboard Card is designed as a wide dashboard bar.

For the best layout, use a **Panel view** in Home Assistant.

Open your dashboard **Raw configuration editor** and use this example:

```yaml
title: HYXi Dashboard
views:
  - title: HYXi
    path: hyxi
    icon: mdi:battery
    panel: true
    type: panel
    cards:
      - type: custom:hyxi-ultra-dashboard-card
        serial: "123456789"
        capacity: 9.2
        investment: 2222.99
        electricity_price: 0.22568
        feed_in_price: 0.10
        start_date: "2026-05-01"
        language: en
```

Replace `123456789` with your own HYXi serial number.

---

## 🇳🇱 Dutch example

```yaml
title: HYXi Dashboard
views:
  - title: HYXi
    path: hyxi
    icon: mdi:battery
    panel: true
    type: panel
    cards:
      - type: custom:hyxi-ultra-dashboard-card
        serial: "123456789"
        capacity: 9.2
        investment: 2222.99
        electricity_price: 0.22568
        feed_in_price: 0.10
        start_date: "2026-05-01"
        language: nl
```

---

## 🧩 Card-only example

You can also add the card manually to an existing dashboard:

```yaml
type: custom:hyxi-ultra-dashboard-card
serial: "123456789"
capacity: 9.2
investment: 2222.99
electricity_price: 0.22568
feed_in_price: 0.10
start_date: "2026-05-01"
language: en
```

Please note: when the card is added inside a normal grid or sections dashboard, Home Assistant controls the available width.

For the full wide layout, the recommended setup is a **Panel view**.

---

## 🔧 Manual entity configuration

If your HYXi sensor names are different, you can manually define the entities:

```yaml
type: custom:hyxi-ultra-dashboard-card
entities:
  soc: sensor.hyxi_123456789_batsoc
  charged: sensor.hyxi_123456789_totalechg
  discharged: sensor.hyxi_123456789_totaledchg
  charging_power: sensor.hyxi_123456789_bat_charging
  discharging_power: sensor.hyxi_123456789_bat_discharging
capacity: 9.2
investment: 2222.99
electricity_price: 0.22568
feed_in_price: 0.10
start_date: "2026-05-01"
language: en
```

---

## 🎨 Dashboard highlights

* Neon cyber-style design
* Dynamic HYXi battery illustration
* Dynamic SOC ring
* Live charging and discharging status
* Efficiency score from A+ to C
* Cycle calculation
* Energy loss analysis
* Savings indication
* Payback time calculation
* English and Dutch labels
* Mobile optimized
* Tablet optimized
* Desktop support

---

## 📂 Included files

```text
dist/hyxi-ultra-dashboard-card.js
hacs.json
README.md
LICENSE
```

Optional YAML examples may also be included for users who prefer manual configuration.

---

## ⚠️ Disclaimer

This dashboard card was created by the Home Assistant community and is not officially affiliated with HYXi.

Use at your own risk.

Always verify the calculations for efficiency, savings, and payback time yourself.

Electricity prices, feed-in tariffs, investment costs, and payback calculations are examples only and should be adjusted to your own situation.

---

## 🤝 Contributing

Improvements, bug fixes, translations, and ideas are welcome.

Feel free to open an Issue or Pull Request.

---

## 📜 License

MIT License

---

## ☕ Support the project

Do you find this dashboard useful?

☕ Buy me a coffee:
https://paypal.me/deadbyrobin

⭐ Or give this repository a Star on GitHub.

