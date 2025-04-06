import React, {useState, useEffect} from 'react';

export const usePressedKeys = () => {
    const [pressedKeys, setPressedKeys] = useState(new Set());

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setPressedKeys((prevKeys) => new Set(prevKeys).add(e.key));
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            setPressedKeys((prevKeys) => {
                const updatedKeys = new Set(prevKeys);
                updatedKeys.delete(e.key);
                return updatedKeys;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return pressedKeys;
};
