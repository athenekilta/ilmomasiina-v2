import { defineMessages } from "../messages";

export const commonMessages = defineMessages({
  fi: {
    language: "Kieli",
    finnish: "Suomi",
    english: "English",
    /* The header carries one link, not a picker: with two languages the only
       thing worth saying is where the link goes. The guild's own site says
       exactly this. */
    switchLanguage: "In English",
    close: "Sulje",
    loading: "Ladataan…",
    retry: "Yritä uudelleen",
    save: "Tallenna",
    cancel: "Peruuta",
    delete: "Poista",
    confirmDelete: "Vahvista poisto",
    back: "Takaisin",
    success: "Onnistui",
    warning: "Varoitus",
    error: "Virhe",
  },
  en: {
    language: "Language",
    finnish: "Suomi",
    english: "English",
    switchLanguage: "Suomeksi",
    close: "Close",
    loading: "Loading…",
    retry: "Try again",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    confirmDelete: "Confirm removal",
    back: "Back",
    success: "Success",
    warning: "Warning",
    error: "Error",
  },
});
