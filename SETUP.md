# 🚀 Quick Setup Guide for GitHub Pages

## Step 1: Upload to GitHub

1. **Create a new repository** on GitHub:
   - Go to https://github.com/new
   - Name it `imageCutter` (or any name you prefer)
   - Make it public
   - Don't initialize with README (we already have one)

2. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/imageCutter.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section (in the left sidebar)
4. Under **Source**, select **"Deploy from a branch"**
5. Choose **"main"** branch and **"/ (root)"** folder
6. Click **Save**

## Step 3: Access Your Website

- Your website will be available at: `https://YOUR_USERNAME.github.io/imageCutter/`
- It may take a few minutes for the first deployment

## Step 4: Update README (Optional)

Replace `yourusername` in the README.md file with your actual GitHub username for correct links.

## 🎉 You're Done!

Your Image Grid Cutter is now live on GitHub Pages!

## 🔧 Local Testing

To test locally before pushing changes:

```bash
# Start local server
python3 -m http.server 8000

# Open http://localhost:8000 in your browser
```

## 📝 Making Changes

1. Edit files locally
2. Test with local server
3. Commit and push:
   ```bash
   git add .
   git commit -m "Your change description"
   git push
   ```

GitHub Pages will automatically update your live site!
