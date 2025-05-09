<template>
  <div class="onboarding-step">
    <h2>Business Information</h2>
    <Form :validation-schema="validationSchema" @submit="handleSubmit" class="form-container">
     <br/> 
     <div class="document-upload">
        <div class="document-preview" v-if="documentPreviewUrl">
          <div class="document-icon">📄</div>
          <div class="document-info">
            <span class="document-name">{{ documentName }}</span>
            <span class="document-size">{{ documentSize }}</span>
          </div>
        </div>
        <label class="upload-label" for="document">
          <span v-if="!documentPreviewUrl"
            >Upload Documents (PDF only, max 5MB)</span
          >
          <span v-else>Change Documents</span>
        </label>
        <input
          type="file"
          id="document"
          accept=".pdf"
          @change="handleDocumentUpload"
          class="file-input"
        />
      </div>
      <div class="business-logo-container">
        <label class="upload-label" for="businessLogo">
          <span v-if="!logoPreviewUrl">Upload Business Logo</span>
          <span v-else>Change Business Logo</span>
        </label>
        <div class="logo-preview" v-if="logoPreviewUrl">
          <img :src="logoPreviewUrl" alt="Business Logo Preview" />
        </div>
        <input
          type="file"
          id="businessLogo"
          accept="image/*"
          @change="handleLogoUpload"
          class="file-input"
        />
      </div>



      <div class="form-group">
        <label for="businessName">Business Name</label>
        <Field
          name="businessName"
          type="text"
          id="businessName"
          v-model="businessName"
          required
          :class="{ 'error': errors.businessName }"
        />
        <ErrorMessage name="businessName" class="error-message" />
      </div>
      <div class="form-group">
        <label for="industry">Industry</label>
        <Field
          name="industry"
          as="select"
          id="industry"
          v-model="industry"
          :class="{ error: errors.industry }"
          required
        >
          <option value="">Select Industry</option>
          <option
            v-for="industryOption in industries"
            :key="industryOption"
            :value="industryOption"
          >
            {{ industryOption }}
          </option>
        </Field>
        <ErrorMessage name="industry" class="error-message" />
      </div>

      <div class="form-group">
        <label for="companySize">Company Size</label>
        <Field
          name="companySize"
          as="select"
          v-model="companySize"
          :class="{ 'error': errors.companySize }"
          id="companySize"
          required
        >
          <option value="">Select Company Size</option>
          <option value="1-10">1–10 employees</option>
          <option value="11-50">11–50 employees</option>
          <option value="51-200">51–200 employees</option>
          <option value="201+">201+ employees</option>
        </Field>
        <ErrorMessage name="companySize" class="error-message" />
      </div>

      <div class="form-actions">
        <button type="button" @click="store.previousStep()" class="prev-button">
          Previous
        </button>
        <button type="submit" class="next-button">Next</button>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useOnboardingStore } from "../stores/onboarding";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as zod from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

const store = useOnboardingStore();
const emit = defineEmits(["update:businessInfo", "next", "previous"]);

const props = defineProps<{
  businessInfo: {
    companyName: string;
    industry: string;
    employees: number;
    businessLogo?: File;
    document?: File;
  };
}>();

// Mock industries data
const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Consulting",
  "Marketing",
  "Legal",
  "Real Estate",
];
const errors = ref({
  businessName: '',
  industry: '',
  companySize: '',
})
const businessName = ref(props.businessInfo.companyName);
const businessLogo = ref(props.businessInfo.businessLogo);
const logoPreviewUrl = ref<string | null>(null);
const industry = ref(props.businessInfo.industry);
const companySize = ref(
  `${props.businessInfo.employees}-${props.businessInfo.employees + 50}`
);
const document = ref(props.businessInfo.document);
const documentPreviewUrl = ref<string | null>(null);
const documentName = ref("");
const documentSize = ref("");

watch(
  () => props.businessInfo,
  (newInfo) => {
    businessName.value = newInfo.companyName;
    businessLogo.value = newInfo.businessLogo;
    industry.value = newInfo.industry;
    companySize.value = `${newInfo.employees}-${newInfo.employees + 50}`;
    document.value = newInfo.document;
  },
  { deep: true }
);

const handleLogoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    businessLogo.value = target.files[0];
    logoPreviewUrl.value = URL.createObjectURL(target.files[0]);
    emit("update:businessInfo", {
      ...props.businessInfo,
      businessLogo: target.files[0],
    });
  }
};

const handleDocumentUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    if (file.type === "application/pdf" && file.size <= 5 * 1024 * 1024) {
      document.value = file;
      documentPreviewUrl.value = URL.createObjectURL(file);
      documentName.value = file.name;
      documentSize.value = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
      emit("update:businessInfo", {
        ...props.businessInfo,
        document: file,
      });
    } else {
      alert("Please upload a PDF file that is less than 5MB");
      target.value = "";
    }
  }
};

const validationSchema = toTypedSchema(
  zod.object({
    businessName: zod.string().min(2, 'Business name must be at least 2 characters long'),
    industry: zod.string().min(2, 'Industry must be at least 2 characters long'),
    companySize: zod.enum(['1-10', '11-50', '51-200', '201+'], {
      errorMap: () => ({ message: 'Please select a company size' })
    }),
    // businessLogo: zod.optional(),
    // document: zod.optional(),
  })
);

const handleSubmit = () => {
  emit("update:businessInfo", {
    companyName: businessName.value,
    industry: industry.value,
    employees: parseInt(companySize.value.split("-")[0]) || 0,
    businessLogo: businessLogo.value,
    document: document.value,
  });
  emit("next");
};

const handlePrevious = () => {
  emit("previous");
};
</script>

<style scoped>

.error-message {
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  padding: 0.25rem;
  background-color: rgba(255, 68, 68, 0.1);
  border-radius: 4px;
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

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #42b883;
}

.business-logo-container {
  /* text-align: center; */
  margin-bottom: 2rem;
}

.logo-preview {
  width: 150px;
  height: 150px;
  margin: 0 auto 1rem;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f7fa;
}

.logo-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.document-preview {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.document-icon {
  font-size: 2rem;
  margin-right: 1rem;
  color: #42b883;
}

.document-info {
  flex: 1;
}

.document-name {
  font-weight: 500;
  color: #333;
}

.document-size {
  font-size: 0.875rem;
  color: #666;
}

.upload-label {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: #42b883;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-label:hover {
  background: #35a570;
}

.file-input {
  display: none;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.prev-button {
  background-color: #e5e7eb;
  color: #333;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.prev-button:hover {
  background-color: #d1d5db;
}

.next-button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.next-button:hover {
  background-color: #35a570;
}

@media (max-width: 768px) {
  .onboarding-step {
    padding: 1.5rem;
  }

  .logo-preview {
    width: 120px;
    height: 120px;
  }

  .document-preview {
    flex-direction: column;
    align-items: flex-start;
  }

  .document-icon {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}
</style>
