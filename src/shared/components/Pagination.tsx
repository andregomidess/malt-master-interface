import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from './Typography'
import { COLORS } from '../styles/colors'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage?: number
  onPageChange: (page: number) => void
  itemLabel?: string // Ex: "estilo", "receita", "lúpulo"
  itemLabelPlural?: string // Ex: "estilos", "receitas", "lúpulos"
}

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 20,
  onPageChange,
  itemLabel = 'item',
  itemLabelPlural = 'itens',
}: PaginationProps) => {
  if (totalPages <= 1) {
    return null
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page)
    }
  }

  // Calcular quais páginas mostrar
  const getVisiblePages = () => {
    const pages: number[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      // Mostrar todas as páginas se houver poucas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Sempre mostrar primeira página
      pages.push(1)

      // Calcular início e fim do range central
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Ajustar se estiver muito próximo do início
      if (currentPage <= 3) {
        start = 2
        end = Math.min(4, totalPages - 1)
      }

      // Ajustar se estiver muito próximo do fim
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - 3)
        end = totalPages - 1
      }

      // Adicionar "..." antes do range se necessário
      if (start > 2) {
        pages.push(-1) // -1 representa "..."
      }

      // Adicionar páginas do range central
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Adicionar "..." depois do range se necessário
      if (end < totalPages - 1) {
        pages.push(-2) // -2 representa "..."
      }

      // Sempre mostrar última página
      pages.push(totalPages)
    }

    return pages
  }

  const visiblePages = getVisiblePages()
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <View style={styles.container}>
      {/* Botões de navegação e números de página */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.paginationButtonDisabled,
          ]}
          onPress={handlePrevious}
          disabled={currentPage === 1}
        >
          <BiChevronLeft
            size={20}
            color={
              currentPage === 1 ? COLORS.text.secondary : COLORS.text.primary
            }
          />
          <Text
            style={[
              styles.paginationButtonText,
              currentPage === 1 && styles.paginationButtonTextDisabled,
            ]}
          >
            Anterior
          </Text>
        </TouchableOpacity>

        <View style={styles.paginationPages}>
          {visiblePages.map((page, index) => {
            if (page === -1 || page === -2) {
              // Renderizar "..."
              return (
                <Text
                  key={`ellipsis-${index}`}
                  style={styles.paginationEllipsis}
                >
                  ...
                </Text>
              )
            }

            return (
              <TouchableOpacity
                key={page}
                style={[
                  styles.paginationPageButton,
                  currentPage === page && styles.paginationPageButtonActive,
                ]}
                onPress={() => handlePageClick(page)}
              >
                <Text
                  style={[
                    styles.paginationPageText,
                    currentPage === page && styles.paginationPageTextActive,
                  ]}
                >
                  {page}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === totalPages && styles.paginationButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={currentPage === totalPages}
        >
          <Text
            style={[
              styles.paginationButtonText,
              currentPage === totalPages && styles.paginationButtonTextDisabled,
            ]}
          >
            Próxima
          </Text>
          <BiChevronRight
            size={20}
            color={
              currentPage === totalPages
                ? COLORS.text.secondary
                : COLORS.text.primary
            }
          />
        </TouchableOpacity>
      </View>

      {/* Informação de paginação */}
      <View style={styles.paginationInfo}>
        <Text style={styles.paginationInfoText}>
          Página {currentPage} de {totalPages} • Mostrando {startItem}-{endItem}{' '}
          de {totalItems} {totalItems === 1 ? itemLabel : itemLabelPlural}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 16,
    flexWrap: 'wrap',
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: COLORS.neutral.white,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  paginationButtonTextDisabled: {
    color: COLORS.text.secondary,
  },
  paginationPages: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
  },
  paginationEllipsis: {
    fontSize: 14,
    color: COLORS.text.secondary,
    paddingHorizontal: 4,
  },
  paginationPageButton: {
    minWidth: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: COLORS.neutral.white,
    borderWidth: 1,
    borderColor: COLORS.border.light,
  },
  paginationPageButtonActive: {
    backgroundColor: COLORS.brand.primary,
    borderColor: COLORS.brand.primary,
  },
  paginationPageText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary,
  },
  paginationPageTextActive: {
    color: COLORS.neutral.white,
    fontWeight: '600',
  },
  paginationInfo: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  paginationInfoText: {
    fontSize: 13,
    color: COLORS.text.secondary,
  },
})
