export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
}

export enum UserGender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export interface User {
  id: string
  username: string
  pictureUrl?: string | null
  country: string
  role: UserRole
  status: UserStatus
  gender: UserGender
  email: string
  emailVerificationToken?: string | null
  emailVerifiedAt?: Date | null
  refreshToken?: string | null
  passwordResetToken?: string | null
  passwordResetExpiry?: Date | null
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export interface UserInput {
  id?: string
  username: string
  pictureUrl?: string | null
  country: string
  role?: UserRole
  status?: UserStatus
  gender: UserGender
  email?: string
  password?: string
  emailVerificationToken?: string | null
  emailVerifiedAt?: Date | null
  refreshToken?: string | null
}

export const genderLabels: Record<UserGender, string> = {
  [UserGender.MALE]: 'Masculino',
  [UserGender.FEMALE]: 'Feminino',
  [UserGender.OTHER]: 'Outro',
}
