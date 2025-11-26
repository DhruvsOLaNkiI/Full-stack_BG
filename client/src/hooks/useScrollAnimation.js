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

        let observer;
        const timeoutId = setTimeout(() => {
            const elements = container.querySelectorAll('.scroll-animate');
            if (elements.length === 0) return;

            observer = new IntersectionObserver(
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
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            if (observer) observer.disconnect();
        };
    }, [containerRef, ...deps]);
}
