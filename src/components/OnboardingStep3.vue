<template>
  <div class="onboarding-step" style="text-align:center">
    <h2>Verification & Summary</h2>

    <div class="verification-section" v-if="!isVerified">
      <button class="back-button" @click="handlePrevious">
        <i class="fas fa-arrow-left"></i> Back
      </button>
      <div class="verification-container">
        <h3>Email Verification</h3>
        <p>We've sent a verification code to your email address:</p>
        <div class="email-display">{{ store.personalInfo.email }}</div>
        <div class="code-input-container">
          <input
            type="text"
            v-model="verificationCode"
            placeholder="Enter verification code"
            maxlength="6"
            class="code-input"
            @keyup.enter="verifyCode"
          />
          <button @click="verifyCode" class="verify-button">Verify</button>
        </div>
        <p class="resend-text" @click="resendCode">Resend code</p>
      </div>
    </div>

    <div class="summary-section" v-else>
      <div class="summary-container">
        <div v-if="isSubmitted" class="success-message-card">
          <h3 class="success-title">Success!</h3>
          <p>Your information has been successfully submitted.</p>
          <p>We'll be in touch soon!</p>
        </div>
        <div class="summary-card">
          <div class="summary-section">
            <h4>Personal Information</h4>
            <div class="summary-item">
              <span class="label">Full Name:</span>
              <span class="value">{{ store.personalInfo.fullName }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Email:</span>
              <span class="value">{{ store.personalInfo.email }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Phone:</span>
              <span class="value">{{ store.personalInfo.phone }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Profile Picture:</span>
              <div class="preview-container">
                <img v-if="store.personalInfo.profilePicture" 
                     :src="store.personalInfo.profilePicture" 
                     alt="Profile Picture"
                     class="preview-image"
                     style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;" />
                <span v-else>No profile picture uploaded</span>
              </div>
            </div>
          </div>

          <div class="summary-section">
            <h4>Business Information</h4>
            <div class="summary-item">
              <span class="label">Business Name:</span>
              <span class="value">{{ store.businessInfo.companyName }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Industry:</span>
              <span class="value">{{ store.businessInfo.industry }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Company Size:</span>
              <span class="value">{{ store.businessInfo.employees }}+ employees</span>
            </div>
            <div class="summary-item">
              <span class="label">Business Logo:</span>
              <div class="preview-container">
                <img v-if="store.businessInfo.businessLogo" 
                     :src="store.businessInfo.businessLogo" 
                     alt="Business Logo"
                     class="preview-image"
                     style="width: 100px; height: 100px; object-fit: contain;" />
                <span v-else>No business logo uploaded</span>
              </div>
            </div>
            <div class="summary-item">
              <span class="label">Documents:</span>
              <div class="preview-container">
                <div v-if="store.businessInfo.document" class="document-preview" @click="showDocumentPreview">
                  <div class="document-icon">📄</div>
                  <div class="document-details">
                    <span class="document-name">{{ store.businessInfo.documentName }}</span>
                    <span class="document-size">{{ store.businessInfo.documentSize }} MB</span>
                  </div>
                </div>

                <!-- Document Preview Modal -->
                <div v-if="showDocumentModal" class="document-modal">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h3>{{ store.businessInfo.documentName }}</h3>
                      <button @click="closeDocumentPreview" class="close-button">×</button>
                    </div>
                    <div class="pdf-viewer">
                      <iframe :src="store.businessInfo.document" type="application/pdf" width="100%" height="600px"></iframe>
                    </div>
                  </div>
                </div>
                <!-- <span v-else>No documents uploaded</span> -->
              </div>
            </div>
          </div>
        </div>
        <div class="submission-section">
          <div class="form-actions">
            <button type="button" @click="handlePrevious" class="prev-button">
              Previous
            </button>
            <div v-if="!isSubmitted" class="submit-section">
              <button
                type="button"
                class="verify-button"
                @click="submitData"
                :disabled="!isVerified || isLoading"
              >
                <LoadingSpinner v-if="isLoading" message="Submitting data..." />
                <span v-else>Submit Data</span>
              </button>
            </div>
            <div v-else class="restart-section">
              <button type="button" @click="showRestartDialog = true" class="next-button">
                Restart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Restart Confirmation Dialog -->
  <div v-if="showRestartDialog" class="clear-dialog">
    <div class="dialog-content">
      <h3>Restart Onboarding</h3>
      <p>Are you sure you want to restart the onboarding process? This will clear all your data and start fresh.</p>
      <div class="dialog-buttons">
        <button class="cancel-button" @click="showRestartDialog = false">Cancel</button>
        <button class="clear-confirm-button" @click="restartOnboarding">Restart</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useOnboardingStore } from "../stores/onboarding";
import LoadingSpinner from "./LoadingSpinner.vue";

const store = useOnboardingStore();
const emit = defineEmits(['previous', 'dashboard']);

const props = defineProps<{
  isVerified: boolean;
  isSubmitted: boolean;
  isLoading: boolean;
  error: string | null;
}>();

const verificationCode = ref("");
const showDocumentModal = ref(false);
const showRestartDialog = ref(false)

watch(
  () => props.isVerified,
  (newVerified) => {
    if (newVerified && verificationCode.value.length !== 6) {
      verificationCode.value = "";
    }
  }
);

const renderOTP = () => {
  if(!props.isVerified){
    alert("Your OTP code is 123456")
  }
}

onMounted(() => {
  renderOTP()
})

const showDocumentPreview = () => {
  showDocumentModal.value = true;
}

const closeDocumentPreview = () => {
  showDocumentModal.value = false;
}

const verifyCode = () => {
  // Simulate verification
  if (verificationCode.value.length === 6) {
    store.verifyIdentity(verificationCode.value);
  } else {
    alert("Please enter a 6-digit verification code");
  }
};

const resendCode = () => {
  alert("Verification code has been resent to your email");
};

const submitData = () => {
  store.submitData();
};

const finishOnboarding = () => {
  emit('dashboard')
};

const handlePrevious = () => {
  emit("previous");
};

const restartOnboarding = () => {
  // Clear localStorage
  localStorage.removeItem('onboardingState')
  
  // Reset the store
  store.reset()
  
  // Navigate back to the first step
  emit('previous')
  
  showRestartDialog.value = false
}
</script>

<style scoped>
@import "@fortawesome/fontawesome-free/css/all.css";
.animate-success {
  animation: success 1s ease-in-out;
}
@keyframes success {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
.document-preview{
  display: flex;
  margin-left:20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.document-preview:hover {
  background-color: #f0f0f0;
}

.document-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  color: #666;
}

.close-button:hover {
  color: #333;
}

.pdf-viewer {
  flex: 1;
  overflow: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
}
.onboarding-step {
  max-width: 800px;
  width: 50vw;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.verification-section {
  text-align: center;
  padding: 2rem;
}

.verification-container {
  max-width: 400px;
  margin: 0 auto;
}

.email-display {
  background: #f5f7fa;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-weight: 500;
}

.code-input-container {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
}

.code-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1.5rem;
  text-align: center;
  letter-spacing: 0.5rem;
}

.verify-button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.verify-button:hover {
  background-color: #35a570;
}

.resend-text {
  color: #42b883;
  cursor: pointer;
  text-decoration: underline;
}

.summary-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.summary-card {
  background: #f5f7fa;
  padding: 2rem;
  border-radius: 12px;
}

.summary-section {
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.label {
  font-weight: 500;
  color: #666;
}

.value {
  font-weight: 400;
  color: #333;
}

.submission-section {
  text-align: center;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.prev-button,
.next-button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
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

.next-button i {
  font-size: 1rem;
}

.success-section {
  text-align: center;
  padding: 3rem;
  background: #f5f7fa;
  border-radius: 12px;
  margin-top: 2rem;
}

.success-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.icon {
  font-size: 3rem;
  color: #42b883;
}

.finish-button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.finish-button:hover {
  background-color: #35a570;
}

.back-button {
  background: none;
  border: none;
  color: #42b883;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-button:hover {
  color: #35a570;
}

.back-button i {
  font-size: 1rem;
}

.clear-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-content {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dialog-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.cancel-button {
  background-color: #f5f7fa;
  color: #333;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #e9ecef;
}

.clear-confirm-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.clear-confirm-button:hover {
  background-color: #c82333;
}
.success-message-card {
  background-color: #f0fdf4;
  border-left: 6px solid #42b883;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  max-width: 500px;
  margin: 2rem auto;
  text-align: center;
  animation: fadeIn 0.6s ease-out;
}

.success-title {
  color: #42b883;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  animation: popIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes popIn {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.submit-section,
.restart-section {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.submit-section {
  margin-left: 1rem;
}

.restart-section {
  margin-left: auto;
}

@media (max-width: 768px) {
  .onboarding-step {
    padding: 1.5rem;
  }

  .summary-card {
    padding: 1rem;
  }

  .summary-section {
    gap: 1rem;
  }

  .summary-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .label {
    color: #333;
  }
}
</style>
