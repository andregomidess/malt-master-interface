import { ImageBackground, View, StyleSheet } from 'react-native'
import { AuthCard } from '../components/AuthCard'
import { Heading } from '../../../shared/components/Typography'
import { Image } from 'react-native'
import logoImage from '../../../assets/logo2.png'
import bgImage from '../../../assets/bg-malt-master.jpg'
import { COLORS } from '../../../shared/styles/colors'
import {
  ChangePasswordForm,
  ChangePasswordFormType,
} from '../components/ChangePasswordForm'
import { useChangePassword } from '../hooks/useChangePassword'
import { useParams } from 'react-router'

export const ChangePassword = () => {
  const { mutate } = useChangePassword()
  const { token } = useParams()

  const handleSubmit = (data: ChangePasswordFormType) =>
    mutate({
      token: token ?? '',
      newPassword: data.password,
    })

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
            <Heading variant="h2" style={{ color: COLORS.brand.primary }}>
              MaltMaster
            </Heading>
          </View>
          <Heading variant="h4" style={{ color: COLORS.text.primary }}>
            Alterar senha
          </Heading>
        </View>
        <ChangePasswordForm onSubmit={handleSubmit} />
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
})
