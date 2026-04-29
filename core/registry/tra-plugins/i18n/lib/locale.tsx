import { useMemo, useSyncExternalStore } from 'react'
import { getLocale, setLocale as paraglideSetLocale } from '../paraglide/runtime.js'
import * as messages from '../paraglide/messages'

// --- Locale Store ---
// React dışında locale değişikliklerini takip eden basit bir store

const subscribers = new Set<() => void>()

export function setLocale(newLocale: 'en' | 'tr') {
    paraglideSetLocale(newLocale, { reload: false })
    subscribers.forEach((fn) => fn()) // tüm subscriber'ları bilgilendir
}

export function useLocale() {
    return useSyncExternalStore(
        (callback) => {
            subscribers.add(callback)
            return () => subscribers.delete(callback) // cleanup
        },
        // Tek gerçek kaynak olarak doğrudan Paraglide runtime'ı oku
        () => getLocale(),
    )
}

// --- useM() hook ---
// Tüm m.* çağrılarına locale'i otomatik enjekte eden Proxy döndürür
// Kullanım: const m = useM()  →  m.greeting({ name: "Ali" })

export function useM() {
    const locale = useLocale() as 'en' | 'tr'

    return useMemo(
        () =>
            new Proxy(messages, {
                get(target, key: string) {
                    const fn = target[key as keyof typeof messages]
                    if (typeof fn === 'function') {
                        return (inputs?: object) =>
                            (fn as (inputs: object, options: { locale: string }) => string)(
                                inputs ?? {},
                                { locale },
                            )
                    }
                    return fn
                },
            }) as typeof messages,
        [locale], // sadece locale değişince yeni Proxy oluştur
    )
}
