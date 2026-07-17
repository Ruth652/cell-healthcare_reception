import "./globals.css";
import ReceptionLayout from "@/components/layout/ReceptionLayout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReceptionLayout>{children}</ReceptionLayout>
      </body>
    </html>
  );
}
