import { defineMessages } from "../messages";

export const adminMessages = defineMessages({
  fi: {
    title: "Hallinta",
    loading: "Ladataan…",
    noSuperadminTitle: "Ei pääkäyttäjän oikeuksia",
    noSuperadminDescription:
      "Käyttäjähallinta on käytettävissä vain pääkäyttäjille.",
    users: "Käyttäjät",
    loadingUsers: "Ladataan käyttäjiä…",
    loadUsersFailed: "Käyttäjien lataaminen epäonnistui.",
    noUsers: "Ei käyttäjiä.",
    updateRoleFailed: "Käyttöoikeuden päivittäminen epäonnistui.",
    columns: {
      name: "Nimi",
      email: "Sähköposti",
      role: "Rooli",
    },
    roles: {
      user: "Uusi käyttäjä",
      userOption: "Uusi käyttäjä (ei oikeuksia)",
      eventEditor: "Tapahtumamuokkaaja",
      superadmin: "Pääkäyttäjä",
      superadminOption: "Pääkäyttäjä (superadmin)",
    },
    ownRoleTitle: "Et voi muuttaa omaa rooliasi turvallisuussyistä.",
    selectRoleTitle: "Valitse käyttäjän rooli",
    confirmRoleChange: (email: string, role: string) =>
      `Haluatko varmasti muuttaa käyttäjän ${email} rooliksi ”${role}”?`,
  },
  en: {
    title: "Administration",
    loading: "Loading…",
    noSuperadminTitle: "Superadmin access required",
    noSuperadminDescription:
      "User management is available only to superadmins.",
    users: "Users",
    loadingUsers: "Loading users…",
    loadUsersFailed: "Could not load users.",
    noUsers: "No users.",
    updateRoleFailed: "Could not update the user’s access rights.",
    columns: {
      name: "Name",
      email: "Email",
      role: "Role",
    },
    roles: {
      user: "New user",
      userOption: "New user (no access)",
      eventEditor: "Event editor",
      superadmin: "Superadmin",
      superadminOption: "Superadmin",
    },
    ownRoleTitle: "You cannot change your own role for security reasons.",
    selectRoleTitle: "Select the user’s role",
    confirmRoleChange: (email: string, role: string) =>
      `Are you sure you want to change ${email}’s role to “${role}”?`,
  },
});
