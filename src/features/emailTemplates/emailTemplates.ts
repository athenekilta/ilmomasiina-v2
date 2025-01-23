import EmailVerificationEmail from "@/emails/EmailVerificationEmail";
import { createEmailTemplate } from "./createEmailTemplate";
import PasswordChangeEmail from "@/emails/PasswordChangeEmail";
import EventSignupEmail from "@/emails/EventSignupEmail";
import EventQueueEmail from "@/emails/EventQueueEmail";
import EventQueueAcceptedEmail from "@/emails/EventQueueAcceptedEmail";

export const emailTemplates = {
  emailVerification: createEmailTemplate(EmailVerificationEmail),
  passwordChange: createEmailTemplate(PasswordChangeEmail),
  eventSignup: createEmailTemplate(EventSignupEmail),
  eventQueue: createEmailTemplate(EventQueueEmail),
  eventQueueAccepted: createEmailTemplate(EventQueueAcceptedEmail),
};
