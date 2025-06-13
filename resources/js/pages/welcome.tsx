import LoginModal from '@/components/login-modal';
import RegisterModal from '@/components/register-modal';
import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleLoginClick = () => {
        setIsLoginModalOpen(true);
        setIsRegisterModalOpen(false);
    };

    const handleRegisterClick = () => {
        setIsRegisterModalOpen(true);
        setIsLoginModalOpen(false);
    };

    interface ButtonProps {
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    }

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen bg-gray-100 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-32">
                {/* Left side - Illustration */}
                <div className="flex flex-1 items-center justify-center p-8">
                    <div className="relative">
                        {/* Musical notes and decorative elements */}
                        <div className="absolute -top-4 -left-8 text-blue-600">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                        </div>
                        <div className="absolute -top-2 -right-6 text-blue-600">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                        </div>
                        <div className="absolute top-8 -left-12 text-blue-600">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="12" r="10" />
                                <polygon points="10,8 16,12 10,16" />
                            </svg>
                        </div>
                        <div className="absolute top-4 -right-8 text-blue-600">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 12l2 2 4-4" />
                                <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
                            </svg>
                        </div>
                        <div className="absolute bottom-4 -left-10 text-blue-600">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                        </div>
                        <div className="absolute -right-10 bottom-8 text-blue-600">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>

                        {/* Main illustration */}
                        <div className="relative flex h-40 w-64 items-end justify-center overflow-hidden rounded-full bg-blue-600">
                            {/* Chair legs */}
                            <div className="absolute bottom-0 left-16 h-10 w-1 rounded bg-gray-800"></div>
                            <div className="absolute right-16 bottom-0 h-10 w-1 rounded bg-gray-800"></div>
                            <div className="absolute bottom-0 left-20 h-8 w-1 rounded bg-gray-800"></div>
                            <div className="absolute right-20 bottom-0 h-8 w-1 rounded bg-gray-800"></div>

                            {/* Person */}
                            <div className="relative mb-6">
                                {/* Body */}
                                <div className="relative h-24 w-20 rounded-full bg-white">
                                    {/* Head */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 transform">
                                        <div className="relative h-14 w-14 rounded-full bg-orange-200">
                                            {/* Hair */}
                                            <div className="absolute -top-3 -left-3 h-14 w-20 rounded-full bg-gray-800"></div>
                                            <div className="absolute -top-2 -left-2 h-12 w-18 rounded-full bg-gray-800"></div>
                                            {/* Face features */}
                                            <div className="absolute top-4 left-4 h-1 w-1 rounded-full bg-gray-800"></div>
                                            <div className="absolute top-4 right-4 h-1 w-1 rounded-full bg-gray-800"></div>
                                            <div className="absolute top-6 left-1/2 h-1 w-2 -translate-x-1/2 transform rounded-full bg-gray-800"></div>
                                        </div>
                                    </div>
                                    {/* Arms */}
                                    <div className="absolute top-6 -left-4 h-4 w-8 -rotate-12 transform rounded-full bg-orange-200"></div>
                                    <div className="absolute top-6 -right-4 h-4 w-8 rotate-12 transform rounded-full bg-orange-200"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Content */}
                <div className="flex flex-1 items-center justify-center p-8">
                    <div className="w-full max-w-md space-y-8">
                        <div>
                            <h1 className="mb-4 text-5xl font-bold">New audiobooks</h1>
                            <p className="text-xl font-bold">Join in TaleTunes today.</p>
                        </div>

                        {/* Sign up buttons */}
                        <div className="space-y-6">
                            <a
                                href={route('google.redirect')}
                                className="flex h-14 w-full items-center justify-center rounded-full border border-gray-300 bg-white px-4 text-base text-gray-700 hover:bg-gray-50"
                            >
                                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Sign up with Google
                            </a>

                            <div className="flex items-center">
                                <div className="flex-1 border-t border-gray-300"></div>
                                <span className="px-4 text-base text-gray-500">OR</span>
                                <div className="flex-1 border-t border-gray-300"></div>
                            </div>

                            <Button
                                onClick={handleRegisterClick}
                                className="h-14 w-full rounded-full bg-blue-600 text-base font-medium text-white hover:bg-blue-700"
                            >
                                Create account
                            </Button>
                        </div>

                        {/* Legal text */}
                        <p className="text-sm leading-relaxed text-gray-500">
                            By signing up, you agree to the{' '}
                            <a href="#" className="text-blue-600 hover:underline">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-blue-600 hover:underline">
                                Privacy Policy
                            </a>
                            , including{' '}
                            <a href="#" className="text-blue-600 hover:underline">
                                Cookie Use
                            </a>
                            .
                        </p>

                        {/* Sign in link */}
                        <div className="pt-6">
                            <p className="mb-4 text-lg font-bold">Already have an account?</p>
                            <Button
                                onClick={handleLoginClick}
                                variant="outline"
                                className="h-14 w-full rounded-full border-gray-300 text-base text-blue-600 hover:bg-gray-50"
                            >
                                Sign in
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <div className="bg-gray-100 pb-8 text-center text-sm text-gray-500">
                <p>© 2025 TaleTunes. All rights reserved.</p>
                <p>Discover and enjoy a world of audiobooks — anytime, anywhere.</p>
            </div>

            {/* Modals */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onForgotPasswordClick={() => {
                    setIsLoginModalOpen(false);
                    setIsForgotPasswordModalOpen(true);
                }}
                onRegisterClick={handleRegisterClick}
                canResetPassword={true}
            />
            <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} onLoginClick={handleLoginClick} />
        </>
    );
}
