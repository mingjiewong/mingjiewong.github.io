import { ecologistPostPreview } from "./pages/EcologistPost";

/**
 * Truncates a string to a specified number of words and appends an ellipsis.
 * If the text is shorter than the word limit, it is returned unchanged.
 *
 * @param {string} text The input string to process.
 * @param {number} [limit=50] The maximum number of words to retain.
 * @returns {string} The truncated string, with '[...]' appended if truncation occurred.
 * @example
 * // returns "This is a long sentence[...]"
 * truncateWords("This is a long sentence that will be truncated.", 5)
 */
const truncateWords = (text, limit = 50) => {
  const words = text.split(' ');
  if (words.length > limit) {
    return words.slice(0, limit).join(' ') + '[...]';
  }
  return text;
};

/**
 * @description A list of international greetings used for the hero section.
 * A random greeting is selected on each page load.
 */
export const greetings = ["Hej", "Hello", "Hola", "Bonjour", "Ciao", "こんにちは", "안녕하세요", "你好", "नमस्ते", "வணக்கம்"];

/**
 * @description An array of blog post objects for display on the homepage.
 * @type {Array<{
 *   title: string;
 *   desc: string;
 *   href: string;
 *   date: string;
 *   tags: string[];
 * }>}
 */
export const newestPosts = [
  {
    title: "Building an AI-Powered Wildlife Identifier for Southeast Asia Using BioCLIP, MongoDB Atlas, and Serverless Infrastructure",
    desc: truncateWords(ecologistPostPreview),
    href: "/blog/ecologist-ai",
    date: "2025-08-01",
    tags: ["AI", "Computer Vision", "Serverless", "Terraform"],
  },
];

/**
 * @description An array of professional experience objects.
 * @type {Array<{
 *   role: string;
 *   company: string;
 *   period: string;
 *   desc: string;
 * }>}
 */
export const latestExperience = [
  {
    role: "Data Scientist",
    company: "Volvo Cars Tech Hub Singapore",
    period: "2025 - Present",
    desc: "Focused on deploying self-hosted LLMs and building MLOps infrastructure for orchestrating internal AI workflows and data pipelines.",
  },
  {
    role: "Data Scientist",
    company: "Singapore Press Holdings (SPH) Media",
    period: "2021 - 2024",
    desc: "Developed and productionized NLP systems for article summarization, tagging, and personalized recommendations across major publications.",
  },
];