import { useState, useEffect, useRef } from "react";

interface UseTypingLoopProps {
    enabled: boolean;
    text?: string;
    speed?: number;
    pauseBetweenLoops?: number;
}

interface UseTypingLoopReturn {
    displayText: string;
}

export const useTypingLoop = ({
    enabled,
    text = "Escribiendo...",
    speed = 80,
    pauseBetweenLoops = 500,
}: UseTypingLoopProps): UseTypingLoopReturn => {
    const [displayText, setDisplayText] = useState("");
    const timeoutRef = useRef<number | null>(null);
    const isTypingRef = useRef(false);

    useEffect(() => {
        if (!enabled) {
            setDisplayText("");
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            return;
        }

        const typeText = () => {
            let index = 0;
            isTypingRef.current = true;
            
            const typeChar = () => {
                if (!enabled || !isTypingRef.current) return;
                
                if (index <= text.length) {
                    setDisplayText(text.slice(0, index));
                    index++;
                    timeoutRef.current = window.setTimeout(typeChar, speed);
                } else {
                    // Terminamos de escribir, pausa antes del siguiente bucle
                    timeoutRef.current = window.setTimeout(() => {
                        if (enabled) {
                            typeText(); // Reiniciar el bucle
                        }
                    }, pauseBetweenLoops);
                }
            };
            
            typeChar();
        };

        // Iniciar el primer bucle
        typeText();

        // Cleanup
        return () => {
            isTypingRef.current = false;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [enabled, text, speed, pauseBetweenLoops]);

    return {
        displayText: enabled ? displayText : text,
    };
};