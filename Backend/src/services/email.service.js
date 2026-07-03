import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, html, textOverride = null) => {
  try {
    const plainText = textOverride || stripHtml(html);

    const response = await resend.emails.send({
      from: `MediFlow Healthcare <${process.env.EMAIL_USER}>`,
      // replyTo lets users reply to a monitored inbox rather than a no-reply address.
      // Spam filters penalise no-reply senders that never receive replies.
      replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_USER,
      to,
      subject,
      html,
      // Plain-text alternative is required by RFC 2822 and CAN-SPAM.
      // Gmail and SpamAssassin heavily penalise HTML-only emails.
      text: plainText,
      headers: {
        // One-click unsubscribe required by Gmail bulk-sender policy (Feb 2024)
        // and recommended by Yahoo Mail. Without this, bulk emails hit spam.
        "List-Unsubscribe": `<mailto:${process.env.EMAIL_REPLY_TO || process.env.EMAIL_USER}?subject=unsubscribe>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        // Unique message ID prevents threading and duplicate detection false-positives
        "X-Entity-Ref-ID": `mediflow-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      },
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    console.log(`[Email] Sent to ${to} | Subject: "${subject}"`);
    return response;
  } catch (error) {
    console.error(`[Email] Failed for ${to}:`, error.message);
    throw error;
  }
};

/**
 * Converts HTML to a clean plain-text fallback.
 *
 * Why this matters:
 * Spam filters (SpamAssassin, Gmail, Outlook) require a text/plain MIME part.
 * Emails without it score 1.0–2.0 extra spam points, which is often enough
 * to push a borderline email into spam.
 */
function stripHtml(html) {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li>/gi, "  - ")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<h[1-6][^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8212;/g, "-")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}