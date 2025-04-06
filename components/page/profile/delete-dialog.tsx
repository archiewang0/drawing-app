import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter} from '@/components/ui/diaglog';
import {Button} from '@/components/ui/button';
import {Trash} from 'lucide-react';
import {deleteimg} from '@/app/actions/deleteimg';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

interface DeleteImgDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setToastinfo: (data: {title: string; description: string; delay: number}) => void;
    setShowToast: (open: boolean) => void;

    imgurl: string;
    name?: string;
    id: string;

    fetchCanvasImg: () => void;
}

export function DeleteImgDialog({open, onOpenChange, id, fetchCanvasImg, imgurl, name, setShowToast, setToastinfo}: DeleteImgDialogProps) {
    const [deleteing, setDeleteing] = useState(false);
    const router = useRouter();
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}>
            <DialogContent className=" bg-white">
                <DialogHeader>
                    <DialogTitle>確定要刪除嗎?</DialogTitle>
                    <DialogDescription asChild>
                        <div className="text-left">
                            <p className="text-sm text-gray-500">{name ? name : '未命名'} 刪除後將無法恢復，請確認是否真的要刪除此圖片。</p>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        disabled={deleteing}
                        onClick={async () => {
                            if (deleteing) return;
                            setDeleteing(true);
                            await deleteimg({id, imgUrl: imgurl, name});
                            await fetchCanvasImg();
                            setToastinfo({
                                title: '刪除成功',
                                description: '刪除圖片成功',
                                delay: 2000,
                            });
                            setDeleteing(false);
                            onOpenChange(false);
                            setShowToast(true);
                        }}
                        variant="outline"
                        className=" border-red-400 text-red-400 ">
                        <Trash /> 刪除
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
