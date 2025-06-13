import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LoginModal from './login-modal';
import RegisterModal from './register-modal';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    status?: string;
    canResetPassword: boolean;
}

export default function AuthModal({ isOpen, onClose, status, canResetPassword }: AuthModalProps) {
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const handleClose = () => {
        setShowLogin(false);
        setShowRegister(false);
        onClose();
    };

    const handleGoogleSignIn = () => {
        // Implement Google sign-in logic here
        window.location.href = route('auth.google');
    };

    return (
        <>
            <Dialog open={isOpen && !showLogin && !showRegister} onOpenChange={handleClose}>
                <DialogContent className="max-w-[425px] p-6 sm:max-w-[425px] sm:p-8 md:p-10 lg:p-12 xl:p-14">
                    <DialogHeader className="flex flex-col items-center">
                        <img src="/images/logo.png" alt="TaleTunes Logo" className="mb-6 h-12 w-auto" />
                        <DialogTitle className="mb-2 text-center text-2xl font-bold">Join today in TaleTunes</DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-6">
                        <a
                            href={route('google.redirect')}
                            className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-gray-200 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            <img src="/images/google.svg" alt="Google" className="h-5 w-5" />
                            Continue with Google
                        </a>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background text-muted-foreground px-2">or</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            className="w-full rounded-full bg-blue-800 text-white transition-colors duration-300 hover:bg-blue-900"
                            onClick={() => setShowRegister(true)}
                        >
                            Create an Account
                        </Button>

                        <p className="text-muted-foreground text-center text-xs">
                            By signing up, you agree to the{' '}
                            <a href="/terms" className="text-blue-800 hover:underline">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="/privacy" className="text-blue-800 hover:underline">
                                Privacy Policy
                            </a>
                            , including Cookie Use.
                        </p>

                        <div className="text-muted-foreground text-center text-sm">
                            Already have an account?{' '}
                            <button type="button" onClick={() => setShowLogin(true)} className="text-blue-800 hover:underline">
                                Sign in
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <LoginModal
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                status={status}
                canResetPassword={canResetPassword}
                onRegisterClick={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                }}
                onForgotPasswordClick={() => {
                    setShowLogin(false);
                    // Handle forgot password click
                }}
            />

            <RegisterModal
                isOpen={showRegister}
                onClose={() => setShowRegister(false)}
                onLoginClick={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                }}
            />
        </>
    );
}
