import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/images/Logo.png"
            alt="App Logo"
            width={50}
            height={50}
            style={{ objectFit: 'contain', ...props.style }}
        />
    );
}
