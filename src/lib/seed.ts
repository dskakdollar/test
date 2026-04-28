import { ConnectedPage } from "./types";

function nowIso(offsetMinutes = 0): string {
  const d = new Date(Date.now() + offsetMinutes * 60_000);
  return d.toISOString();
}

const samplePageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Acme SaaS — Pricing</title>
<style>
  body { font-family: 'Inter', system-ui, sans-serif; margin: 0; background: #fafaf7; color: #111; }
  .hero { padding: 80px 40px; text-align: center; background: linear-gradient(180deg,#0f172a 0%, #1e293b 100%); color:#f8fafc; }
  .hero h1 { font-size: 56px; margin: 0 0 16px; letter-spacing: -0.02em; }
  .hero p { font-size: 20px; opacity: 0.85; margin: 0; }
  .hero img { display:block; margin: 32px auto 0; max-width: 380px; border-radius: 12px; }
  .promo { padding: 24px 40px; text-align:center; background:#fffbe6; color:#7a5d00; font-weight:600; font-size:16px; }
  .pricing { padding: 80px 40px; max-width: 1200px; margin: 0 auto; }
  .pricing h2 { font-size: 36px; text-align: center; margin: 0 0 12px; }
  .pricing .sub { text-align:center; color:#666; margin: 0 0 48px; font-size: 17px; }
  .country-tabs { display:flex; gap: 8px; justify-content:center; margin-bottom: 36px; }
  .country-tab { padding: 8px 20px; border:1px solid #ddd; border-radius:999px; font-weight:500; }
  .country-tab.active { background:#111; color:#fff; border-color:#111; }
  .country-block { margin-bottom: 60px; }
  .country-title { font-size: 22px; margin: 0 0 6px; font-weight: 600; }
  .country-meta { color:#777; font-size: 14px; margin: 0 0 24px; }
  .plans { display:grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
  .plan { border:1px solid #e5e5e5; border-radius:14px; padding:32px 24px; background:#fff; }
  .plan h3 { margin: 0 0 8px; font-size:20px; }
  .plan .price { font-size: 44px; font-weight: 700; margin: 12px 0 4px; letter-spacing: -0.02em; }
  .plan .period { color:#777; font-size:14px; margin: 0 0 18px; }
  .plan ul { padding-left: 18px; margin: 0 0 24px; color:#444; font-size:14px; }
  .plan ul li { margin-bottom: 6px; }
  .plan .cta { display:inline-block; padding: 12px 22px; border-radius:8px; background:#111; color:#fff; text-decoration:none; font-weight:600; font-size:14px; }
  .plan.featured { border-color:#111; box-shadow: 0 12px 40px -10px rgba(0,0,0,0.15); }
  .events { padding: 80px 40px; max-width: 1200px; margin: 0 auto; }
  .events h2 { font-size: 32px; margin: 0 0 24px; }
  .event { padding: 20px; border-bottom: 1px solid #eee; display:flex; justify-content:space-between; align-items:center; }
  .event-name { font-size: 18px; font-weight: 500; }
  .event-date { color:#666; font-family: monospace; font-size: 14px; }
  .gallery { padding: 80px 40px; max-width: 1200px; margin: 0 auto; }
  .gallery h2 { font-size: 32px; margin: 0 0 24px; }
  .gallery-grid { display:grid; grid-template-columns: repeat(3,1fr); gap: 16px; }
  .gallery-grid img { width:100%; height: 200px; object-fit:cover; border-radius:10px; }
  footer { padding: 40px; text-align:center; color:#888; font-size:14px; border-top:1px solid #eee; }
</style>
</head>
<body>

<section class="hero">
  <h1>Power your team with Acme SaaS</h1>
  <p>The toolkit that scales with your business. Available worldwide.</p>
  <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800" alt="Hero" />
</section>

<div class="promo">🎉 Spring sale ends March 31, 2026 — save up to 40%</div>

<section class="pricing">
  <h2>Simple, transparent pricing</h2>
  <p class="sub">Choose a plan that fits your stage. All prices in local currency.</p>

  <div class="country-block" data-country="Germany">
    <h3 class="country-title">🇩🇪 Germany</h3>
    <p class="country-meta">Payments via Stripe · billed in EUR</p>
    <div class="plans">
      <div class="plan">
        <h3>Basic</h3>
        <div class="price">19€</div>
        <div class="period">per month · Stripe</div>
        <ul>
          <li>Up to 3 users</li>
          <li>5 GB storage</li>
          <li>Email support</li>
        </ul>
        <a class="cta" href="#">Choose Basic</a>
      </div>
      <div class="plan featured">
        <h3>Pro</h3>
        <div class="price">49€</div>
        <div class="period">per month · Stripe</div>
        <ul>
          <li>Unlimited users</li>
          <li>100 GB storage</li>
          <li>Priority support</li>
        </ul>
        <a class="cta" href="#">Choose Pro</a>
      </div>
      <div class="plan">
        <h3>Enterprise</h3>
        <div class="price">199€</div>
        <div class="period">per month · Stripe</div>
        <ul>
          <li>SSO &amp; advanced security</li>
          <li>Dedicated CSM</li>
          <li>SLA 99.99%</li>
        </ul>
        <a class="cta" href="#">Talk to sales</a>
      </div>
    </div>
  </div>

  <div class="country-block" data-country="USA">
    <h3 class="country-title">🇺🇸 USA</h3>
    <p class="country-meta">Payments via Stripe · billed in USD</p>
    <div class="plans">
      <div class="plan">
        <h3>Basic</h3>
        <div class="price">$22</div>
        <div class="period">per month · Stripe</div>
        <ul>
          <li>Up to 3 users</li>
          <li>5 GB storage</li>
          <li>Email support</li>
        </ul>
        <a class="cta" href="#">Choose Basic</a>
      </div>
      <div class="plan featured">
        <h3>Pro</h3>
        <div class="price">$54</div>
        <div class="period">per month · Stripe</div>
        <ul>
          <li>Unlimited users</li>
          <li>100 GB storage</li>
          <li>Priority support</li>
        </ul>
        <a class="cta" href="#">Choose Pro</a>
      </div>
      <div class="plan">
        <h3>Enterprise</h3>
        <div class="price">$219</div>
        <div class="period">per month · Stripe</div>
        <ul>
          <li>SSO &amp; advanced security</li>
          <li>Dedicated CSM</li>
          <li>SLA 99.99%</li>
        </ul>
        <a class="cta" href="#">Talk to sales</a>
      </div>
    </div>
  </div>

  <div class="country-block" data-country="Russia">
    <h3 class="country-title">🇷🇺 Russia</h3>
    <p class="country-meta">Payments via YooKassa · billed in RUB</p>
    <div class="plans">
      <div class="plan">
        <h3>Basic</h3>
        <div class="price">1 990 ₽</div>
        <div class="period">per month · YooKassa</div>
        <ul>
          <li>Up to 3 users</li>
          <li>5 GB storage</li>
          <li>Email support</li>
        </ul>
        <a class="cta" href="#">Choose Basic</a>
      </div>
      <div class="plan featured">
        <h3>Pro</h3>
        <div class="price">4 990 ₽</div>
        <div class="period">per month · YooKassa</div>
        <ul>
          <li>Unlimited users</li>
          <li>100 GB storage</li>
          <li>Priority support</li>
        </ul>
        <a class="cta" href="#">Choose Pro</a>
      </div>
      <div class="plan">
        <h3>Enterprise</h3>
        <div class="price">19 900 ₽</div>
        <div class="period">per month · YooKassa</div>
        <ul>
          <li>SSO &amp; advanced security</li>
          <li>Dedicated CSM</li>
          <li>SLA 99.99%</li>
        </ul>
        <a class="cta" href="#">Talk to sales</a>
      </div>
    </div>
  </div>
</section>

<section class="events">
  <h2>Upcoming events</h2>
  <div class="event">
    <div class="event-name">Acme Spring Conference 2026</div>
    <div class="event-date">March 12, 2026</div>
  </div>
  <div class="event">
    <div class="event-name">Free workshop: scaling SaaS</div>
    <div class="event-date">March 28, 2026</div>
  </div>
  <div class="event">
    <div class="event-name">Customer day · Berlin</div>
    <div class="event-date">April 5, 2026</div>
  </div>
</section>

<section class="gallery">
  <h2>Customer stories</h2>
  <div class="gallery-grid">
    <img src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=600" alt="Story 1" />
    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600" alt="Story 2" />
    <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600" alt="Story 3" />
  </div>
</section>

<footer>
  © 2026 Acme SaaS · Built with care · Hosted on Tilda
</footer>

</body>
</html>`;

const acmeId = "acme-saas-pricing";

export function seedPages(): ConnectedPage[] {
  return [
    {
      id: acmeId,
      name: "Acme SaaS · Pricing",
      sourceUrl: "https://acme-saas.tilda.ws/pricing",
      publishedHtml: samplePageHtml,
      draftHtml: null,
      draftPrompt: null,
      draftError: null,
      versions: [
        {
          id: "v-initial",
          prompt: "Initial published version",
          html: samplePageHtml,
          publishedAt: nowIso(-60 * 24 * 4),
        },
      ],
      createdAt: nowIso(-60 * 24 * 7),
      updatedAt: nowIso(-60 * 24 * 4),
    },
  ];
}

export const SAMPLE_PAGE_HTML = samplePageHtml;
