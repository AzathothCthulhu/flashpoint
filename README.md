# FLASHPOINT

FLASHPOINT is a browser-based cyber crisis tabletop exercise for senior leadership teams. Participants take charge of **Meridian Health**, a fictional healthcare organisation dealing with a third-party data breach. Over 21 simulated days, the team decides what to investigate, when to escalate, how to communicate and where to spend its limited capacity.

The exercise is designed for a facilitator and a group working from one shared screen. One person can also play through all five roles to rehearse a session or compare decision paths.

## Install and run

You need a supported [Node.js LTS release](https://nodejs.org/en/download), npm (included with Node.js) and a modern desktop browser. A desktop or projected display is best for the dashboard. Git is optional if you download and extract the repository ZIP from GitHub.

Open a terminal in the directory containing `package.json`. If you are using Git, run the first two commands to get there.

```sh
git clone https://github.com/AzathothCthulhu/flashpoint.git
cd flashpoint
npm ci
npm run dev
```

Open the **Local** URL printed by Vite, usually `http://localhost:5173/`. Keep the terminal open while you play. Press **Ctrl+C** in that terminal to stop the server.

For later sessions, run `npm run dev` from the same folder. Run `npm ci` again after pulling an updated lockfile. Installation downloads dependencies from npm. The application does not require an account, API key or database.

## Run a tabletop session

Assign the five roles, or have participants cover several if the group is small. Ask one person to operate the shared browser while the group discusses decisions.

| Role | What to watch |
| --- | --- |
| CISO | Security posture, investigation and technical response capacity |
| CFO | Budget, liquidity, financial exposure and vendors |
| Legal | Privilege, regulator engagement, contractual position and ethics |
| Comms | Public narrative, media relationships and stakeholder confidence |
| CEO | Board confidence, reputation, staff morale and strategic posture |

1. **Read the situation.** Review the Events timeline, resource pools and available decision gates. Use the War Room to surface issues that cut across roles.
2. **Discuss the decision gates.** A gate presents a choice at a particular point in the scenario. Committing an option applies its consequences to the simulation. Record what the team knew at the time and why it chose that option.
3. **Plan each role's day.** Switch between role tabs, select actions within each role's action-point budget and mark the role ready. Selected actions are applied when the day advances. A role that has not marked itself ready incurs its default effects.
4. **Advance the day.** Review changes in the log, new events and workstream progress. The scenario runs through Exposure (days 1–7), Escalation (days 8–14) and Resolution (days 15–21).
5. **Debrief.** Review the outcome and the choices that shaped it. Discuss what the team would do differently, which decisions need clearer ownership and what to update in its real incident response plan.

### How the simulation responds

Resource pools track conditions such as security posture, available funds and stakeholder confidence. Gate choices and daily actions change those pools. Some conditions decay over time or trigger cascading effects. Sustained work in areas such as forensics or regulatory response can produce a payoff when it reaches a threshold.

Scenario events fire according to day and state conditions. The War Room highlights cross-role issues as pressure builds. The ending tracker and debrief translate the simulated state into possible outcomes so the group can compare the consequences of different choices.

### Facilitator controls

Open the gear menu or press **Shift+F** to advance to a specific day, jump to an act, mark all roles ready, bulk-commit gates or manage the saved session. The skip and bulk controls are useful when rehearsing the exercise. A day jump processes intermediate days, so check the resulting state before using it as a workshop starting point. The previous-day button changes the day counter without reversing prior decisions or effects.

| Shortcut | Action |
| --- | --- |
| `1`–`5` | Switch to CISO, CFO, Legal, Comms or CEO |
| `Space` | Advance the day |
| `W` | Open the War Room |
| `D` | Open the Debrief |
| `Shift+F` | Toggle facilitator controls |
| `Esc` | Close the active overlay |

Progress is saved in browser storage at key state changes. Reopen the app in the same browser profile at the same URL to restore it, or use **Save**, **Load** and **Clear** in the facilitator panel. For a new group, use **Reset** to start again at day one. Each browser has an independent session. To let remote participants follow the same run, share the facilitator's screen.

## Build and host

```sh
npm run build
npm run preview
```

The build creates `dist/index.html` and bundled files under `dist/assets/`. Vite preview serves that build locally, usually at `http://localhost:4173/`. For deployment, publish the **contents of `dist/`** to a static web host. In a Git-connected host, use `npm run build` as the build command and `dist` as the output directory. The default build expects the root of a domain. For a subdirectory deployment, set Vite's base path when building, for example `npm run build -- --base=/flashpoint/`.

The browser runs the simulation and stores the session. A hosted copy gives each visitor their own session. If you want access limited to workshop participants, configure access controls at the host.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| `node` or `npm` is not recognised | Install Node.js LTS, then open a new terminal and run `node --version` and `npm --version`. |
| npm cannot find `package.json` | Change to the project folder before running the command. |
| The local URL does not load | Keep the Vite terminal running and use the exact URL it prints. It may choose a different port if the default is busy. |
| A hosted page loads blank | Deploy both `index.html` and `assets/` from the same build. Check the base path if the site is served from a subdirectory. |
| A saved session does not appear | Check the browser profile, URL and port. Browser storage is tied to the site's origin. |

## Project layout and tests

| Path | Purpose |
| --- | --- |
| [`src/main.js`](src/main.js) | Starts the app, wires the dashboard and handles shortcuts and autosave. |
| [`src/engine/`](src/engine/) | Simulation state, decision gates, resource pools, role actions, scenario events and War Room rules. |
| [`src/components/`](src/components/) | Dashboard panels, role controls, facilitator tools and debrief. |
| [`src/styles/`](src/styles/) | Layout, styling and visual effects. |
| [`src/engine/__tests__/simulation.test.js`](src/engine/__tests__/simulation.test.js) | Engine checks, including a full 21-day simulation. |

Run `npm test` for the engine suite and `npm run build` to check the production bundle. The application uses JavaScript, Vite and GSAP.

## Licence

The repository is public and currently has no published licence. Contact the project owner for permission to reuse or redistribute it.
