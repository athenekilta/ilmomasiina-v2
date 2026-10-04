import { config } from "md-editor-rt";
import type { Locale } from "@/i18n/config";

const markdownEditorConfig = {
  languageUserDefined: {
    fi: {
      toolbarTips: {
        bold: "Lihavointi",
        underline: "Alleviivaus",
        italic: "Kursivointi",
        strikeThrough: "Yliviivaus",
        title: "Otsikko",
        sub: "Alaindeksi",
        sup: "Yläindeksi",
        quote: "Lainaus",
        unorderedList: "Luettelomerkit",
        orderedList: "Numeroitu luettelo",
        task: "Tehtäväluettelo",
        codeRow: "Rivikoodi",
        code: "Koodilohko",
        link: "Linkki",
        image: "Kuva",
        table: "Taulukko",
        mermaid: "Kaavio",
        katex: "Kaava",
        revoke: "Kumoa",
        next: "Tee uudelleen",
        save: "Tallenna",
        prettier: "Muotoile",
        pageFullscreen: "Sivun kokoinen tila",
        fullscreen: "Koko näyttö",
        catalog: "Sisällysluettelo",
        preview: "Esikatselu",
        previewOnly: "Vain esikatselu",
        htmlPreview: "HTML-esikatselu",
        github: "Avaa GitHubissa",
      },
      titleItem: {
        h1: "Otsikko 1",
        h2: "Otsikko 2",
        h3: "Otsikko 3",
        h4: "Otsikko 4",
        h5: "Otsikko 5",
        h6: "Otsikko 6",
      },
      imgTitleItem: {
        link: "Lisää kuvalinkki",
        upload: "Lataa kuva",
        clip2upload: "Rajaa ja lataa kuva",
      },
      linkModalTips: {
        linkTitle: "Lisää linkki",
        imageTitle: "Lisää kuva",
        descLabel: "Kuvaus",
        descLabelPlaceHolder: "Anna kuvaus",
        urlLabel: "Osoite",
        urlLabelPlaceHolder: "Anna osoite",
        buttonOK: "Vahvista",
      },
      clipModalTips: {
        title: "Rajaa kuvaa",
        buttonUpload: "Lataa",
      },
      copyCode: {
        text: "Kopioi koodi",
        successTips: "Koodi kopioitiin",
        failTips: "Koodin kopiointi epäonnistui",
      },
      mermaid: {
        flow: "Vuokaavio",
        sequence: "Sekvenssikaavio",
        gantt: "Gantt-kaavio",
        class: "Luokkakaavio",
        state: "Tilakaavio",
        pie: "Ympyräkaavio",
        relationship: "Relaatiokaavio",
        journey: "Käyttäjäpolku",
      },
      katex: {
        inline: "Tekstinsisäinen kaava",
        block: "Kaavalohko",
      },
      footer: {
        markdownTotal: "Merkkimäärä",
        scrollAuto: "Synkronoi vieritys",
      },
    },
  },
};

config({ editorConfig: markdownEditorConfig });

export function markdownLanguage(locale: Locale) {
  return locale === "fi" ? "fi" : "en-US";
}
