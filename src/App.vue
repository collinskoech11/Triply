<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useOnboardingStore } from './stores/onboarding'
import OnboardingStep1 from './components/OnboardingStep1.vue'
import OnboardingStep2 from './components/OnboardingStep2.vue'
import OnboardingStep3 from './components/OnboardingStep3.vue'
import Dashboard from './components/Dashboard.vue'
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast();

const store = useOnboardingStore()
const showDashboard = ref(false)

console.log(store.currentStep)
const resetOnboarding = () => {
  store.reset()
  showDashboard.value = false
}

const handleNext = () => {
  store.nextStep()
}

const handlePrevious = () => {
  if (showDashboard.value) {
    showDashboard.value = false
    return
  }
  store.previousStep()
}

const handleBack = () => {
  showDashboard.value = false
  currentStep.value = 3
}

const handleSubmit = () => {
  store.submitData()
}

const handleDashboard = () => {
  showDashboard.value = true
  store.currentStep = 4 // Mark as completed
}

const handlePersonalInfoUpdate = (info: any) => {
  store.updatePersonalInfo(info)
  toast.success('Personal information saved')
}

const handleBusinessInfoUpdate = (info: BusinessInfo) => {
  store.updateBusinessInfo(info)
  toast.success('Business information saved')
}

watch(() => store.error, (error) => {
  if (error) {
    toast.error(error)
  }
})

watch(() => store.isSubmitted, (submitted) => {
  if (submitted) {
    toast.success('Data submitted successfully!')
  }
})
</script>

<template>
  <div class="app-container">
    <div class="onboarding-wrapper">
      <div class="progress-bar">
        <div class="progress" :style="{ width: `${(store.currentStep / 3) * 100}%` }"></div>
      </div>
      <div class="step-content">
        <OnboardingStep1
          v-if="store.currentStep === 1"
          :personalInfo="store.personalInfo"
          @update:personalInfo="handlePersonalInfoUpdate"
          @next="handleNext"
        />
        
        <OnboardingStep2
          v-if="store.currentStep === 2"
          :businessInfo="store.businessInfo"
          @update:businessInfo="handleBusinessInfoUpdate"
          @next="handleNext"
          @previous="handlePrevious"
        />
        
        <OnboardingStep3
          v-if="store.currentStep === 3"
          :is-verified="store.isVerified"
          :is-submitted="store.isSubmitted"
          :is-loading="store.isLoading"
          :error="store.error"
          @previous="handlePrevious"
          @dashboard="handleDashboard"
          @submit="handleSubmit"
        />
        
        <Dashboard v-if="showDashboard" @back="handleBack" />
      </div>
    </div>
  </div>
</template>

<style scoped>

.error-message {
  color: #ff4444;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.app-container {
  min-height: 100vh !important;
  width:100vw;
  background: #f5f7fa;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.onboarding-wrapper {
  max-width: 1200px;
  width: 90%;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.progress-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  margin-bottom: 2rem;
  width: 100%;
}

.progress {
  height: 100%;
  background: #42b883;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (max-width: 1200px) {
  .onboarding-wrapper {
    max-width: 1000px;
    padding: 2rem;
  }
}

@media (max-width: 1000px) {
  .onboarding-wrapper {
    max-width: 800px;
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .app-container {
    padding: 1rem;
  }
  
  .onboarding-wrapper {
    max-width: 100%;
    padding: 1rem;
    border-radius: 12px;
  }
  
  .progress-bar {
    height: 4px;
  }
}
</style>
