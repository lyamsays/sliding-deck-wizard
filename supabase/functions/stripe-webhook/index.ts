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
      // Send upgrade confirmation email
      if (s.customer_details?.email) {
        await supabase.functions.invoke("send-email", {
          body: {
            to: s.customer_details.email,
            subject: "You're now on Educator Pro 🎉",
            html: `<div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 40px 20px;"><h1 style="color: #111;">You're on Educator Pro</h1><p style="color: #555;">Your upgrade is confirmed. Unlimited presentations, document upload, and PowerPoint export are all unlocked.</p><a href="https://usesliding.com/create" style="display:block;text-align:center;background:#7c3aed;color:white;font-weight:600;padding:14px;border-radius:12px;text-decoration:none;margin-top:24px;">Start creating →</a></div>`,
          }
        });
      }
    }
  } else if (event.type === "customer.subscription.deleted") {
    const s = event.data.object as Stripe.Subscription;
    await supabase.from("profiles").update({ is_pro: false, stripe_subscription_id: null }).eq("stripe_customer_id", s.customer as string);
  }

  return new Response(JSON.stringify({ received: true }));
});
