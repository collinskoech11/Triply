<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div class="form-actions">
        <button class="prev-button" @click="handleBack">
           Back
        </button>
        <button class="next-button" @click="showClearDialog = true">
          Clear Data
        </button> 
      </div>
      <div class="user-info">
        <div class="profile-image">
          <img v-if="store.personalInfo.profilePicture" :src="store.personalInfo.profilePicture" alt="Profile" />
          <span v-else class="initials">{{ initials }}</span>
        </div>
        <div class="user-details">
          <h2>{{ store.personalInfo.fullName }}</h2>
          <p>{{ store.personalInfo.email }}</p>
        </div>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="dashboard-section">
        <h3>Personal Information</h3>
        <div class="info-card">
          <div class="info-item">
            <span class="label">Full Name:</span>
            <span class="value">{{ store.personalInfo.fullName }}</span>
          </div>
          <div class="info-item">
            <span class="label">Email:</span>
            <span class="value">{{ store.personalInfo.email }}</span>
          </div>
          <div class="info-item">
            <span class="label">Phone:</span>
            <span class="value">{{ store.personalInfo.phone }}</span>
          </div>
        </div>
      </div>

      <div class="dashboard-section">
        <h3>Business Information</h3>
        <div class="info-card">
          <div class="info-item">
            <span class="label">Company Name:</span>
            <span class="value">{{ store.businessInfo.companyName }}</span>
          </div>
          <div class="info-item">
            <span class="label">Industry:</span>
            <span class="value">{{ store.businessInfo.industry }}</span>
          </div>
          <div class="info-item">
            <span class="label">Company Size:</span>
            <span class="value">{{ store.businessInfo.employees }}+ employees</span>
          </div>
          <div class="info-item">
            <span class="label">Business Logo:</span>
            <img v-if="store.businessInfo.businessLogo" :src="store.businessInfo.businessLogo" alt="Business Logo" class="logo-preview" />
            <span v-else class="no-logo">No logo uploaded</span>
          </div>
        </div>
      </div>

      <div class="dashboard-section">
        <h3>Verification Status</h3>
        <div class="info-card">
          <div class="info-item">
            <span class="label">Email Verified:</span>
            <span class="value" :class="{ verified: store.isVerified }">
              {{ store.isVerified ? '✅ Verified' : '❌ Not Verified' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Clear Confirmation Dialog -->
    <div v-if="showClearDialog" class="clear-dialog">
      <div class="dialog-content">
        <h3>Clear All Data</h3>
        <p>Are you sure you want to clear all onboarding data? This action cannot be undone.</p>
        <div class="dialog-buttons">
          <button class="cancel-button" @click="showClearDialog = false">Cancel</button>
          <button class="clear-confirm-button" @click="clearAllData">Clear</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useOnboardingStore } from '../stores/onboarding'

const store = useOnboardingStore()
const emit = defineEmits(['back'])

const showClearDialog = ref(false)

const initials = computed(() => {
  const name = store.personalInfo.fullName
  return name
    ? name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    : ''
})

const clearAllData = () => {
  // Clear localStorage
  localStorage.removeItem('onboardingState')
  
  // Reset the store
  store.reset()
  
  // Navigate back to the first step
  emit('back')
  
  showClearDialog.value = false
}

const handleBack = () => {
  emit('previous')
}
</script>

<style scoped>
@import "@fortawesome/fontawesome-free/css/all.css";

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.prev-button,
.next-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease;
}

.prev-button {
  background-color: #f5f7fa;
  color: #333;
  border: 1px solid #ddd;
}

.prev-button:hover {
  background-color: #e9ecef;
}

.next-button {
  background-color: #dc3545;
  color: white;
}

.next-button:hover {
  background-color: #c82333;
}

.prev-button i,
.next-button i {
  font-size: 1rem;
}

.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #42b883;
  color: white;
  font-weight: bold;
  font-size: 2rem;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details h2 {
  margin: 0;
  font-size: 1.5rem;
}

.user-details p {
  margin: 0.25rem 0 0;
  color: #666;
}

.dashboard-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.dashboard-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

h3 {
  margin: 0 0 1rem;
  color: #333;
}

.info-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.label {
  color: #666;
  font-weight: 500;
}

.value {
  flex: 1;
  color: #333;
}

.value.verified {
  color: #42b883;
}

.logo-preview {
  max-width: 100px;
  max-height: 100px;
  object-fit: contain;
}

.no-logo {
  color: #999;
  font-style: italic;
}

.clear-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.dialog-content h3 {
  color: #333;
  margin-bottom: 1rem;
}

.dialog-content p {
  color: #666;
  margin-bottom: 1.5rem;
}

.dialog-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.cancel-button,
.clear-confirm-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  flex: 1;
}

.cancel-button {
  background: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
}

.cancel-button:hover {
  background: #e9ecef;
}

.clear-confirm-button {
  background: #dc3545;
  color: white;
}

.clear-confirm-button:hover {
  background: #c82333;
}
</style>
