import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Heliparts USA",
  description: "Helicopter parts marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Nav */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem 2rem",
            background: "#001f3f",
            color: "white",
          }}
        >
          <Link href="/" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            Heliparts USA
          </Link>
          <nav style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/">Home</Link>
            <Link href="/search">Search</Link>
          </nav>
        </header>

        {/* Page Content */}
        {children}

        {/* Footer */}
        <footer
          style={{
            padding: "1.5rem",
            background: "#001f3f",
            color: "white",
            textAlign: "center",
            marginTop: "2rem",
          }}
        >
          <p>&copy; {new Date().getFullYear()} Heliparts USA. All Rights Reserved.</p>
        </footer>
      </body>
    </html>
  );
}
