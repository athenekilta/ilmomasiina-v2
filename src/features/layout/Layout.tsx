import { Header } from "./Header";
import { Footer } from "./Footer";
export type Layoutprops = {
  children: React.ReactNode;
};

export function Layout(props: Layoutprops) {
  return (
    <div className="bg-brand-beige flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-3xl grow">{props.children}</main>
      <Footer />
    </div>
  );
}
