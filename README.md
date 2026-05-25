# You Got This

A polished, mobile-first Progressive Web App for helping people feel grounded through daily wins, emoji mood check-ins, private journaling, history, sharing, and quiet support resources.

## Current build

This build focuses on layout and visual polish without changing the saved data format.

- Premium iPhone-style app shell
- Mobile full-screen PWA layout
- Desktop/tablet centred phone-style app container
- No stretched desktop layout
- Clean top navigation: Home / Journal / History
- Dedicated screens for:
  - Mood check-in
  - Daily wins
  - Journal
  - History
  - Support
  - Send link
- Support rebuilt as polished cards and sections
- Journal rebuilt as a dedicated calm writing screen
- Bottom bar removed
- Home dashboard cleaned up with large cards
- Warm dark theme with gold/brown accents
- Light mode still available
- PWA manifest and service worker checked for home-screen launch

## Shared access code

The app opens with a simple access code screen so the public link or QR code can be shared separately from the access code.

Default access code:

```text
45310
```

A person only needs to enter the code once on the same phone/browser. After that, the app remembers access locally and opens normally. They may be asked again if they clear browser data, use a different browser, use a different phone, or remove/reinstall the home screen app.

To change the code, edit `app.js` and find:

```js
const appAccessPassword = "45310";
```

Keep `appAccessKey` the same if people who already opened the app should not be asked again.

This is a simple front-end access gate for private sharing. It is not the same as secure user accounts because a technical person could inspect the app files. The optional PIN lock helps keep the journal private on that person’s own device.

## Add to Home Screen

The access screen and Send Link screen include install instructions.

iPhone:

```text
Open the live link in Safari
Tap Share
Tap Add to Home Screen
Tap Add
```

Android:

```text
Open the live link in Chrome
Tap the menu
Tap Add to Home screen / Install app
```

## Run locally

Open a terminal in this folder and run:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Deploy to Vercel

1. Upload this folder to the GitHub repository.
2. Commit the change.
3. Vercel should redeploy automatically.
4. After the new deployment, delete the old phone home-screen icon and add the app again if the old PWA icon does not open correctly.

No build command is needed.

## Files

```text
you-got-this/
├── index.html
├── styles.css
├── app.js
├── manifest.json
├── service-worker.js
├── README.md
├── icons/
├── assets/
└── data/
```

## Data and privacy

All journal entries, mood check-ins, wins and PIN details are stored locally in the user's browser using localStorage. This keeps version 1 simple, private, offline-friendly, and ready to grow later with optional cloud sync.

## Support section

This build includes quiet support information for:

- emergency danger
- urgent mental health support
- Bradford, Airedale, Wharfedale and Craven First Response
- Samaritans
- Shout text support
- CALM
- ANDYSMANCLUB
- domestic abuse routes
- local homelessness and emergency accommodation around Skipton, Craven, Keighley and Bradford

Important: phone numbers and service availability can change. Before sharing widely, check all support details with the relevant official organisations and update the app regularly.


Update note: v16 scroll shell fix keeps the header/nav separate from the main scroll area so content does not slide underneath the top navigation.


Update note: v17 widens the desktop/tablet layout into a polished centred app container while keeping mobile full-screen and preserving the scroll-shell fix.
