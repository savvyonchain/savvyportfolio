import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req) {
	try {
		const { name, email, message } = await req.json()

		if (!process.env.RESEND_API_KEY) {
			console.error('RESEND_API_KEY is missing')
			return NextResponse.json(
				{ error: 'Email service unconfigured' },
				{ status: 500 },
			)
		}

		await resend.emails.send({
			from: 'Portfolio Contact <onboarding@resend.dev>',
			to: 'savvyonchain@gmail.com', // Replace with your real email once verified or verified domain
			subject: `New Lead: ${name}`,
			html: `
				<div style="font-family: sans-serif; padding: 40px; background: #0A0612; color: white; border-radius: 20px;">
					<h2 style="color: #9f66c2; border-bottom: 2px solid #9f66c240; padding-bottom: 20px;">
						New Message from ${name}
					</h2>
					<p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
					<div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
						<p style="margin: 0; white-space: pre-wrap;">${message}</p>
					</div>
					<br />
					<hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1);" />
					<p style="color: #666; font-size: 12px;">Sent via SavvyOnChain Portfolio Site</p>
				</div>
			`,
		})

		return NextResponse.json({ success: true })
	} catch (err) {
		console.error('Email send error:', err)
		return NextResponse.json({ error: err.message }, { status: 500 })
	}
}
