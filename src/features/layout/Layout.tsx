import { Header } from "./Header";
import { Footer } from "./Footer";
export type Layoutprops = {
  children: React.ReactNode;
};

export function Layout(props: Layoutprops) {
  return (
    /* pt-14 matches the fixed header's height — it is out of flow, so the
       page has to reserve the space itself or the first content would
       start underneath it. */
    <div className="bg-brand-beige flex min-h-screen flex-col pt-14">
      <Header />
      <main className="mx-auto w-full max-w-6xl grow px-4 py-5 sm:px-6 sm:py-6">
        {props.children}
      </main>
      <Footer />
    </div>
  );
}
