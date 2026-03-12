export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body style={{ fontFamily: 'Arial, sans-serif', margin: 0, background: '#f1f5f9' }}>
        {children}
      </body>
    </html>
  );
}
