import { defineMessages } from "../messages";

export const layoutMessages = defineMessages({
  fi: {
    management: "Hallinta",
    privacy: "Tietosuoja",
    signOut: "Kirjaudu ulos",
    metaDescription: "Athenen tapahtumien ilmoittautumispalvelu",
    realtime: {
      disconnected: "Reaaliaikainen yhteys katkesi",
      retryHint:
        "Yhteyttä yritetään uudelleen automaattisesti. Tiedot päivitetään yhteyskatkon aikana 30 sekunnin välein, kun sivu on näkyvissä ja verkkoyhteys on käytettävissä.",
    },
    emailPreview: {
      title: "Sähköpostien esikatselu",
      developmentOnly: "Vain kehitysympäristössä",
      description:
        "Esimerkkitiedot eivät lähetä sähköpostia tai käytä tietokantaa.",
      templates: "Sähköpostipohjat",
      subject: "Aihe",
      previewTitle: (name: string) => `${name} -esikatselu`,
      unavailable: "Esikatseluita ei voitu ladata.",
    },
  },
  en: {
    management: "Administration",
    privacy: "Privacy",
    signOut: "Log out",
    metaDescription: "Registration service for Athene events",
    realtime: {
      disconnected: "The real-time connection was interrupted",
      retryHint:
        "The connection will be retried automatically. While disconnected, data is refreshed every 30 seconds when the page is visible and the network is available.",
    },
    emailPreview: {
      title: "Email previews",
      developmentOnly: "Development environment only",
      description:
        "The example data does not send email or access the database.",
      templates: "Email templates",
      subject: "Subject",
      previewTitle: (name: string) => `${name} preview`,
      unavailable: "The previews could not be loaded.",
    },
  },
});
