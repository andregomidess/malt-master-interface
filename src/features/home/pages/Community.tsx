import { View, StyleSheet } from 'react-native'
import { Layout } from '../../../shared/components/Layout'
import { Heading } from '../../../shared/components/Typography'
import { COLORS } from '../../../shared/styles/colors'

export const Community = () => {
  return (
    <Layout activeMenuItem="community">
      <View style={styles.container}>
        <Heading variant="h3" style={styles.title}>
          Comunidade
        </Heading>
      </View>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
})

