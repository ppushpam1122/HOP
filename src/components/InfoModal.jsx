import { useEffect } from 'react';

const CONTENT = {
  'About Us': {
    label: 'Our Story',
    heading: 'About Peacock',
    body: (
      <div className="space-y-4 text-neutral-600 text-sm leading-relaxed">
        <p>
          Peacock was born from a simple belief — that everyday clothing should feel as good as it looks.
          Founded in India, we set out to create a label that bridges the gap between premium quality
          and honest pricing.
        </p>
        <p>
          Every piece in our collection is designed in-house and produced in small batches using
          carefully sourced fabrics — ring-spun cottons, pure linens, and fine Oxford weaves.
          We work directly with manufacturers to keep our supply chain short and our standards high.
        </p>
        <p>
          We believe clothing should last. That's why we over-engineer the basics — reinforced
          stitching, pre-washed fabrics, and fits that are tested on real bodies before they ever
          reach you.
        </p>
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-100">
          {[
            { value: '2021', label: 'Founded' },
            { value: '50K+', label: 'Happy Customers' },
            { value: '100%', label: 'Made in India' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-display font-semibold text-neutral-900">{s.value}</p>
              <p className="text-xs text-neutral-400 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  'Size Guide': {
    label: 'Reference Guide',
    heading: 'Size Guide',
    body: (
      <div className="space-y-5">
        {/* How to measure */}
        <div className="bg-neutral-50 border border-neutral-100 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-3">
            How to Measure
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-neutral-600">
            <div className="flex gap-2.5">
              <span className="text-hop-red font-bold flex-shrink-0">①</span>
              <p><strong className="text-neutral-800">Chest</strong> — Around the fullest part, tape horizontal.</p>
            </div>
            <div className="flex gap-2.5">
              <span className="text-hop-red font-bold flex-shrink-0">②</span>
              <p><strong className="text-neutral-800">Waist</strong> — Natural waistline, tape comfortably loose.</p>
            </div>
            <div className="flex gap-2.5">
              <span className="text-hop-red font-bold flex-shrink-0">③</span>
              <p><strong className="text-neutral-800">Length</strong> — Top of shoulder down to hem.</p>
            </div>
          </div>
        </div>

        {/* Size table */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">
            All measurements in inches
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] sm:text-sm border-collapse">
              <thead>
                <tr className="bg-neutral-900 text-white">
                  {['Size','Chest','Waist','Length','US','UK'].map((h) => (
                    <th key={h} className="px-2 py-2 sm:px-3 sm:py-2.5 text-left text-[9px] sm:text-xs font-semibold tracking-widest uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { size:'XS', chest:'34–35', waist:'27–28', length:'27', us:'XS',  uk:'6–8'  },
                  { size:'S',  chest:'36–37', waist:'29–30', length:'28', us:'S',   uk:'8–10' },
                  { size:'M',  chest:'38–40', waist:'31–33', length:'29', us:'M',   uk:'10–12'},
                  { size:'L',  chest:'41–43', waist:'34–36', length:'30', us:'L',   uk:'12–14'},
                  { size:'XL', chest:'44–46', waist:'37–39', length:'31', us:'XL',  uk:'14–16'},
                  { size:'XXL',chest:'47–49', waist:'40–42', length:'32', us:'XXL', uk:'16–18'},
                ].map((row, i) => (
                  <tr key={row.size} className={`border-b border-neutral-100 ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}>
                    <td className="px-2 py-2 sm:px-3 sm:py-2.5 font-semibold text-neutral-900">{row.size}</td>
                    <td className="px-2 py-2 sm:px-3 sm:py-2.5 text-neutral-600 whitespace-nowrap">{row.chest}"</td>
                    <td className="px-2 py-2 sm:px-3 sm:py-2.5 text-neutral-600 whitespace-nowrap">{row.waist}"</td>
                    <td className="px-2 py-2 sm:px-3 sm:py-2.5 text-neutral-600 whitespace-nowrap">{row.length}"</td>
                    <td className="px-2 py-2 sm:px-3 sm:py-2.5 text-neutral-600">{row.us}</td>
                    <td className="px-2 py-2 sm:px-3 sm:py-2.5 text-neutral-600">{row.uk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed">
          <strong className="text-neutral-600">Tip:</strong> Between sizes? Size up for relaxed fit, size down for fitted.
          All Peacock garments are pre-washed to minimise shrinkage.
        </p>
      </div>
    ),
  },

  'Shipping Policy': {
    label: 'Delivery Info',
    heading: 'Shipping Policy',
    body: (
      <div className="space-y-5 text-sm">
        {[
          {
            title: '🚚 Free Shipping',
            text: 'All orders above ₹999 ship free across India. Orders below ₹999 have a flat shipping fee of ₹79.',
          },
          {
            title: '📦 Processing Time',
            text: 'Orders are processed within 1–2 business days of confirmation. You will receive a WhatsApp update once your order is dispatched.',
          },
          {
            title: '🗓 Delivery Timeline',
            text: 'Standard delivery takes 4–7 business days depending on your location. Metro cities (Bengaluru, Mumbai, Delhi, Hyderabad, Chennai, Pune) typically receive orders in 3–5 days.',
          },
          {
            title: '📍 Tracking',
            text: 'A tracking link will be shared with you on WhatsApp once your order is shipped. You can track your package directly through the courier partner\'s website.',
          },
          {
            title: '🌍 International Shipping',
            text: 'We currently ship within India only. International shipping is coming soon — reach out on WhatsApp to enquire about specific locations.',
          },
        ].map((item) => (
          <div key={item.title} className="flex gap-3">
            <div>
              <p className="font-semibold text-neutral-800 mb-1">{item.title}</p>
              <p className="text-neutral-600 leading-relaxed">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },

  'Return Policy': {
    label: 'Returns & Exchanges',
    heading: 'Return Policy',
    body: (
      <div className="space-y-5 text-sm">
        <div className="bg-red-50 border border-red-100 px-4 py-3 text-red-800 text-xs font-medium">
          We offer hassle-free returns within <strong>7 days</strong> of delivery.
        </div>
        {[
          {
            title: '✅ Eligible for Return',
            items: [
              'Unused and unwashed items with original tags attached',
              'Wrong size received',
              'Defective or damaged product',
              'Wrong item delivered',
            ],
          },
          {
            title: '❌ Not Eligible for Return',
            items: [
              'Items washed, worn, or altered',
              'Items without original tags',
              'Sale / clearance items (marked as Final Sale)',
              'Returns initiated after 7 days of delivery',
            ],
          },
        ].map((section) => (
          <div key={section.title}>
            <p className="font-semibold text-neutral-800 mb-2">{section.title}</p>
            <ul className="space-y-1.5">
              {section.items.map((item) => (
                <li key={item} className="flex gap-2 text-neutral-600">
                  <span className="text-neutral-300 flex-shrink-0 mt-0.5">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="font-semibold text-neutral-800 mb-1">🔄 How to Initiate a Return</p>
          <p className="text-neutral-600 leading-relaxed">
            Simply WhatsApp us at <strong>+91 99999 99999</strong> with your order details and reason
            for return. We'll arrange a pickup at no extra cost for eligible returns.
            Refunds are processed within 5–7 business days after we receive the item.
          </p>
        </div>
      </div>
    ),
  },

  'Contact': {
    label: 'Get in Touch',
    heading: 'Contact Us',
    body: (
      <div className="space-y-5 text-sm">
        <p className="text-neutral-600 leading-relaxed">
          The fastest way to reach us is WhatsApp. We typically respond within a few hours
          during business hours (Mon–Sat, 10am–7pm IST).
        </p>

        <div className="space-y-3">
          {[
            {
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              ),
              label: 'WhatsApp',
              value: '+91 99999 99999',
              href: 'https://wa.me/919999999999',
              color: 'text-[#25D366]',
              bg: 'bg-[#25D366]/10',
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              ),
              label: 'Email',
              value: 'hello@peacockclothing.in',
              href: 'mailto:hello@peacockclothing.in',
              color: 'text-hop-red',
              bg: 'bg-red-50',
            },
          ].map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-4 p-4 ${c.bg} hover:opacity-80 transition-opacity`}
            >
              <span className={`${c.color} flex-shrink-0`}>{c.icon}</span>
              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-widest">{c.label}</p>
                <p className="font-semibold text-neutral-800 mt-0.5">{c.value}</p>
              </div>
              <svg className="w-4 h-4 text-neutral-300 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          ))}
        </div>

        <div className="pt-4 border-t border-neutral-100">
          <p className="text-xs text-neutral-400 leading-relaxed">
            <strong className="text-neutral-600">Business Hours:</strong> Monday to Saturday, 10:00 AM – 7:00 PM IST.<br />
            We are closed on Sundays and public holidays. Orders placed outside business hours will be attended to the next working day.
          </p>
        </div>
      </div>
    ),
  },
};

export default function InfoModal({ page, onClose }) {
  const content = CONTENT[page];

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5 py-6 sm:px-10 md:px-16 lg:px-24">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative bg-white w-full max-w-md mx-auto max-h-[88vh] overflow-y-auto animate-slide-up shadow-modal">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 sticky top-0 bg-white z-10">
          <div>
            <p className="section-label mb-0.5">{content.label}</p>
            <h2 className="display-heading text-2xl">{content.heading}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6">
          {content.body}
        </div>
      </div>
    </div>
  );
}
