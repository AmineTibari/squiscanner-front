<template>
  <div class="summary-strip" v-if="result">
    <div class="summary-card">
      <div class="label">Fournisseur</div>
      <div class="value vendor">{{ result.fournisseur?.nom || '—' }}</div>
    </div>
    <div class="summary-card">
      <div class="label">N° Facture</div>
      <div class="value">{{ result.invoice?.numero || '—' }}</div>
    </div>
    <div class="summary-card">
      <div class="label">Total TTC</div>
      <div class="value accent">{{ formatCurrency(result.totaux?.total_ttc, result.invoice?.devise) }}</div>
    </div>
    <div class="summary-card">
      <div class="label">Articles</div>
      <div class="value">{{ result.articles?.length ?? '—' }}</div>
    </div>
    <div class="summary-card">
      <div class="label">Confiance IA</div>
      <div class="value" :class="confidenceClass">
        {{ confidenceLabel }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  result: { type: Object, default: null },
})

function formatCurrency(amount, devise = 'EUR') {
  if (amount == null) return '—'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: devise || 'EUR',
  }).format(amount)
}

const confidenceLabel = computed(() => {
  const score = props.result?.metadata?.confidence_score
  if (score == null) return '—'
  return `${Math.round(score * 100)}%`
})

const confidenceClass = computed(() => {
  const score = props.result?.metadata?.confidence_score
  if (score == null) return ''
  if (score >= 0.85) return 'success'
  if (score >= 0.6) return 'warning'
  return 'danger'
})
</script>

<style scoped>
.summary-strip {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.summary-card {
  background: var(--sq-surface);
  border: 0.5px solid var(--sq-border);
  border-radius: var(--sq-radius-sm);
  padding: 14px 16px;
}

.label {
  font-size: 11px;
  color: var(--sq-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 5px;
}

.value {
  font-size: 16px;
  font-weight: 500;
  font-family: 'Syne', sans-serif;
  color: var(--sq-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.value.vendor { font-size: 13px; }
.value.accent { color: var(--sq-accent); }
.value.success { color: var(--sq-success); }
.value.warning { color: #d97706; }
.value.danger { color: var(--sq-error); }

@media (max-width: 860px) {
  .summary-strip { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 560px) {
  .summary-strip { grid-template-columns: repeat(2, 1fr); }
}
</style>
