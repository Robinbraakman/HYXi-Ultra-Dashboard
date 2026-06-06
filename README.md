🔋 HYXi Ultra Dashboard

Community Home Assistant dashboard voor HYXi batterijsystemen met live monitoring, prestatie-analyse en terugverdienberekeningen.

✨ Functies
📊 Live laad- en ontlaadvermogen
🔋 Batterijpercentage (SOC)
⚡ Totaal geladen en ontladen energie
📈 Rendementberekening
🔄 Cycliberekening
💰 Winstindicatie
⏳ Terugverdientijdberekening
🎨 Neon HYXi dashboard design
📱 Werkt op desktop, tablet en mobiel
📸 Screenshot

<img width="1644" height="320" alt="image" src="https://github.com/user-attachments/assets/5bd0c035-31cc-4fb2-bd95-9cda2c09c698" />

📋 Vereisten
Home Assistant
Home Assistant 2024.6 of nieuwer
Werkende HYXi integratie
HACS

Installeer via HACS:

Button Card
Card Mod (aanbevolen)
🔧 Benodigde sensoren

Vervang 123456789 door jouw eigen HYXi serienummer.

sensor.hyxi_123456789_batsoc
sensor.hyxi_123456789_totalechg
sensor.hyxi_123456789_totaledchg
sensor.hyxi_123456789_bat_charging
sensor.hyxi_123456789_bat_discharging
⚙️ Standaard instellingen
Capaciteit: 6.0 kWh
Investering: €1870
Stroomprijs: €0.1357 per kWh
Injectietarief: €0.0151 per kWh

Pas deze waarden aan naar je eigen situatie.

🚀 Installatie
Download de YAML.
Open Home Assistant.
Ga naar Dashboard → Bewerken → Ruwe configuratie-editor.
Plak de YAML.
Sla op.
Vervang de voorbeeldsensoren door je eigen sensoren.
Pas indien gewenst de standaard instellingen aan.
⚠️ Disclaimer

Dit dashboard is gemaakt door de Home Assistant community en is niet officieel verbonden aan HYXi.

Gebruik op eigen risico.

Controleer altijd zelf de berekeningen voor rendement, winst en terugverdientijd.

📜 Licentie

MIT License
