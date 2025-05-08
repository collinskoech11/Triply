<template>
  <div class="onboarding-step">
    <h2>Verification & Summary</h2>

    <div class="verification-section" v-if="!isVerified">
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
        <div class="success-message" v-if="isSubmitted">
          <h3 :class="{ 'animate-success': isSubmitted }" style="color: #42b883; font-size: 1rem;">Success!</h3>
          <p>Your information has been successfully submitted.</p>
          <p>We'll be in touch soon!</p>
          <button @click="finishOnboarding" class="finish-button">
            Finish
          </button>
        </div>
        <br/>
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
              <span class="value"
                >{{ store.businessInfo.employees }}+ employees</span
              >
            </div>
          </div>
        </div>
        <br/>
        <div class="submission-section">
          <button
            v-if="!isSubmitted"
            class="finish-button"
            @click="submitData"
            :disabled="!isVerified || isLoading"
          >
            <LoadingSpinner v-if="isLoading" message="Submitting data..." />
            <span v-else>Submit Data</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
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

watch(
  () => props.isVerified,
  (newVerified) => {
    if (newVerified && verificationCode.value.length !== 6) {
      verificationCode.value = "";
    }
  }
);

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
</script>

<style scoped>
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

.submit-button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #35a570;
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
