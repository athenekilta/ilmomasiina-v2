import { Header } from "./Header";
import { Footer } from "./Footer";
export type Layoutprops = {
  children: React.ReactNode;
};

export function Layout(props: Layoutprops) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-beige">
      <Header />
      <main className="mx-auto w-full max-w-6xl grow px-3 py-5 sm:px-4 sm:py-6">
        {props.children}
      </main>
      <Footer />
    </div>
  );
}
