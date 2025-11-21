import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { cookies } from "next/headers";
import { encrypt, decrypt } from "@/lib/encryption";

// GET - Fetch email settings (admin only)
export async function GET() {
  try {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get("admin_authenticated")?.value === "true";

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await query("SELECT * FROM email_settings ORDER BY id LIMIT 1");

    if (result.rows.length === 0) {
      return NextResponse.json({
        smtp_host: 'smtp.gmail.com',
        smtp_port: 587,
        smtp_user: '',
        from_email: '',
        to_email: '',
        email_enabled: false
      });
    }

    const settings = result.rows[0];

    // Return settings without decrypted password (for security)
    return NextResponse.json({
      id: settings.id,
      smtp_host: settings.smtp_host,
      smtp_port: settings.smtp_port,
      smtp_user: settings.smtp_user,
      from_email: settings.from_email,
      to_email: settings.to_email,
      email_enabled: settings.email_enabled,
      has_password: !!settings.smtp_password_encrypted // Just indicate if password exists
    });

  } catch (error) {
    console.error("[Email Settings] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch email settings" }, { status: 500 });
  }
}

// PUT - Update email settings (admin only)
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const isAuthenticated = cookieStore.get("admin_authenticated")?.value === "true";

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const {
      smtp_host,
      smtp_port,
      smtp_user,
      smtp_password, // Plain text password from client
      from_email,
      to_email,
      email_enabled
    } = data;

    // Build update query
    let updateQuery = `
      UPDATE email_settings SET
        smtp_host = $1,
        smtp_port = $2,
        smtp_user = $3,
        from_email = $4,
        to_email = $5,
        email_enabled = $6,
        updated_at = NOW()
    `;

    let params = [
      smtp_host,
      smtp_port,
      smtp_user,
      from_email,
      to_email,
      email_enabled
    ];

    // Only update password if provided
    if (smtp_password && smtp_password.trim() !== '') {
      const encryptedPassword = encrypt(smtp_password);
      updateQuery = `
        UPDATE email_settings SET
          smtp_host = $1,
          smtp_port = $2,
          smtp_user = $3,
          smtp_password_encrypted = $4,
          from_email = $5,
          to_email = $6,
          email_enabled = $7,
          updated_at = NOW()
      `;
      params = [
        smtp_host,
        smtp_port,
        smtp_user,
        encryptedPassword,
        from_email,
        to_email,
        email_enabled
      ];
    }

    updateQuery += " WHERE id = (SELECT id FROM email_settings ORDER BY id LIMIT 1)";

    await query(updateQuery, params);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[Email Settings] PUT error:", error);
    return NextResponse.json({ error: "Failed to update email settings" }, { status: 500 });
  }
}

// Helper function to get decrypted email settings (for internal use)
export async function getEmailSettings() {
  try {
    const result = await query("SELECT * FROM email_settings ORDER BY id LIMIT 1");

    if (result.rows.length === 0) {
      return null;
    }

    const settings = result.rows[0];

    if (!settings.email_enabled) {
      return null;
    }

    return {
      host: settings.smtp_host,
      port: settings.smtp_port,
      user: settings.smtp_user,
      password: settings.smtp_password_encrypted ? decrypt(settings.smtp_password_encrypted) : '',
      from: settings.from_email,
      to: settings.to_email,
      enabled: settings.email_enabled
    };
  } catch (error) {
    console.error("[Email Settings] Failed to fetch:", error);
    return null;
  }
}
