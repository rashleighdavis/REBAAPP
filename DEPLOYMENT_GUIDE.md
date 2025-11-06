# REBA Deployment Guide

## 🚀 Quick Start - Local Development

### Prerequisites
- Node.js (version 16 or higher) - Download from https://nodejs.org
- Git (optional, but recommended) - Download from https://git-scm.com

### Step 1: Setup Your Project

1. **Extract/Copy all files** to a folder on your computer (e.g., `reba-app`)

2. **Open Terminal/Command Prompt** and navigate to your project folder:
   ```bash
   cd path/to/reba-app
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** to `http://localhost:5173`

That's it! Your app is now running locally.

---

## 🌐 Deploy to Production (Free Options)

### Option 1: Vercel (Recommended - Easiest)

**Vercel is the fastest way to deploy React apps - takes 2 minutes!**

1. **Create account** at https://vercel.com (free)

2. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

3. **Deploy**:
   ```bash
   npm run build
   vercel
   ```

4. Follow the prompts:
   - Link to existing project? **N**
   - Project name? **reba-app**
   - Directory? **./** (press Enter)
   - Override settings? **N**

5. **Done!** You'll get a live URL like: `https://reba-app.vercel.app`

**OR use Vercel Dashboard (No CLI needed):**
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your Git repository (or drag & drop your folder)
4. Click "Deploy"
5. Done! You'll get a live URL instantly

---

### Option 2: Netlify

**Great alternative with drag-and-drop deployment**

1. **Build your app**:
   ```bash
   npm run build
   ```

2. **Deploy via Netlify Dashboard**:
   - Go to https://netlify.com and sign up (free)
   - Click "Add new site" → "Deploy manually"
   - Drag and drop your `dist` folder
   - Done! You'll get a URL like: `https://reba-app.netlify.app`

**OR use Netlify CLI:**
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

---

### Option 3: GitHub Pages

**Perfect if you want to use GitHub**

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json** - add these lines:
   ```json
   {
     "homepage": "https://yourusername.github.io/reba-app",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Create GitHub repository**:
   - Go to github.com and create new repo named "reba-app"
   - Initialize git in your project:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/yourusername/reba-app.git
     git push -u origin main
     ```

4. **Deploy**:
   ```bash
   npm run deploy
   ```

5. **Enable GitHub Pages**:
   - Go to your repo → Settings → Pages
   - Source: gh-pages branch
   - Your site will be live at: `https://yourusername.github.io/reba-app`

---

### Option 4: Firebase Hosting

**Google's hosting platform**

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase**:
   ```bash
   firebase init hosting
   ```
   - Select "Use an existing project" or create new one
   - Public directory: **dist**
   - Single-page app: **Yes**
   - Automatic builds with GitHub: **No** (unless you want CI/CD)

4. **Build and Deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

5. **Done!** You'll get a URL like: `https://reba-app.web.app`

---

## 🔧 Adding Zillow API (Live Data)

To connect real MLS data, update `src/App.jsx`:

1. **Sign up for RapidAPI**: https://rapidapi.com/apimaker/api/zillow-com1
2. **Subscribe to Zillow API** (they have free tier)
3. **Get your API key** from the dashboard

4. **Update the code** in `src/App.jsx` around line 53:

Replace this section:
```javascript
// Demo data - In production, replace with actual Zillow API call
```

With:
```javascript
const response = await fetch(`https://zillow-com1.p.rapidapi.com/propertyExtendedSearch?location=${encodeURIComponent(query)}`, {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'YOUR_API_KEY_HERE',
    'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
  }
});

const data = await response.json();
// Map the Zillow API response to your propertyData format
```

5. **Redeploy** using whichever method you chose above

---

## 📱 Custom Domain (Optional)

### For Vercel:
1. Go to your project dashboard
2. Settings → Domains
3. Add your custom domain (e.g., reba-app.com)
4. Follow DNS configuration instructions

### For Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update your DNS records as instructed

---

## 🎯 Recommended Deployment Flow

**For Beginners:**
1. Start with Vercel - it's the easiest
2. Use the web dashboard (no CLI needed)
3. Deploy in under 2 minutes

**For Professional Use:**
1. Use Vercel or Netlify
2. Connect to GitHub for automatic deployments
3. Add custom domain
4. Set up SSL (included free with both platforms)

---

## 🐛 Troubleshooting

**Build fails?**
- Make sure Node.js version is 16+: `node --version`
- Delete `node_modules` and run `npm install` again
- Check for any errors in the console

**Voice recognition not working?**
- Use Chrome or Edge browser (Safari has limited support)
- Make sure you're using HTTPS (required for mic access)
- All deployment platforms provide HTTPS by default

**API calls failing?**
- Check your RapidAPI key is correct
- Verify your API subscription is active
- Check browser console for CORS errors

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- React + Vite Docs: https://vitejs.dev

## 🎉 You're Ready!

Your REBA app is now live and realtors can start using it immediately. The voice search will work on any modern browser, and you can add the Zillow API integration whenever you're ready.

**Recommended Next Steps:**
1. Deploy to Vercel (takes 2 minutes)
2. Test the voice search feature
3. Add your RapidAPI Zillow key for live data
4. Share the link with realtors
5. Add a custom domain for branding
