# 🌟 3D Smart Home System — Project Showcase & Presentation Guide

> **A Next-Generation Architectural IoT Dashboard uniting 3D Spatial Computing, Energy Economics, and Residential Security.**

---

## 🎯 Executive Summary & Pitch

Traditional smart home dashboards are often fragmented—relying on isolated toggle lists, disjointed vendor apps, or generic cards that fail to convey physical context. 

The **3D Smart Home System** reinvents residential management into a single, architectural control interface. By combining a **Three.js isometric 3D model** with **deep energy economics** and **multi-sensor perimeter telemetry**, homeowners gain immediate spatial intuition and actionable control over their entire living environment.

---

## 💎 Key Innovations & Pillars

```
┌────────────────────────────────────────────────────────────────────────┐
│                        3D Smart Home System                            │
├──────────────────┬──────────────────┬──────────────────┬───────────────┤
│  3D Spatial Web  │  Energy Economics│ Security Center  │ Smart Scenes  │
│  Interactive     │  Sub-metering,   │ Perimeter mesh,  │ Orchestrated  │
│  Three.js Floor  │  Tariff models & │ Panic lockdown & │ automations & │
│  plan & Climate  │  Solar savings   │ Live camera feeds│ sync routines │
└──────────────────┴──────────────────┴──────────────────┴───────────────┘
```

### 1. Spatial Computing in the Browser (WebGL + React 19)
- Built directly on top of `@react-three/fiber` and `@react-three/drei`.
- Employs an isometric 3D architectural floorplan with bounded orbit controls, dynamic lighting shadows, and interactive room raycasting.
- Eliminates context switching: clicking any physical room in the 3D canvas immediately filters environmental sensors, lighting, and climate targets.

### 2. Deep Energy Economics & Sub-Metering
- Beyond simple kilowatt meters, the system calculates **net financial savings**:
  - Live solar vs. consumption dual-bar charts (`24h`, `7d`, `30d`).
  - Appliance-level breakdown tracking 7+ high-draw appliances with interactive eco-mode optimization.
  - Multi-currency conversion (**USD**, **EUR**, **GBP**) and interactive utility tariff presets.
  - Month-end projected electricity bill vs. estimated solar return with CO₂ offset calculations.

### 3. Whole-Home Perimeter Defense & Emergency Panic
- Real-time sensor mesh status across 8+ physical touchpoints (doors, windows, PIR motion sensors).
- Interactive sensor trigger simulation for testing perimeter breach responses.
- One-click **Emergency Lockdown** state machine: seals smart deadbolts, sounds warning sirens, and alerts monitoring services with confirmation guardrails.

### 4. Warm Brutalist Architectural Design System
- Eschews generic neon cyberpunk tropes in favor of an elegant, Scandinavian-inspired stone palette (`#f2eee5`, `#f7f4ed`, `#f5f1e8`, `#1c1917`, `#292524`).
- Strict grid alignment and container balancing: zero empty gaps, perfectly flush card borders, and high-density telemetry.

---

## 🎬 3-Minute Live Demo Script

Use this structured walkthrough when presenting this project to interviewers, clients, or audiences:

### Minute 1: The 3D Residence & Spatial Control
1. **Show the 3D Home Scene**:
   - *"Notice the isometric 3D residence rendered natively via WebGL and Three.js."*
   - Orbit, rotate, and zoom the camera around the residence.
2. **Interact with Rooms**:
   - Click on the **Living room** button or hover over rooms to demonstrate interactive highlights.
   - Adjust the climate temperature up/down and toggle the room's illumination button.
   - Show how the side panel fits proportionally within the 560px canvas viewport without vertical dead space.

### Minute 2: Energy Intelligence & Solar ROI
1. **Navigate to the Energy Tab**:
   - *"Modern homeowners demand more than raw kWh numbers; they want financial accountability."*
   - Toggle through the `24h`, `7d`, and `30d` timeframe tabs on the **Hourly generation vs. consumption** chart to showcase dual-bar comparisons.
2. **Sub-Metering & Eco Optimization**:
   - Scroll down to the **Appliance-level consumption** card.
   - Filter appliances by category (*Climate*, *Mobility*, *Kitchen*) and toggle **Eco optimized** on the HVAC or EV Fast Charger to see live draw reductions.
3. **Financial Tariff Adjustments**:
   - In the **Cost & solar savings** sidebar, switch currencies between **USD ($)**, **EUR (€)**, and **GBP (£)**.
   - Click the `+` / `-` tariff buttons to demonstrate dynamic recalculations of today's cost, monthly projected bills, and CO₂ offset.

### Minute 3: Perimeter Security & Automation Scenes
1. **Navigate to Security**:
   - Review the live camera feed previews (Front door, Garden, Driveway).
   - Click on any sensor in the **Sensor network status** grid (e.g., *Driveway beam sensor*) to simulate live motion alerts.
   - Toggle the **Front entrance deadbolt** between Locked and Unlocked.
2. **Trigger Emergency Lockdown**:
   - Click the **Emergency Panic Lockdown** button, confirm the modal prompt, and observe the high-priority whole-home siren banner.
   - Reset the lockdown to return to normal operation.
3. **Show Smart Scenes & Dark Mode**:
   - Switch to **Scenes** to view synchronized automated routines (*Movie Night*, *Away Mode*).
   - Toggle the global **Dark / Light theme** in the header to demonstrate the high-contrast stone palette adaptability.

---

## 📐 Technical Architecture & Decisions

### Component Tree
```text
App.jsx (Root State, Theme & Notifications)
 ├── DashboardHeader.jsx (Navigation, Live Clock, Unread Dropdown)
 ├── SmartHomeScene.jsx (Three.js Canvas, Climate, Per-room devices)
 ├── SmartScenes.jsx (Automated routines & category filters)
 ├── SecurityPanel.jsx (Camera feeds, Sensor grid, Panic lockdown)
 ├── EnergyPanel.jsx (Dual-bar charts, Appliance sub-meters, Tariff calculator)
 └── SettingsPanel.jsx (Residence profile, Localization, Theme, Diagnostics)
```

### Engineering Highlights
- **CSS Grid Row Balancing**: Grid columns utilize CSS Grid `minmax(0, 1fr)` paired with structured flexbox hierarchies (`flex flex-col justify-between` with pinned footers) to ensure 100% pixel-aligned bottom borders between uneven data cards.
- **State Persistence**: Theme preference (`darkMode`) is preserved across sessions via reactive `localStorage` synchronization.
- **Zero Runtime Dependencies for Charts**: The bar charts and balance visualizers are engineered using native, lightweight semantic HTML and Tailwind CSS without bulky third-party charting libraries, maintaining optimal bundle sizes.

---

## 📊 Performance & Quality Metrics

- **Production Build Time**: ~1.44s with Vite 8.
- **Bundle Optimization**: Gzipped CSS < 9 kB.
- **Code Standards**: 100% clean ESLint pass (0 errors, 0 warnings).
- **Responsive Layout**: Full support across mobile, tablet, desktop, and ultrawide viewports.
