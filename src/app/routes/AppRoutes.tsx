import { BrowserRouter, Route, Routes } from 'react-router'
import { SignIn } from '../../features/auth/pages/SignIn'
import { CreateAccount } from '../../features/auth/pages/CreateAccount'
import { ForgotPassword } from '../../features/auth/pages/ForgotPassword'
import { VerifyEmail } from '../../features/auth/pages/VerifyEmail'
import { ChangePassword } from '../../features/auth/pages/ChangePassword'
import { Home } from '../../features/home/pages/Home'
import { ListRecipes } from '../../features/recipes/pages/ListRecipes'
import { ListBrewing } from '../../features/brewing/pages/ListBrewing'
import { ListStock } from '../../features/stock/pages/ListStock'
import { ListYeast } from '../../features/yeast/pages/ListYeast'
import { ListReviews } from '../../features/reviews/pages/ListReviews'
import { Community } from '../../features/community/pages/Community'
import { Profile } from '../../features/profile/pages/Profile'
import { ListEquipment } from '../../features/equipment/pages/ListEquipment'
import { ListHops } from '../../features/hops/pages/ListHops'
import { ListFermentable } from '../../features/malt/pages/ListFermentable'
import { ListWater } from '../../features/water/pages/ListWater'
import { ListBeerStyle } from '../../features/beer-style/pages/ListBeerStyle'

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
        <Route path="/brewings" element={<ListBrewing />} />
        <Route path="/stock" element={<ListStock />} />
        <Route path="/equipment" element={<ListEquipment />} />
        <Route path="/hops" element={<ListHops />} />
        <Route path="/fermentable" element={<ListFermentable />} />
        <Route path="/yeast" element={<ListYeast />} />
        <Route path="/water" element={<ListWater />} />
        <Route path="/reviews" element={<ListReviews />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/beer-styles" element={<ListBeerStyle />} />
      </Routes>
    </BrowserRouter>
  )
}
