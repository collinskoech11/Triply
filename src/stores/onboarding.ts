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
  state: () => {
    const savedState = localStorage.getItem('onboardingState')
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      // Ensure isSubmitted is a boolean
      return {
        ...parsedState,
        isSubmitted: !!parsedState.isSubmitted
      }
    }
    return {
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
      isSubmitted: false,
      isLoading: false,
      error: null as string | null
    }
  },

  actions: {
    saveToLocalStorage() {
      localStorage.setItem('onboardingState', JSON.stringify(this.$state))
      console.log("Saved to local storage", localStorage.getItem('onboardingState'))
    },

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
      this.isSubmitted = false
      this.isLoading = false
      this.error = null
      this.saveToLocalStorage()
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
        this.saveToLocalStorage()
      }
    },

    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--
        this.saveToLocalStorage()
      }
    },

    submitData() {
      this.isLoading = true
      // Add your submission logic here
      setTimeout(() => {
        this.isSubmitted = true
        this.isLoading = false
        this.saveToLocalStorage()
      }, 3000)
    },

    updatePersonalInfo(info: PersonalInfo) {
      this.personalInfo = info
      this.saveToLocalStorage()
    },

    updateBusinessInfo(info: BusinessInfo) {
      this.businessInfo = info
      this.saveToLocalStorage()
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
          this.saveToLocalStorage()
        } else {
          this.isLoading = false
          this.error = 'Invalid verification code'
          toast.error('Invalid verification code')
          this.saveToLocalStorage()
        }
      }, 1000)
    }
  }
})
