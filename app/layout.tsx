import "./globals.css";
import ReceptionLayout from "@/components/layout/ReceptionLayout";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center" />
        <ReceptionLayout>{children}</ReceptionLayout>
      </body>
    </html>
  );
}
