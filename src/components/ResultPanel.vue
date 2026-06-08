<template>
  <section class="result-section">
    <SummaryStrip :result="result" />

    <div class="result-grid">
      <!-- Panneau gauche : aperçu document -->
      <div class="panel">
        <div class="panel-header">
          <h3>
            <i class="ti ti-file-description" aria-hidden="true" />
            Document original
          </h3>
          <span class="file-name" v-if="fileName">{{ fileName }}</span>
        </div>

        <div class="panel-body preview-body">
          <!-- Image -->
          <img
            v-if="previewUrl"
            :src="previewUrl"
            class="doc-preview"
            alt="Aperçu de la facture scannée"
          />
          <!-- PDF ou pas d'image -->
          <div v-else class="no-preview">
            <i class="ti ti-file-type-pdf" aria-hidden="true" />
            <p>{{ fileName || 'Document PDF' }}</p>
            <span>Aperçu non disponible pour les PDF</span>
          </div>
        </div>

        <!-- Nouvelle analyse -->
        <div class="panel-footer">
          <button class="btn-ghost" @click="$emit('reset')">
            <i class="ti ti-refresh" aria-hidden="true" />
            Nouvelle analyse
          </button>
        </div>
      </div>

      <!-- Panneau droit : JSON -->
      <div class="panel">
        <div class="panel-header">
          <h3>
            <i class="ti ti-code" aria-hidden="true" />
            JSON extrait
          </h3>
          <div class="header-actions">
            <button class="btn-icon" @click="downloadJSON" title="Télécharger le JSON">
              <i class="ti ti-download" aria-hidden="true" />
            </button>
            <button class="btn-icon" @click="copyJSON" :class="{ copied: isCopied }">
              <i :class="`ti ti-${isCopied ? 'check' : 'copy'}`" aria-hidden="true" />
              {{ isCopied ? 'Copié !' : 'Copier' }}
            </button>
          </div>
        </div>

        <div class="panel-body json-body">
          <!-- Chargement -->
          <div v-if="status === 'loading'" class="loading-state">
            <div class="spinner" />
            <p>Analyse en cours par SquiScanner IA…</p>
            <span>Extraction des champs de la facture</span>
          </div>

          <!-- JSON affiché -->
          <pre v-else-if="result" class="json-output">{{ prettyJSON }}</pre>

          <!-- Erreur -->
          <div v-else-if="status === 'error'" class="error-state">
            <i class="ti ti-alert-circle" aria-hidden="true" />
            <p>{{ errorMessage }}</p>
          </div>
        </div>

        <!-- Status bar -->
        <div
          v-if="status === 'success'"
          class="status-bar success"
        >
          <i class="ti ti-circle-check" aria-hidden="true" />
          Extraction réussie · {{ result?.articles?.length ?? 0 }} article(s) détecté(s)
          · Type : {{ result?.metadata?.type_document || 'facture' }}
        </div>
        <div
          v-else-if="status === 'error'"
          class="status-bar error"
        >
          <i class="ti ti-alert-triangle" aria-hidden="true" />
          Analyse échouée — vérifiez que le fichier est une facture lisible
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import SummaryStrip from './SummaryStrip.vue'

const props = defineProps({
  status: { type: String, required: true },
  result: { type: Object, default: null },
  errorMessage: { type: String, default: '' },
  previewUrl: { type: String, default: null },
  fileName: { type: String, default: null },
})

defineEmits(['reset'])

const isCopied = ref(false)

const prettyJSON = computed(() =>
  props.result ? JSON.stringify(props.result, null, 2) : ''
)

async function copyJSON() {
  if (!props.result) return
  await navigator.clipboard.writeText(prettyJSON.value)
  isCopied.value = true
  setTimeout(() => { isCopied.value = false }, 2200)
}

