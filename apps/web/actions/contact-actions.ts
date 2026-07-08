"use server";

import { ContactMessageTemplate } from "@/components/email-template/ContactMessageTemplate";
import { resend } from "@/lib/resend";
import {
  ContactMessageSchema,
  ContactMessageSchemaType,
} from "@/validations/contact-schemas";

/**
 * Sends a contact form submission to the site's contact address, with the
 * visitor's own address set as reply-to so the team can reply directly.
 */
export async function sendContactMessage(data: ContactMessageSchemaType) {
  const validated = ContactMessageSchema.parse(data);

  const emailFrom = process.env.EMAIL_FROM;
  const contactEmail = process.env.CONTACT_EMAIL || emailFrom;

  if (!emailFrom || !contactEmail) {
    throw new Error(
      "La variable d'environnement EMAIL_FROM n'est pas définie."
    );
  }

  try {
    await resend.emails.send({
      from: emailFrom,
      to: contactEmail,
      replyTo: validated.email,
      subject: `[Contact] ${validated.subject}`,
      react: ContactMessageTemplate(validated),
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to send contact message:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de l'envoi de votre message.",
    };
  }
}
