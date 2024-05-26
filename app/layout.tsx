import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.scss';

const APP_NAME = 'Snake Game';
const APP_DEFAULT_TITLE = "Nacho's Snake Game";
const APP_DESCRIPTION =
  'JS Snake game with basic controls for game configuration';

const pixelon = localFont({ src: '../public/pixelon.ttf' });

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  keywords: ['master trainer', 'board game'],
  authors: [{ name: 'Nacho Betancourt' }],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
    startupImage: '/icons/512x512.webp',
  },
};

export const viewport: Viewport = {
  themeColor: '#a6d6d8',
  minimumScale: 1,
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/icons/180x180.webp'
        />
        <link
          rel='icon'
          type='image/webp'
          sizes='32x32'
          href='/icons/32x32.webp'
        />
        <link
          rel='icon'
          type='image/webp'
          sizes='16x16'
          href='/icons/16x16.webp'
        />
        <meta name='view-transition' content='same-origin' />
      </head>
      <body className={pixelon.className}>{children}</body>
    </html>
  );
}
