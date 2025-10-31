import { ImageBackground, View, StyleSheet } from 'react-native'
import { AuthCard } from '../components/AuthCard'
import bgImage from '../../../assets/bg-malt-master.jpg'
import { Heading, Text } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'
import { BiEnvelope } from 'react-icons/bi'
import { Button } from '../../../shared/components/Button'
import { useNavigate, useSearchParams } from 'react-router'

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || 'seu.email@exemplo.com'
  const navigate = useNavigate()

  return (
    <ImageBackground
      source={{ uri: bgImage }}
      style={styles.container}
      resizeMode="cover"
    >
      <AuthCard>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <BiEnvelope size={64} color={COLORS.brand.primary} />
          </View>

          <Heading variant="h3" style={styles.title}>
            Verifique seu e-mail!
          </Heading>

          <Text variant="body" style={styles.description}>
            Enviamos um link de verificação para o endereço de e-mail{' '}
            <Text variant="body" style={styles.email}>
              {email}
            </Text>
            .
          </Text>

          <View style={styles.instructionsList}>
            <View style={styles.instructionItem}>
              <Text variant="bodySmall" style={styles.bullet}>
                •
              </Text>
              <Text variant="bodySmall" style={styles.instructionText}>
                Verifique sua caixa de spam ou lixo eletrônico.
              </Text>
            </View>

            <View style={styles.instructionItem}>
              <Text variant="bodySmall" style={styles.bullet}>
                •
              </Text>
              <Text variant="bodySmall" style={styles.instructionText}>
                Aguarde alguns minutos. Às vezes, leva um tempo.
              </Text>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <Button
              variant="ghost"
              onPress={() => navigate('/sign-in')}
              style={styles.linkButton}
            >
              Já verifiquei meu e-mail, ir para login
            </Button>
          </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    width: '100%',
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    color: COLORS.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  email: {
    color: COLORS.brand.primary,
    fontWeight: '600',
  },
  instructionsList: {
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bullet: {
    color: COLORS.text.secondary,
    fontSize: 16,
    lineHeight: 20,
  },
  instructionText: {
    flex: 1,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    width: '100%',
  },
  linkButton: {
    width: '100%',
  },
})
