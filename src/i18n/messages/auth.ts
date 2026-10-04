import { defineMessages } from "../messages";

export const authMessages = defineMessages({
  fi: {
    fields: {
      name: "Nimi",
      email: "Sähköposti",
      password: "Salasana",
    },
    actions: {
      login: "Kirjaudu sisään",
      signup: "Luo tunnus",
      createAccount: "Luo tunnus",
      changePassword: "Vaihda salasana",
      requestPasswordChange: "Lähetä salasanan vaihtolinkki",
      requestEmailVerification: "Lähetä vahvistusviesti",
      requestNewVerificationEmail: "Lähetä uusi vahvistusviesti",
      showPassword: "Näytä salasana",
      hidePassword: "Piilota salasana",
    },
    validation: {
      invalidEmail: "Anna kelvollinen sähköpostiosoite",
      nameTooShort: (minimum: number) =>
        `Nimen on oltava vähintään ${minimum} merkkiä`,
      passwordTooShort: (minimum: number) =>
        `Salasanan on oltava vähintään ${minimum} merkkiä`,
    },
    login: {
      title: "Kirjaudu sisään",
      invalidCredentials: "Sähköposti tai salasana on virheellinen.",
      failed: "Kirjautuminen epäonnistui. Yritä uudelleen.",
    },
    signup: {
      title: "Luo tunnus",
      failed: "Tunnuksen luominen epäonnistui. Yritä uudelleen.",
    },
    emailVerification: {
      requestTitle: "Pyydä sähköpostin vahvistusta",
      title: "Vahvista sähköpostiosoitteesi",
      checkEmail: "Tarkista sähköpostisi.",
      initialEmailSent:
        "Lähetimme vahvistusviestin sähköpostiosoitteeseesi, kun kirjauduit ensimmäisen kerran.",
      resendInstructions:
        "Jos tarvitset uuden vahvistusviestin, voit lähettää sen alla olevalla painikkeella.",
      emailSent:
        "Olemme lähettäneet sinulle sähköpostiviestin, jossa olevalla linkillä voit vahvistaa sähköpostiosoitteesi.",
      sentTo: (email: string) =>
        `Vahvistusviesti lähetettiin osoitteeseen ${email}.`,
      emailNotFound: "Sähköpostiosoitetta ei löytynyt",
      verificationFailed: "Sähköpostiosoitteen vahvistaminen epäonnistui.",
      requestFailed: "Vahvistusviestin lähettäminen epäonnistui.",
    },
    passwordChange: {
      title: "Vaihda salasana",
      requestTitle: "Pyydä salasanan vaihtoa",
      requestDescription:
        "Anna sähköpostiosoitteesi, niin lähetämme sinulle linkin salasanan vaihtamista varten.",
      requestedTitle: "Unohtuiko salasana?",
      requestedDescription:
        "Salasanan vaihtolinkki on lähetetty sähköpostiisi.",
      changedDescription: "Salasana vaihdettiin onnistuneesti.",
      invalidToken: "Salasanan vaihtolinkki ei ole voimassa.",
      enterNewPassword: (email: string) =>
        `Anna uusi salasana käyttäjälle ${email}.`,
      loading: "Ladataan…",
      changeFailed: "Salasanan vaihtaminen epäonnistui.",
      requestFailed: "Salasanan vaihtolinkin lähettäminen epäonnistui.",
    },
  },
  en: {
    fields: {
      name: "Name",
      email: "Email",
      password: "Password",
    },
    actions: {
      login: "Log in",
      signup: "Create account",
      createAccount: "Create an account",
      changePassword: "Change password",
      requestPasswordChange: "Send password reset link",
      requestEmailVerification: "Send verification email",
      requestNewVerificationEmail: "Send a new verification email",
      showPassword: "Show password",
      hidePassword: "Hide password",
    },
    validation: {
      invalidEmail: "Enter a valid email address",
      nameTooShort: (minimum: number) =>
        `Name must be at least ${minimum} characters`,
      passwordTooShort: (minimum: number) =>
        `Password must be at least ${minimum} characters`,
    },
    login: {
      title: "Log in",
      invalidCredentials: "Invalid email or password.",
      failed: "Login failed. Please try again.",
    },
    signup: {
      title: "Create account",
      failed: "Could not create the account. Please try again.",
    },
    emailVerification: {
      requestTitle: "Request email verification",
      title: "Verify your email",
      checkEmail: "Check your email.",
      initialEmailSent:
        "We sent a verification email to your email address when you first signed in.",
      resendInstructions:
        "If you need a new verification email, you can send one using the button below.",
      emailSent:
        "We have sent you an email with a link to verify your email address.",
      sentTo: (email: string) => `Verification email sent to ${email}.`,
      emailNotFound: "Email address not found",
      verificationFailed: "Email verification failed.",
      requestFailed: "Could not send the verification email.",
    },
    passwordChange: {
      title: "Change password",
      requestTitle: "Request a password reset",
      requestDescription:
        "Enter your email address and we will send you a link to reset your password.",
      requestedTitle: "Forgot your password?",
      requestedDescription:
        "A password reset link has been sent to your email.",
      changedDescription: "Password changed successfully.",
      invalidToken: "The password reset link is invalid.",
      enterNewPassword: (email: string) => `Enter a new password for ${email}.`,
      loading: "Loading…",
      changeFailed: "Could not change the password.",
      requestFailed: "Could not send the password reset link.",
    },
  },
});
