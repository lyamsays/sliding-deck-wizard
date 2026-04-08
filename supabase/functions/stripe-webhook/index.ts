import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", { apiVersion: "2023-10-16" });
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, Deno.env.get("STRIPE_WEBHOOK_SECRET")!);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    if (s.metadata?.user_id) {
      await supabase.from("profiles").update({ is_pro: true, stripe_subscription_id: s.subscription as string, stripe_customer_id: s.customer as string }).eq("id", s.metadata.user_id);
    }
  } else if (event.type === "customer.subscription.deleted") {
    const s = event.data.object as Stripe.Subscription;
    await supabase.from("profiles").update({ is_pro: false, stripe_subscription_id: null }).eq("stripe_customer_id", s.customer as string);
  }

  return new Response(JSON.stringify({ received: true }));
});
