import React from 'react'
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { COLORS } from '../../../shared/styles/colors'
import { Heading } from '../../../shared/components/Typography'
import { BiX } from 'react-icons/bi'

interface ModalProps {
  visible: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export const RecipeModal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Heading variant="h5" style={styles.title}>
              {title}
            </Heading>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <BiX size={24} color={COLORS.text.secondary} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: COLORS.neutral.white,
    borderRadius: 12,
    width: '100%',
    maxWidth: 600,
    maxHeight: '80%',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.light,
  },
  title: {
    color: COLORS.text.primary,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
})
