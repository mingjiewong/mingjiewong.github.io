# Personal Homepage & Blog

This is my personal homepage and blog, built with React and Vite. It features a clean, responsive design, a dark/light theme toggle, and statically generated blog posts.

## Tech Stack

- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router](https://reactrouter.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) & [Lucide React](https://lucide.dev/)

## Getting Started

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Run the development server:**
    ```sh
    npm run dev
    ```
    The site will be available at `http://localhost:5173`.

## Available Scripts

- `npm run dev`: Starts the development server with Hot Module Replacement (HMR).
- `npm run build`: Bundles the application for production.
- `npm run lint`: Lints the source code using ESLint.
- `npm run preview`: Serves the production build locally for previewing.

## Adding a New Blog Post

To add a new blog post to the site, follow these steps:

### 1. Create the Post Component

Create a new `.jsx` file in the `src/pages/` directory (e.g., `src/pages/MyNewPost.jsx`). This file will contain the content of your blog post. At the top of the file, export a `const` containing a short preview text.

```jsx
// filepath: src/pages/MyNewPost.jsx
import { Link } from 'react-router-dom';

// Export a short preview for the homepage listing.
export const myNewPostPreview = "This is a short preview of my new blog post...";

export default function MyNewPost() {
  const base = import.meta.env.BASE_URL || "/";

  return (
    <div className="w-full max-w-[768px] px-6 py-12 text-[20px] mx-auto">
      <Link to={base} className="inline-flex items-center gap-2 text-[var(--foreground-muted)] no-underline opacity-60 mb-8 font-bold hover:opacity-100 hover:underline">
        <strong>Back to Home</strong>
      </Link>
      <article className="prose dark:prose-invert max-w-none">
        <h1>My New Blog Post Title</h1>
        <p>{myNewPostPreview}</p>
        {/* ... rest of your blog post content ... */}
      </article>
    </div>
  );
}
```

### 2. Update the Data File

Open `src/data.js` and add your new post to the `newestPosts` array.

-   Import the preview text you exported in the previous step.
-   Add a new object to the `newestPosts` array.

```javascript
// filepath: src/data.js
import { ecologistPostPreview } from "./pages/EcologistPost";
import { myNewPostPreview } from "./pages/MyNewPost"; // 1. Import the new preview

// ... (truncateWords function) ...

export const newestPosts = [
  // 2. Add the new post object here
  {
    title: "My New Blog Post Title",
    desc: truncateWords(myNewPostPreview),
    href: "/blog/my-new-post", // Use a unique URL
    date: "2025-08-04",
    tags: ["New Tag", "Another Tag"],
  },
  // Existing posts...
  {
    title: "Building an AI-Powered Wildlife Identifier...",
    desc: truncateWords(ecologistPostPreview),
    href: "/blog/ecologist-ai",
    date: "2025-08-01",
    tags: ["AI", "Computer Vision", "Serverless", "Terraform"],
  },
];

// ... (rest of the file) ...
```

### 3. Add the Route

Finally, open `src/App.jsx` and add a new `<Route>` for your post.

-   Import your new post component.
-   Add a `<Route>` inside the `<Routes>` block, making sure the `path` matches the `href` from `data.js`.

```jsx
// filepath: src/App.jsx
// ... other imports
import EcologistPost from "./pages/EcologistPost";
import MyNewPost from "./pages/MyNewPost"; // 1. Import the new component
import { greetings, newestPosts, latestExperience } from "./data.js";

export default function App() {
  // ... component logic ...

  return (
    <div className="flex justify-center bg-[var(--background)]">
      <div className="w-full max-w-[768px] px-6">
        {/* ... header ... */}
        <main>
          <Routes>
            <Route path="/" element={/* ... */} />
            <Route path="/blog/ecologist-ai" element={<EcologistPost />} />
            {/* 2. Add the new route here */}
            <Route path="/blog/my-new-post" element={<MyNewPost />} />
          </Routes>
        </main>
        {/* ... footer ... */}
      </div>
    </div>
  );
}
```

## License

This project is licensed under the **Creative Commons Attribution 4.0 International License**.

[![CC BY 4.0][cc-by-shield]][cc-by]

[cc-by]: https://creativecommons.org/licenses/by/4.0/
[cc-by-shield]: https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg