# Alert Card

A custom Lovelace card for Home Assistant to display the state of a room or entity at a glance, with customizable icon, image, and actions.

---

## Features

- Display entity state with custom image or icon
- Configurable colors and actions
- Editor UI for easy configuration
- Compatible with [custom-card-helpers](https://github.com/custom-cards/custom-card-helpers)

---

## Installation

### Manual Installation

1. **Build the card**  
   Run:

   ```sh
   npm install
   npm run build
   ```

   This will generate `dist/alert-card.js`.

2. **Copy to Home Assistant**  
   Place `dist/alert-card.js` in your Home Assistant `www/alert-card/` directory (create it if it doesn't exist).

3. **Add as a Lovelace resource**  
   In Home Assistant, go to _Settings > Dashboards > Resources_ and add:
   ```yaml
   - url: /local/alert-card/alert-card.js
     type: module
   ```

---

### HACS Installation (Recommended)

1. **Repository Setup**
   - In Home Assistant, go to _HACS > Frontend > Custom repositories_.
   - Add your repository URL (e.g., `https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME`) and select "Lovelace" as the category.

2. **Install the Card**
   - Find "Alert Card" in HACS under Frontend and install it.

3. **Add as a Lovelace resource**
   - HACS may add the resource automatically. If not, add it manually as above.

4. **Update**
   - When you release a new version, users can update via HACS.

---

## Usage

Add to your dashboard using the UI editor or YAML:

```yaml
- type: "custom:alert-card"
  entity: sensor.living_room
  title: Living Room
  image: /local/alert-card/living_room.png
  icon_bg_color: "#f5f3eb"
  state_field: state
  tap_action:
    action: more-info
```

---

## Configuration Options

| Name              | Type   | Required | Description                    |
| ----------------- | ------ | -------- | ------------------------------ |
| entity            | string | yes      | Entity ID to display           |
| title             | string | yes      | Card title                     |
| image             | string | yes      | Image URL                      |
| icon_bg_color     | string | no       | Icon background color          |
| state_field       | string | no       | Field to display (state, etc.) |
| tap_action        | object | no       | Action on tap                  |
| hold_action       | object | no       | Action on hold                 |
| double_tap_action | object | no       | Action on double tap           |

---

## Development

- Source code: [`src/`](src/)
- Build: `npm run build` (bundles and prepares the card for Home Assistant)
- Lint: `npm run lint`
- Format: `npm run format`

---

## Deploying to Home Assistant (Advanced/Manual)

You can use the provided `deploy.sh` script to copy the built card to a remote Home Assistant instance.  
Edit the variables in `deploy.sh` to match your setup, then run:

```sh
./deploy.sh
```

---

## Next Steps to Deploy to HACS

1. **Push your latest code to GitHub.**
2. **Tag a release** (e.g., `v0.1.0`) on GitHub.  
   HACS will use your releases to provide updates to users.
3. **Ensure your `hacs.json` is correct** (it should point to the built file, e.g., `dist/alert-card.js`).
4. **Test installation via HACS** in your Home Assistant instance.

---

## License

MIT
