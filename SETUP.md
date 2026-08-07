# GitHub Pages Setup Instructions

Follow these steps to enable GitHub Pages for your Hugo site:

## 1. Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/smartango/smartango.github.io`
2. Click on **Settings** tab
3. In the left sidebar, click **Pages** (under "Code and automation")
4. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions**
   - That's it! No need to select a branch when using GitHub Actions

## 2. Push Your Code

If you haven't already, push all the files to GitHub:

```bash
git add .
git commit -m "Initial Hugo site setup"
git push origin main
```

## 3. Wait for Deployment

1. Go to the **Actions** tab in your repository
2. You should see the "Deploy Hugo site to GitHub Pages" workflow running
3. Wait for it to complete (usually takes 1-2 minutes)
4. Once complete, your site will be live at: `https://smartango.github.io`

## 4. Verify Deployment

Visit `https://smartango.github.io` to see your live site!

## Troubleshooting

### Build Fails

- Check the Actions tab for error messages
- Ensure all required files are committed and pushed
- Verify Hugo syntax in content files

### Site Not Updating

- Check that the workflow completed successfully
- GitHub Pages can take a few minutes to reflect changes
- Try a hard refresh in your browser (Ctrl+F5 or Cmd+Shift+R)

### Custom Domain (Optional)

To use a custom domain:

1. Add a file named `CNAME` in the `static/` directory with your domain name
2. Configure your DNS provider to point to GitHub Pages
3. In repository Settings → Pages, add your custom domain

## Auto-Deployment

Every time you push to the `main` branch:
- GitHub Actions automatically builds the Hugo site
- The built site is deployed to GitHub Pages
- Your changes go live within 1-2 minutes

No manual deployment needed! 🚀
