import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from 'react-native'
import { AuthCard } from '../components/AuthCard'
import { SignInForm, SignInFormType } from '../components/SignInForm'
import logoImage from '../../../assets/logo2.png'
import bgImage from '../../../assets/bg-malt-master.jpg'
import { Heading, Text } from '../../../shared/components/Typography'
import { useSignIn } from '../hooks/useSignIn'
import { FONT_FAMILY } from '../../../shared/styles/typography'
import { COLORS } from '../../../shared/styles/colors'
import { useNavigate } from 'react-router'

export const SignIn = () => {
  const { mutate } = useSignIn()

  const navigate = useNavigate()

  const handleSubmit = (body: SignInFormType) => mutate(body)

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
          <Heading variant="h4" style={styles.title}>
            Bem-vindo de volta!
          </Heading>
        </View>

        <SignInForm onSubmit={handleSubmit} />

        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigate('/create-account')}>
            <Text style={styles.signupLink}>Criar conta</Text>
          </TouchableOpacity>
        </View>
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
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  logoImage: {
    width: 55,
    height: 55,
  },
  logo: {
    color: '#D58300',
  },
  title: {
    color: '#171a1f',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.primary,
    paddingHorizontal: 12,
    color: COLORS.text.tertiary,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.primary,
    color: COLORS.text.secondary,
  },
  signupLink: {
    fontSize: 14,
    fontFamily: FONT_FAMILY.primary,
    fontWeight: '600',
    color: COLORS.brand.primary,
  },
})
