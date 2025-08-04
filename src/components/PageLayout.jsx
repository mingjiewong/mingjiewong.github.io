import { Link } from "react-router-dom";

/**
 * A shared layout component that provides consistent page structure and styling.
 * Automatically applies w-[90%] max-w-[768px] and centers content.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The page content to render
 * @param {boolean} props.showBackLink - Whether to show the "Back to Home" link
 * @param {string} props.className - Additional CSS classes to apply
 */
export default function PageLayout({ children, showBackLink = false, className = "" }) {
  const base = import.meta.env.BASE_URL || "/";

  return (
    <div className={`w-[90%] max-w-[768px] px-6 py-12 mx-auto ${className}`}>
      {showBackLink && (
        <Link 
          to={base} 
          className="inline-flex items-center gap-2 text-[var(--foreground-muted)] no-underline opacity-60 mb-8 font-bold hover:opacity-100 hover:underline"
        >
          <strong>Back to Home</strong>
        </Link>
      )}
      {children}
    </div>
  );
}
