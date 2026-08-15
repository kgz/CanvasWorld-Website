import type { RefObject } from "react";
import { useRef, useEffect } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref: RefObject<HTMLElement>, callback?: () => void) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event: MouseEvent) {
            if (!ref.current) return
            if (!(event.target instanceof HTMLElement)) return

            if (ref.current && !ref.current.contains(event.target)) {
                callback && callback()
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [callback, ref]);
}

/**
 * Component that alerts if you click outside of it
 */
export default function OutsideAlerter(props: { children: JSX.Element, callback?: () => void }) {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, props.callback);
    return <div ref={wrapperRef}>{props.children}</div>;
}