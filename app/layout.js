export const metadata = {
  title: 'TSBridge - Options Monitor',
  description: 'Realtime signals and orders from option_monitor.py',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0d1117', color: '#e6edf3', fontFamily: 'Consolas, monospace' }}>
        {children}
      </body>
    </html>
  );
}
