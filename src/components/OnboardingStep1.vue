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
    if (file.type === "image/jpeg" || file.type === "image/png" && file.size <= 2 * 1024 * 1024) {
      toast.success("Document validated");
    } else {
      toast.error("Please upload a valid image file that is less than 2MB");
    }
    
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

</style>
