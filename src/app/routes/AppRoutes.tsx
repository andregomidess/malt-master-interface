import { BrowserRouter, Route, Routes } from 'react-router'
import { SignIn } from '../../features/auth/pages/SignIn'
import { CreateAccount } from '../../features/auth/pages/CreateAccount'
import { ForgotPassword } from '../../features/auth/pages/ForgotPassword'
import { VerifyEmail } from '../../features/auth/pages/VerifyEmail'
import { ChangePassword } from '../../features/auth/pages/ChangePassword'
import { Home } from '../../features/home/pages/Home'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
