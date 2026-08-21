'use client'

import { useState, type FormEvent } from 'react'
import {
  FormControl,
  TextInput,
  Textarea,
  Flash,
} from '@primer/react'
import { ArrowRightIcon, CheckIcon } from '@primer/octicons-react'
import { Section, SectionTag, Mono } from './primitives'
import { AccentButton } from './accent-button'

export function Contact() {
  const [sent, setSent] = useState(false)
  const [values, setValues] = useState({ name: '', email: '', message: '' })

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSent(true)
  }

  return (
    <Section id="kontakt" style={{ borderTop: '1px solid var(--bc-line)' }}>
      <div className="bc-contact-grid">
        <div>
          <SectionTag>Kontakt</SectionTag>
          <h2
            className="bc-display"
            style={{ fontSize: 'clamp(36px, 6vw, 84px)', marginTop: 20 }}
          >
            Release, Klang
            <br />
            oder <span style={{ color: 'var(--bc-accent)' }}>Form?</span>
          </h2>
          <p
            style={{
              marginTop: 28,
              maxWidth: 420,
              color: 'var(--bc-fg-muted)',
              fontSize: 16,
              lineHeight: 1.65,
            }}
          >
            Erzähl uns, was du schaffst. Antwort innerhalb von 24 Stunden.
          </p>
          <div style={{ marginTop: 32 }}>
            <Mono accent>SHAPE YOUR SOUND / 2026</Mono>
          </div>
        </div>

        <div
          style={{
            border: '1px solid var(--bc-line)',
            borderRadius: 16,
            background: 'var(--bc-surface)',
            padding: 'clamp(20px, 3vw, 32px)',
          }}
        >
          {sent ? (
            <Flash variant="success" style={{ display: 'flex', gap: 8 }}>
              <CheckIcon /> Danke — wir melden uns innerhalb von 24 Stunden.
            </Flash>
          ) : (
            <form onSubmit={onSubmit}>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
              >
                <FormControl required>
                  <FormControl.Label>Name / Projekt</FormControl.Label>
                  <TextInput
                    block
                    size="large"
                    placeholder="Artist, Label oder Projekt"
                    value={values.name}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, name: e.target.value }))
                    }
                  />
                </FormControl>

                <FormControl required>
                  <FormControl.Label>E-Mail</FormControl.Label>
                  <TextInput
                    block
                    size="large"
                    type="email"
                    placeholder="du@sound.de"
                    value={values.email}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, email: e.target.value }))
                    }
                  />
                </FormControl>

                <FormControl required>
                  <FormControl.Label>Nachricht</FormControl.Label>
                  <Textarea
                    block
                    rows={4}
                    resize="vertical"
                    placeholder="Erzähl uns von deinem Sound…"
                    value={values.message}
                    onChange={(e) =>
                      setValues((v) => ({ ...v, message: e.target.value }))
                    }
                  />
                </FormControl>

                <AccentButton
                  type="submit"
                  size="large"
                  block
                  trailingVisual={ArrowRightIcon}
                >
                  Anfrage senden
                </AccentButton>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .bc-contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: start;
        }
        @media (min-width: 900px) {
          .bc-contact-grid { grid-template-columns: 1fr 1fr; gap: 56px; }
        }
      `}</style>
    </Section>
  )
}
