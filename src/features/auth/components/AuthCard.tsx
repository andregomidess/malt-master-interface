import { View, StyleSheet } from 'react-native'

export const AuthCard = ({ children }: { children: React.ReactNode }) => {
  return <View style={styles.container}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: '#fff',
    width: 440,
    height: 520,
    paddingVertical: 40,
    alignItems: 'center',
    shadowColor: '#171a1f',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
})
