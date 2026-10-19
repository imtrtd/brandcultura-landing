'use client'
import { useState } from 'react'
import { useLocale } from './locale-provider'
import { Reveal } from './reveal'
import { CONTACT_EMAIL } from '@/lib/site'
export function Contact() { const [sent,setSent] = useState(false); const { copy } = useLocale(); const t = copy.contact;
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Static-export fallback: no backend handler yet, so open the visitor's mail client with a prefilled message.
    const d = new FormData(e.currentTarget)
    const name = String(d.get('name') ?? ''), email = String(d.get('email') ?? ''), message = String(d.get('message') ?? '')
    const body = `${t.name}: ${name}\n${t.email}: ${email}\n\n${message}`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`${t.subject}${name ? ' — ' + name : ''}`)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }
  return <section id="kontakt" aria-labelledby="kontakt-heading" className="carbon-surface border-t border-border"><div className="mx-auto grid max-w-6xl grid-cols-1 gap-9 px-4 py-14 sm:gap-12 sm:px-5 sm:py-16 md:grid-cols-2 md:px-8 md:py-24"><Reveal><span className="label-mono text-lime">{t.label}</span><h2 id="kontakt-heading" className="display mt-4 text-pretty text-4xl font-bold text-foreground sm:text-5xl md:text-7xl">{t.title}</h2><p className="mt-5 max-w-sm text-pretty leading-relaxed text-muted-foreground sm:mt-6">{t.intro} <span className="text-foreground">{t.hours}</span></p><p className="mt-6 flex flex-col gap-2"><span className="label-mono text-muted-foreground">{t.direct}</span><a href={`mailto:${CONTACT_EMAIL}`} className="text-lg text-lime underline-offset-4 hover:underline">{CONTACT_EMAIL}</a></p></Reveal><Reveal delay={100}>{sent ? <div className="carbon-panel signal-glow flex min-h-56 flex-col justify-center border-lime p-6 sm:p-8"><span className="label-mono text-lime">{t.received}</span><p className="mt-3 text-lg text-foreground">{t.thanks}</p></div> : <form className="carbon-panel flex flex-col gap-4 p-4 sm:p-6" onSubmit={handleSubmit}><Field label={t.name}><input name="name" type="text" required placeholder={t.namePlaceholder} className="min-h-12 border border-border bg-background/80 px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-lime"/></Field><Field label={t.email}><input name="email" type="email" required placeholder="you@sound.de" className="min-h-12 border border-border bg-background/80 px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-lime"/></Field><Field label={t.message}><textarea name="message" rows={4} placeholder={t.messagePlaceholder} className="resize-none border border-border bg-background/80 px-4 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-lime"/></Field><button type="submit" className="mt-2 min-h-12 bg-lime px-6 py-3 text-sm font-semibold text-lime-foreground transition-opacity hover:opacity-90">{t.send}</button></form>}</Reveal></div></section> }
function Field({label,children}:{label:string;children:React.ReactNode}) { return <label className="flex flex-col gap-2"><span className="label-mono text-muted-foreground">{label}</span>{children}</label> }
