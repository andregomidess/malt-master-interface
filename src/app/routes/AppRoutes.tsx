import { BrowserRouter, Route, Routes } from 'react-router'
import { SignIn } from '../../features/auth/pages/SignIn'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        {/* <Route path="/" element={<Home />} /> */}
      </Routes>
    </BrowserRouter>
  )
}
