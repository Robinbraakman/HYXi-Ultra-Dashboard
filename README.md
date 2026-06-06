# HYXi-Ultra-Dashboard
Community Home Assistant dashboard for HYXi battery systems with live monitoring, performance analytics and payback calculations.

  # 🔋 HYXi Ultra Dashboard

Een geavanceerd Home Assistant dashboard voor HYXi thuisbatterijen met:

- 📊 Live laad- en ontlaadvermogen
- 🔋 Batterij percentage (SOC)
- ⚡ Totaal geladen en ontladen energie
- 📈 Rendement berekening
- 🔄 Cycli berekening
- 💰 Winst indicatie
- ⏳ Terugverdientijd berekening
- 🎨 Neon HYXi dashboard design
- 📱 Werkt op desktop, tablet en mobiel

---

## Screenshot

<img width="1642" height="311" alt="image" src="https://github.com/user-attachments/assets/f33d6843-9b93-4e84-94ed-e59802bb4edf" />

---

## Vereisten

### Home Assistant

- Home Assistant 2024.6 of nieuwer
- HYXi integratie

### HACS

Installeer via HACS:

- Button Card

Optioneel:

- Card Mod

---

## Benodigde sensoren

Vervang `123456789` door jouw eigen HYXi serienummer.

```yaml
sensor.hyxi_123456789_batsoc
sensor.hyxi_123456789_totalechg
sensor.hyxi_123456789_totaledchg
sensor.hyxi_123456789_bat_charging
sensor.hyxi_123456789_bat_discharging
