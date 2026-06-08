# SquiScanner — Scanner intelligent de factures

Interface Vue.js 3 pour l'extraction automatique de données de factures en JSON structuré,
propulsée par l'IA Claude (Anthropic).

---

## Structure du projet

```
squiscanner/
├── index.html                        # Point d'entrée HTML
├── vite.config.js                    # Configuration Vite
├── package.json
└── src/
    ├── main.js                       # Bootstrap Vue
    ├── App.vue                       # Composant racine
    ├── styles/
    │   └── global.css               # Variables CSS & reset
    ├── components/
    │   ├── AppNavbar.vue            # Barre de navigation
    │   ├── UploadZone.vue           # Hero + zone glisser-déposer
    │   ├── SummaryStrip.vue         # Résumé des champs clés
    │   └── ResultPanel.vue          # Aperçu document + JSON extrait
    └── composables/
        └── useInvoiceAnalyzer.js    # Logique API Anthropic + état
```

---

## Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement
npm run dev

# 3. Builder pour la production
npm run build
```

---

## Configuration de l'API

L'application utilise l'API Anthropic directement depuis le navigateur.

### Option 1 — Proxy local (recommandé pour la production)

Créez un serveur proxy qui ajoute votre clé API :

```js
// server/proxy.js (exemple Express)
app.post('/api/analyze', async (req, res) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(req.body),
  })
  const data = await response.json()
  res.json(data)
})
```

Puis dans `useInvoiceAnalyzer.js`, remplacez l'URL :
```js
const response = await fetch('/api/analyze', { ... })
// Retirez le header 'x-api-key' côté client
```

### Option 2 — Variable d'environnement Vite (développement uniquement)

```bash
# .env.local
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

```js
// dans useInvoiceAnalyzer.js
headers: {
  'Content-Type': 'application/json',
  'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
}
```

> ⚠️ Ne jamais exposer votre clé API en production côté client.

---

## Structure JSON retournée

```json
{
  "invoice": {
    "numero": "F-2024-0042",
    "date_emission": "2024-03-15",
    "date_echeance": "2024-04-15",
    "devise": "EUR",
    "statut": "en_attente"
  },
  "fournisseur": {
    "nom": "Acme SARL",
    "adresse": "12 rue de la Paix",
    "ville": "Paris",
    "code_postal": "75001",
    "pays": "France",
    "siret": "123 456 789 00012",
    "tva_intracommunautaire": "FR12345678900"
  },
  "client": {
    "nom": "Client Corp",
    "adresse": "...",
    "reference_client": "CLI-001"
  },
  "articles": [
    {
      "description": "Prestation de développement",
      "reference": "DEV-001",
      "quantite": 5,
      "unite": "jours",
      "prix_unitaire_ht": 800.00,
      "taux_tva": 20,
      "remise_pct": 0,
      "montant_ht": 4000.00,
      "montant_tva": 800.00,
      "montant_ttc": 4800.00
    }
  ],
  "totaux": {
    "sous_total_ht": 4000.00,
    "total_remises": 0,
    "total_tva": 800.00,
    "total_ttc": 4800.00,
    "acompte_verse": 0,
    "reste_a_payer": 4800.00
  },
  "paiement": {
    "mode": "Virement bancaire",
    "iban": "FR76 3000 6000 0112 3456 7890 189",
    "bic": "AGRIFRPP"
  },
  "metadata": {
    "confidence_score": 0.96,
    "champs_manquants": ["telephone"],
    "langue_detectee": "fr",
    "type_document": "facture"
  }
}
```

---

## Formats supportés

- Images : JPG, PNG, WEBP, GIF
- Documents : PDF (aperçu non disponible, analyse fonctionnelle)

---

## Technologies

- [Vue.js 3](https://vuejs.org/) + Composition API
- [Vite](https://vitejs.dev/) — build tool
- [Anthropic Claude API](https://docs.anthropic.com/) — extraction IA
- [Tabler Icons](https://tabler-icons.io/) — iconographie
- [Google Fonts](https://fonts.google.com/) — Syne + Inter