function downloadJSON() {
  if (!props.result) return
  const blob = new Blob([prettyJSON.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const baseName = props.fileName?.replace(/\.[^.]+$/, '') || 'facture'
  a.href = url
  a.download = `${baseName}_squiscanner.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.result-section {
  max-width: 960px;
  margin: 0 auto 64px;
  padding: 0 24px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.result-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* Panel */
.panel {
  background: var(--sq-surface);
  border: 0.5px solid var(--sq-border);
  border-radius: var(--sq-radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 0.5px solid var(--sq-border);
  flex-shrink: 0;
}

.panel-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--sq-text);
}

.panel-header h3 i {
  font-size: 16px;
  color: var(--sq-accent);
}

.file-name {
  font-size: 12px;
  color: var(--sq-muted);
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Panel body */
.panel-body {
  flex: 1;
  overflow: hidden;
}

.preview-body {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--sq-subtle);
  min-height: 340px;
}

.doc-preview {
  width: 100%;
  height: 340px;
  object-fit: contain;
  display: block;
}

.no-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--sq-muted);
  padding: 40px;
  text-align: center;
}

.no-preview i {
  font-size: 48px;
  opacity: 0.35;
  color: var(--sq-accent);
}

.no-preview p {
  font-size: 14px;
  font-weight: 500;
  color: var(--sq-text);
}

.no-preview span {
  font-size: 12px;
  color: var(--sq-muted);
}

/* JSON body */
.json-body {
  min-height: 340px;
  background: var(--sq-subtle);
  overflow-y: auto;
}

.json-output {
  font-family: 'Courier New', Courier, monospace;
  font-size: 12px;
  line-height: 1.75;
  padding: 18px;
  white-space: pre;
  color: var(--sq-text);
  min-height: 340px;
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 340px;
  padding: 40px;
  text-align: center;
}

.spinner {
  width: 34px;
  height: 34px;
  border: 2.5px solid var(--sq-border-strong);
  border-top-color: var(--sq-accent);
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.loading-state p {
  font-size: 14px;
  color: var(--sq-text);
  font-weight: 500;
}

.loading-state span {
  font-size: 12px;
  color: var(--sq-muted);
}

/* Error */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 340px;
  padding: 40px;
  text-align: center;
}

.error-state i {
  font-size: 40px;
  color: var(--sq-error);
  opacity: 0.7;
}

.error-state p {
  font-size: 14px;
  color: var(--sq-text);
}

/* Status bar */
.status-bar {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 18px;
  font-size: 13px;
  border-top: 0.5px solid var(--sq-border);
  flex-shrink: 0;
}

.status-bar i { font-size: 15px; }

.status-bar.success {
  color: var(--sq-success);
  background: var(--sq-success-bg);
}

.status-bar.error {
  color: var(--sq-error);
  background: var(--sq-error-bg);
}

/* Footer */
.panel-footer {
  padding: 10px 14px;
  border-top: 0.5px solid var(--sq-border);
  flex-shrink: 0;
}

/* Buttons */
.btn-ghost {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 0.5px solid var(--sq-border);
  border-radius: var(--sq-radius-sm);
  padding: 6px 12px;
  font-size: 13px;
  color: var(--sq-muted);
  cursor: pointer;
  transition: all 0.15s;
}

.btn-ghost:hover {
  color: var(--sq-text);
  border-color: var(--sq-border-strong);
  background: var(--sq-subtle);
}

.btn-icon {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: 0.5px solid var(--sq-border);
  border-radius: var(--sq-radius-sm);
  padding: 5px 10px;
  font-size: 13px;
  color: var(--sq-muted);
  cursor: pointer;
  transition: all 0.15s;
}

.btn-icon:hover {
  color: var(--sq-text);
  background: var(--sq-subtle);
}

.btn-icon.copied {
  color: var(--sq-success);
  border-color: var(--sq-success);
}

.btn-icon i { font-size: 15px; }

@media (max-width: 680px) {
  .result-grid { grid-template-columns: 1fr; }
}
</style>
