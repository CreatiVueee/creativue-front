import { Header } from "@/shared/components/Header";
import { Footer } from "@/shared/components/Footer";
import { LoginModal } from "@/features/auth/ui/LoginModal";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <LoginModal />
    </>
  );
}
