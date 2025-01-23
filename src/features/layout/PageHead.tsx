import Head from "next/head";

export type PageHeadProps = {
  title?: string;
};

export function PageHead(props: PageHeadProps) {
  const title = props.title ? `Ilmomasiina ― ${props.title}` : "Ilmomasiina";

  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
}
