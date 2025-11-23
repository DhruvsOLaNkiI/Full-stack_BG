import { useEffect } from 'react';

/**
 * Hook that observes all elements with the class 'scroll-animate' inside the given ref.
 * When an element enters the viewport, the 'animate' class is added, triggering the CSS animation.
 * Usage: const containerRef = useRef(null); useScrollAnimation(containerRef);
 */
export function useScrollAnimation(containerRef, deps = []) {
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Small timeout to ensure DOM is ready
        const timeoutId = setTimeout(() => {
            const elements = container.querySelectorAll('.scroll-animate');
            if (elements.length === 0) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('animate');
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1 }
            );
            elements.forEach((el) => observer.observe(el));

            // Cleanup function for this effect run
            return () => observer.disconnect();
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [containerRef, ...deps]);
}
