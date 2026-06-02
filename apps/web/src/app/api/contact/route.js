import sql from "../utils/sql.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Get all contact inquiries (for admin)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    let query = "SELECT * FROM contact_inquiries";
    let params = [];
    if (status) {
      query += " WHERE status = $1";
      params = [status];
    }
    query += " ORDER BY created_at DESC";
    const inquiries = await sql(query, params);
    return Response.json({
      success: true,
      data: inquiries,
    });
  } catch (error) {
    console.error("Error fetching contact inquiries:", error);
    return Response.json(
      { success: false, error: "Failed to fetch contact inquiries" },
      { status: 500 },
    );
  }
}

// Create new contact inquiry
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      subject,
      message,
      service_interest,
      budget_range,
      timeline,
    } = body;

    if (!name || !email || !message) {
      return Response.json(
        { success: false, error: "Name, email, and message are required" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, error: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO contact_inquiries (
        name, email, phone, subject, message, service_interest, budget_range, timeline
      )
      VALUES (
        ${name}, ${email}, ${phone}, ${subject}, ${message}, ${service_interest}, ${budget_range}, ${timeline}
      )
      RETURNING *
    `;

    // Send email notification to MASS Tech
    try {
      await resend.emails.send({
        from: "MASS Tech Contact <onboarding@resend.dev>",
        to: "info@masstech1.com",
        subject: `New Inquiry: ${subject || "Contact Form Submission"}`,
        html: `
          <h2>New Contact Form Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Subject:</strong> ${subject || "Not provided"}</p>
          <p><strong>Service Interest:</strong> ${service_interest || "Not provided"}</p>
          <p><strong>Budget Range:</strong> ${budget_range || "Not provided"}</p>
          <p><strong>Timeline:</strong> ${timeline || "Not provided"}</p>
          <h3>Message:</h3>
          <p>${message}</p>
          <hr />
          <p style="color: gray; font-size: 12px;">This inquiry was submitted via the MASS Tech website contact form.</p>
        `,
      });
    } catch (emailError) {
      // Don't fail the whole request if email fails
      console.error("Email notification failed:", emailError);
    }

    return Response.json({
      success: true,
      message: "Thank you for your inquiry! We will get back to you soon.",
      data: result[0],
    });
  } catch (error) {
    console.error("Error creating contact inquiry:", error);
    return Response.json(
      { success: false, error: "Failed to submit inquiry. Please try again." },
      { status: 500 },
    );
  }
}
