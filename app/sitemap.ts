// app/sitemap.ts — АЛЬТЕРНАТИВА public/sitemap.xml (использовать что-то одно).
import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export const dynamic = 'force-static'

// Поставьте true, когда появятся отдельные URL /en и /ru (docs/i18n-routing.md)
const HAS_LOCALE_ROUTES = false

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date() // дата сборки
  const languages = HAS_LOCALE_ROUTES
    ? { de: `${SITE_URL}/`, en: `${SITE_URL}/en`, ru: `${SITE_URL}/ru`, 'x-default': `${SITE_URL}/` }
    : undefined
  const urls: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified, alternates: languages ? { languages } : undefined },
  ]
  if (HAS_LOCALE_ROUTES) {
    urls.push(
      { url: `${SITE_URL}/en`, lastModified, alternates: { languages: languages! } },
      { url: `${SITE_URL}/ru`, lastModified, alternates: { languages: languages! } },
    )
  }
  // После создания страниц:
  // urls.push({ url: `${SITE_URL}/impressum`, lastModified }, { url: `${SITE_URL}/datenschutz`, lastModified })
  return urls
}
