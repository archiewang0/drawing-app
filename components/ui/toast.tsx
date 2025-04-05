import * as React from 'react';

import {XCircle} from 'lucide-react';
import {Toast} from 'radix-ui';

interface ToastProps {
    delay: number;
}

const ToastMessage: React.FC<ToastProps> = ({delay}) => {
    const [open, setOpen] = React.useState(true);
    const timerRef = React.useRef(0);

    React.useEffect(() => {
        if (open) {
            timerRef.current = window.setTimeout(() => {
                setOpen(false);
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
                onOpenChange={setOpen}>
                <Toast.Title className="ToastTitle">新增成功</Toast.Title>

                <Toast.Description asChild>
                    <p className="ToastDescription">可以查看你所繪畫的圖片</p>
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
