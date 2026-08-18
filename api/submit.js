// Serverless endpoint for Vercel. Set RESEND_API_KEY in the deployment settings.
// Replace the temporary FROM address with a verified SYKSS address before going live.
export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });
  const { answers, submittedAt } = request.body || {};
  if (!answers || typeof answers !== 'object') return response.status(400).json({ error: 'Invalid submission' });
  const text = Object.entries(answers).map(([key, value]) => `${key}: ${value}`).join('\n');
  if (!process.env.RESEND_API_KEY) return response.status(503).json({ error: 'Email service not configured' });
  const email = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: 'SYKSS Quiz <onboarding@resend.dev>', to: ['syksscontact@gmail.com'], subject: `Nouvelle candidature SYKSS — ${answers.business || answers.name || 'sans nom'}`, text: `Reçue le ${submittedAt}\n\n${text}` }) });
  if (!email.ok) return response.status(502).json({ error: 'Could not send notification' });
  return response.status(200).json({ ok: true });
}
