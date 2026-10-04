import { defineMessages } from "../messages";

export const publicEventsMessages = defineMessages({
  fi: {
    list: {
      title: "Tapahtumat",
      adminFilters: "Hallinnan suodattimet",
      view: "Näkymä",
      allEvents: "Kaikki tapahtumat",
      upcomingEvents: "Tulevat tapahtumat",
      draftsVisible: "Luonnokset näkyvissä",
      draftsHidden: "Luonnokset piilotettu",
      eventList: "Tapahtumalista",
      empty: "Tyhjää täynnä. Ei tulevia tapahtumia.",
      registrationEnded: "Ilmo päättynyt",
      management: "Hallinta",
      createEvent: "Luo uusi tapahtuma",
    },
    identity: {
      promptTitle: "Aloita täydentämällä ilmotietosi",
      promptDescription:
        "Näillä tiedoilla ilmoat tapahtumiin jatkossa automaattisesti",
      completeTitle: "Täydennä ilmotietosi",
      completeDescription:
        "Aseta nimi ja sähköposti ennen ilmoa. Huomaa, että voit ilmota tapahtumaan vain kerran.",
      publicPrivacy:
        "Nimi on julkinen tieto. Voit halutessasi ilmota salanimellä tapahtumaan.",
      privatePrivacy: "Voit halutessasi ilmota salanimellä tapahtumaan.",
      name: "Nimi",
      emailPlaceholder: "sinä@example.com",
      save: "Tallenna",
      cancel: "Peruuta",
      invalidEmail: "Anna kelvollinen sähköpostiosoite",
      nameTooShort: "Nimen on oltava vähintään 3 merkkiä",
    },
    card: {
      draft: "Luonnos",
      registrationEnded: "Ilmo päättynyt",
      edit: "Muokkaa",
      fill: {
        signupCount: (count: number) => `${count} ilmonnutta`,
        remaining: (remaining: number, capacity: number) =>
          `${remaining}/${capacity} paikkaa jäljellä`,
        unlimited: "Ei paikkarajaa",
        spaceRemaining: (count: number, capacity: number) =>
          `${count}/${capacity} · tilaa jäljellä`,
        filling: (count: number, capacity: number) =>
          `${count}/${capacity} · täyttymässä`,
        full: (count: number, capacity: number) =>
          `${count}/${capacity} · täynnä, ilmo jonoon`,
        unlimitedLabel: (countText: string) =>
          `${countText} · tilaa jäljellä`,
      },
      timing: {
        closed: "Ilmo sulkeutunut",
        endedAt: (dateTime: string) => `Päättyi ${dateTime}`,
        opensInMinutes: (count: number) =>
          `Aukeaa ${count} minuutin päästä`,
        opensInHours: (count: number) => `Aukeaa ${count} tunnin päästä`,
        opensTomorrow: "Aukeaa huomenna",
        opensInDays: (count: number) => `Aukeaa ${count} päivän päästä`,
        closesInMinutes: (count: number) =>
          `Sulkeutuu ${count} minuutin päästä`,
        closesInHours: (count: number) =>
          `Sulkeutuu ${count} tunnin päästä`,
        closesTomorrow: "Sulkeutuu huomenna",
        closesInDays: (count: number) =>
          `Sulkeutuu ${count} päivän päästä`,
        openForDays: (count: number) => `Auki vielä ${count} päivää`,
        until: (dateTime: string) => `${dateTime} asti`,
        at: (date: string, time: string) => `${date} klo ${time}`,
      },
    },
    detail: {
      unavailableTitle: "Tapahtuma ei ole saatavilla",
      forbidden: "Sinulla ei ole oikeutta nähdä tätä tapahtumaa.",
      notFound: "Tapahtumaa ei löytynyt tai se ei ole enää saatavilla.",
      refreshFailed: "Tapahtuman päivitys epäonnistui. Yritä uudelleen.",
      staleData:
        "Tapahtuman päivitys epäonnistui. Näytetyt tiedot voivat olla vanhentuneita.",
      retry: "Yritä uudelleen",
      backToEvents: "Takaisin tapahtumiin",
      backToHome: "Takaisin etusivulle",
      loading: "Ladataan…",
      draft: "Luonnos",
      editEvent: "Muokkaa tapahtumaa",
      information: "Tiedot",
      dateTime: "Ajankohta:",
      location: "Sijainti:",
    },
    registration: {
      title: "Ilmo",
      periodEnded: "Ilmo on päättynyt.",
      openUntil: (dateTime: string) => `Auki ${dateTime} asti`,
      opensAt: (dateTime: string) => `Ilmo aukeaa ${dateTime}`,
      completedWarning:
        "Tällä sähköpostilla on jo ilmo. Muokkaa olemassa olevaa ilmoa sähköpostiin tulleen linkin kautta.",
      editLinkSent: "Ilmon muokkauslinkki lähetetty sähköpostiin.",
      editLinkFailed: "Linkin lähettäminen epäonnistui. Yritä uudelleen.",
      unknownError: "Tuntematon virhe. Yritä uudelleen.",
      signupFailed: "Ilmoittautuminen epäonnistui. Yritä uudelleen.",
      signupComplete: "Ilmo kunnossa!",
      completedWithEmail: (email: string) =>
        `Olet ilmonnut sähköpostilla ${email}.`,
      registrationClosedCannotEdit:
        "Ilmo on päättynyt, eikä ilmoa voi enää muokata.",
      editFromEmail: "Muokkaa ilmoa sähköpostista löytyvällä linkillä.",
      editSignup: "Muokkaa ilmoa",
      sendingLink: "Lähetetään linkkiä…",
      sendEditLink: "Lähetä muokkauslinkki",
      newSignup: "Uusi ilmo",
      signupInProgress: "Ilmo kesken!",
      inProgressWithEmail: (email: string) =>
        `Sinulla on keskeneräinen ilmo sähköpostilla ${email}.`,
      finishSignup: "Viimeistele ilmo",
      greeting: (name: string, email: string) =>
        `Hei ${name}, olet ilmoamassa sähköpostilla ${email}.`,
      changeIdentity: "Vaihda",
      unlimitedCapacity: "Paikkamäärää ei ole rajattu",
      signupCount: (count: number) => `${count} ilmonnutta`,
      totalCapacity: (count: number) => `Paikkoja yhteensä: ${count}`,
      reservedCapacity: (occupied: number, capacity: number) =>
        `${occupied} / ${capacity} varattu`,
      reservedCapacityAria: (occupied: number, capacity: number) =>
        `${occupied} / ${capacity} paikkaa varattu`,
      quotaSignupCountTitle: (title: string, count: number) =>
        `${title}: ${count} ilmonnutta`,
      quotaPlacesRemainingTitle: (title: string, count: number) =>
        `${title}: ${count} kiintiöpaikkaa jäljellä`,
      quotaReservedPlaces: "Kiintiölle varatut paikat",
      signupCountWithCapacity: (count: number, capacity: number) =>
        `${count} / ${capacity} ilmonnutta`,
      waitlisted: (count: number) => `${count} jonossa`,
      removeDemoSignup: (title: string) =>
        `Poista demoilmo kiintiöstä ${title}`,
      addDemoSignup: (title: string) => `Lisää demoilmo kiintiöön ${title}`,
      joinQueue: "Ilmoa jonoon",
      signUp: "Ilmoa",
      conflictTitle: "Vaihda kiintiötä?",
      foundPreviousCompleted:
        "Löysimme tällä sähköpostilla aiemman vahvistetun ilmon.",
      foundPreviousIncomplete:
        "Löysimme tällä sähköpostilla aiemman vahvistamattoman ilmon.",
      previous: "Aiempi:",
      new: "Uusi:",
      inQueue: "Jonossa",
      inQuota: "Kiintiössä",
      keepPrevious: "Pidä aiempi ilmo",
      chooseNewQuota: "Valitse uusi kiintiö",
    },
    signup: {
      pageTitle: "Ilmo",
      invalidLink: "Ilmoittautumislinkki ei ole voimassa.",
      forbidden: "Sinulla ei ole oikeutta nähdä tätä ilmoa.",
      unavailable:
        "Ilmoa ei löytynyt, se on poistettu tai sen lataus epäonnistui. Tallentamattomia vastauksia ei lähetetty.",
      retry: "Yritä uudelleen",
      backToEvent: "Takaisin tapahtumaan",
      detailsTitle: "Ilmon tiedot",
      finishTitle: "Viimeistele ilmo",
      editTitle: "Muokkaa ilmoa",
      editingClosed:
        "Ilmoittautuminen on päättynyt, eikä ilmoa voi enää muokata. Ilmosi tiedot näkyvät alla.",
      existingIncomplete:
        "Löysimme jo sinun vahvistamattoman ilmosi tähän tapahtumaan. Täydennä tai muokkaa tietoja alla ja vahvista lopuksi.",
      wrongQuota: "Väärä kiintiö? Poista ilmo ja tee uusi.",
      quota: "Kiintiö",
      inQueue: "Jonossa",
      inQuota: "Kiintiössä",
      reloadFailed:
        "Uusimpien tietojen lataus epäonnistui. Omat vastauksesi säilytettiin.",
      savedButReloadFailed:
        "Ilmo tallennettiin, mutta uusimpia tietoja ei voitu ladata.",
      saved: "Ilmo onnistui",
      saveFailed: "Ilmon tallentaminen epäonnistui. Yritä uudelleen.",
      deleted: "Ilmo poistettiin",
      deleteFailed:
        "Ilmon poisto epäonnistui. Päivitä tiedot ja yritä uudelleen.",
      updateFailed:
        "Tietojen päivitys epäonnistui. Omat vastauksesi säilytettiin.",
      participant: "Osallistuja",
      name: "Nimi",
      email: "Sähköposti",
      identityLocked: "Nimeä ja sähköpostia ei voi muuttaa tässä vaiheessa.",
      questions: "Kysymykset",
      required: "pakollinen",
      public: "julkinen",
      publicAnswer:
        "Tämä vastaus näkyy tapahtuman julkisessa osallistujalistassa.",
      termsTitle: "Ehdot",
      termsBeforeLink:
        "Ilmoittautumisen sulkeuduttua ilmoittautuminen on sitova. Tämän jälkeen ilmoittautunut on velvollinen maksamaan osallistumismaksun tai löytämään paikalleen toisen osallistujan. Osallistumalla tapahtumaan sitoudut noudattamaan",
      principles: "Athenen yhteisiä periaatteita",
      confirm: "Vahvista ilmo",
      deleting: "Poistetaan…",
      delete: "Poista ilmo",
      deleteTitle: "Poista ilmo?",
      deleteMessage: "Haluatko varmasti poistaa ilmosi? Tätä ei voi perua.",
      invalidAnswer: "Tarkista vastaus.",
    },
    validation: {
      identity: {
        invalidEmail: "Anna kelvollinen sähköpostiosoite",
        nameTooShort: "Nimen on oltava vähintään 3 merkkiä",
      },
      signup: {
        nameRequired: "Nimi on pakollinen",
        invalidEmail: "Anna kelvollinen sähköpostiosoite",
      },
      answers: {
        atLeastTwoOptions: "Lisää vähintään kaksi vaihtoehtoa",
        optionRequired: "Vaihtoehto ei voi olla tyhjä",
        optionSingleLine: "Vaihtoehto ei voi sisältää rivinvaihtoa",
        optionsUnique: "Vaihtoehtojen on oltava yksilöllisiä",
        answerRequired: "Vastaus on pakollinen",
        invalidOption: "Valittu vaihtoehto ei ole kelvollinen",
        duplicateOption: "Sama vaihtoehto on valittu useita kertoja",
        duplicateQuestion: "Sama kysymys on vastattu useita kertoja",
        unknownQuestion: "Vastaus viittaa tuntemattomaan kysymykseen",
        requiredAnswerMissing: "Pakollinen vastaus puuttuu",
      },
    },
  },
  en: {
    list: {
      title: "Events",
      adminFilters: "Management filters",
      view: "View",
      allEvents: "All events",
      upcomingEvents: "Upcoming events",
      draftsVisible: "Drafts visible",
      draftsHidden: "Drafts hidden",
      eventList: "Event list",
      empty: "Nothing here yet. There are no upcoming events.",
      registrationEnded: "Registration ended",
      management: "Management",
      createEvent: "Create new event",
    },
    identity: {
      promptTitle: "Start by entering your registration details",
      promptDescription:
        "These details will be used automatically when you register for events",
      completeTitle: "Complete your registration details",
      completeDescription:
        "Enter your name and email before registering. You can only register for an event once.",
      publicPrivacy:
        "Your name is public. You may use a pseudonym when registering if you prefer.",
      privatePrivacy:
        "You may use a pseudonym when registering if you prefer.",
      name: "Name",
      emailPlaceholder: "you@example.com",
      save: "Save",
      cancel: "Cancel",
      invalidEmail: "Enter a valid email address",
      nameTooShort: "Name must be at least 3 characters",
    },
    card: {
      draft: "Draft",
      registrationEnded: "Registration ended",
      edit: "Edit",
      fill: {
        signupCount: (count: number) =>
          `${count} ${count === 1 ? "registration" : "registrations"}`,
        remaining: (remaining: number, capacity: number) =>
          `${remaining}/${capacity} places remaining`,
        unlimited: "No capacity limit",
        spaceRemaining: (count: number, capacity: number) =>
          `${count}/${capacity} · places available`,
        filling: (count: number, capacity: number) =>
          `${count}/${capacity} · filling up`,
        full: (count: number, capacity: number) =>
          `${count}/${capacity} · full, join the queue`,
        unlimitedLabel: (countText: string) =>
          `${countText} · places available`,
      },
      timing: {
        closed: "Registration closed",
        endedAt: (dateTime: string) => `Ended ${dateTime}`,
        opensInMinutes: (count: number) =>
          `Opens in ${count} ${count === 1 ? "minute" : "minutes"}`,
        opensInHours: (count: number) =>
          `Opens in ${count} ${count === 1 ? "hour" : "hours"}`,
        opensTomorrow: "Opens tomorrow",
        opensInDays: (count: number) =>
          `Opens in ${count} ${count === 1 ? "day" : "days"}`,
        closesInMinutes: (count: number) =>
          `Closes in ${count} ${count === 1 ? "minute" : "minutes"}`,
        closesInHours: (count: number) =>
          `Closes in ${count} ${count === 1 ? "hour" : "hours"}`,
        closesTomorrow: "Closes tomorrow",
        closesInDays: (count: number) =>
          `Closes in ${count} ${count === 1 ? "day" : "days"}`,
        openForDays: (count: number) =>
          `Open for ${count} more ${count === 1 ? "day" : "days"}`,
        until: (dateTime: string) => `Until ${dateTime}`,
        at: (date: string, time: string) => `${date} at ${time}`,
      },
    },
    detail: {
      unavailableTitle: "Event unavailable",
      forbidden: "You do not have permission to view this event.",
      notFound: "The event was not found or is no longer available.",
      refreshFailed: "Could not update the event. Try again.",
      staleData:
        "Could not update the event. The information shown may be out of date.",
      retry: "Try again",
      backToEvents: "Back to events",
      backToHome: "Back to the front page",
      loading: "Loading…",
      draft: "Draft",
      editEvent: "Edit event",
      information: "Information",
      dateTime: "Date and time:",
      location: "Location:",
    },
    registration: {
      title: "Registration",
      periodEnded: "Registration has ended.",
      openUntil: (dateTime: string) => `Open until ${dateTime}`,
      opensAt: (dateTime: string) => `Registration opens ${dateTime}`,
      completedWarning:
        "This email already has a registration. Edit the existing registration using the link sent by email.",
      editLinkSent: "The registration edit link was sent by email.",
      editLinkFailed: "Could not send the link. Try again.",
      unknownError: "An unknown error occurred. Try again.",
      signupFailed: "Registration failed. Try again.",
      signupComplete: "Registration complete!",
      completedWithEmail: (email: string) =>
        `You registered with the email address ${email}.`,
      registrationClosedCannotEdit:
        "Registration has ended and can no longer be edited.",
      editFromEmail: "Edit your registration using the link in your email.",
      editSignup: "Edit registration",
      sendingLink: "Sending link…",
      sendEditLink: "Send edit link",
      newSignup: "New registration",
      signupInProgress: "Registration incomplete!",
      inProgressWithEmail: (email: string) =>
        `You have an incomplete registration with the email address ${email}.`,
      finishSignup: "Complete registration",
      greeting: (name: string, email: string) =>
        `Hello ${name}, you are registering with the email address ${email}.`,
      changeIdentity: "Change",
      unlimitedCapacity: "There is no capacity limit",
      signupCount: (count: number) =>
        `${count} ${count === 1 ? "registration" : "registrations"}`,
      totalCapacity: (count: number) => `Total places: ${count}`,
      reservedCapacity: (occupied: number, capacity: number) =>
        `${occupied} / ${capacity} reserved`,
      reservedCapacityAria: (occupied: number, capacity: number) =>
        `${occupied} of ${capacity} places reserved`,
      quotaSignupCountTitle: (title: string, count: number) =>
        `${title}: ${count} ${count === 1 ? "registration" : "registrations"}`,
      quotaPlacesRemainingTitle: (title: string, count: number) =>
        `${title}: ${count} reserved ${count === 1 ? "place" : "places"} remaining`,
      quotaReservedPlaces: "Places reserved for quotas",
      signupCountWithCapacity: (count: number, capacity: number) =>
        `${count} / ${capacity} registered`,
      waitlisted: (count: number) => `${count} in queue`,
      removeDemoSignup: (title: string) =>
        `Remove demo registration from ${title}`,
      addDemoSignup: (title: string) => `Add demo registration to ${title}`,
      joinQueue: "Join queue",
      signUp: "Register",
      conflictTitle: "Change quota?",
      foundPreviousCompleted:
        "We found an earlier confirmed registration with this email address.",
      foundPreviousIncomplete:
        "We found an earlier unconfirmed registration with this email address.",
      previous: "Previous:",
      new: "New:",
      inQueue: "In queue",
      inQuota: "In quota",
      keepPrevious: "Keep previous registration",
      chooseNewQuota: "Choose new quota",
    },
    signup: {
      pageTitle: "Registration",
      invalidLink: "The registration link is invalid.",
      forbidden: "You do not have permission to view this registration.",
      unavailable:
        "The registration was not found, has been deleted, or could not be loaded. Unsaved answers were not sent.",
      retry: "Try again",
      backToEvent: "Back to event",
      detailsTitle: "Registration details",
      finishTitle: "Complete registration",
      editTitle: "Edit registration",
      editingClosed:
        "Registration has ended and can no longer be edited. Your registration details are shown below.",
      existingIncomplete:
        "We found your existing unconfirmed registration for this event. Complete or edit the details below, then confirm it.",
      wrongQuota: "Wrong quota? Delete the registration and create a new one.",
      quota: "Quota",
      inQueue: "In queue",
      inQuota: "In quota",
      reloadFailed:
        "Could not load the latest information. Your answers were preserved.",
      savedButReloadFailed:
        "The registration was saved, but the latest information could not be loaded.",
      saved: "Registration successful",
      saveFailed: "Could not save the registration. Try again.",
      deleted: "Registration deleted",
      deleteFailed:
        "Could not delete the registration. Refresh the information and try again.",
      updateFailed:
        "Could not update the information. Your answers were preserved.",
      participant: "Participant",
      name: "Name",
      email: "Email",
      identityLocked: "The name and email cannot be changed at this stage.",
      questions: "Questions",
      required: "required",
      public: "public",
      publicAnswer:
        "This answer is shown in the event’s public participant list.",
      termsTitle: "Terms",
      termsBeforeLink:
        "Once registration closes, your registration is binding. After that, you must pay the participation fee or find another participant to take your place. By attending the event, you agree to follow",
      principles: "Athene’s shared principles",
      confirm: "Confirm registration",
      deleting: "Deleting…",
      delete: "Delete registration",
      deleteTitle: "Delete registration?",
      deleteMessage:
        "Are you sure you want to delete your registration? This cannot be undone.",
      invalidAnswer: "Check your answer.",
    },
    validation: {
      identity: {
        invalidEmail: "Enter a valid email address",
        nameTooShort: "Name must be at least 3 characters",
      },
      signup: {
        nameRequired: "Name is required",
        invalidEmail: "Enter a valid email address",
      },
      answers: {
        atLeastTwoOptions: "Add at least two options",
        optionRequired: "An option cannot be empty",
        optionSingleLine: "An option cannot contain a line break",
        optionsUnique: "Options must be unique",
        answerRequired: "An answer is required",
        invalidOption: "The selected option is invalid",
        duplicateOption: "The same option was selected more than once",
        duplicateQuestion: "The same question was answered more than once",
        unknownQuestion: "The answer refers to an unknown question",
        requiredAnswerMissing: "A required answer is missing",
      },
    },
  },
});
