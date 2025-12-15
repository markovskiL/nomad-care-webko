import { Resend } from "resend"

// Form type definition (inline to avoid dependency on generated types)
interface Form {
  id: string | number
  title: string
  fields?: Array<{ name: string; label?: string | null }> | null
  emailNotification?: {
    enabled?: boolean | null
    recipientEmail?: string | null
    emailSubject?: string | null
  } | null
}

interface SendNotificationResult {
  success: boolean
  error?: string
}

/**
 * Sends an email notification when a form is submitted
 */
export async function sendFormNotification(
  form: Form,
  data: Record<string, unknown>
): Promise<SendNotificationResult> {
  const emailNotification = form.emailNotification

  const isEnabled = emailNotification?.enabled
  const recipient = emailNotification?.recipientEmail

  // Skip if notifications are disabled or no recipient
  if (!isEnabled || !recipient) {
    return { success: true }
  }

  // Check for API key
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured - skipping email notification")
    return { success: false, error: "Email service not configured" }
  }

  try {
    // Initialize Resend inside the function to avoid build-time errors
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Format the form data into readable HTML
    const formattedData = formatFormData(form, data)

    console.log(`📧 Sending email notification to: ${recipient}`)

    const result = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>", // Use your verified domain in production
      to: recipient,
      subject: emailNotification?.emailSubject ?? `New submission from ${form.title}`,
      html: generateEmailHtml(form.title, formattedData),
    })

    if (result.error) {
      console.error("❌ Failed to send notification email:", result.error)
      return { success: false, error: result.error.message }
    }

    console.log(`✅ Email sent successfully! ID: ${result.data?.id}`)
    return { success: true }
  } catch (error) {
    console.error("Error sending notification email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Formats form data with field labels for better readability
 */
function formatFormData(form: Form, data: Record<string, unknown>): string {
  const lines: string[] = []
  const fields = form.fields

  for (const [key, value] of Object.entries(data)) {
    // Find the field config to get the label
    const fieldConfig = fields?.find((f) => f.name === key)
    const label = fieldConfig?.label ?? key

    // Format the value
    let formattedValue = String(value ?? "")
    if (typeof value === "boolean") {
      formattedValue = value ? "Yes" : "No"
    }

    lines.push(`<tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #374151; width: 30%;">${label}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${formattedValue}</td>
    </tr>`)
  }

  return lines.join("")
}

/**
 * Generates the HTML email template
 */
function generateEmailHtml(formTitle: string, tableRows: string): string {
  const timestamp = new Date().toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 12px 12px 0 0; padding: 32px; text-align: center;">
      <h1 style="margin: 0; color: #3b82f6; font-size: 24px; font-weight: 700;">New Form Submission</h1>
      <p style="margin: 8px 0 0; color: #94a3b8; font-size: 14px;">${formTitle}</p>
    </div>

    <!-- Content -->
    <div style="background-color: #ffffff; padding: 32px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <table style="width: 100%; border-collapse: collapse;">
        ${tableRows}
      </table>

      <!-- Footer -->
      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="margin: 0; color: #6b7280; font-size: 12px;">
          Submitted on ${timestamp}
        </p>
        <p style="margin: 8px 0 0; color: #9ca3af; font-size: 11px;">
          This email was sent from your website contact form.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`
}
