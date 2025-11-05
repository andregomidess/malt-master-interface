import { BrowserRouter, Route, Routes } from 'react-router'
import { SignIn } from '../../features/auth/pages/SignIn'
import { CreateAccount } from '../../features/auth/pages/CreateAccount'
import { ForgotPassword } from '../../features/auth/pages/ForgotPassword'
import { VerifyEmail } from '../../features/auth/pages/VerifyEmail'
import { ChangePassword } from '../../features/auth/pages/ChangePassword'
import { Home } from '../../features/home/pages/Home'
import { ListRecipes } from '../../features/recipes/pages/ListRecipes'
import { Brewings } from '../../features/home/pages/Brewings'
import { ListStock } from '../../features/stock/pages/ListStock'
import { Hops } from '../../features/home/pages/Hops'
import { Malt } from '../../features/home/pages/Malt'
import { Yeast } from '../../features/home/pages/Yeast'
import { Water } from '../../features/home/pages/Water'
import { Reviews } from '../../features/home/pages/Reviews'
import { Community } from '../../features/home/pages/Community'
import { Profile } from '../../features/home/pages/Profile'
import { ListEquipment } from '../../features/equipment/pages/ListEquipment'

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
        <Route path="/dashboard" element={<Home />} />
        <Route path="/recipes" element={<ListRecipes />} />
        <Route path="/brewings" element={<Brewings />} />
        <Route path="/stock" element={<ListStock />} />
        <Route path="/equipment" element={<ListEquipment />} />
        <Route path="/hops" element={<Hops />} />
        <Route path="/malt" element={<Malt />} />
        <Route path="/yeast" element={<Yeast />} />
        <Route path="/water" element={<Water />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}
