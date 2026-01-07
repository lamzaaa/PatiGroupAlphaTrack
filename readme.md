# Vite template for Pug Engine

## Required

### Node.js Version

From 20.x.x

```bash
node -v
```

### Switch version node using NVM

```bash
nvm use 20
```

## Getting Started

### How to Run the Source

To run the source code locally, follow these steps:

1. **Install Dependencies**: First, install the necessary dependencies by running:

    ```bash
    npm install
    ```

2. **Start the Development Server**: Launch the development server with:

    ```bash
    npm run dev
    ```

3. **Build for Production**: To build the project for production, use:

    ```bash
    npm run build
    ```

4. **Preview Production Build**: You can preview the production build locally with:
    ```bash
    npm run preview
    ```

## Features

### Keybind Shortcuts

The development server includes several keybind shortcuts to enhance your workflow:

-   **r + Enter**: Restart the server
-   **u + Enter**: Show server URL
-   **o + Enter**: Open in browser
-   **c + Enter**: Clear console
-   **g + Enter**: Generate Sass imports
-   **[ + Enter**: Build CSS
-   **] + Enter**: Build JS
-   **q + Enter**: Quit the server

Press `h` to display the list of available shortcuts.

## Styling System

### Automatic Sass Import Generation

Run `npm run generate-imports` to automatically update `src/styles/main.sass` with component imports:

Or pressing `g` on runtime

```sass
// Auto-generated in main.sass
@import "../components/Home/home"
@import "../components/About/about"
```

### TailwindCSS Integration

-   Custom responsive breakpoints
-   Custom utility classes with `rem:` prefix for responsive sizing
-   Custom clamp utilities for fluid typography
-   Gradient backgrounds and shadows

## Build Configuration

### Custom Build Features

-   **Smart entry naming**: Prevents conflicts between CSS and JS files
-   **Code splitting**: Automatic vendor chunk separation
-   **Asset optimization**: Images, fonts, and CSS are optimized
-   **Module resolution**: Clean import paths and shortcuts

### Custom Vite Plugins

-   **Vituum**: Multi-page Pug support with automatic routing
-   **Sass shortcuts**: Automatic import generation
-   **TailwindCSS**: Integrated with custom configuration

## 🎨 Design System

### Responsive Design

-   Mobile-first approach
-   Custom breakpoints: `xs`, `sm`, `md`, `lg`, `xl`, `1.5xl`, `2xl`, `3xl`
-   Fluid typography with `rem:` utilities
-   Responsive aspect ratios with `ratio-[w/h]` classes

### Color Scheme

-   Default gradient: `linear-gradient(139deg, #27A451 -25.75%, #006EB4 122.55%)`
-   Custom shadow system (light, medium, hard)
-   Text shadow utilities

### Typography

-   Inter Tight font family
-   Responsive typography with clamp functions
-   Custom header and subheader utilities

## 🔧 Advanced Features

### Notification System

```javascript
// Available notification types
import { t } from "./notification.js"

t.success("Success message")
t.error("Error message")
t.warning("Warning message")
t.info("Info message")
```

### Image Optimization

-   Lazy loading with Lozad.js integration
-   Responsive images with aspect ratio utilities
-   WebP format support
-   Automatic fallbacks

### Performance Optimizations

-   Code splitting and chunk optimization
-   CSS purging with TailwindCSS
-   Asset preloading and optimization
-   Tree shaking for minimal bundle size

## 📝 Development Tips

1. **Use the component generator** for consistent structure
2. **Run import generation** after adding new components
3. **Follow the naming conventions** for automatic processing
4. **Leverage Pug mixins** for reusable UI patterns
5. **Use TailwindCSS utilities** for rapid development

## 🚀 Deployment

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

The `dist/` folder contains the optimized production files ready for deployment.
