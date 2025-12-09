# Running the Coaching Hotboard App Locally

## Quick Start

1. **Navigate to the app folder:**
   ```bash
   cd app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   The terminal will show a URL like `http://localhost:5173` - open that in your browser.

## Folder Structure

```
app/
├── public/
│   └── coaches_data.json    ← Your coaching data goes here
├── src/
│   ├── main.jsx             ← Entry point
│   └── CoachingHotboard.jsx ← Main component
├── index.html
├── package.json
└── vite.config.js
```

## Updating Your Data

When you add more coaches using the scraper or manual entry:

1. Run your scraper or `add_coaches_manual.py` to update `coaches_data.json`
2. Copy the updated file to the app:
   ```bash
   cp coaches_data.json app/public/
   ```
3. The app will automatically reload with the new data

## Building for Production

To create a production build:

```bash
cd app
npm run build
```

This creates a `dist` folder you can deploy to any static hosting service.

## Troubleshooting

**"Failed to load coaches data" error:**
- Make sure `coaches_data.json` is in the `app/public/` folder
- Check that the JSON is valid (no syntax errors)

**Port already in use:**
- Vite will automatically try another port, or you can specify one:
  ```bash
  npm run dev -- --port 3000
  ```

**Module not found errors:**
- Delete `node_modules` and run `npm install` again
