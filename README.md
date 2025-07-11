# Alert Card

A custom Lovelace card for Home Assistant to display the state of a room or entity at a glance, with customizable icon, image, and actions.

## Features

- Display entity state with custom image/icon
- Configurable colors and actions
- Editor UI for easy configuration

## Installation

### Manual

1. Download the latest `alert-card.js` from the [releases](https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/releases) page.
2. Place it in your Home Assistant `www/alert-card/` directory (create if it doesn't exist).
3. Add the following to your Lovelace resources:
   ```yaml
   - url: /local/alert-card/alert-card.js
     type: module
   ```

### HACS (Recommended)

1. Go to HACS > Frontend > Custom repositories.
2. Add your repository URL and select "Lovelace" as the category.
3. Install "Alert Card" from HACS.
4. Add the resource automatically or manually as above.

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

## Development

- Source: [`src/`](src/)
- Build: `npm run build` (bundles and prepares the card for Home Assistant)

> **Note:** This card uses [custom-card-helpers](https://github.com/custom-cards/custom-card-helpers) for action handling compatibility with Home Assistant.

## Deploy

See `deploy.sh`

## License

MIT
