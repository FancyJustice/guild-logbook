# The Guild Logbook

A fantasy-themed character database and admin panel for your VRChat guild. Browse guild members and criminals with filtering, search, and detailed character information.

## Features

- 📖 **Interactive Character Browser** - Browse characters with fantasy aesthetic
- 🔍 **Advanced Filtering** - Search by name, race, class, affiliation, personality
- 👤 **Guild & Criminal Types** - Separate sections for members and wanted criminals
- ⚙️ **Admin Panel** - Password-protected interface to add/edit/delete characters
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Fantasy Styling** - Parchment and gold medieval theme
- 💾 **Local Storage** - Changes persist in your browser
- 🚀 **Easy Deployment** - Deploy free on GitHub Pages

## Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The site will be available at `http://localhost:5173`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete GitHub Pages deployment instructions.

Quick summary:
1. Create a GitHub repository
2. Push code to GitHub
3. Enable GitHub Pages in repository settings
4. Your site is live!

## Usage

### Browse Characters
1. Go to the site
2. Use filters and search to find characters
3. Click a character card for full details

### Admin Panel
1. Click **Admin** button
2. Enter password: `guild2024`
3. Add, edit, or delete characters
4. Changes save to your browser

## Configuration

### Change Admin Password
Edit `src/App.jsx` line 12:
```javascript
const [adminPassword, setAdminPassword] = useState('your-new-password')
```

### Manage Characters
Characters are stored in `public/characters.json`. You can:
- Edit JSON directly and commit to GitHub
- Use the Admin panel (changes save to browser localStorage)
- Combine both approaches

### Customize Dropdowns
Edit the `dropdownOptions` in `public/characters.json`:
- Personality traits
- Flaws
- Elemeltan Attunements
- Classes
- Races
- Life Skills

## Character Data Structure

Each character includes:
- Basic Info: Name, VRC Player Name, Gender, Race, Age, Class, Height
- Guild/Criminal Details: Type, Affiliation, Status, Rank, Origin
- Attributes: Personality, Flaw, Elemeltan Attunement
- Abilities: Combat Skills, Life Skills
- Story: Quote, Lore, Observations
- Criminal Fields: Bounty, Crime (for criminal type)

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **PostCSS** - CSS processing

## Future Enhancements

- 3D artifact viewer using Three.js
- Database backend (Supabase) for real-time sync
- Photo uploads (Cloudinary/Imgur)
- Character statistics and achievements
- Guild announcements section

## Troubleshooting

**Characters not showing?**
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh page (Ctrl+Shift+R)
- Check browser console (F12) for errors

**Admin panel not accessible?**
- Verify correct password is entered
- Check localStorage in browser dev tools
- Try incognito/private mode

**Images not loading?**
- Ensure image URLs are direct links
- Test URL in new browser tab
- Check CORS headers on image server

## Project Structure

```
guild-logbook/
├── public/
│   └── characters.json          # Character data
├── src/
│   ├── components/
│   │   ├── Browser.jsx          # Main interface
│   │   ├── CharacterGrid.jsx    # Card display
│   │   ├── CharacterDetail.jsx  # Full view
│   │   ├── FilterBar.jsx        # Search/filter
│   │   ├── AdminPanel.jsx       # Admin interface
│   │   └── CharacterForm.jsx    # Add/edit form
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## License

Free to use and modify for your VRChat guild!

---

Built with ❤️ for fantasy gaming communities
