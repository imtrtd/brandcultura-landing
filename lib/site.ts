// lib/site.ts — единая точка правды для домена и бренда.
// Если сайт переезжает на brandcultura.art (см. CLOUDFLARE.md в репо), поменять SITE_URL здесь
// и сделать 301 со старого домена (docs/redirect-rules.md).
export const SITE_URL = 'https://brandcultura.agency'
export const SITE_NAME = 'brandcultura'
export const LOCALES = ['de', 'en', 'ru'] as const
export type Locale = (typeof LOCALES)[number]
export const CONTACT_EMAIL = 'imtrtd@pm.me'
