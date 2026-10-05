
export const mockUser = {
  firstName: 'Joy',
  lastName: 'Oyeledun',
  email: 'joy@example.com',
  phone: '08012345678',
  customerSince: '15 June 2025',
}

export const mockApplication = {
  id: 'DM-IPPIS-000123',
  completedSteps: 4,
  totalSteps: 6,
  lastSaved: '18 June 2025, 10:42 AM',
  nextStep: 'Upload Documents',
  nextStepPath: '/apply/documents',
  amount: '750000',
  dateStarted: '15 June 2025',
  lastUpdated: '18 June 2025',
  dateSubmitted: '18 June 2025',
  statusUpdated: '20 June 2025',
}

export const mockHistory = [
  {
    title: 'Under Review',
    time: '20 June 2025 · 09:15 AM',
    description: 'Your application is being reviewed by our loan team.',
    done: false,
  },
  {
    title: 'Application Submitted',
    time: '18 June 2025 · 11:06 AM',
    description: 'Your application was received successfully.',
    done: true,
  },
  {
    title: 'Application Started',
    time: '15 June 2025 · 03:40 PM',
    description: 'You started an IPPIS Loan Application.',
    done: true,
  },
  {
    title: 'Account Created',
    time: '15 June 2025 · 03:22 PM',
    description: 'Your Dominion Merchant account was created.',
    done: true,
  },
]

export const fullName = `${mockUser.firstName} ${mockUser.lastName}`
export const initials = `${mockUser.firstName[0]}${mockUser.lastName[0]}`.toUpperCase()
