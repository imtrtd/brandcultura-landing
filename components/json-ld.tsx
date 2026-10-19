// components/json-ld.tsx — вывод JSON-LD в статический HTML (работает со static export).
// Подключается в app/layout.tsx. Неизвестные поля (address, founder, sameAs, priceRange) намеренно опущены — TODO владельца.
import { CONTACT_EMAIL, SITE_URL } from '@/lib/site'

const organization = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: 'brandcultura',
  alternateName: ['brandcultura agency', 'Brand Cultura'],
  url: `${SITE_URL}/`,
  slogan: 'SHAPE YOUR SOUND',
  description:
    'Agentur für Künstler:innen und Labels. Wir lesen Spektrogramme, zerlegen Frequenzen und geben dem Sound eine Form, die bleibt: visuelle Systeme für Cover, Motion, Stage und Identity.',
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/icon-512.png`, width: 512, height: 512 },
  image: `${SITE_URL}/og-image.jpg`,
  knowsLanguage: ['de', 'en', 'ru'],
  audience: { '@type': 'Audience', audienceType: 'Musiker:innen, Künstler:innen und Labels' },
  email: CONTACT_EMAIL,
  // Раскомментировать после заполнения (см. jsonld/organization.json):
  // areaServed: '…', priceRange: '…', founder: {...}, address: {...}, sameAs: [...],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Leistungen',
    itemListElement: [
      ['Visual Sound — Klang sichtbar machen', 'Spektrogramm → Form. Waveform und Frequenzräume für visuelle Identität.'],
      ['Form + System', 'Visuelle Systeme vom einzelnen Release bis zur gesamten visuellen Welt eines Artists: Cover, Motion, Stage, Identity.'],
      ['Musik: Release & Community', 'Release-Strategien, visuelle Systeme, Konzerte und Community um Artist oder Label.'],
      ['Kunst & Kreativität', 'Rahmen für Künstler:innen: vom Manifest bis zur tragfähigen Community.'],
    ].map(([name, description]) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name, description } })),
  },
}

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: 'brandcultura',
  alternateName: 'brandcultura — SHAPE YOUR SOUND',
  inLanguage: 'de',
  publisher: { '@id': `${SITE_URL}/#organization` },
}

export function JsonLd({ extra = [] }: { extra?: object[] }) {
  const graph = [organization, website, ...extra]
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\\u003c') }}
    />
  )
}
// FAQPage добавлять ТОЛЬКО вместе с видимым блоком FAQ на странице (docs/faq-content.md):
// <JsonLd extra={[faqJson]} />
