'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  readConsentState,
  saveConsentState,
  updateConsentMode,
  type ConsentState,
} from '@/lib/analytics'

type Props = {
  enabled: boolean
}

function buildConsent(analytics: boolean, source: ConsentState['source']): ConsentState {
  return {
    essential: true,
    analytics,
    updatedAt: new Date().toISOString(),
    source,
  }
}

export function CookieConsentBanner({ enabled }: Props) {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const current = readConsentState()

    if (!current) {
      setShowBanner(true)
      return
    }

    setAnalyticsEnabled(current.analytics)
    updateConsentMode(current.analytics)
  }, [enabled])

  if (!enabled) {
    return null
  }

  const acceptAll = () => {
    const consent = buildConsent(true, 'banner')
    saveConsentState(consent)
    updateConsentMode(true)
    setAnalyticsEnabled(true)
    setShowBanner(false)
    setShowSettings(false)
  }

  const rejectOptional = () => {
    const consent = buildConsent(false, 'banner')
    saveConsentState(consent)
    updateConsentMode(false)
    setAnalyticsEnabled(false)
    setShowBanner(false)
    setShowSettings(false)
  }

  const saveSettings = () => {
    const consent = buildConsent(analyticsEnabled, 'settings')
    saveConsentState(consent)
    updateConsentMode(analyticsEnabled)
    setShowBanner(false)
    setShowSettings(false)
  }

  return (
    <>
      {showBanner ? (
        <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-700">
              Usamos cookies essenciais e opcionais de analytics para melhorar sua experiencia.
              Voce pode aceitar, recusar ou configurar.
              <Link href="/politica-cookies" className="ml-1 font-medium text-[#C2227A] underline-offset-2 hover:underline">
                Ler politica de cookies
              </Link>
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowSettings(true)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Configurar
              </button>
              <button
                onClick={rejectOptional}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Recusar opcionais
              </button>
              <button
                onClick={acceptAll}
                className="rounded-lg bg-[#C2227A] px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Aceitar analytics
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setShowSettings(true)}
        className="fixed bottom-4 left-4 z-[80] rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-md hover:bg-slate-50"
        aria-label="Abrir configuracoes de cookies"
      >
        Cookies
      </button>

      {showSettings ? (
        <div className="fixed inset-0 z-[95] flex items-end justify-center bg-black/40 p-4 md:items-center">
          <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">Preferencias de cookies</h2>
            <p className="mt-2 text-sm text-slate-600">
              Cookies essenciais ficam sempre ativos. Analytics e opcional e voce pode alterar a qualquer momento.
            </p>

            <div className="mt-4 rounded-xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">Cookies essenciais</p>
                  <p className="text-sm text-slate-600">Necessarios para login, seguranca e funcionamento do site.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">Sempre ativo</span>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">Cookies de analytics</p>
                  <p className="text-sm text-slate-600">Medicao de uso de paginas para melhoria do produto.</p>
                </div>
                <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Ativar
                </label>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                onClick={() => setShowSettings(false)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={saveSettings}
                className="rounded-lg bg-[#C2227A] px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Salvar preferencias
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
