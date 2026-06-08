// composables/useInvoiceAnalyzer.js
// Gère l'appel à l'API Anthropic et l'état de l'extraction

import { ref } from 'vue'

const SYSTEM_PROMPT = `Tu es SquiScanner, un scanner intelligent spécialisé dans l'extraction de données de factures.
Analyse attentivement le document fourni et retourne UNIQUEMENT un JSON valide, sans aucun texte avant ou après.
Le JSON doit respecter cette structure exacte et être aussi fidèle que possible au document :

{
  "invoice": {
    "numero": "string ou null",
    "date_emission": "YYYY-MM-DD ou null",
    "date_echeance": "YYYY-MM-DD ou null",
    "devise": "EUR",
    "statut": "en_attente | payee | annulee"
  },
  "fournisseur": {
    "nom": "string",
    "adresse": "string ou null",
    "ville": "string ou null",
    "code_postal": "string ou null",
    "pays": "string ou null",
    "telephone": "string ou null",
    "email": "string ou null",
    "siret": "string ou null",
    "tva_intracommunautaire": "string ou null"
  },
  "client": {
    "nom": "string ou null",
    "adresse": "string ou null",
    "ville": "string ou null",
    "code_postal": "string ou null",
    "pays": "string ou null",
    "email": "string ou null",
    "reference_client": "string ou null"
  },
  "articles": [
    {
      "description": "string",
      "reference": "string ou null",
      "quantite": 1,
      "unite": "string ou null",
      "prix_unitaire_ht": 0.00,
      "taux_tva": 20,
      "remise_pct": 0,
      "montant_ht": 0.00,
      "montant_tva": 0.00,
      "montant_ttc": 0.00
    }
  ],
  "totaux": {
    "sous_total_ht": 0.00,
    "total_remises": 0.00,
    "total_tva": 0.00,
    "total_ttc": 0.00,
    "acompte_verse": 0.00,
    "reste_a_payer": 0.00
  },
  "paiement": {
    "mode": "string ou null",
    "iban": "string ou null",
    "bic": "string ou null",
    "reference_paiement": "string ou null",
    "conditions": "string ou null"
  },
  "notes": "string ou null",
  "metadata": {
    "confidence_score": 0.95,
    "champs_manquants": [],
    "langue_detectee": "fr",
    "type_document": "facture | avoir | proforma | devis"
  }
}

Si une information n'est pas visible sur la facture, utilise null. Sois précis sur les montants. Retourne UNIQUEMENT le JSON.`

export function useInvoiceAnalyzer() {
  const status = ref('idle') // idle | loading | success | error
  const result = ref(null)
  const error = ref(null)
  const previewUrl = ref(null)
  const fileName = ref(null)

  /**
   * Lit un File et retourne { base64, mediaType }
   */
  function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target.result
        const base64 = dataUrl.split(',')[1]
        resolve({ base64, mediaType: file.type })
      }
      reader.onerror = () => reject(new Error('Lecture du fichier impossible'))
      reader.readAsDataURL(file)
    })
  }

  /**
   * Lance l'analyse d'une facture
   * @param {File} file - Le fichier image ou PDF
   */
  async function analyze(file) {
    status.value = 'loading'
    result.value = null
    error.value = null
    fileName.value = file.name

    // Prévisualisation image
    if (file.type.startsWith('image/')) {
      previewUrl.value = URL.createObjectURL(file)
    } else {
      previewUrl.value = null
    }

    try {
      const { base64, mediaType } = await readFile(file)

      // Construction du contenu selon le type
      const contentParts = []

      if (mediaType.startsWith('image/')) {
        contentParts.push({
          type: 'image',
          source: { type: 'base64', media_type: mediaType, data: base64 },
        })
      } else if (mediaType === 'application/pdf') {
        contentParts.push({
          type: 'document',
          source: { type: 'base64', media_type: 'application/pdf', data: base64 },
        })
      }

      contentParts.push({
        type: 'text',
        text: 'Analyse cette facture et extrait toutes les données en JSON.',
      })

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: contentParts }],
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData?.error?.message || `Erreur API : ${response.status}`)
      }

      const data = await response.json()
      const raw = data.content?.map((b) => b.text || '').join('') || ''
      const clean = raw.replace(/```json|```/g, '').trim()

      result.value = JSON.parse(clean)
      status.value = 'success'
    } catch (err) {
      console.error('[SquiScanner]', err)
      error.value = err.message || 'Erreur inconnue lors de l\'analyse'
      status.value = 'error'
    }
  }

  function reset() {
    status.value = 'idle'
    result.value = null
    error.value = null
    previewUrl.value = null
    fileName.value = null
  }

  return {
    status,
    result,
    error,
    previewUrl,
    fileName,
    analyze,
    reset,
  }
}
