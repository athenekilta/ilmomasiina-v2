import { Header } from "./Header";
import { Footer } from "./Footer";
export type Layoutprops = {
  children: React.ReactNode;
};

export function Layout(props: Layoutprops) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">{props.children}</main>
      <Footer />
    </div>
  );
}
