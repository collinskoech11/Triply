import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { personalInfoSchema, businessInfoSchema } from '../types'
import { z } from 'zod'

const toast = useToast();

interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  profilePicture?: string
  password: string
  confirmPassword: string
}

interface BusinessInfo {
  companyName: string
  industry: string
  employees: number
  businessLogo?: string
  website: string
  description: string
  address: string
}

interface OnboardingState {
  currentStep: number
  personalInfo: PersonalInfo
  businessInfo: BusinessInfo
  isVerified: boolean
  isSubmitted: boolean
  isLoading: boolean
  error: string | null
}

export const useOnboardingStore = defineStore('onboarding', {
  state: () => ({
    currentStep: 1,
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      profilePicture: '',
      password: '',
      confirmPassword: ''
    },
    businessInfo: {
      companyName: '',
      industry: '',
      employees: 0,
      businessLogo: '',
      website: '',
      description: '',
      address: ''
    },
    isVerified: false,
    isLoading: false,
    error: null as string | null
  }),

  actions: {
    reset() {
      this.currentStep = 1
      this.personalInfo = {
        fullName: '',
        email: '',
        phone: '',
        profilePicture: '',
        password: '',
        confirmPassword: ''
      }
      this.businessInfo = {
        companyName: '',
        industry: '',
        employees: 0,
        businessLogo: '',
        website: '',
        description: '',
        address: ''
      }
      this.isVerified = false
      this.isLoading = false
      this.error = null
    },

    validatePersonalInfo(info: any) {
      try {
        personalInfoSchema.parse(info)
        return true
      } catch (err) {
        if (err instanceof z.ZodError) {
          const errors = err.errors.reduce((acc, error) => {
            acc[error.path[0]] = error.message
            return acc
          }, {} as Record<string, string>)
          this.error = Object.values(errors).join('\n')
          toast.error(this.error)
        }
        return false
      }
    },

    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++
      }
    },

    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },

    submitData() {
      this.isLoading = true
      // Add your submission logic here
      setTimeout(() => {
        this.isSubmitted = true
        this.isLoading = false
      }, 1000)
    },

    updatePersonalInfo(info: PersonalInfo) {
      this.personalInfo = info
    },

    updateBusinessInfo(info: BusinessInfo) {
      this.businessInfo = info
    },

    verifyIdentity(code: string) {
      console.log(code, "(*&*^&*^")
      this.isLoading = true
      this.error = null
      
      // Simulate verification process
      setTimeout(() => {
        if (code === '123456') { // Example valid code
          this.isVerified = true
          this.isLoading = false
          this.error = null
          toast.success('Identity verified successfully!')
        } else {
          this.isLoading = false
          this.error = 'Invalid verification code'
          toast.error('Invalid verification code')
        }
      }, 1000)
    }
  }
})
