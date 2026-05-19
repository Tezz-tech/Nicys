const nodemailer = require('nodemailer')

const createTransport = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

/**
 * Send order confirmation to the customer and notification to admin.
 */
async function sendOrderEmails(order) {
  const transporter = createTransport()
  const admin = process.env.ADMIN_EMAIL || process.env.EMAIL_USER

  const addonsText = order.addons.length
    ? order.addons.join(', ')
    : 'None'

  // ── Admin notification ────────────────────────────────────────────
  await transporter.sendMail({
    from: `"Nicys System" <${process.env.EMAIL_USER}>`,
    to:   admin,
    subject: `✦ New Order Received — ${order.orderId}`,
    html: `
      <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;color:#1B2A4A;">
        <div style="background:#1B2A4A;padding:32px;text-align:center;">
          <h1 style="color:#FFF8F0;font-weight:300;letter-spacing:0.2em;margin:0;">Nicys</h1>
          <p style="color:#C8A4D4;font-size:12px;margin-top:8px;letter-spacing:0.2em;">NEW ORDER RECEIVED</p>
        </div>
        <div style="padding:40px;">
          <table style="width:100%;border-collapse:collapse;">
            ${[
              ['Order Reference', order.orderId],
              ['Service Type', order.serviceType === 'physical' ? 'Physical Gift Box' : 'Digital Letter'],
              ['Collection', order.letterCollection],
              ['Tier', order.tier === 'scribe' ? "Scribe's Tier" : "Designer's Tier"],
              ['Sender', `${order.senderName} (${order.senderEmail} | ${order.senderPhone})`],
              ['Recipient', `${order.recipientName}${order.recipientEmail ? ` — ${order.recipientEmail}` : ''}`],
              ['Occasion', order.occasion],
              ['Desired Delivery', order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-GB') : 'TBC'],
              ['Add-ons', addonsText],
              ...(order.deliveryAddress ? [['Delivery Address', order.deliveryAddress]] : []),
            ].map(([k, v]) => `
              <tr style="border-bottom:1px solid #F5EDE0;">
                <td style="padding:12px 0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#888;width:40%;">${k}</td>
                <td style="padding:12px 0;font-size:14px;color:#1B2A4A;">${v}</td>
              </tr>
            `).join('')}
          </table>

          <div style="margin-top:24px;padding:20px;background:#FFF8F0;border-left:3px solid #C8A4D4;">
            <p style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#888;margin:0 0 8px;">Story / Message</p>
            <p style="font-size:14px;line-height:1.7;color:#1B2A4A;margin:0;">${order.message.replace(/\n/g, '<br/>')}</p>
          </div>

          ${order.specialInstructions ? `
            <div style="margin-top:16px;padding:16px;background:#F5EDE0;">
              <p style="font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#888;margin:0 0 8px;">Special Instructions</p>
              <p style="font-size:14px;color:#1B2A4A;margin:0;">${order.specialInstructions}</p>
            </div>
          ` : ''}

          ${order.paymentProofUrl ? `<p style="margin-top:16px;font-size:13px;">📎 Payment proof uploaded: <a href="${process.env.CLIENT_URL}/uploads/${order.paymentProofUrl}">${order.paymentProofUrl}</a></p>` : ''}
        </div>
      </div>
    `,
  })

  // ── Customer confirmation ─────────────────────────────────────────
  await transporter.sendMail({
    from: `"Nicys" <${process.env.EMAIL_USER}>`,
    to:   order.senderEmail,
    subject: `Your Nicys order is confirmed — ${order.orderId}`,
    html: `
      <div style="font-family:'Georgia',serif;max-width:600px;margin:0 auto;color:#1B2A4A;">
        <div style="background:#1B2A4A;padding:40px;text-align:center;">
          <h1 style="color:#FFF8F0;font-weight:300;letter-spacing:0.25em;margin:0;">Nicys</h1>
          <p style="color:#C8A4D4;font-size:12px;margin-top:10px;font-style:italic;">Helping you say what matters most</p>
        </div>
        <div style="padding:48px 40px;">
          <h2 style="font-weight:300;font-size:28px;margin-bottom:8px;">Your letter is on its way.</h2>
          <p style="font-size:14px;color:#666;line-height:1.7;margin-bottom:32px;">
            Thank you, ${order.senderName}. We've received your order and are excited to begin working on your letter.
          </p>

          <div style="background:#FFF8F0;border:1px solid rgba(200,164,212,0.3);padding:24px;margin-bottom:32px;">
            <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C8A4D4;margin:0 0 16px;">Your Reference Number</p>
            <p style="font-size:28px;letter-spacing:0.15em;color:#1B2A4A;margin:0;font-weight:300;">${order.orderId}</p>
            <p style="font-size:12px;color:#999;margin-top:8px;">Save this to track your order at nicys.ng/track</p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
            ${[
              ['Collection', order.letterCollection],
              ['Estimated Delivery', order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }) : 'To be confirmed'],
              ['Service', order.tier === 'scribe' ? "Scribe's Tier — We write it for you" : "Designer's Tier — We style your words"],
            ].map(([k, v]) => `
              <tr style="border-bottom:1px solid #F5EDE0;">
                <td style="padding:12px 0;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#aaa;width:40%;">${k}</td>
                <td style="padding:12px 0;font-size:14px;">${v}</td>
              </tr>
            `).join('')}
          </table>

          <div style="border-left:3px solid #2D6A4F;padding:16px 20px;background:#f8faf9;margin-bottom:32px;">
            <p style="font-size:13px;color:#1B2A4A;margin:0;line-height:1.7;">
              <strong>What's next?</strong> We'll verify your payment and begin working on your letter within 24 hours.
              If you haven't already transferred payment, please do so to:
              <br/><br/>
              <strong>First Bank of Nigeria</strong><br/>
              Account: 3012345678<br/>
              Name: Nicys Creative Studio<br/>
              <em>Reference: ${order.senderName} — ${order.occasion}</em>
            </p>
          </div>

          <p style="font-size:13px;color:#888;line-height:1.7;">
            Have questions? Reach us on <a href="https://wa.me/2348000000000" style="color:#2D6A4F;">WhatsApp</a> or reply to this email.
          </p>
        </div>
        <div style="background:#F5EDE0;padding:24px;text-align:center;">
          <p style="font-size:11px;color:#aaa;margin:0;">No refunds due to the deeply personalised nature of our work.</p>
          <p style="font-size:11px;color:#bbb;margin-top:8px;">© ${new Date().getFullYear()} Nicys</p>
        </div>
      </div>
    `,
  })
}

/**
 * Send notification for a new contact form submission.
 */
async function sendContactEmail(contact) {
  const transporter = createTransport()
  const admin = process.env.ADMIN_EMAIL || process.env.EMAIL_USER

  await transporter.sendMail({
    from: `"Nicys Contact" <${process.env.EMAIL_USER}>`,
    to:   admin,
    subject: `New contact message from ${contact.name}`,
    html: `
      <div style="font-family:'Georgia',serif;max-width:500px;margin:0 auto;color:#1B2A4A;padding:32px;">
        <h2 style="font-weight:300;">New Contact Message</h2>
        <p><strong>From:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
        <p><strong>Message:</strong></p>
        <div style="background:#FFF8F0;padding:20px;border-left:3px solid #C8A4D4;">
          <p style="line-height:1.7;margin:0;">${contact.message.replace(/\n/g, '<br/>')}</p>
        </div>
      </div>
    `,
  })
}

module.exports = { sendOrderEmails, sendContactEmail }
