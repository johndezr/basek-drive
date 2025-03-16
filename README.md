# 🛠️ BasekDrive: Google Drive File Picker for Jupyter Tree

## Vercel URL

<https://basek-drive.vercel.app>

## 📌 Project Description

Custom file picker built with **Next.js 15** that allows retrieving files from Google Drive, indexing, and un-indexing them in the user's storage to later create a knowledge base in Jupyter Notebook.

## Getting Started

- Ensure that Jupyter Notebook is running locally (see Jupyter configuration below).
- Since the application is created in test mode by Google, only limited emails can use it.
- Clone the project and run it on localhost:

```bash
yarn && yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## ⚒️ Tech Stack

- **Framework**: React + Next.js (latest stable version)
- **Data Fetching**: Fetch + React Query
- **Styling**: Tailwind CSS (latest stable version)
- **Component Library**: Shadcn (latest stable version)
- **External Libraries**:
  - @react-oauth/google
  - googleapis

## 📦 Integration with Jupyter Notebook

### **Local Installation**

1. Ensure Python is installed.
2. You can configure everything easily via VS Code [https://www.youtube.com/watch?v=suAkMeWJ1yE&ab_channel=VisualStudioCode] or open the terminal and follow these steps:

Create and activate a virtual environment:

```sh
python3 -m venv jupyter_env
source jupyter_env/bin/activate
```

Then:

```sh
python3 -m pip install notebook
jupyter notebook --version
jupyter notebook
```

By default, Jupyter Notebook runs on <http://localhost:8888/>. Now you can visit the file directory at <http://localhost:8888/tree>, where our knowledge base will be stored.

To interact with the API, we need a token. Obtain it with the following command:

```sh
jupyter notebook list
```

You will see something like: `http://localhost:8888/?token=abcdef123456789`

3. The API will be exposed at `http://localhost:8888/api/contents/`. For more details, check these links:

- <https://jupyter-server.readthedocs.io/en/latest/developers/rest-api.html>
- <https://github.com/jupyter/jupyter/wiki/Jupyter-Notebook-Server-API>

### **Production**

This video explains the available options: <https://www.youtube.com/watch?v=mnW61tjHsqI>. I chose Binder because it is super easy to set up and allows me to connect to the API. The only issue is persistence, but it works well for testing.

## Dealing with Google Drive API

TBD

## High-Level Design System

A high-level design system that outlines functional requirements and the RADIO system for this project:

### Functional Requirements

- Ability to connect and grant consent and permissions to Google Drive via the API.
- Retrieve files and folders.
- Display a folder or file selector for indexing.
- Remove previously indexed files from the indexed list.
- Display all files or folders with their contents in a table, allowing selection of individual files or entire folders.
- Select and index/un-index a file or folder (user storage and Jupyter) with user feedback.

### Requirements Exploration: Scope and Clarifying Questions

- **What happens if there is a deep folder structure (5 levels)? How deep do we display? What if there are no files?**
  - All folders must contain at least one file; otherwise, they are not rendered.
  - A depth limit of 3 levels is set.
- **Does the user session persist after leaving? How can we track previously indexed files? Can we store session progress in a simple API or database?**
  - We will use LocalStorage to save session progress and state.
- **What is the maximum number of files we allow indexing?**
  - A limit of 20 files will be set. However, we may explore IndexedDB as an alternative.
- **What happens if an indexed file is deleted from Google Drive? What if it is removed from Jupyter Notebook?**
  - The system should not be affected. There is no need for a direct WebSocket connection to Google Drive; we act as an independent file repository.
- **How does a knowledge base work based on files?**
  - It is a repository where files from multiple sources are gathered and organized. In our case, users will centralize selected Google Drive files.

### High-Level Architecture

#### Component Responsibilities

- **Server**: Provides HTTP APIs to fetch folders/files and index/un-index files in Jupyter
  - Google Drive API
  - Jupyter API
- **Client**:
  - services
  - api (Next.js API route handlers)
  - libs
  - utils
  - domain (models/use-cases)
  - client-store (LocalStorage management)
  - hooks
  - layout
    - Pages
    - Components
      - ui/shadcn
      - app-components
      - modules

![alt text](<domain  use cases.png>)

#### Rendering Approach: SSR and CSR

- Performance is generally better; First Contentful Paint (FCP) is high, and SSR-rendered pages appear faster than CSR.
- Lower Cumulative Layout Shift (CLS) since final HTML is already present.
- SSR allows personalized pages (user-specific content) instead of static generation, crucial for scaling e-commerce platforms.

## Data Model

### **File (Server)**

```json
{
  "name": "file.pdf",
  "size": 1024,
  "fileType": "pdf",
  "date": "2025-03-15"
}
```

### **User (Server/Client)**

```json
{
  "id": "user123",
  "name": "User",
  "profilePic": "avatar_url"
}
```

| Entity | Source | Belongs To        | Fields                               |
| ------ | ------ | ----------------- | ------------------------------------ |
| Folder | Server | folder/files list | name - files (list of files)         |
| File   | Server | folder/files list | name - size - mimeType - createdTime |
| User   | Server | client-store      | id - name - profilePic               |

## Interface Definition (API)

We need the following HTTP APIs:

- **User**:
  - Authenticate user into Google
  - Fetch user info
- **Files**:
  - Retrieve folders and files
- **Base Knowledge**:
  - Index and un-index files

| Source   | Destination | API Type | Functionality                     |
| -------- | ----------- | -------- | --------------------------------- |
| server 1 | client      | HTTP     | Authenticate user into Google     |
| server 1 | client      | HTTP     | Fetch user info                   |
| server 1 | client      | HTTP     | Get list of files                 |
| server 2 | client      | HTTP     | Get list of already indexed files |
| client   | server 2    | HTTP     | Index/un-index a file             |

## Optimizations and Deep Dive

- **General Optimizations**:
  - All static files and fonts within the project, including icons.
  - Code-splitting for better performance.
  - Next.js SSR.
- **Accessibility**
- **Speed Insights**:
  - Do we meet key performance metrics? How do we achieve this?
  - What does SSR in Next.js offer for performance improvements?
  - Ensuring necessary content is displayed at each stage.
- **React Query**:
  - Leveraging caching for queries?

## Whats Next

TBD
