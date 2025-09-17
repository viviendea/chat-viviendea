import { useState, useEffect, useRef, useCallback } from "react";

interface UseTypewriterProps {
    text: string;
    speed?: number;
    startDelay?: number;
}

interface UseTypewriterReturn {
    displayText: string;
    isComplete: boolean;
}

export const useTypewriter = ({
    text,
    speed = 50,
    startDelay = 100,
}: UseTypewriterProps): UseTypewriterReturn => {
    const [displayText, setDisplayText] = useState("");
    const [isComplete, setIsComplete] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    // Función recursiva memoizada para mejor rendimiento
    const updateText = useCallback((index: number) => {
        // Verificar que el texto sigue siendo el mismo para evitar condiciones de carrera
        if (index >= text.length) {
            setIsComplete(true);
            return;
        }

        // Actualizar el texto mostrado
        setDisplayText(text.slice(0, index + 1));
        
        // Si no hemos terminado, programar la siguiente actualización
        if (index < text.length - 1) {
            timeoutRef.current = window.setTimeout(() => {
                updateText(index + 1);
            }, speed);
        } else {
            // Terminamos la animación
            setIsComplete(true);
        }
    }, [text, speed]);

    useEffect(() => {
        // Si no hay texto, no hacer nada
        if (!text) {
            setDisplayText("");
            setIsComplete(true);
            return;
        }

        // Reset de estados
        setDisplayText("");
        setIsComplete(false);

        // Limpiar timeout previo
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Iniciar la animación después del delay
        timeoutRef.current = window.setTimeout(() => {
            updateText(0);
        }, startDelay);

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [text, updateText, startDelay]);

    return {
        displayText,
        isComplete,
    };
};
