<img width="1634" height="309" alt="image" src="https://github.com/user-attachments/assets/6cebe4d4-317d-4428-b49d-44632513c485" />

# 🔋 HYXi Ultra Dashboard

Community Home Assistant dashboard for HYXi battery systems with live monitoring, performance analysis, and payback calculations.

## ✨ Features

* 📊 Live charging and discharging power
* 🔋 Battery percentage (SOC)
* ⚡ Total charged and discharged energy
* 📈 Efficiency calculation
* 🔄 Cycle calculation
* 💰 Savings indication
* ⏳ Payback calculation
* 🎨 Neon HYXi dashboard design
* 📱 Works on desktop, tablet, and mobile

---

## 📸 Screenshot

<img width="1631" height="314" alt="image" src="https://github.com/user-attachments/assets/2880ed57-3229-4b08-bec7-d3cd4c4df70f" />
<img width="1666" height="316" alt="image" src="https://github.com/user-attachments/assets/8dc0f8ec-26ef-4370-aa05-79250a0f749c" />

---

## 📋 Requirements

### Home Assistant

* Home Assistant 2024.6 or newer
* Working HYXi integration

### HACS

Install via HACS:

* Button Card
* Card Mod recommended

---

## 🔧 Required sensors

Replace `123456789` with your own HYXi serial number.

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
Investment: €1870
Electricity price: €0.1357 per kWh
Feed-in tariff: €0.0151 per kWh
```

Adjust these values to match your own situation.

---

## 🚀 Installation

This repository contains a full dashboard YAML example.

1. Download the YAML file from this repository.
2. Open Home Assistant.
3. Create a new dashboard or open an existing dashboard.
4. Click the three dots in the top-right corner.
5. Select **Edit dashboard**.
6. Click the three dots again and choose **Raw configuration editor**.
7. Paste the full YAML configuration.
8. Save the dashboard.
9. Replace the example sensors with your own HYXi sensors.
10. Adjust the default values if needed.

---

## 📂 Included file

```text
HYXi_Ultra_Dashboard_Community_123456789.yaml
```

This file contains example sensors so everyone can easily adapt the dashboard to their own HYXi installation.

---

## 🎨 Dashboard highlights

* Neon cyber-style design
* Dynamic battery ring
* Live charging and discharging status
* Efficiency score from A+ to C
* Cycle calculation
* Loss analysis
* Savings indication
* Payback time calculation
* Mobile optimized
* Tablet optimized
* Desktop support

---

## ⚠️ Disclaimer

This dashboard was created by the Home Assistant community and is not officially affiliated with HYXi.

Use at your own risk.

Always verify the calculations for efficiency, savings, and payback time yourself.

---

## 🤝 Contributing

Improvements, bug fixes, and ideas are always welcome.

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

