import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/vue'
import '@vitest/expect'
import { createPinia } from 'pinia'
import { useOnboardingStore } from '@/stores/onboarding'
import OnboardingStep1 from '@/components/OnboardingStep1.vue'

// Mock the toast notification
vi.mock('vue-toast-notification', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}))

// Mock the vee-validate components
vi.mock('vee-validate', () => ({
  Form: vi.fn(),
  Field: vi.fn(),
  ErrorMessage: vi.fn(),
  useField: vi.fn().mockReturnValue({ setValue: vi.fn() }),
}))

// Mock the useFetch
vi.mock('@vueuse/core', () => ({
  useFetch: vi.fn().mockReturnValue({ data: { value: [] } }),
}))

describe('OnboardingStep1', () => {
  let store
  let pinia

  beforeEach(() => {
    pinia = createPinia()
    store = useOnboardingStore()
  })

  const renderComponent = (props = {}) => {
    return render(OnboardingStep1, {
      props: {
        personalInfo: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '1234567890',
          profilePicture: ''
        }
      }
    })
  }

  it('renders personal information form', () => {
    renderComponent()
    expect(screen.getByText('Personal Information')).toBeInTheDocument()
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument()
  })

  it('initializes form values from props', () => {
    renderComponent()
    const fullNameInput = screen.getByLabelText(/Full Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    const phoneInput = screen.getByLabelText(/Phone/i)

    expect(fullNameInput).toHaveValue('John Doe')
    expect(emailInput).toHaveValue('john@example.com')
    expect(phoneInput).toHaveValue('1234567890')
  })

  it('handles file upload and validates image', async () => {
    const { getByLabelText } = renderComponent()
    const fileInput = getByLabelText(/Profile Picture/i)
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' })

    await fireEvent.change(fileInput, { target: { files: [file] } })
    
    expect(vi.mocked(toast.success).mock.calls.length).toBe(1)
    expect(vi.mocked(toast.success).mock.calls[0][0]).toBe('Document validated')
  })

  it('emits update:personalInfo when form is submitted', async () => {
    const { emitted } = renderComponent()
    const submitButton = screen.getByRole('button', { name: /Save/i })

    await fireEvent.click(submitButton)

    expect(emitted()['update:personalInfo']).toBeTruthy()
    expect(emitted()['next']).toBeTruthy()
  })

  it('validates form inputs', async () => {
    const { getByLabelText, getByRole } = renderComponent()

    // Clear all inputs
    const fullNameInput = getByLabelText(/Full Name/i)
    const emailInput = getByLabelText(/Email/i)
    const phoneInput = getByLabelText(/Phone/i)

    await fireEvent.change(fullNameInput, { target: { value: '' } })
    await fireEvent.change(emailInput, { target: { value: 'invalid' } })
    await fireEvent.change(phoneInput, { target: { value: '123' } })

    const submitButton = getByRole('button', { name: /Save/i })
    await fireEvent.click(submitButton)

    // Check error messages
    const errorMessages = screen.getAllByText(/error/i, { exact: false })
    expect(errorMessages.length).toBe(3)
    expect(errorMessages[0]).toHaveTextContent(/Full name must be at least 2 characters long/i)
    expect(errorMessages[1]).toHaveTextContent(/Invalid email address/i)
    expect(errorMessages[2]).toHaveTextContent(/Phone number must be at least 10 characters long/i)
  })
})
