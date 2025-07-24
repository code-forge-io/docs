# Welcome to Forge 42 Documentation Template

This template is built to support a flexible content structure using .md/.mdx files organized in folders. It allows for deeply nested sections and subsections, making it easy to structure complex documentation with a clear hierarchy.

## Documentation Template Structure Overview

`app/`

This folder contains React Router v7 web application folders and files, including components and UI primitives for the documentation site’s interface, internal hooks and utilities, and the tailwind.css file for styling.


`resources/`

This folder contains all the resources used by the documentation site, such as SVG icons, fonts, and other assets.

`content/`

This folder contains sections and subsections with .mdx files that hold your documentation content. Below is the recommended structure to follow.


## Documentation Content Directory Example

An example of a valid content/ folder structure for organizing your package documentation:

```
content/
├── 01-changelog.mdx
├── 02-introduction.mdx
├── 03-overview.mdx
├── 04-getting-started/
│   ├── index.md
│   ├── 01-installation.mdx
│   ├── 02-quick-start.mdx
│   └── 03-project-setup.mdx
└── 05-core-features/
    ├── index.md
    ├── 01-authentication.mdx
    ├── 02-authorization.mdx
    ├── 03-data-management/
    │   ├── index.md
    │   ├── 01-fetching-data.mdx
    │   └── 02-caching-strategies.mdx
    └── 04-ui-components/
        ├── index.md
        ├── 01-buttons.mdx
        └── 02-modals.mdx
```
- Top-level .mdx files (like 01-changelog.mdx) are allowed.
- Sections (like 04-getting-started, 05-core-features) are subfolders inside the content/ folder.
- Subsections (like 03-data-management, 04-ui-components) are nested folders within sections.
- Each section or subsection should have an index.md file for its sidebar title.

### Example of the valid `02-introduction.mdx` file:
```
---
title: "Introduction to Forge42 Base Stack"
summary: "Overview of the Stack"
description: "Get started with the Forge42 Base Stack — a modern web app starter template designed for speed, scalability, and developer experience."
lastUpdated: 2025-07-20
author: forge-42
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

### Example of the valid `04-getting-started/index.md` file:
```
---
title: Getting Started
---

```


## Getting started

1. Fork the repository

2. Install the dependencies:
```bash
pnpm install
```
3. Read through the README.md files in the project to understand our decisions.

4. Add `content` folder

5. Start the development server:
```bash
pnpm run dev
```
5. Happy coding!
