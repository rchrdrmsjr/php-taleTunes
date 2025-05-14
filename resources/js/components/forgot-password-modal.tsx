import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type ForgotPasswordForm = {
    email: string;
};

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginClick: () => void;
    status?: string;
}

export default function ForgotPasswordModal({ isOpen, onClose, onLoginClick, status }: ForgotPasswordModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<ForgotPasswordForm>>({
        email: '',
    });

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'), {
            onFinish: () => reset(),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[425px] p-6 sm:max-w-[425px] sm:p-8 md:p-10 lg:p-12 xl:p-14">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold">Forgot Password</DialogTitle>
                </DialogHeader>

                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Email address"
                                className="rounded-sm"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 w-full rounded-full bg-blue-800 text-white transition-colors duration-300 hover:bg-blue-900"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Send Reset Link
                        </Button>
                    </div>

                    <div className="text-muted-foreground text-center text-sm">
                        Remember your password?{' '}
                        <button type="button" onClick={onLoginClick} className="text-blue-800 hover:underline">
                            Sign in
                        </button>
                    </div>
                </form>

                {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
            </DialogContent>
        </Dialog>
    );
}
