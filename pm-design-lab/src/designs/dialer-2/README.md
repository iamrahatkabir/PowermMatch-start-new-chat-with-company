# Dialer 2.0 (developer handoff)

A call bar fixed to the bottom of every page, full width under the nav.

| File | What it is |
|---|---|
| `dialer/DialerBar.vue` | The call bar. **Ship this.** |
| `dialer/DndToast.vue` | "You are now in DND mode" toast: shows for 2 seconds when `show` turns true, then slides out to the right. Used inside DialerBar. **Ship this.** |
| `dialer/dialer.js` | Plain-JS helpers: `STATUS` (label + colors for Available and Do not disturb), `formatDuration(seconds)`. **Ship this.** |
| `parts/DialerPage.vue` | Prototype only: empty page + fake call state (timer, mute, hold, Do not disturb). |
| `A.vue` | Preview wrapper for version A. |

## Versions

| Version | What it is |
|---|---|
| A | Initial call bar. Left: status pill (**Available**). Centre: call timer, Mute, Hold, the big green **Call** button (red **Hang up** during a call), Keypad, Transfer. Timer and controls are greyed out until a call starts. Right: Missed calls (red count), Call queue, Do not disturb, Audio devices. **Do not disturb on:** red status pill, red moon button, toast for 2 seconds. |

## DialerBar

| Prop | Type | Notes |
|---|---|---|
| `inCall` | Boolean | Enables Mute / Hold / Keypad / Transfer and turns Call into Hang up. |
| `seconds` | Number | Call length, shown as `mm:ss`. |
| `muted`, `held` | Boolean | Mute shows a red crossed mic; Hold shows Resume. |
| `missed` | Number | Red badge on Missed calls (hidden at 0). |
| `dnd` | Boolean | Do not disturb on: the status pill becomes a red **Do not disturb** pill (crossed phone), the moon button turns solid red, and the DND toast shows above the bar's right edge for 2 seconds, then slides out to the right. Calling out still works. |

Events: `call`, `hang-up`, `mute`, `hold`, `keypad`, `transfer`, `history`, `queue`, `dnd`, `devices`.

Layout: wrap the app shell and the bar in a full-height column; the bar is 64px high with a 1px top border.
