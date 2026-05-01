const UK_LANG = 'en-GB'

function normalizeLang(lang: string): string {
  return lang.toLowerCase().replace('_', '-')
}

/** True if the browser labels this voice as UK English (locale or name hint). */
function isUkEnglishVoice(v: SpeechSynthesisVoice): boolean {
  const lang = normalizeLang(v.lang)
  if (lang.startsWith('en-gb')) return true
  return /uk|british|united kingdom|england|en-gb/i.test(v.name)
}

/**
 * Prefer a UK English female voice when available (names vary by OS: Martha, Kate, Serena, Google UK English Female, Libby, etc.).
 */
function selectPreferredUkFemaleVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null

  const ukVoices = voices.filter(isUkEnglishVoice)
  let pool: SpeechSynthesisVoice[]
  if (ukVoices.length > 0) {
    pool = ukVoices
  } else {
    const nameHintsUk = voices.filter((v) => /UK|British|United Kingdom|England/i.test(v.name))
    if (nameHintsUk.length > 0) {
      pool = nameHintsUk
    } else {
      const enNonUs = voices.filter((v) => {
        const L = normalizeLang(v.lang)
        return L.startsWith('en') && !L.startsWith('en-us')
      })
      pool = enNonUs.length > 0 ? enNonUs : voices.filter((v) => normalizeLang(v.lang).startsWith('en'))
    }
  }

  const femaleNamePatterns = [
    /Google UK English Female/i,
    /\bMartha\b/i,
    /\bKate\b/i,
    /\bSerena\b/i,
    /\bFlo\b/i,
    /\bLibby\b/i,
    /\bSonia\b/i,
    /\bMaisie\b/i,
    /Microsoft .* English \(United Kingdom\).* Female/i,
    /Microsoft Libby/i,
    /Microsoft Sonia/i,
    /female/i,
  ]

  for (const pattern of femaleNamePatterns) {
    const hit = pool.find((v) => pattern.test(v.name))
    if (hit) return hit
  }

  // Any UK voice, then any English voice
  if (ukVoices.length > 0) return ukVoices[0]
  return pool[0] ?? null
}

/** Avoid spelling-style pronunciation for function words in isolation. */
function normalizeUtteranceText(text: string): string {
  const trimmed = text.trim().toLowerCase()
  if (trimmed === 'a') return 'uh'
  return text
}

/**
 * Prefer clearer synthesis variants and avoid compact/muffled voices.
 */
function scoreVoiceForClarity(voice: SpeechSynthesisVoice): number {
  let score = 0
  if (isUkEnglishVoice(voice)) score += 50
  if (/google uk english female|libby|sonia|serena|martha|kate|maisie|female/i.test(voice.name)) score += 20
  if (/enhanced|premium|neural|online|natural/i.test(voice.name)) score += 8
  if (/compact|whisper|muffled|low quality/i.test(voice.name)) score -= 12
  if (!voice.localService) score += 2
  return score
}

function selectBestUkVoice(): SpeechSynthesisVoice | null {
  const preferred = selectPreferredUkFemaleVoice()
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return preferred
  const ukVoices = voices.filter(isUkEnglishVoice)
  const pool = ukVoices.length > 0 ? ukVoices : voices.filter((v) => normalizeLang(v.lang).startsWith('en'))
  if (!pool.length) return preferred
  return [...pool].sort((a, b) => scoreVoiceForClarity(b) - scoreVoiceForClarity(a))[0] ?? preferred
}

function speakWithVoices(text: string): void {
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(normalizeUtteranceText(text))
  // Slightly faster and brighter than before to reduce muddy output.
  utterance.rate = 0.92
  utterance.pitch = 1.08
  utterance.volume = 1

  const voice = selectBestUkVoice()
  if (voice) {
    utterance.voice = voice
    utterance.lang = normalizeLang(voice.lang).startsWith('en') ? voice.lang : UK_LANG
  } else {
    utterance.lang = UK_LANG
  }

  window.speechSynthesis.speak(utterance)
}

export function speak(text: string): void {
  if (!('speechSynthesis' in window)) {
    return
  }

  const voices = window.speechSynthesis.getVoices()
  if (voices.length > 0) {
    speakWithVoices(text)
    return
  }

  const onVoices = () => {
    window.speechSynthesis.removeEventListener('voiceschanged', onVoices)
    speakWithVoices(text)
  }
  window.speechSynthesis.addEventListener('voiceschanged', onVoices)
}
