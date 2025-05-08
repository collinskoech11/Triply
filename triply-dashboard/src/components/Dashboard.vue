<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <button class="back-button" @click="handleBack">← Back</button>
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useOnboardingStore } from '../stores/onboarding'

const store = useOnboardingStore()
const emit = defineEmits(['back'])

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

const handleBack = () => {
  emit('back')
}
</script>

<style scoped>
.back-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: none;
  border: none;
  color: #42b883;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: rgba(66, 184, 131, 0.1);
  color: #38a169;
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
</style>



<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
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
</style>
