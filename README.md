# Welcome to Forge 42 Documentation Template
The documentation template is designed to support deeply nested sections and subsections, allowing you to organize your docs in a flexible, versioned structure. It comes with a whole UI implementation, which you can customize if desired.

## Documentation Template Structure Overview
`app/`
- components/: Reusable React components for documentation UI (e.g., sidebar, table of contents, code blocks, pager).
- hooks/: Custom React hooks used inside components.
- ui/: UI primitives.
- utils/: Utility functions for sidebar trees, table of contents, etc.
- tailwind.css: TailwindCSS styles.

`scripts/`
- validate-content-positions.ts: Script to validate content file positions and structure. you can run it with:
```bash
pnpm run validate-content-position
```
`resources/`
- icons/: SVG icon assets for the UI.

`content/`
- .mdx files or sections and subsections with index.md and .mdx files.


## Documentation Content Directory Layout Example
An example of a valid `content` folder structure containing your package documentation:
```
content/
├── changelog.mdx
├── introduction.mdx
├── overview.mdx
├── getting-started/
│   ├── index.md
│   ├── installation.mdx
│   ├── quick-start.mdx
│   └── project-setup.mdx
└── core-features/
    ├── index.md
    ├── authentication.mdx
    ├── authorization.mdx
    ├── data-management/
    │   ├── index.md
    │   ├── fetching-data.mdx
    │   └── caching-strategies.mdx
    └── ui-components/
        ├── index.md
        ├── buttons.mdx
        └── modals.mdx
```
- Top-level .mdx files are allowed.
- Sections (like getting-started, core-features) are subfolders.
- Subsections (like data-management, ui-components) are nested folders within sections.
- Each section or subsection should have an index.md file for its sidebar title and order.

### Example of the valid `introduction.mdx` file:
```
---
title: "Introduction to Forge42 Base Stack"
summary: "Overview of the Stack"
description: "Get started with the Forge42 Base Stack — a modern web app starter template designed for speed, scalability, and developer experience."
lastUpdated: 2025-07-20
author: Forge 42
position: 1
---

## What is Forge42 Base Stack?

The Forge42 Base Stack is a full-featured web application starter template. It combines modern tools and technologies like **Remix**, **Tailwind CSS**, **TypeScript**, **Vitest**, and **React Aria Components** to help you build accessible and scalable web apps quickly.

This documentation will guide you through setting up the project, understanding its structure, and customizing it for your needs.

## Installation

To get started with the base stack, simply clone the repository and install dependencies:

```bash
npx degit forge42/base-stack my-app
cd my-app
npm install
```

### Example of the valid `getting-started/index.md` file:
```
---
title: Getting Started
position: 1
---

```

### TODO add that this docs-template uses content-collections and some gray-matter and similar packages

## Getting started

1. Fork the repository

2. Install the dependencies:
```bash
pnpm install
```
3. Read through the README.md files in the project to understand our decisions.

4. Add `content` folder

5. TODO Run scripts...add this part

5. Start the development server:
```bash
pnpm run dev
```
5. Happy coding!
