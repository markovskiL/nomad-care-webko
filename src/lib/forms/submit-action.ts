"use server"

import { getPayloadClient } from "@/lib/payload"
import { sendFormNotification } from "@/lib/email/send-notification"

interface SubmitResult {
  success: boolean
  error?: string
}

/**
 * Server action to submit form data to Payload CMS.
 * Creates a form submission entry in the database and sends email notification.
 */
export async function submitFormAction(
  formId: string | number,
  data: Record<string, unknown>
): Promise<SubmitResult> {
  try {
    const payload = await getPayloadClient()

    // Fetch the form configuration
    const form = await payload.findByID({
      collection: "forms",
      id: typeof formId === "string" ? parseInt(formId, 10) : formId,
    })

    if (!form) {
      return { success: false, error: "Form not found" }
    }

    // Save the submission to Payload
    await payload.create({
      collection: "form-submissions",
      data: {
        form: typeof formId === "string" ? parseInt(formId, 10) : formId,
        data,
        submittedAt: new Date().toISOString(),
      },
    })

    console.log("📝 Form submission saved, attempting to send email...")

    // Send email notification (don't fail the submission if email fails)
    const emailResult = await sendFormNotification(form, data)
    if (!emailResult.success) {
      console.warn("⚠️ Email notification failed:", emailResult.error)
    } else {
      console.log("✅ Email notification completed")
    }

    return { success: true }
  } catch (error) {
    console.error("Form submission error:", error)
    return {
      success: false,
      error: "Failed to submit form. Please try again.",
    }
  }
}
