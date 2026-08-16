import { useEffect, useRef, useState } from "react";

/**
 * Animates a number counting up from 0 to `target` whenever `target` changes.
 * Pure React (useState + useEffect + requestAnimationFrame), no extra libraries.
 */
function useCountUp(target, duration = 800) {

    const [value, setValue] = useState(0);

    const frameRef = useRef(null);

    useEffect(() => {

        const start = performance.now();
        const from = 0;
        const to = Number(target) || 0;

        function tick(now) {

            const elapsed = now - start;

            const progress = Math.min(elapsed / duration, 1);

            const eased = 1 - Math.pow(1 - progress, 3);

            const current = Math.round(from + (to - from) * eased);

            setValue(current);

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(tick);
            }
        }

        frameRef.current = requestAnimationFrame(tick);

        return () => {

            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };

    }, [target, duration]);

    return value;
}

export default useCountUp;