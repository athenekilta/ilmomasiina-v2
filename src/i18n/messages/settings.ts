import { defineMessages } from "../messages";

export const settingsMessages = defineMessages({
  fi: {
    title: "Hallintatunnuksen asetukset",

    backHome: "Takaisin etusivun hallintaan",
    manageUsers: "Käyttäjien hallinta",
    loading: "Ladataan hallintatunnuksen tietoja…",
    loadFailed: "Hallintatunnuksen tietojen lataaminen epäonnistui.",
    retry: "Yritä uudelleen",
    signedInAs: "Kirjautunut hallintatunnuksella",
    role: "Rooli",
    roles: {
      superadmin: "Pääkäyttäjä",
      event_editor: "Tapahtumien muokkaaja",
      user: "Käyttäjä",
    },
    password: {
      description:
        "Vahvista salasanan vaihto nykyisellä salasanallasi. Muut istuntosi kirjataan ulos.",
      current: "Nykyinen salasana",
      next: "Uusi salasana",
      confirm: "Vahvista uusi salasana",
      required: "Anna nykyinen salasanasi.",
      length: "Salasanan on oltava 8–128 merkkiä pitkä.",
      mismatch: "Salasanat eivät täsmää.",
      submit: "Vaihda salasana",
      success: "Salasana vaihdettu. Muut istuntosi on kirjattu ulos.",
      failed:
        "Salasanan vaihtaminen epäonnistui. Tarkista nykyinen salasanasi tai kirjaudu uudelleen sisään ja yritä uudelleen.",
      forgot:
        "Unohditko nykyisen salasanasi? Voit pyytää vaihtolinkin sähköpostiisi.",
    },
  },
  en: {
    title: "Management account settings",

    backHome: "Back to home management",
    manageUsers: "Manage users",
    loading: "Loading management account details…",
    loadFailed: "Could not load your management account details.",
    retry: "Try again",
    signedInAs: "Signed in with management account",
    role: "Role",
    roles: {
      superadmin: "Superadmin",
      event_editor: "Event editor",
      user: "User",
    },
    password: {
      description:
        "Confirm the change with your current password. Your other sessions will be signed out.",
      current: "Current password",
      next: "New password",
      confirm: "Confirm new password",
      required: "Enter your current password.",
      length: "Your password must be 8–128 characters long.",
      mismatch: "The passwords do not match.",
      submit: "Change password",
      success: "Password changed. Your other sessions have been signed out.",
      failed:
        "Could not change your password. Check your current password, or sign in again and retry.",
      forgot:
        "Forgot your current password? You can request a reset link by email.",
    },
  },
});
