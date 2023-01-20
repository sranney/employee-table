export interface Employee {
  id: string
  DOB: string
  fullName: string
  role: string
}

// TODO: I added this because I had intentions to use them as management for showing different states to the user regarding api requests
export type RequestStatus = 'idle' | 'pending' | 'resolved' | 'rejected'
