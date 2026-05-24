# You Got This

A positive, mobile-first Progressive Web App for helping people feel grounded through easy daily wins, emoji mood check-ins, positive notes, a private daily journal, and quiet support resources.

## What it does

- Positive daily tick list
- Basic emoji mood check-in at the beginning
- Encouraging micro-celebrations when users complete wins
- Bright daily affirmation
- Add your own custom win
- Positive journal prompt with a clear save button
- Separate personal journal tab for each day
- Date picker to go back and write for previous days
- History tab with past entries
- Weekly and monthly summary cards
- Light and dark mode with visible labels
- Saves privately in the browser with `localStorage`
- Works offline after first load
- Installable as a PWA
- Shared access code gate before the app opens
- Useful support numbers visible on the lock screen
- Ready for Vercel static deployment


## Shared access code

This version opens with a simple access code screen so the public link or QR code can be shared separately from the access code.

Default access code:

```text
45310
```

A person only needs to enter the code once on the same phone/browser. After that, the app remembers access locally and opens normally. They may be asked again if they clear browser data, use a different browser, use a different phone, or remove/reinstall the home screen app.

To change the code, edit `app.js` and find:

```js
const appAccessPassword = "45310";
```

Change the code inside the quotes, commit the file in GitHub, and Vercel will redeploy. Keep `appAccessKey` the same if you do not want people who already opened the app to be asked again.

This is a simple front-end gate for casual/private sharing. It is not the same as secure user accounts because a technical person could inspect the app files. The optional PIN lock still protects the journal on that person’s own device.

## Add to Home Screen instructions

The access screen now includes quick install instructions:

- iPhone: open the link in Safari, tap Share, then Add to Home Screen.
- Android: open the link in Chrome, tap the menu, then Add to Home screen or Install app.

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

1. Upload this folder to a GitHub repository.
2. Go to Vercel.
3. Import the repository.
4. Use the default static site settings.
5. Deploy.

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

## Notes

All entries are stored locally in the user's browser. This keeps version 1 simple, private, offline-friendly, and ready to grow later with optional cloud sync.


## Support section

This build includes a quick-access support tab for:
- emergency danger
- urgent mental health support
- local Bradford, Airedale, Wharfedale and Craven crisis support
- homelessness and emergency accommodation around Skipton, Keighley and the wider nearby area
- domestic abuse and immediate safety

Important: phone numbers and service availability can change. Before using publicly, check all crisis details with the relevant official organisations and update the app regularly.


## Latest update

The Support tab now has clear Male support, Female support, and Anyone / emergency housing sections.


## Final public name

This release uses the public app name **You Got This**.


## Latest update

- Added a clear Home button/tab so users can quickly return to the daily grounding screen.


## Latest update

- Top quick actions now show **Home** on the left and **Support** on the right.
- Main menu now sits at the top and only includes **Home**, **Journal**, and **History**.
- Added a **Send link** button using the phone/browser share sheet where available.
- Added an optional local PIN lock for casual privacy on the user's own device.

Security note: the PIN lock is a simple device-level privacy screen. It helps stop casual viewing if someone opens the app, but it does not encrypt journal data or replace proper device security.


## Latest update

- Access code is clearly explained as a one-time entry per phone/browser.
- Added Add to Home Screen instructions directly on the access screen.
- Kept the same access memory key so existing unlocked devices are not asked again.
