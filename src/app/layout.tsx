export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body style={{
        margin: 0,
        background: "#0b0b0f",
        color: "white",
        fontFamily: "system-ui"
      }}>
        <div style={{
          padding: 15,
          borderBottom: "1px solid #222",
          marginBottom: 20
        }}>
          ⚽ Goal Zone
        </div>

        {children}
      </body>
    </html>
  );
}
