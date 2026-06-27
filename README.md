<img width="1616" height="338" alt="image" src="https://github.com/user-attachments/assets/48d08dce-a6cc-4cf1-9e75-5e14ce9655ca" />

# 🔋 HYXi Ultra Dashboard

Community Home Assistant dashboard card for HYXi battery systems with live monitoring, performance analysis, savings indication, Dutch dual tariff support, and payback calculations.

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
* 🇳🇱 Optional Dutch dual tariff mode
* 🌙 Normal and off-peak tariff support
* 💸 Feed-in compensation and feed-in costs support
* 🧮 Weighted average tariff estimate for total savings
* 🔧 Charged and discharged correction values
* 🎨 Neon HYXi dashboard design
* 🌍 English and Dutch language support
* 📱 Responsive layout for desktop, tablet, and mobile

---

## 📸 Screenshot

<img width="1628" height="720" alt="image" src="https://github.com/user-attachments/assets/1545151f-dd4a-4f0b-b7cb-bf8acf80ca5e" />

---

This version no longer requires a long button-card YAML configuration.  
The dashboard now runs as a native custom Lovelace card.

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

## 💰 Savings calculation explained

The savings calculation is intended as an indication, not as an exact financial calculation.

The card supports two tariff modes:

```yaml
tariff_mode: "simple"
```

or:

```yaml
tariff_mode: "nl_dual"
```

---

## Simple tariff mode

This is the original and easiest calculation mode.

The card uses this formula:

```text
savings = discharged kWh × (electricity_price - feed_in_price)
```

### electricity_price

`electricity_price` is the price you normally pay when buying electricity from the grid.

Example:

```yaml
electricity_price: 0.22568
```

This means €0.22568 per kWh.

### feed_in_price

`feed_in_price` is the estimated value of electricity that would otherwise be exported back to the grid.

Example:

```yaml
feed_in_price: 0.10
```

This means €0.10 per kWh.

Example calculation:

```text
€0.22568 - €0.10 = €0.12568 estimated benefit per kWh
```

---

## 🇳🇱 Dutch dual tariff mode

For Dutch users, energy contracts can be more complicated because they may include:

* normal tariff
* off-peak tariff
* weekend off-peak tariff
* feed-in compensation
* feed-in costs

The card supports an optional Dutch dual tariff mode:

```yaml
tariff_mode: "nl_dual"
normal_electricity_price: 0.22568
offpeak_electricity_price: 0.22326
feed_in_compensation: 0.10
feed_in_costs: 0.00
offpeak_start: "23:00"
offpeak_end: "07:00"
weekend_offpeak: true
```

### Current savings/hour

The current savings/hour indication uses the currently active tariff.

Example:

```text
Current tariff: Off-peak
```

or in Dutch:

```text
Tarief nu: Dal
```

### Total savings

Total savings use a weighted average tariff estimate from `start_date` until now.

This keeps the card simple and does not require extra Home Assistant sensors, helpers, or automations.

Example:

```text
Total average tariff: €0.22442/kWh
```

or in Dutch:

```text
Gem. tarief totaal: €0.22442/kWh
```

### Weekend off-peak

When this option is enabled:

```yaml
weekend_offpeak: true
```

the card treats Saturday and Sunday as off-peak tariff days.

When disabled:

```yaml
weekend_offpeak: false
```

the card only uses the configured off-peak time window.

### Feed-in compensation and feed-in costs

In Dutch contracts, feed-in value can include both compensation and costs.

The card calculates the net feed-in value as:

```text
net feed-in value = feed_in_compensation - feed_in_costs
```

Example:

```yaml
feed_in_compensation: 0.10
feed_in_costs: 0.00
```

This means the exported energy is estimated to be worth €0.10 per kWh.

---

## 🔧 Charged and discharged correction

HYXi total energy sensors are cumulative counters.

If your HYXi system already had charged or discharged kWh values before you started using this dashboard, you can correct the displayed values.

Example:

```yaml
charged_correction: 562.0
discharged_correction: 570.8
```

The card then calculates:

```text
displayed charged = HYXi total charged - charged_correction
displayed discharged = HYXi total discharged - discharged_correction
```

Use `0` if you do not want to apply a correction.

```yaml
charged_correction: 0
discharged_correction: 0
```

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
        extra_benefit: 33.38
        start_date: "2026-05-01"
        language: en
        charged_correction: 0
        discharged_correction: 0
