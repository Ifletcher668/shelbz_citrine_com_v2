import Header from "@/Components/layout/Header";
import Footer from "@/Components/layout/Footer";

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-void">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
