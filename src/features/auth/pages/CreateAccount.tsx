import { ImageBackground, View } from 'react-native'
import { AuthCard } from '../components/AuthCard'
import bgImage from '../../../assets/bg-malt-master.jpg'
import { StyleSheet } from 'react-native'
import { Heading } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import logoImage from '../../../assets/logo2.png'
import { Image } from 'react-native'
import {
  CreateAccountForm,
  CreateAccountFormData,
} from '../components/CreateAccountForm'
import { useCreateAccount } from '../hooks/useCreateAccount'
export const CreateAccount = () => {
  const { mutate } = useCreateAccount()

  const handleSubmit = (body: CreateAccountFormData) => mutate(body)

  return (
    <ImageBackground
      source={{ uri: bgImage }}
      style={styles.container}
      resizeMode="cover"
    >
      <AuthCard>
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Image source={{ uri: logoImage }} style={styles.logoImage} />
            <Heading variant="h2" style={styles.logo}>
              MaltMaster
            </Heading>
          </View>
          <Heading variant="h4" style={{ color: COLORS.text.primary }}>
            Crie sua conta
          </Heading>
        </View>

        <CreateAccountForm onSubmitRequest={handleSubmit} />
      </AuthCard>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEFEFD',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    rowGap: 16,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logoImage: {
    width: 55,
    height: 55,
  },
  logo: {
    color: '#D58300',
  },
})
