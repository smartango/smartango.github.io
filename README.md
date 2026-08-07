# Smartango - Cloud Native Consulting

[![Deploy Hugo site to GitHub Pages](https://github.com/smartango/smartango.github.io/actions/workflows/hugo.yml/badge.svg)](https://github.com/smartango/smartango.github.io/actions/workflows/hugo.yml)

This is the official website for Smartango consulting services, built with [Hugo](https://gohugo.io/).

## About

Smartango provides cloud-native application development and consulting services, led by Daniele Cruciani.

## Site Structure

- **Home Page**: Introduction to services, technologies, and consulting offerings
- **Products Page**: 
  - **GatearwayMan**: A gateway service for exposing, authenticating, and routing requests
    - Feature development status matrix
    - Interactive Docker Swarm deployment YAML generator (React application)

## Development

### Prerequisites

- Hugo Extended v0.100.0 or later
- Git

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/smartango/smartango.github.io.git
   cd smartango.github.io
   ```

2. Run the Hugo development server:
   ```bash
   hugo server -D
   ```

3. Visit `http://localhost:1313` in your browser

### Building for Production

Build the static site:
```bash
hugo --gc --minify
```

The generated site will be in the `public/` directory.

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the `main` branch.

### GitHub Pages Setup

To enable GitHub Pages deployment:

1. Go to your repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow will automatically build and deploy on every push to `main`

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── hugo.yml          # GitHub Actions deployment workflow
├── content/                   # Content files (Markdown)
│   ├── _index.md             # Home page content
│   └── products/
│       ├── _index.md         # Products listing
│       └── gatearwayman.md     # GatearwayMan product page
├── data/                      # Data files (YAML)
│   └── gatearwayman-features.yaml  # GatearwayMan feature status
├── static/                    # Static assets
│   ├── css/
│   │   └── style.css         # Site styles
│   └── js/
│       └── yaml-generator.js # React YAML generator app
├── themes/
│   └── custom/               # Custom Hugo theme
│       ├── layouts/
│       │   ├── _default/
│       │   │   ├── baseof.html
│       │   │   ├── single.html
│       │   │   └── gatearwayman.html
│       │   ├── partials/
│       │   │   ├── header.html
│       │   │   └── footer.html
│       │   └── index.html
│       └── theme.toml
├── hugo.toml                 # Hugo configuration
├── .gitignore
└── README.md
```

## Updating Feature Status

To update the development status of GatearwayMan features:

1. Edit `data/gatearwayman-features.yaml`
2. Change the `status` field for any feature:
   - `Released` - Feature is production-ready and deployed
   - `WIP` - Work in progress, actively being developed
   - `Define Requirements` - Requirements gathering phase
   - `Planned` - Planned for future development
3. Commit and push - the site will automatically rebuild

## Features

- ✅ Responsive design
- ✅ Custom Hugo theme
- ✅ Automated GitHub Pages deployment
- ✅ Interactive YAML generator for Docker Swarm deployments
- ✅ Feature matrix for product development status
- ✅ Clean, modern UI

## Technologies

- **Hugo**: Static site generator
- **React**: Interactive YAML generator component
- **GitHub Actions**: CI/CD deployment
- **GitHub Pages**: Hosting

## Contact

**Daniele Cruciani**  
Cell: +39 3489215204  
GitHub: [@smartango](https://github.com/smartango)

## License

This website is proprietary. All rights reserved.