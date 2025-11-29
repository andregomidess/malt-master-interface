import { BrowserRouter, Route, Routes } from 'react-router'
import { SignIn } from '../../features/auth/pages/SignIn'
import { CreateAccount } from '../../features/auth/pages/CreateAccount'
import { ForgotPassword } from '../../features/auth/pages/ForgotPassword'
import { VerifyEmail } from '../../features/auth/pages/VerifyEmail'
import { ChangePassword } from '../../features/auth/pages/ChangePassword'
import { Home } from '../../features/home/pages/Home'
import { ListRecipes } from '../../features/recipes/pages/ListRecipes'
import { SaveRecipes } from '../../features/recipes/pages/SaveRecipes'
import { ListBrewing } from '../../features/brewing/pages/ListBrewing'
import { SaveBrewing } from '../../features/brewing/pages/SaveBrewing'
import { BrewSession } from '../../features/brewing/pages/BrewSession'
import { ListStock } from '../../features/stock/pages/ListStock'
import { SaveStock } from '../../features/stock/pages/SaveStock'
import { ListYeast } from '../../features/yeast/pages/ListYeast'
import { SaveYeast } from '../../features/yeast/pages/SaveYeast'
import { ListReviews } from '../../features/reviews/pages/ListReviews'
import { SaveReviews } from '../../features/reviews/pages/SaveReviews'
import { Community } from '../../features/community/pages/Community'
import { Profile } from '../../features/profile/pages/Profile'
import { EditProfile } from '../../features/profile/pages/EditProfile'
import { ListEquipment } from '../../features/equipment/pages/ListEquipment'
import { SaveEquipment } from '../../features/equipment/pages/SaveEquipment'
import { ListHops } from '../../features/hops/pages/ListHops'
import { SaveHops } from '../../features/hops/pages/SaveHops'

import { ListWater } from '../../features/water/pages/ListWater'
import { SaveWater } from '../../features/water/pages/SaveWater'
import { ListBeerStyle } from '../../features/beer-style/pages/ListBeerStyle'
import { SaveBeerStyle } from '../../features/beer-style/pages/SaveBeerStyle'
import { GuardRoute } from '../../shared/components/GuardRoute'
import { ListFermentable } from '../../features/fermentable/pages/ListFermentable'
import { SaveFermentable } from '../../features/fermentable/pages/SaveFermentable'
import { ListCarbonationProfile } from '../../features/profiles/pages/ListCarbonationProfile'
import { SaveCarbonationProfile } from '../../features/profiles/pages/SaveCarbonationProfile'
import { ListFermentationProfile } from '../../features/profiles/pages/ListFermentationProfile'
import { SaveFermentationProfile } from '../../features/profiles/pages/SaveFermentationProfile'
import { ListMashProfile } from '../../features/profiles/pages/ListMashProfile'
import { SaveMashProfile } from '../../features/profiles/pages/SaveMashProfile'
import { useParams } from 'react-router'

const BrewSessionWrapper = () => {
  const { id } = useParams<{ id: string }>()
  if (!id) return null
  return <BrewSession batchId={id} />
}

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
          path="/recipes/new"
          element={
            <GuardRoute>
              <SaveRecipes />
            </GuardRoute>
          }
        />
        <Route
          path="/recipes/:id/edit"
          element={
            <GuardRoute>
              <SaveRecipes />
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
          path="/brewings/new"
          element={
            <GuardRoute>
              <SaveBrewing />
            </GuardRoute>
          }
        />
        <Route
          path="/brewings/:id/edit"
          element={
            <GuardRoute>
              <SaveBrewing />
            </GuardRoute>
          }
        />
        <Route
          path="/brewings/:id/session"
          element={
            <GuardRoute>
              <BrewSessionWrapper />
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
          path="/stock/new"
          element={
            <GuardRoute>
              <SaveStock />
            </GuardRoute>
          }
        />
        <Route
          path="/stock/:id/edit"
          element={
            <GuardRoute>
              <SaveStock />
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
          path="/equipment/new"
          element={
            <GuardRoute>
              <SaveEquipment />
            </GuardRoute>
          }
        />
        <Route
          path="/equipment/:id/edit"
          element={
            <GuardRoute>
              <SaveEquipment />
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
          path="/hops/new"
          element={
            <GuardRoute>
              <SaveHops />
            </GuardRoute>
          }
        />
        <Route
          path="/hops/:id/edit"
          element={
            <GuardRoute>
              <SaveHops />
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
          path="/fermentable/new"
          element={
            <GuardRoute>
              <SaveFermentable />
            </GuardRoute>
          }
        />
        <Route
          path="/fermentable/:id/edit"
          element={
            <GuardRoute>
              <SaveFermentable />
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
          path="/yeast/new"
          element={
            <GuardRoute>
              <SaveYeast />
            </GuardRoute>
          }
        />
        <Route
          path="/yeast/:id/edit"
          element={
            <GuardRoute>
              <SaveYeast />
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
          path="/water/new"
          element={
            <GuardRoute>
              <SaveWater />
            </GuardRoute>
          }
        />
        <Route
          path="/water/:id/edit"
          element={
            <GuardRoute>
              <SaveWater />
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
          path="/reviews/new"
          element={
            <GuardRoute>
              <SaveReviews />
            </GuardRoute>
          }
        />
        <Route
          path="/reviews/:id/edit"
          element={
            <GuardRoute>
              <SaveReviews />
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
          path="/profile/edit"
          element={
            <GuardRoute>
              <EditProfile />
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
        <Route
          path="/beer-styles/new"
          element={
            <GuardRoute>
              <SaveBeerStyle />
            </GuardRoute>
          }
        />
        <Route
          path="/beer-styles/:id/edit"
          element={
            <GuardRoute>
              <SaveBeerStyle />
            </GuardRoute>
          }
        />
        <Route
          path="/carbonation-profiles"
          element={
            <GuardRoute>
              <ListCarbonationProfile />
            </GuardRoute>
          }
        />
        <Route
          path="/carbonation-profiles/new"
          element={
            <GuardRoute>
              <SaveCarbonationProfile />
            </GuardRoute>
          }
        />
        <Route
          path="/carbonation-profiles/:id/edit"
          element={
            <GuardRoute>
              <SaveCarbonationProfile />
            </GuardRoute>
          }
        />
        <Route
          path="/fermentation-profiles"
          element={
            <GuardRoute>
              <ListFermentationProfile />
            </GuardRoute>
          }
        />
        <Route
          path="/fermentation-profiles/new"
          element={
            <GuardRoute>
              <SaveFermentationProfile />
            </GuardRoute>
          }
        />
        <Route
          path="/fermentation-profiles/:id/edit"
          element={
            <GuardRoute>
              <SaveFermentationProfile />
            </GuardRoute>
          }
        />
        <Route
          path="/mash-profiles"
          element={
            <GuardRoute>
              <ListMashProfile />
            </GuardRoute>
          }
        />
        <Route
          path="/mash-profiles/new"
          element={
            <GuardRoute>
              <SaveMashProfile />
            </GuardRoute>
          }
        />
        <Route
          path="/mash-profiles/:id/edit"
          element={
            <GuardRoute>
              <SaveMashProfile />
            </GuardRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
