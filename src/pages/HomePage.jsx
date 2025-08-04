import { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineCalendar } from "react-icons/ai";

/**
 * Renders the home page content, including hero, about, experience, and posts sections.
 * @param {{
 *   greeting: string;
 *   newestPosts: Array<object>;
 *   latestExperience: Array<object>;
 * }} props - The props for the component.
 */
export default function HomePage({ greeting, newestPosts, latestExperience }) {
  const base = import.meta.env.BASE_URL || "/";
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <>
      {/* HERO */}
      <section className="pt-12 pb-6 text-center space-y-5">
        <h1 className="text-4xl md:text-5xl text-strong leading-tight">
          <span>{greeting}, I'm Ming Jie</span>{" "}
          👋🏽
        </h1>
        <p className="opacity-90">
          Cloud-Native Developer • AI Platform & Applications Engineer • 🇸🇬
        </p>
        <img
          src={`${base}home.jpg`}
          alt="Cover"
          width="1280"
          height="720"
          className="mx-auto w-full max-w-[640px] h-auto rounded-xl border border-[var(--border)] shadow-lg"
        />
      </section>

      {/* ABOUT, EXPERIENCE, POSTS SECTIONS */}
      <section className="space-y-12 py-12">
        {/* About Section */}
        <div className="grid md:grid-cols-[auto,1fr] items-start gap-4">
          <h2 className="text-lg text-strong">About</h2>
          <div className="flex gap-6">
            <div className="self-center">
              <img
                src={`${base}profile.jpg`}
                alt="Ming Jie Wong"
                width="120"
                height="120"
                className="w-24 h-24 object-contain"
              />
            </div>
            <p className="text-[17px] opacity-90 leading-relaxed">
              🇸🇬 Software engineer building robust, scalable infrastructure for deploying Large Language
              Models (LLMs) in enterprise environments. My recent work spans NLP applications, MLOps, LLM
              orchestration, and data pipeline automation. Off hours, I contribute to open-source projects,
              enjoy reading philosophy, and deepen my Anapānasati meditation practice.
            </p>
          </div>
        </div>

        {/* Experience Section */}
        <div className="grid md:grid-cols-[auto,1fr] items-start">
          <h2 className="text-lg text-strong">Latest Experience</h2>
          <div className="space-y-8">
            {latestExperience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-[20px]">{exp.role}</h3>
                  <p className="text-[20px] opacity-90">{exp.period}</p>
                </div>
                <p className="text-[20px] opacity-90 mb-2">{exp.company}</p>
                <p className="text-[17px] opacity-90">{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Newest Posts */}
        <div className="grid md:grid-cols-[auto,1fr] items-start">
          <h2 className="text-lg text-strong mb-4">Newest Posts</h2>
          <div className="grid md:grid-cols-2">
            {newestPosts.map((post, idx) => (
              <Link
                key={post.href}
                to={post.href}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="
                  group
                  block
                  text-[var(--foreground-muted)]    
                  no-underline             
                  visited:text-[var(--foreground-muted)]
                  border-b border-[var(--border)] p-4 last:border-b-0
                  transition-colors duration-200 ease-out
                  hover:bg-gray-100/50 dark:hover:bg-gray-800/50
                "
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="flex items-center text-[14px] mb-1 opacity-80 group-hover:opacity-100">
                      <AiOutlineCalendar size={20}/>
                      <span>&nbsp;{post.date}</span>
                    </div>
                    <h3 className="text-lg leading-tight transition-all duration-200 ease-out opacity-80 group-hover:opacity-100 group-hover:underline">{post.title}</h3>
                    <p className="text-[15px] leading-relaxed transition-opacity duration-200 ease-out opacity-80 group-hover:opacity-100">{post.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}