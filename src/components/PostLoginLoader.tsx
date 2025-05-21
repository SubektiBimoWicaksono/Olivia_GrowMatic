// src/components/PostLoginLoader.tsx
import { useEffect } from "react";
import "./PostLoginLoader.css"; // We'll create this CSS file next

const PostLoginLoader = () => {
  useEffect(() => {
    // Prevent scrolling when loader is active
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="text-center">
        <section className="loader">
          <div className="slider" style={{ "--i": 0 } as React.CSSProperties}></div>
          <div className="slider" style={{ "--i": 1 } as React.CSSProperties}></div>
          <div className="slider" style={{ "--i": 2 } as React.CSSProperties}></div>
          <div className="slider" style={{ "--i": 3 } as React.CSSProperties}></div>
          <div className="slider" style={{ "--i": 4 } as React.CSSProperties}></div>
        </section>
        <p className="mt-8 text-xl font-medium text-white">Preparing your dashboard...</p>
      </div>
    </div>
  );
};

export default PostLoginLoader;