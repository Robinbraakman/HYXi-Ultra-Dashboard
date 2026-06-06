# 🔋 HYXi Ultra Dashboard

Community Home Assistant dashboard voor HYXi batterijsystemen met live monitoring, prestatie-analyse en terugverdienberekeningen.

## ✨ Functies

- 📊 Live laad- en ontlaadvermogen
- 🔋 Batterijpercentage (SOC)
- ⚡ Totaal geladen en ontladen energie
- 📈 Rendementberekening
- 🔄 Cycliberekening
- 💰 Winstindicatie
- ⏳ Terugverdientijdberekening
- 🎨 Neon HYXi dashboard design
- 📱 Werkt op desktop, tablet en mobiel

---

## 📸 Screenshot

<img width="1663" height="358" alt="image" src="https://github.com/user-attachments/assets/cf60272c-9901-4a26-a5a8-fad45269a15d" />


---

## 📋 Vereisten

### Home Assistant

- Home Assistant 2024.6 of nieuwer
- Werkende HYXi integratie

### HACS

Installeer via HACS:

- Button Card
- Card Mod (aanbevolen)

---

## 🔧 Benodigde sensoren

Vervang `123456789` door jouw eigen HYXi serienummer.

```yaml
sensor.hyxi_123456789_batsoc
sensor.hyxi_123456789_totalechg
sensor.hyxi_123456789_totaledchg
sensor.hyxi_123456789_bat_charging
sensor.hyxi_123456789_bat_discharging
```

---

## ⚙️ Standaard instellingen

```text
Capaciteit: 6.0 kWh
Investering: €1870
Stroomprijs: €0.1357 per kWh
Injectietarief: €0.0151 per kWh
```

Pas deze waarden aan naar je eigen situatie.

---

## 🚀 Installatie

1. Download de YAML uit deze repository.
2. Open Home Assistant.
3. Ga naar Dashboard → Bewerken → Ruwe configuratie-editor.
4. Plak de YAML.
5. Sla op.
6. Vervang de voorbeeldsensoren door je eigen HYXi sensoren.
7. Pas eventueel de standaardwaarden aan.

---

## 📂 Inbegrepen bestand

```text
HYXi_Ultra_Dashboard_Community_123456789.yaml
```

Dit bestand bevat voorbeeldsensoren zodat iedereen het dashboard eenvoudig kan aanpassen aan zijn eigen HYXi installatie.

---

## 🎨 Dashboard kenmerken

- Neon cyber-stijl ontwerp
- Dynamische batterijring
- Live laad- en ontlaadstatus
- Rendementsscore (A+ t/m C)
- Cycliberekening
- Verliesanalyse
- Winstindicatie
- Terugverdientijd berekening
- Mobiel geoptimaliseerd
- Tablet geoptimaliseerd
- Desktop ondersteuning

---

## ⚠️ Disclaimer

Dit dashboard is gemaakt door de Home Assistant community en is niet officieel verbonden aan HYXi.

Gebruik op eigen risico.

Controleer altijd zelf de berekeningen voor rendement, winst en terugverdientijd.

---
## 🤝 Bijdragen

Verbeteringen, bugfixes en ideeën zijn altijd welkom.

Maak gerust een Issue of Pull Request aan.

 ## ⭐ Ondersteun het project

Vind je dit dashboard handig? Geef deze repository dan een ster ⭐ op GitHub.

## 📜 Licentie

MIT License
