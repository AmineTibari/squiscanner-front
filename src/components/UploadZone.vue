<template>
  <section class="hero">
    <!-- Badge -->
    <div class="badge">
      <i class="ti ti-sparkles" aria-hidden="true" />
      Extraction IA · 99.4% de précision
    </div>

    <!-- Titre -->
    <h1>
      Numérisez vos <span class="accent">factures</span><br />
      en JSON structuré
    </h1>
    <p class="subtitle">
      SquiScanner analyse intelligemment vos factures et extrait chaque champ en JSON fidèle —
      fournisseur, articles, TVA, totaux — en quelques secondes.
    </p>

    <!-- Zone de dépôt -->
    <div
      class="drop-zone"
      :class="{ 'drag-over': isDragging, 'has-file': hasFile }"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="onDrop"
      @click="triggerInput"
      role="button"
      tabindex="0"
      aria-label="Zone de dépôt de fichier facture"
      @keydown.enter="triggerInput"
      @keydown.space.prevent="triggerInput"
    >
      <input
        ref="inputRef"
        type="file"
        accept="image/*,.pdf"
        class="file-input"
        @change="onFileChange"
      />

      <div class="drop-icon">
        <i class="ti ti-file-upload" aria-hidden="true" />
      </div>
      <h3>Déposez votre facture ici</h3>
      <p>ou cliquez pour parcourir vos fichiers</p>

      <div class="type-pills">
        <span class="pill">JPG</span>
        <span class="pill">PNG</span>
        <span class="pill">PDF</span>
        <span class="pill">WEBP</span>
      </div>
    </div>

    <!-- Grille de features -->
    <div class="features">
      <div v-for="f in features" :key="f.title" class="feature-card">
        <div class="feature-icon" :style="{ background: f.iconBg }">
          <i :class="`ti ti-${f.icon}`" :style="{ color: f.iconColor }" aria-hidden="true" />
        </div>
        <h4>{{ f.title }}</h4>
        <p>{{ f.description }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['file-selected'])

const inputRef = ref(null)
const isDragging = ref(false)
const hasFile = ref(false)

const features = [
  {
    icon: 'brain',
    iconBg: '#EBF0FF',
    iconColor: '#1A56DB',
    title: 'IA de dernière génération',
    description: 'Reconnaissance optique avancée, même sur les factures floues ou de travers.',
  },
  {
    icon: 'code',
    iconBg: '#F0FDF4',
    iconColor: '#16a34a',
    title: 'JSON normalisé',
    description: 'Sortie JSON cohérente et structurée, prête à intégrer dans vos systèmes.',
  },
  {
    icon: 'bolt',
    iconBg: '#FFF7ED',
    iconColor: '#ea580c',
    title: 'Résultats en 5 secondes',
    description: 'Traitement ultra-rapide pour des volumes importants de documents.',
  },
  {
    icon: 'shield-check',
    iconBg: '#FDF4FF',
    iconColor: '#9333ea',
    title: 'Données sécurisées',
    description: 'Vos documents ne sont jamais stockés. Traitement en mémoire uniquement.',
  },
]

function triggerInput() {
  inputRef.value?.click()
}

function onDrop(e) {
  isDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) emitFile(file)
}

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (file) emitFile(file)
}

function emitFile(file) {
  hasFile.value = true
  emit('file-selected', file)
}
</script>

<style scoped>
.hero {
  max-width: 760px;
  margin: 0 auto;
  padding: 72px 24px 48px;
  text-align: center;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--sq-accent-light);
  color: var(--sq-accent);
  border-radius: 20px;
  padding: 5px 16px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 28px;
}

.badge i { font-size: 13px; }

h1 {
  font-family: 'Syne', sans-serif;
  font-size: 44px;
  font-weight: 700;
  line-height: 1.15;
  color: var(--sq-text);
  margin-bottom: 18px;
}

h1 .accent { color: var(--sq-accent); }

.subtitle {
  font-size: 17px;
  color: var(--sq-muted);
  line-height: 1.7;
  margin-bottom: 40px;
  max-width: 560px;
  margin-inline: auto;
  margin-bottom: 40px;
}

/* Drop zone */
.drop-zone {
  border: 1.5px dashed var(--sq-border-strong);
  border-radius: var(--sq-radius-lg);
  padding: 52px 32px;
  cursor: pointer;
  background: var(--sq-surface);
  position: relative;
  transition: border-color 0.2s, background 0.2s;
  outline: none;
  margin-bottom: 52px;
}

.drop-zone:hover,
.drop-zone:focus,
.drop-zone.drag-over {
  border-color: var(--sq-accent);
  background: var(--sq-accent-light);
}

.file-input {
  display: none;
}

.drop-icon {
  width: 60px;
  height: 60px;
  background: var(--sq-subtle);
  border: 0.5px solid var(--sq-border);
  border-radius: var(--sq-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
}

.drop-icon i {
  font-size: 28px;
  color: var(--sq-accent);
}

.drop-zone h3 {
  font-family: 'Syne', sans-serif;
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--sq-text);
}

.drop-zone > p {
  font-size: 14px;
  color: var(--sq-muted);
}

.type-pills {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 18px;
}

.pill {
  background: var(--sq-subtle);
  border: 0.5px solid var(--sq-border);
  border-radius: 20px;
  padding: 3px 12px;
  font-size: 12px;
  color: var(--sq-muted);
}

/* Features */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  text-align: left;
}

.feature-card {
  background: var(--sq-surface);
  border: 0.5px solid var(--sq-border);
  border-radius: var(--sq-radius-md);
  padding: 20px;
}

.feature-icon {
  width: 38px;
  height: 38px;
  border-radius: var(--sq-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}

.feature-icon i { font-size: 19px; }

.feature-card h4 {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: var(--sq-text);
}

.feature-card p {
  font-size: 13px;
  color: var(--sq-muted);
  line-height: 1.55;
}

@media (max-width: 640px) {
  h1 { font-size: 30px; }
  .hero { padding: 48px 16px 32px; }
}
</style>