```

Replace `123456789` with your own HYXi serial number.

---

## 🇳🇱 Dutch dual tariff example

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

        tariff_mode: "nl_dual"
        normal_electricity_price: 0.22568
        offpeak_electricity_price: 0.22326
        feed_in_compensation: 0.10
        feed_in_costs: 0.00
        offpeak_start: "23:00"
        offpeak_end: "07:00"
        weekend_offpeak: true

        extra_benefit: 33.38
        start_date: "2026-05-01"
        language: nl

        charged_correction: 0
        discharged_correction: 0
```

---

## 🌍 English dual tariff example

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

        tariff_mode: "nl_dual"
        normal_electricity_price: 0.22568
        offpeak_electricity_price: 0.22326
        feed_in_compensation: 0.10
        feed_in_costs: 0.00
        offpeak_start: "23:00"
        offpeak_end: "07:00"
        weekend_offpeak: true

        extra_benefit: 33.38
        start_date: "2026-05-01"
        language: en

        charged_correction: 0
        discharged_correction: 0
```

---

## 🧪 Example dashboards

This repository includes ready-to-copy YAML examples:

```text
examples/card-only-en.yaml
examples/card-only-nl.yaml
examples/full-neon-dashboard-en.yaml
examples/full-neon-dashboard-nl.yaml
```

### Card-only examples

Use the card-only examples if you only want to add the HYXi Ultra Dashboard Card to an existing dashboard.

### Full neon dashboard examples

Use the full neon dashboard examples if you want a complete HYXi-only dashboard with:

* HYXi Ultra Dashboard Card
* neon KPI cards
* tariff and savings information
* history graphs
* raw HYXi sensor overview

Replace `123456789` with your own HYXi serial number before using the examples.

---

## 🧩 Card-only example

You can also add the card manually to an existing dashboard.

### Simple mode

```yaml
type: custom:hyxi-ultra-dashboard-card
serial: "123456789"
capacity: 9.2
investment: 2222.99
electricity_price: 0.22568
feed_in_price: 0.10
extra_benefit: 33.38
start_date: "2026-05-01"
language: en
charged_correction: 0
discharged_correction: 0
```

### Dutch dual tariff mode

```yaml
type: custom:hyxi-ultra-dashboard-card
serial: "123456789"
capacity: 9.2
investment: 2222.99

tariff_mode: "nl_dual"
normal_electricity_price: 0.22568
offpeak_electricity_price: 0.22326
feed_in_compensation: 0.10
feed_in_costs: 0.00
offpeak_start: "23:00"
offpeak_end: "07:00"
weekend_offpeak: true

extra_benefit: 33.38
start_date: "2026-05-01"
language: en

charged_correction: 0
discharged_correction: 0
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
extra_benefit: 33.38
start_date: "2026-05-01"
language: en
charged_correction: 0
discharged_correction: 0
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
* Dutch dual tariff support
* Weighted average tariff estimate
* Payback time calculation
* English and Dutch labels
* Mobile optimized
* Tablet optimized
* Desktop support

---

## 📂 Included files

```text
dist/hyxi-ultra-dashboard-card.js
dist/hyxihalopgnnieuw.png
examples/card-only-en.yaml
examples/card-only-nl.yaml
examples/full-neon-dashboard-en.yaml
examples/full-neon-dashboard-nl.yaml
hacs.json
README.md
LICENSE
```

Optional YAML examples are included for users who prefer manual configuration.

---

## ⚠️ Disclaimer

This dashboard card was created by the Home Assistant community and is not officially affiliated with HYXi.

Use at your own risk.

Always verify the calculations for efficiency, savings, and payback time yourself.

Electricity prices, feed-in tariffs, investment costs, tariff modes, weighted average tariff estimates, and payback calculations are examples only and should be adjusted to your own situation.

The Dutch dual tariff mode is an estimate. Current savings/hour uses the active tariff, while total savings use a weighted average tariff from `start_date` until now.

---

## 🤝 Contributing

Improvements, bug fixes, translations, and ideas are welcome.

Feel free to open an Issue or Pull Request.

---

## 📜 License

MIT License

---

## ☕ Support the project

HYXi Ultra Dashboard is a free community project.

Building, testing and maintaining this dashboard takes time.  
If this project helps you, you can support future development here:

☕ **Buy me a coffee:**  
https://paypal.me/deadbyrobin

You can also support the project by giving this repository a ⭐ Star on GitHub.

Thank you for your support!
