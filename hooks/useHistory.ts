

import { useState } from 'react';


type actionType<T> = actionFunction<T> | T;
type actionFunction<T> = (param: T) => T

export const useHistory = <T>(initialState: T): [
    history: T,
    setState: (action:   actionType<T> , overwrite?: boolean) => void,
    undo: () => void,
    redo: () => void
] => {
    const [index, setIndex] = useState<number>(0);
    const [history, setHistory] = useState<T[]>([initialState]);

    const setState = (
        action:  actionType<T>,
        overwrite: boolean = false
    ) => {
        const newState = typeof action === "function" ? (action as  actionFunction<T> )(history[index]) :  action ;

        if (overwrite) {
            const historyCopy = [...history];
            historyCopy[index] = newState;
            setHistory(historyCopy);
        } else {
            const updatedState = [...history].slice(0, index + 1);
            setHistory([...updatedState, newState]);
            setIndex(prevState => prevState + 1);
        }
    };

    const undo = () => {
        if (index > 0) {
            setIndex(prevState => prevState - 1);
        }
    };

    const redo = () => {
        if (index < history.length - 1) {
            setIndex(prevState => prevState + 1);
        }
    };

    return [history[index], setState, undo, redo];
};