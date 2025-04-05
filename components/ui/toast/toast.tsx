import * as React from 'react';

import {XCircle} from 'lucide-react';
import {Toast} from 'radix-ui';
import './toast.css';
interface ToastProps {
    delay: number;
    title: string;
    description: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const ToastMessage: React.FC<ToastProps> = ({open, onOpenChange, delay, title, description}) => {
    const timerRef = React.useRef(0);

    React.useEffect(() => {
        if (open) {
            timerRef.current = window.setTimeout(() => {
                onOpenChange(false);
                window.clearTimeout(timerRef.current);
            }, delay);
        }
        return () => clearTimeout(timerRef.current);
    }, []);

    return (
        <Toast.Provider swipeDirection="right">
            <Toast.Root
                className="ToastRoot"
                open={open}
                onOpenChange={onOpenChange}>
                <Toast.Title className="ToastTitle">{title}</Toast.Title>

                <Toast.Description asChild>
                    <p className="ToastDescription">{description}</p>
                </Toast.Description>

                <Toast.Action
                    className="ToastAction"
                    asChild
                    altText="Goto schedule to undo">
                    <button className="Button small green">
                        <XCircle />
                    </button>
                </Toast.Action>
            </Toast.Root>

            <Toast.Viewport className="ToastViewport" />
        </Toast.Provider>
    );
};

export default ToastMessage;
