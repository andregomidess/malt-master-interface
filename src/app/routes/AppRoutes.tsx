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
import { GuardRoute } from '../../shared/components/GuardRoute'

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/change-password" element={<ChangePassword />} />

        <Route
          path="/"
          element={
            <GuardRoute>
              <Home />
            </GuardRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <GuardRoute>
              <Home />
            </GuardRoute>
          }
        />
        <Route
          path="/recipes"
          element={
            <GuardRoute>
              <ListRecipes />
            </GuardRoute>
          }
        />
        <Route
          path="/brewings"
          element={
            <GuardRoute>
              <ListBrewing />
            </GuardRoute>
          }
        />
        <Route
          path="/stock"
          element={
            <GuardRoute>
              <ListStock />
            </GuardRoute>
          }
        />
        <Route
          path="/equipment"
          element={
            <GuardRoute>
              <ListEquipment />
            </GuardRoute>
          }
        />
        <Route
          path="/hops"
          element={
            <GuardRoute>
              <ListHops />
            </GuardRoute>
          }
        />
        <Route
          path="/fermentable"
          element={
            <GuardRoute>
              <ListFermentable />
            </GuardRoute>
          }
        />
        <Route
          path="/yeast"
          element={
            <GuardRoute>
              <ListYeast />
            </GuardRoute>
          }
        />
        <Route
          path="/water"
          element={
            <GuardRoute>
              <ListWater />
            </GuardRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <GuardRoute>
              <ListReviews />
            </GuardRoute>
          }
        />
        <Route
          path="/community"
          element={
            <GuardRoute>
              <Community />
            </GuardRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <GuardRoute>
              <Profile />
            </GuardRoute>
          }
        />
        <Route
          path="/beer-styles"
          element={
            <GuardRoute>
              <ListBeerStyle />
            </GuardRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
