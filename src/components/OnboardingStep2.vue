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
        <Field
          name="document"
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
        <Field
          name="businessLogo"
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
          :class="`form-input ${errors.businessName ? 'error' : ''}`"
          />
          <!-- :class="{ 'error': errors.businessName }" -->
        <ErrorMessage name="businessName" class="error-message" />
      </div>
      <div class="form-group">
        <label for="industry">Industry</label>
        <Field
          name="industry"
          as="select"
          id="industry"
          v-model="industry"
          :class="`form-input ${errors.industry ? 'error' : ''}`"
          required
        >
          <option value="">Select Industry</option>
          <option
            v-for="industryOption in industries"
            :key="industryOption.id"
            :value="industryOption.name"
          >
            {{ industryOption.name }}
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
          :class="`form-input ${errors.companySize ? 'error' : ''}`"
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
        <button type="button" @click="store.previousStep()" class="prev-button" style="background-color: #f5f7fa;
  color: #333; border: 1px solid #ddd;">
          Previous
        </button>
        <button type="submit" class="next-button" :disabled="isLoading">
          <LoadingSpinner v-if="isLoading" message="Processing..." />
          <span v-else>Save</span>
        </button>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useOnboardingStore } from "../stores/onboarding";
import { useField, Form, Field, ErrorMessage } from "vee-validate";
import * as zod from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import LoadingSpinner from './reusable/LoadingSpinner.vue';
import { useFetch } from '@vueuse/core'
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast();

const store = useOnboardingStore();
const emit = defineEmits(["update:businessInfo", "next", "previous"]);
const industries = ref([])

const fetchIndustries = async () => {
    const { data } = await useFetch('/api/industries/products').json()
    industries.value = data.value
    if (!data.value) {
      toast.error("failed to fetch industries")
    }
}
const props = defineProps<{
  businessInfo: {
    companyName: string;
    industry: string;
    employees: number;
    businessLogo?: File;
    document?: File;
  };
}>();

const isLoading = ref(false);
const industriesz = [
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
fetchIndustries()
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
// onMounted(async () => {
//   await fetchIndustries()
// })
const handleLogoUpload = async (event: Event) => {
  await fetchIndustries()
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0]
    logoPreviewUrl.value = URL.createObjectURL(file);
    if (file.type === "image/jpeg" || file.type === "image/png" && file.size <= 2 * 1024 * 1024) {
      toast.success("Document validated");
    } else {
      toast.error("Please upload a valid image file that is less than 2MB");
    }
    const reader = new FileReader()
    reader.onload = () => {
      const base64String = reader.result as string
      
      const field = useField('businessLogo')
      field.setValue(base64String)
      
      emit('update:businessInfo', {
        ...props.businessInfo,
        businessLogo: base64String
      })
    }
    reader.readAsDataURL(file)
  }
};

const handleDocumentUpload = async (event: Event) => {
  await fetchIndustries()
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];

    documentPreviewUrl.value = URL.createObjectURL(file);
    documentName.value = file.name;
    documentSize.value = `${(file.size / 1024 / 1024).toFixed(2)} MB`;

    if (file.type === "application/pdf" && file.size <= 5 * 1024 * 1024) {
      toast.success("Document validated");
    } else {
      toast.error("Please upload a PDF file that is less than 5MB");
    }

    const reader = new FileReader()
    reader.onload = () => {
      const base64String = reader.result as string
      
      const field = useField('document')
      field.setValue(base64String)
      
      emit('update:businessInfo', {
        ...props.businessInfo,
        document: base64String
      })
    }
    reader.readAsDataURL(file)
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

const handleSubmit = async (values: any) => {
  isLoading.value = true;
  
  // Simulate loading for 3 seconds
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Update store with form values
  store.updateBusinessInfo({
    companyName: values.businessName,
    industry: values.industry,
    employees: parseInt(values.companySize.split('-')[0]),
    businessLogo: props.businessInfo.businessLogo,
    document: props.businessInfo.document,
    documentName: documentName.value,
    documentSize: documentSize.value,
  });
  
  // Emit next step
  emit('next');
  
  isLoading.value = false;
};

const handlePrevious = () => {
  emit("previous");
};
</script>