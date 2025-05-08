import { z } from 'zod'

// Personal Information Schema
export const personalInfoSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  profilePicture: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters')
})

// Business Information Schema
export const businessInfoSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  industry: z.string().min(2, 'Industry is required'),
  employees: z.number().min(1, 'Number of employees must be at least 1'),
  businessLogo: z.string().optional(),
  // website: z.string().optional().url('Invalid website URL'),
  description: z.string().min(10, 'Description must be at least 10 characters').optional(),
  address: z.string().min(5, 'Address is required')
})

// Verification Schema
export const verificationSchema = z.object({
  verificationCode: z.string().length(6, 'Verification code must be 6 digits')
})

// Combined Onboarding Schema
export const onboardingSchema = z.object({
  personalInfo: personalInfoSchema,
  businessInfo: businessInfoSchema
})

// Type exports
export type PersonalInfo = z.infer<typeof personalInfoSchema>
export type BusinessInfo = z.infer<typeof businessInfoSchema>
export type Verification = z.infer<typeof verificationSchema>
export type OnboardingData = z.infer<typeof onboardingSchema>
