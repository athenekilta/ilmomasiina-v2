import { defineMessages } from "../messages";

export const emailMessages = defineMessages({
  fi: {
    details: {
      event: "Tapahtuma",
      signup: "Ilmo",
      name: "Nimi",
      dateTime: "Ajankohta",
      email: "Sähköposti",
      quota: "Kiintiö",
    },
    emailVerification: {
      subject: "Vahvista sähköpostiosoitteesi",
      preview: "Vahvista Ilmomasiina-tilisi sähköpostiosoite",
      heading: "Vahvista sähköpostiosoitteesi",
      body: "Viimeistele Ilmomasiina-tilisi käyttöönotto vahvistamalla sähköpostiosoitteesi.",
      button: "Vahvista sähköpostiosoite",
      ignore: "Jos et ole luonut tiliä, voit jättää tämän viestin huomiotta.",
    },
    passwordChange: {
      subject: "Vaihda salasanasi",
      preview: "Ilmomasiina-tilillesi pyydettiin salasanan vaihtoa",
      heading: "Salasanan vaihto",
      body: "Ilmomasiina-tilillesi pyydettiin salasanan vaihtoa. Voit asettaa uuden salasanan alla olevasta painikkeesta.",
      button: "Vaihda salasana",
      notice:
        "Linkki on voimassa seitsemän päivää. Jos et pyytänyt salasanan vaihtoa, voit jättää tämän viestin huomiotta.",
    },
    eventSignup: {
      subject: (eventName: string) => `Ilmosi on vahvistettu: ${eventName}`,
      preview: (eventName: string) =>
        `Ilmosi tapahtumaan ${eventName} on vahvistettu`,
      heading: "Ilmo vahvistettu",
      body: "Olet saanut paikan tapahtumasta. Ilmosi tiedot ovat alla.",
      button: "Muokkaa ilmoa",
    },
    eventQueue: {
      subject: (eventName: string) => `Olet jonossa: ${eventName}`,
      preview: (eventName: string) =>
        `Ilmosi tapahtumaan ${eventName} on jonossa`,
      heading: "Ilmosi on jonossa",
      body: "Tapahtuman paikat ovat tällä hetkellä täynnä. Ilmoitamme sinulle sähköpostitse, jos saat paikan.",
      button: "Muokkaa ilmoa",
    },
    eventQueueAccepted: {
      subject: (eventName: string) => `Paikkasi on vahvistettu: ${eventName}`,
      preview: (eventName: string) =>
        `Olet saanut paikan tapahtumasta ${eventName}`,
      heading: "Sait paikan tapahtumasta",
      body: "Tapahtumaan vapautui paikka, ja ilmosi on nyt vahvistettu.",
      button: "Muokkaa ilmoa",
    },
    eventSignupAccess: {
      subject: (eventName: string) => `Muokkaa ilmoasi: ${eventName}`,
      preview: (eventName: string) => `Linkki tapahtuman ${eventName} ilmoosi`,
      heading: "Ilmolinkkisi",
      body: "Avaa ilmosi alta olevasta painikkeesta.",
      button: "Muokkaa ilmoa",
    },
  },
  en: {
    details: {
      event: "Event",
      signup: "Registration",
      name: "Name",
      dateTime: "Date and time",
      email: "Email",
      quota: "Quota",
    },
    emailVerification: {
      subject: "Verify your email address",
      preview: "Verify the email address for your Ilmomasiina account",
      heading: "Verify your email address",
      body: "Finish setting up your Ilmomasiina account by verifying your email address.",
      button: "Verify email address",
      ignore: "If you did not create an account, you can ignore this message.",
    },
    passwordChange: {
      subject: "Change your password",
      preview: "A password change was requested for your Ilmomasiina account",
      heading: "Change your password",
      body: "A password change was requested for your Ilmomasiina account. You can set a new password using the button below.",
      button: "Change password",
      notice:
        "The link is valid for seven days. If you did not request a password change, you can ignore this message.",
    },
    eventSignup: {
      subject: (eventName: string) =>
        `Your registration is confirmed: ${eventName}`,
      preview: (eventName: string) =>
        `Your registration for ${eventName} is confirmed`,
      heading: "Registration confirmed",
      body: "You have a place at the event. Your registration details are below.",
      button: "Edit registration",
    },
    eventQueue: {
      subject: (eventName: string) =>
        `You are on the waiting list: ${eventName}`,
      preview: (eventName: string) =>
        `Your registration for ${eventName} is on the waiting list`,
      heading: "Your registration is on the waiting list",
      body: "The event is currently full. We will notify you by email if a place becomes available for you.",
      button: "Edit registration",
    },
    eventQueueAccepted: {
      subject: (eventName: string) => `Your place is confirmed: ${eventName}`,
      preview: (eventName: string) =>
        `You have a place at the event ${eventName}`,
      heading: "You have a place at the event",
      body: "A place became available at the event, and your registration is now confirmed.",
      button: "Edit registration",
    },
    eventSignupAccess: {
      subject: (eventName: string) => `Edit your registration: ${eventName}`,
      preview: (eventName: string) =>
        `Link to your registration for ${eventName}`,
      heading: "Your registration link",
      body: "Open your registration using the button below.",
      button: "Edit registration",
    },
  },
});
