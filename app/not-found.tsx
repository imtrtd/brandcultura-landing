// app/not-found.tsx — брендированная 404 (Next сам ставит статус 404 и meta robots noindex).
// При static export Next генерирует out/404.html, Cloudflare Pages отдаёт его со статусом 404.
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Seite nicht gefunden (404)',
  // Явно, иначе наследуется index,follow из layout. Next добавит ещё свой noindex — это не конфликт.
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6">
      <span className="label-mono text-lime">404 · kein Signal</span>
      <h1 className="display text-5xl font-bold text-foreground md:text-7xl">Seite nicht gefunden</h1>
      <p className="text-lg text-muted-foreground">
        Diese Seite existiert nicht (mehr). Page not found. Страница не найдена.
      </p>
      <nav className="flex flex-wrap gap-4" aria-label="404">
        <a href="/" className="bg-lime px-4 py-2 font-semibold text-lime-foreground">Zur Startseite →</a>
        <a href="/#kontakt" className="border border-border px-4 py-2 text-foreground">Kontakt</a>
      </nav>
    </main>
  )
}
