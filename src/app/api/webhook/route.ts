import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!stripeKey || stripeKey.startsWith('your_')) {
    return Response.json({ received: true })
  }

  try {
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeKey)

    const body = await req.text()
    const sig = req.headers.get('stripe-signature') ?? ''

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret!)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      console.log('Payment completed:', session.id)
      // TODO: Update order status in Supabase, generate tickets
    }

    return Response.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return Response.json({ error: 'Webhook failed' }, { status: 400 })
  }
}
