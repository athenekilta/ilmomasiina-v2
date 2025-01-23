"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplates = void 0;
const EmailVerificationEmail_1 = __importDefault(require("@/emails/EmailVerificationEmail"));
const createEmailTemplate_1 = require("./createEmailTemplate");
const PasswordChangeEmail_1 = __importDefault(require("@/emails/PasswordChangeEmail"));
const EventSignupEmail_1 = __importDefault(require("@/emails/EventSignupEmail"));
const EventQueueEmail_1 = __importDefault(require("@/emails/EventQueueEmail"));
const EventQueueAcceptedEmail_1 = __importDefault(require("@/emails/EventQueueAcceptedEmail"));
exports.emailTemplates = {
    emailVerification: (0, createEmailTemplate_1.createEmailTemplate)(EmailVerificationEmail_1.default),
    passwordChange: (0, createEmailTemplate_1.createEmailTemplate)(PasswordChangeEmail_1.default),
    eventSignup: (0, createEmailTemplate_1.createEmailTemplate)(EventSignupEmail_1.default),
    eventQueue: (0, createEmailTemplate_1.createEmailTemplate)(EventQueueEmail_1.default),
    eventQueueAccepted: (0, createEmailTemplate_1.createEmailTemplate)(EventQueueAcceptedEmail_1.default),
};
