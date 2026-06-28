import './globals.css';

export const metadata = {
  title: 'Futbol Kart Oyunu',
  description: 'FUT tarzı 2 oyunculu hot-seat kart oyunu',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="bg-gray-950 antialiased">{children}</body>
    </html>
  );
}
