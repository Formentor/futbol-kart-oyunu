import './globals.css';

export const metadata = {
  title: 'Futbol Kart Oyunu',
  description: 'FUT tarzı 2 oyunculu hot-seat kart oyunu',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="bg-gray-950 antialiased overflow-x-hidden">{children}</body>
    </html>
  );
}
