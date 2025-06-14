import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface NotFoundModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotFoundModal = ({ isOpen, onClose }: NotFoundModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="ml-6">Audiobook Not Found</DialogTitle>
                    <DialogDescription>
                        The audiobook with the provided code could not be found. Please double-check the code and try again.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end">
                    <Button onClick={onClose}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
