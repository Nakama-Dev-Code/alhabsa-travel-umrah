import { useEffect, useRef } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const tracingBeamRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollElement = scrollContainerRef.current;

    const handleScroll = () => {
      if (!scrollElement || !tracingBeamRef.current) return;

      const scrollTop = scrollElement.scrollTop;
      const scrollHeight = scrollElement.scrollHeight;
      const clientHeight = scrollElement.clientHeight;

      const progress = scrollTop / (scrollHeight - clientHeight);
      tracingBeamRef.current.style.width = `${progress * 100}%`;
      tracingBeamRef.current.style.opacity = scrollTop > 5 ? "1" : "0";
    };

    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="relative h-screen">
      {/* Scroll Tracing Beam */}
      <div
        ref={tracingBeamRef}
        className="fixed top-0 left-0 h-[3px] bg-pink-500 z-50 transition-all duration-300"
        style={{ width: "0%", opacity: 0 }}
      ></div>

      {/* Scrollable content container */}
      <div
        ref={scrollContainerRef}
        className="h-full overflow-y-auto"
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
