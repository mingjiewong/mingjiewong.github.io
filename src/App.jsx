import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { FaGithub, FaLinkedin, FaFilePdf } from "react-icons/fa";
import { SiHuggingface } from "react-icons/si";
import ThemeToggle from "./ThemeToggle";

// Import page components
import HomePage from "./pages/HomePage";
import EcologistPost from "./pages/EcologistPost";

// Import shared data
import { greetings, newestPosts, latestExperience } from "./data.js";

/**
 * The main application component.
 * Handles routing, theme management, and overall page layout.
 */
export default function App() {
  const base = import.meta.env.BASE_URL || "/";
  const [greeting] = useState(() => greetings[Math.floor(Math.random() * greetings.length)]);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="flex justify-center bg-[var(--background)]">
      <div className="w-full max-w-[768px] px-6">
        <header className="sticky top-0 z-50 bg-[var(--background)]">
          <div className="flex justify-end items-center" style={{ minHeight: "80px" }}>
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </header>

        <main>
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  greeting={greeting} 
                  newestPosts={newestPosts} 
                  latestExperience={latestExperience} 
                />
              } 
            />
            <Route path="/blog/ecologist-ai" element={<EcologistPost />} />
          </Routes>
        </main>

        <footer className="mt-16 pt-6 border-t border-[var(--border)] opacity-80 text-sm flex justify-between items-center min-h-[60px]">
          <div className="text-[15px]">
            © {new Date().getFullYear()}, Ming Jie Wong.{" "}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" className="hover:underline no-underline text-current">
              CC BY 4.0.
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <a href={`${base}resume.pdf`} target="_blank" rel="noreferrer" aria-label="Resume" className="hover:opacity-100 opacity-80 transition-opacity text-current">
              <FaFilePdf size={20} />
            </a>
            <a href="https://www.linkedin.com/in/ming-jie-wong/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:opacity-100 opacity-80 transition-opacity text-current">
              <FaLinkedin size={20} />
            </a>
            <a href="https://huggingface.co/mjwong" target="_blank" rel="noreferrer" aria-label="HuggingFace" className="hover:opacity-100 opacity-80 transition-opacity text-current">
              <SiHuggingface size={20} />
            </a>
            <a href="https://github.com/mingjiewong" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:opacity-100 opacity-80 transition-opacity text-current">
              <FaGithub size={20} />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
