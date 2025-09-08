# 🌐 Survey Form — Modern, Responsive, and Delightful

A beautiful, responsive survey form with a glassmorphism UI, inline validation, progress bar, autosave, and a polished submit experience. Built with accessible, semantic HTML, modern CSS, and lightweight vanilla JavaScript.

## ✨ Features

- 🎨 Elegant glassmorphism UI with background image and soft shadows  
- 📱 Fully responsive layout (mobile-first, grid-based)  
- 🧭 Progress bar that reflects form completion  
- ✅ Inline validation with friendly error messages  
- 💾 Autosave to localStorage (restore on refresh)  
- ⭐ Live rating value and character counter  
- 🔒 Required consent with clear messaging  
- 🔔 Toast notifications for success and errors  
- 🚀 Fast: deferred scripts, minimal dependencies  
- ♿ Accessibility: labels, aria-live regions, keyboard-friendly focus states

## 🗂️ Project Structure

/ ├─ index.html # Markup (semantic, accessible) ├─ style.css # Styles (glassmorphism theme + responsive) ├─ script.js # Logic (validation, progress, autosave, toasts) └─ README.md # You are here


## 🚀 Quick Start

- Option A: Open index.html directly in your browser.
- Option B: Serve locally (recommended for best results):
  - Python: python3 -m http.server 8080
  - Node (http-server): npx http-server -p 8080
  - VS Code: Install “Live Server” and click “Go Live”

Then visit:
http://localhost:8080

## 🧩 How It Works

- Progress: Computed from required fields (First Name, Email, Discovery, Consent). Valid email increases progress.  
- Validation: Inline errors for empty/invalid fields; age validated if provided (1–80).  
- Autosave: Saves values to localStorage under key survey-form-data and restores on load.  
- Submit flow: Shows loading spinner on the button, simulates async submission, shows success toast, clears storage, and resets the form.

## 🛠️ Customization

- Background Image
  - Open style.css and update the CSS variable:
    --bg-img: url('https://your-image.url/here.jpg');

- Theme Colors
  - Tweak primary, text, and panel colors via variables in :root:
    --primary, --primary-600, --primary-700, --text, --muted, --panel, --card

- Motion and Focus
  - Reduced motion respect:
    @media (prefers-reduced-motion: reduce) { ... }
  - Focus ring:
    --focus: 0 0 0 3px rgba(111, 168, 255, 0.6);

- Form Limits
  - Rating range: change min/max on #rating
  - Comment length: adjust maxlength on #comments

## 📋 Form Fields

- Personal Info: First Name (required), Last Name (required), Email (required + validated), Age (optional, 1–80)  
- Discovery & Usage: Discovery (required), Devices (checkboxes), Browser (radios), Satisfaction (radios), Rating (range with live output)  
- Feedback: Comments (with live character counter)  
- Consent: Required to submit

## ♿ Accessibility

- Proper label associations (for/ids)  
- aria-live for error and toast updates  
- Keyboard-friendly: focus states, clear tabbable elements  
- Semantic structure: header, main, section, fieldset, legend

## 🧪 FreeCodeCamp Notes

- Preserves FCC-required ids: title, description, survey-form, name, email, number, name-label, email-label, number-label, dropdown, submit.  
- Uses novalidate for custom inline validation while keeping required attributes.

## 🧰 Tech Stack

- HTML5 + CSS3 (no framework)
- Vanilla JavaScript (no dependencies)
- Works in modern browsers (Chromium, Firefox, Safari, Edge)

## 🐞 Troubleshooting

- Form doesn’t restore values:
  - Check localStorage is enabled and not blocked (Private/Incognito modes may restrict it).
- Progress bar doesn’t move:
  - Ensure Email is valid and required fields are filled.
- Styles look off:
  - Clear cache or do a hard reload. Confirm style.css is correctly linked in index.html.
- Background too bright/dim:
  - Adjust --overlay in style.css or the panel/card alpha values.

## 🧹 Scripts and Build

No build step required. All files are static and ready to serve.

## 📸 Screenshots (optional)

- Add your screenshots to /assets and link them here:
  - ![Desktop Screenshot](assets/screenshot-desktop.png)
  - ![Mobile Screenshot](assets/screenshot-mobile.png)

## 📜 License

MIT — free to use, modify, and distribute. Attribution appreciated.

## 🙌 Acknowledgements

- Background images courtesy of Unsplash photographers  
- Inspiration from modern glassmorphism and neumorphism design trends

Happy building! ✨