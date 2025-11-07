# Guild Logbook - Deployment Guide

## Overview
This is a fantasy character browser and admin panel for your VRChat guild. The site is built with React + Vite and can be deployed entirely on GitHub Pages (static hosting).

## Features
- **Browse View**: Public character database with filtering and search
- **Admin Panel**: Password-protected interface to add/edit/delete characters
- **Filters**: Search by name, type (guild/criminal), race, class, affiliation, personality
- **Character Types**: Supports both Guild Members and Criminal entries
- **Responsive Design**: Fantasy-themed dark parchment aesthetic

## Deployment to GitHub Pages

### Step 1: Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and create a new repository
2. Name it: `guild-logbook` (or whatever you prefer)
3. Make it **Public** (required for free GitHub Pages hosting)
4. Don't initialize with README (we'll push our code)

### Step 2: Initialize Git in Your Project
```bash
cd "F:\AI\Guild Vagabond\guild-logbook"
git init
git add .
git commit -m "Initial commit: Guild Logbook character browser"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/guild-logbook.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

### Step 3: Update package.json for GitHub Pages
Edit `package.json` and add this line after `"private": true`:
```json
"homepage": "https://YOUR-USERNAME.github.io/guild-logbook/",
```

Also add a deploy script:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "deploy": "npm run build && npx gh-pages -d dist"
}
```

### Step 4: Enable GitHub Pages
1. Go to your GitHub repository
2. Click **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Choose branch: **main**
5. Choose folder: **/ (root)**
6. Click Save

Your site will be live at: `https://YOUR-USERNAME.github.io/guild-logbook/`

(If you skip Step 3 and don't add homepage, the site will be at `https://YOUR-USERNAME.github.io/guild-logbook`)

### Step 5: Deploy
Each time you update characters or the code:
```bash
git add .
git commit -m "Update characters and styles"
git push origin main
```

If you set up the deploy script, you can also run:
```bash
npm run deploy
```

---

## Managing Characters

### Add Characters Via Admin Panel
1. Go to your site and click **Admin**
2. Enter password: `guild2024`
3. Click **+ Add Character**
4. Fill out the form with:
   - Basic info (Name, Race, Class, etc.)
   - Photo URL (must be a direct image link)
   - Personality and Flaw from dropdowns
   - Combat Skills & Life Skills (add each one individually)
   - Lore and quote
5. Click **Add Character**

### Edit/Delete Characters
- In Admin panel, find the character
- Click **Edit** to modify
- Click **Delete** to remove

### Data Persistence
Character data is saved in **localStorage** in your browser. This means:
- ✅ Changes persist across page reloads
- ✅ Each person's browser stores their own copy
- ⚠️ Data is NOT synced between browsers/devices

**Better Approach**: Manually update `/public/characters.json` with your characters and commit to GitHub for everyone to see the same data.

### Editing characters.json Directly
1. Edit `public/characters.json`
2. Follow the format:
```json
{
  "characters": [
    {
      "id": "char_001",
      "type": "guild",
      "name": "Character Name",
      "vrcPlayerName": "VRCName#1234",
      "photo": "https://image-url.jpg",
      "race": "Human",
      "class": "Warrior",
      "gender": "Male",
      "age": 25,
      "height": "6'0\"",
      "affiliation": "The Silver Warband",
      "placeOfOrigin": "The Northern Peaks",
      "status": "Active",
      "rank": "Captain",
      "title": "Legendary Hero",
      "quote": "\"Never give up.\"",
      "lore": "A seasoned warrior with decades of experience...",
      "personality": "Stoic",
      "flaw": "Ambitious",
      "elemeltanAttunement": "Fire",
      "combatSkills": ["Sword Mastery", "Shield Defense"],
      "lifeSkills": ["Blacksmithing", "Tracking"],
      "observations": "Always carries an old sword.",
      "bounty": null,
      "crime": null
    }
  ],
  "dropdownOptions": { ... }
}
```

3. Commit and push:
```bash
git add public/characters.json
git commit -m "Add new characters"
git push origin main
```

---

## Customization

### Change Admin Password
Edit `src/App.jsx` line 12:
```javascript
const [adminPassword, setAdminPassword] = useState('guild2024')
```
Change `'guild2024'` to your desired password.

### Change Dropdown Options
Edit `public/characters.json` - the `dropdownOptions` object contains all the dropdown lists.

### Colors & Styling
The fantasy aesthetic uses these colors (edit `tailwind.config.js` to change):
- **Parchment**: `#f4e8d8` (cream)
- **Wood**: `#4a3728` (dark brown)
- **Gold**: `#d4a574` (accent)
- **Seal**: `#8b0000` (red)

---

## Future Enhancements

### 3D Artifact Viewer
To add 3D models for artifacts:
1. Install Three.js: `npm install three`
2. Create a new `src/components/ArtifactViewer.jsx`
3. Add artifacts field to character data
4. Link in CharacterDetail component

### Database Backend
For real-time updates across devices (instead of localStorage):
1. Use **Supabase** (free PostgreSQL with auth)
2. Create `backend/` folder with Node.js API
3. Deploy backend to Vercel or Railway
4. Update frontend to fetch from API

### Photo Uploads
Currently requires image URLs. To support uploads:
1. Use **Cloudinary** (free tier) or **Imgur API**
2. Create upload endpoint
3. Update character form

---

## Troubleshooting

### Characters Not Showing
- Check that `characters.json` is in `/public` folder
- Reload page (Ctrl+Shift+R for hard refresh)
- Check browser console (F12) for errors

### Admin Panel Won't Load
- Make sure password is correct
- Check browser localStorage (F12 → Application → Local Storage)
- Try clearing site data and logging in again

### Deploy Not Working
- Verify GitHub Pages is enabled in Settings
- Check branch is set to `main`
- Ensure `homepage` is added to package.json
- Try `npm run build` to test locally first

### Images Not Loading
- Image URLs must be direct links (not shortened URLs)
- Must be from a CORS-enabled server
- Test URL in a new browser tab first

---

## File Structure
```
guild-logbook/
├── public/
│   └── characters.json       # All character data
├── src/
│   ├── components/
│   │   ├── Browser.jsx       # Main browse interface
│   │   ├── CharacterGrid.jsx # Card grid display
│   │   ├── CharacterDetail.jsx # Full character view
│   │   ├── FilterBar.jsx     # Search & filter controls
│   │   ├── AdminPanel.jsx    # Admin interface
│   │   └── CharacterForm.jsx # Add/edit form
│   ├── App.jsx               # Main app component
│   ├── index.css             # Global styles (Tailwind)
│   └── main.jsx              # Entry point
├── package.json              # Dependencies & config
├── vite.config.js            # Vite build config
└── tailwind.config.js        # Tailwind CSS config
```

---

## Support
If you encounter issues:
1. Check the browser console (F12) for error messages
2. Verify image URLs are valid (test in new tab)
3. Ensure JSON formatting is correct (use JSONLint)
4. Try clearing browser cache (Ctrl+Shift+Delete)

---

## Next Steps
1. Deploy to GitHub Pages (follow Step 1-5 above)
2. Add your first character via Admin panel
3. Share the link with your guild members!
4. Update password from default `guild2024` to something secure

Enjoy your fantasy guild logbook! 📖✨
