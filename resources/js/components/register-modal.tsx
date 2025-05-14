import { useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type RegisterForm = {
    fullname: string;
    username: string;
    birthday: string;
    gender: string;
    email: string;
    password: string;
    password_confirmation: string;
};

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginClick: () => void;
}

export default function RegisterModal({ isOpen, onClose, onLoginClick }: RegisterModalProps) {
    const [step, setStep] = useState(1);
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        fullname: '',
        username: '',
        birthday: '',
        gender: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // reset form when modal is closed
    useEffect(() => {
        if (!isOpen) {
            reset();
            setStep(1);
        }
    }, [isOpen, reset]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (step === 1) {
            setStep(2);
            return;
        }

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-[425px] p-6 sm:max-w-[425px] sm:p-8 md:p-10 lg:p-12 xl:p-14">
                <DialogHeader>
                    <p className="text-muted-foreground mb-2 text-sm">Step {step} of 2</p>
                    <DialogTitle className="text-3xl font-bold">Create an Account</DialogTitle>
                </DialogHeader>

                <form className="flex flex-col gap-6" onSubmit={submit}>
                    <div className="grid gap-6">
                        {step === 1 ? (
                            <>
                                <div className="grid gap-2">
                                    <Input
                                        id="fullname"
                                        type="text"
                                        required
                                        autoFocus
                                        value={data.fullname}
                                        onChange={(e) => setData('fullname', e.target.value)}
                                        placeholder="Full name"
                                        className="rounded-sm"
                                    />
                                    <InputError message={errors.fullname} />
                                </div>

                                <div className="grid gap-2">
                                    <Input
                                        id="username"
                                        type="text"
                                        required
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        placeholder="Username"
                                        className="rounded-sm"
                                    />
                                    <InputError message={errors.username} />
                                </div>

                                <div className="grid gap-2">
                                    <Input
                                        id="birthday"
                                        type="date"
                                        required
                                        value={data.birthday}
                                        onChange={(e) => setData('birthday', e.target.value)}
                                        className="rounded-sm"
                                    />
                                    <InputError message={errors.birthday} />
                                </div>

                                <div className="grid gap-2">
                                    <Select value={data.gender} onValueChange={(value) => setData('gender', value)}>
                                        <SelectTrigger className="rounded-sm">
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.gender} />
                                </div>
                            </>
                        ) : (
                            <>
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

                                <div className="grid gap-2">
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Password"
                                            className="rounded-sm pr-10"
                                        />

                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                        <InputError message={errors.password} />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="Confirm password"
                                            className="rounded-sm pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </div>
                            </>
                        )}

                        <Button
                            type="submit"
                            className="mt-4 w-full rounded-full bg-blue-800 text-white transition-colors duration-300 hover:bg-blue-900"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            {step === 1 ? 'Continue' : 'Sign up'}
                        </Button>
                    </div>

                    <div className="text-muted-foreground text-center text-sm">
                        Already have an account?{' '}
                        <button type="button" onClick={onLoginClick} className="text-blue-800 hover:underline">
                            Sign in
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
