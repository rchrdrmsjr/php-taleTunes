import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    status?: string;
    canResetPassword: boolean;
}

export default function LoginModal({ isOpen, onClose, status, canResetPassword }: LoginModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[425px] p-6 sm:max-w-[425px] sm:p-8 md:p-10 lg:p-12 xl:p-14">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold">Sign in to TaleTunes</DialogTitle>
                </DialogHeader>

                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            {/* <Label htmlFor="email">Email address</Label> */}
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Username or email"
                                className="rounded-sm"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Password"
                                className="rounded-sm"
                            />
                            <InputError message={errors.password} />
                        </div>
                        <div className="flex items-center">
                            {/* <Label htmlFor="password">Password</Label> */}
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="text-sm text-blue-800" tabIndex={5}>
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>

                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onClick={() => setData('remember', !data.remember)}
                                tabIndex={3}
                            />
                            <Label htmlFor="remember">Remember me</Label>
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 w-full rounded-full bg-blue-800 text-white transition-colors duration-300 hover:bg-blue-900"
                            tabIndex={4}
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Sign in
                        </Button>
                    </div>

                    <div className="text-muted-foreground text-center text-sm">
                        Don't have an account?{' '}
                        <TextLink href={route('register')} tabIndex={5} className="text-blue-800">
                            Sign up
                        </TextLink>
                    </div>
                </form>

                {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
            </DialogContent>
        </Dialog>
    );
}
