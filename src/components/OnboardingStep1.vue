<template>
  <div class="onboarding-step">
    <h2>Personal Information</h2>
    <Form :validation-schema="validationSchema" @submit="handleSubmit" class="form-container">
      <div class="form-group">
        <div v-if="previewUrl" class="preview-container">
          <img :src="previewUrl" alt="Profile Preview" />
        </div>
        <label for="profilePicture">Profile Picture</label>
        <Field
          name="profilePicture"
          type="file"
          id="profilePicture"
          accept="image/*"
          @change="handleFileUpload"
        />
        <ErrorMessage name="profilePicture" class="error-message" />
      </div>

      <div class="form-group">
        <label for="fullName">Full Name</label>
        <Field
          name="fullName"
          type="text"
          id="fullName"
          v-model="fullName"
          placeholder="Enter your full name"
          :class="{ 'error': errors.fullName }"
        />
        <ErrorMessage name="fullName" class="error-message" />
      </div>
      
      <div class="form-group">
        <label for="email">Email</label>
        <Field
          name="email"
          type="email"
          id="email"
          v-model="email"
          placeholder="Enter your email"
          :class="{ 'error': errors.email }"
        />
        <ErrorMessage name="email" class="error-message" />
      </div>
      
      <div class="form-group">
        <label for="phone">Phone</label>
        <Field
          name="phone"
          type="tel"
          id="phone"
          v-model="phone"
          placeholder="Enter your phone number"
          :class="{ 'error': errors.phone }"
        />
        <ErrorMessage name="phone" class="error-message" />
      </div>



      <div class="form-buttons">
        <button type="submit">Save</button>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { personalInfoSchema } from '../types'
import * as zod from 'zod';
import { useField, Form, Field, ErrorMessage } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { useFetch } from '@vueuse/core'

const props = defineProps<{
  personalInfo: {
    fullName: string
    email: string
    phone: string
    profilePicture: string
  }
}>()

const industries = ref([])

const fetchIndustries = async () => {
  try {
    const { data } = await useFetch('/api/industries/products').json()
    industries.value = data.value
  } catch (error) {
    console.log(error, "(*(*&))")
  }
}

const emit = defineEmits(['update:personalInfo', 'next'])

// Initialize reactive properties with default values
const fullName = ref('')
const email = ref('')
const phone = ref('')
const previewUrl = ref<string | null>(null)
const errors = ref({
  fullName: '',
  email: '',
  phone: ''
})

// Initialize form with prop values
onMounted(async () => {
  await fetchIndustries()
  if (props.personalInfo) {
    fullName.value = props.personalInfo.fullName
    email.value = props.personalInfo.email
    phone.value = props.personalInfo.phone
    if (props.personalInfo.profilePicture) {
      previewUrl.value = props.personalInfo.profilePicture
    }
  }
})

// Watch for prop changes
watch(() => props.personalInfo, (newInfo) => {
  if (newInfo) {
    fullName.value = newInfo.fullName
    email.value = newInfo.email
    phone.value = newInfo.phone
    if (newInfo.profilePicture) {
      previewUrl.value = newInfo.profilePicture
    }
  }
}, { deep: true, immediate: true })

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    
    previewUrl.value = URL.createObjectURL(file)
    
    const reader = new FileReader()
    reader.onload = () => {
      const base64String = reader.result as string
      
      const field = useField('profilePicture')
      field.setValue(base64String)
      
      emit('update:personalInfo', {
        ...props.personalInfo,
        profilePicture: base64String
      })
    }
    reader.readAsDataURL(file)
  }
}

const isFormValid = computed(() => {
  return personalInfoSchema.safeParse({
    fullName: fullName.value,
    email: email.value,
    phone: phone.value,
    profilePicture: previewUrl.value || '',
  }).success
})

const validationSchema = toTypedSchema(
  zod.object({
    fullName: zod.string().min(2, 'Full name must be at least 2 characters long'),
    email: zod.string().email('Invalid email address'),
    phone: zod.string().min(10, 'Phone number must be at least 10 characters long'),
    // profilePicture: zod.optional()
  })
);

const handleSubmit = () => {
  emit('update:personalInfo', {
    fullName: fullName.value,
    email: email.value,
    phone: phone.value,
    profilePicture: previewUrl.value || '',
  })
  emit('next')
}
</script>

<style scoped>
.onboarding-step {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.form-container {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #42b883;
}

.form-group input.error {
  border-color: #ff4444;
  background-color: rgba(255, 68, 68, 0.1);
}

.form-group input.error:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.2);
}

.error-message {
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  padding: 0.25rem;
  background-color: rgba(255, 68, 68, 0.1);
  border-radius: 4px;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

button:not(:disabled) {
  background-color: #42b883;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:not(:disabled):hover {
  background-color: #38a169;
}

button:disabled {
  background-color: #a0cfa0;
  cursor: not-allowed;
  color: #666;
}

.profile-picture-container {
  text-align: center;
  margin-bottom: 2rem;
}

.preview-container {
  width: 150px;
  height: 150px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
}

.profile-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-input {
  display: none;
}
/* 
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
} */

.form-input:focus {
  outline: none;
  border-color: #42b883;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
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
  
  .profile-picture-container {
    margin-bottom: 1.5rem;
  }
  
  .preview-container {
    width: 120px;
    height: 120px;
  }
}
</style>
