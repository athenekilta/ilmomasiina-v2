import { defineMessages } from "../messages";

export const accountMessages = defineMessages({
  fi: {
    settings: {
      title: "Asetukset",
      name: "Nimi",
      email: "Sähköposti",
      passwordChange: "Salasanan vaihto",
      saveName: "Tallenna nimi",
      discardAndReload: "Hylkää oma muutos ja lataa nimi",
      staleName:
        "Nimitiedot ovat muuttuneet tai niitä ei voitu päivittää. Lataa uusimmat tiedot ennen tallentamista. Lataaminen hylkää oman nimimuutoksesi.",
      loadFailed: "Nimen lataus epäonnistui. Omat muutoksesi säilytettiin.",
      saveFailed: "Nimen tallennus epäonnistui. Omat muutoksesi säilytettiin.",
      savedButReloadFailed:
        "Nimi tallennettiin, mutta uusimpia tietoja ei voitu ladata. Lataa tiedot ennen uutta tallennusta.",
      requestPasswordChange: "Lähetä salasanan vaihtolinkki",
      passwordChangeSent: "Salasanan vaihtolinkki lähetettiin sähköpostiisi.",
      passwordChangeFailed: "Salasanan vaihtolinkin lähettäminen epäonnistui.",
    },
    access: {
      title: "Ilmoittautumislinkki",
      invalid: "Ilmoittautumislinkki ei ole voimassa.",
      loading: "Ilmoittautumislinkkiä avataan",
    },
    identity: {
      menuLabel: "Ilmoittautumistiedot",
      missingDetails: "Nimi ja sähköposti puuttuvat",
      openWithName: (name: string) => `Ilmoittautumistiedot: ${name}`,
      openWithoutDetails: "Aseta ilmoittautumistiedot",
      ready: "Ilmoittautumistiedot kunnossa",
      incomplete: "Ilmoittautumistiedot puuttuvat",
      name: "Nimi",
      email: "Sähköposti",
      emailPlaceholder: "sinä@example.com",
      update: "Päivitä",
      clear: "Tyhjennä tiedot",
      close: "Sulje",
      invalidEmail: "Anna kelvollinen sähköpostiosoite",
      nameTooShort: "Nimen on oltava vähintään 3 merkkiä",
    },
  },
  en: {
    settings: {
      title: "Settings",
      name: "Name",
      email: "Email",
      passwordChange: "Change password",
      saveName: "Save name",
      discardAndReload: "Discard my change and reload name",
      staleName:
        "The name has changed or could not be refreshed. Load the latest information before saving. Reloading will discard your name change.",
      loadFailed: "Could not load the name. Your changes were preserved.",
      saveFailed: "Could not save the name. Your changes were preserved.",
      savedButReloadFailed:
        "The name was saved, but the latest information could not be loaded. Reload it before saving again.",
      requestPasswordChange: "Send password reset link",
      passwordChangeSent: "A password reset link was sent to your email.",
      passwordChangeFailed: "Could not send the password reset link.",
    },
    access: {
      title: "Registration link",
      invalid: "The registration link is invalid.",
      loading: "Opening registration link",
    },
    identity: {
      menuLabel: "Registration details",
      missingDetails: "Name and email are missing",
      openWithName: (name: string) => `Registration details: ${name}`,
      openWithoutDetails: "Set registration details",
      ready: "Registration details complete",
      incomplete: "Registration details incomplete",
      name: "Name",
      email: "Email",
      emailPlaceholder: "you@example.com",
      update: "Update",
      clear: "Clear details",
      close: "Close",
      invalidEmail: "Enter a valid email address",
      nameTooShort: "Name must be at least 3 characters",
    },
  },
});
