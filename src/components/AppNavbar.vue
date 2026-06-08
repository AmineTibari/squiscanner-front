<template>
  <nav class="navbar">
    <a class="logo" href="#">
      <div class="logo-icon">
        <i class="ti ti-scan" aria-hidden="true" />
      </div>
      <span>SquiScanner</span>
    </a>

    <div class="nav-links">
      <a href="#">Fonctionnalités</a>
      <a href="#">API</a>
      <a href="#">Documentation</a>
    </div>

    <button class="btn-primary" @click="$emit('scan')">
      <i class="ti ti-file-upload" aria-hidden="true" />
      Scanner une facture
    </button>
  </nav>
</template>

<script setup>
defineEmits(['scan'])
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  background: var(--sq-surface);
  border-bottom: 0.5px solid var(--sq-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: var(--sq-text);
}

.logo-icon {
  width: 34px;
  height: 34px;
  background: var(--sq-accent);
  border-radius: var(--sq-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon i {
  color: #fff;
  font-size: 18px;
}

.nav-links {
  display: flex;
  gap: 28px;
  align-items: center;
}

.nav-links a {
  font-size: 14px;
  color: var(--sq-muted);
  transition: color 0.15s;
}

.nav-links a:hover {
  color: var(--sq-text);
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 7px;
  background: var(--sq-accent);
  color: #fff;
  border: none;
  border-radius: var(--sq-radius-sm);
  padding: 9px 18px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}

.btn-primary:hover {
  background: var(--sq-accent-dark);
}

.btn-primary i {
  font-size: 16px;
}

@media (max-width: 768px) {
  .nav-links { display: none; }
  .navbar { padding: 14px 20px; }
}
</style>
