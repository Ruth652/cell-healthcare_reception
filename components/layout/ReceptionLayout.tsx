import Header from "./Header";
import Navigation from "./Navigation";

export default function ReceptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app">
      <Header />

      <Navigation />

      <main className="main">{children}</main>
    </div>
  );
}
