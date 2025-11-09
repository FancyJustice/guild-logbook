# Vercel Deployment Guide

This guide will help you deploy Guild Logbook to Vercel for free hosting with live editing.

## Quick Start

### 1. Sign up for Vercel
- Go to https://vercel.com
- Click "Sign Up"
- Connect your GitHub account (easiest option)

### 2. Deploy from GitHub
- Click "New Project"
- Select your `guild-logbook` repository
- Vercel will auto-detect it's a Vite project
- Click "Deploy"

That's it! Your site is now live! 🚀

### 3. Get Your URL
After deployment completes, you'll get a URL like:
- `https://guild-logbook-xyz.vercel.app`
- Or use a custom domain

## How Data Persistence Works

Currently, character data is stored in **browser localStorage**:
- All edits are saved in the browser
- Data persists between sessions on the same device
- Export/Import using the JSON files

## Optional: Add Database Persistence

To allow multiple users to edit and save simultaneously, you can connect to:

### Option A: Firebase (Recommended)
1. Create a Firebase project at https://firebase.google.com
2. Enable Firestore Database (free tier)
3. Update `src/App.jsx` to save to Firebase instead of localStorage
4. Users' changes will sync in real-time

### Option B: Vercel KV (Redis)
1. Add KV store to your Vercel project
2. Use the provided credentials in environment variables
3. Update `api/characters.js` to use KV store

### Option C: GitHub API
1. Generate a GitHub token
2. Use GitHub API to commit changes directly to your repo
3. More complex but keeps data in GitHub

## Character Images

Images are stored in `public/images/characters/`:
- Upload resized images here
- JSON references them as file paths
- Automatically served by Vercel

## Editing on Vercel

1. **Browse**: Visit your Vercel URL to browse characters
2. **Edit**: Click Admin panel (password: guild2024)
3. **Changes save to**: Browser localStorage
4. **Export**: Download character JSON files for backup
5. **Import**: Re-upload modified JSONs using Merge feature

## Environment Variables (Optional)

If you add database integration, add secrets in Vercel:
1. Go to Project Settings → Environment Variables
2. Add `DATABASE_URL`, `FIREBASE_CONFIG`, etc.
3. Redeploy

## Git Integration

- Any changes pushed to GitHub automatically deploy to Vercel
- Vercel watches your main branch
- Deployment takes ~2-3 minutes

## Custom Domain

To use your own domain:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Support

For issues:
- Check Vercel logs: Project → Deployments → View logs
- Check browser console for errors (F12)
- Verify image paths in `public/images/characters/`
