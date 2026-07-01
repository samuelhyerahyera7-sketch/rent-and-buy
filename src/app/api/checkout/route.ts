import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { items, customerEmail, successUrl, cancelUrl } = await req.json()

    const stripeKey = process.env.STRIPE_SECRET_KEY

    if (!stripeKey || stripeKey.startsWith('your_')) {
      // Demo mode — return a mock session
      return Response.json({
        url: successUrl || '/checkout/success',
        sessionId: 'demo_' + Date.now(),
        demo: true,
      })
    }

    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(stripeKey)

    const lineItems = items.map((item: { name: string; price: number; quantity: number; event: string }) => ({
      price_data: {
        currency: 'zar',
        product_data: { name: `${item.event} — ${item.name}` },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    })

    return Response.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('Checkout error:', err)
    return Response.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
