<template>
  <div id="squiscanner-app">
    <!-- Navigation -->
    <AppNavbar @scan="triggerUpload" />

    <main>
      <!-- Zone d'upload (visible si pas encore de fichier en cours) -->
      <UploadZone
        v-if="status === 'idle'"
        ref="uploadZoneRef"
        @file-selected="onFileSelected"
      />

      <!-- Résultat (visible dès qu'un fichier est en cours d'analyse ou analysé) -->
      <ResultPanel
        v-else
        :status="status"
        :result="result"
        :error-message="error"
        :preview-url="previewUrl"
        :file-name="fileName"
        @reset="reset"
      />
    </main>

    <footer class="sq-footer">
      SquiScanner &mdash; Scanner intelligent de factures &middot; Propulsé par l'IA Claude
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppNavbar from './components/AppNavbar.vue'
import UploadZone from './components/UploadZone.vue'
import ResultPanel from './components/ResultPanel.vue'
import { useInvoiceAnalyzer } from './composables/useInvoiceAnalyzer.js'

const uploadZoneRef = ref(null)

const { status, result, error, previewUrl, fileName, analyze, reset } =
  useInvoiceAnalyzer()

function onFileSelected(file) {
  analyze(file)
}

function triggerUpload() {
  if (status.value !== 'idle') {
    reset()
    return
  }
  // Déclenche le clic sur l'input file du composant UploadZone
  uploadZoneRef.value?.$el
    ?.querySelector('input[type="file"]')
    ?.click()
}
</script>

<style scoped>
#squiscanner-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.sq-footer {
  text-align: center;
  padding: 28px 32px;
  border-top: 0.5px solid var(--sq-border);
  font-size: 13px;
  color: var(--sq-muted);
  background: var(--sq-surface);
  margin-top: auto;
}
</style>
