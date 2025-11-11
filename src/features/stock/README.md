# Feature: Inventário/Estoque (Stock)

## Descrição
Esta feature gerencia o inventário de insumos cervejeiros do usuário, incluindo fermentáveis, lúpulos e leveduras.

## Estrutura de Arquivos

```
stock/
├── api/
│   └── inventoryApi.ts         # Cliente da API para chamadas ao backend
├── components/
│   ├── StockCard.tsx            # Card individual de item do estoque
│   └── StockStats.tsx           # Estatísticas gerais do estoque
├── hooks/
│   ├── index.ts                 # Exportações dos hooks
│   ├── useInventory.ts          # Hook para buscar inventário completo
│   ├── useInventoryStats.ts     # Hook para estatísticas
│   ├── useInventoryItems.ts     # Hook para buscar itens
│   ├── useSearchInventory.ts    # Hook para busca de itens
│   ├── useInventoryMutations.ts # Hooks para criar/atualizar/remover itens
│   └── useInfiniteInventoryItems.ts # Hook com scroll infinito
├── interfaces/
│   └── inventory.ts             # Tipos TypeScript para inventário
├── pages/
│   └── ListStock.tsx            # Página principal de listagem
└── data/
    └── mockStockData.ts         # Dados mockados (deprecado)
```

## Hooks Disponíveis

### Queries (React Query)

#### `useInventory()`
Busca o inventário completo do usuário com todos os itens organizados por tipo.

```typescript
const { data, isLoading, error } = useInventory()
```

#### `useInventoryStats()`
Busca estatísticas do inventário (total de itens, valor total, itens próximos ao vencimento, etc).

```typescript
const { data: stats, isLoading } = useInventoryStats()
```

#### `useInventoryItems()`
Busca todos os itens do inventário como uma lista plana.

```typescript
const { data: items, isLoading } = useInventoryItems()
```

#### `useInventoryItemsByType(type)`
Busca itens filtrados por tipo específico.

```typescript
const { data: fermentables } = useInventoryItemsByType(InventoryItemType.FERMENTABLE)
```

#### `useSearchInventory(searchTerm)`
Busca itens por termo de pesquisa.

```typescript
const { data: results } = useSearchInventory('cascade')
```

#### `useInfiniteInventoryItems(filterType, searchQuery)` 🌟
Hook principal com scroll infinito e paginação do lado do cliente.

```typescript
const {
  items,              // Itens carregados até o momento
  totalItems,         // Total de itens disponíveis
  isLoading,          // Estado de carregamento inicial
  fetchNextPage,      // Função para carregar próxima página
  hasMore,            // Indica se há mais itens para carregar
  isFetchingNextPage  // Estado de carregamento da próxima página
} = useInfiniteInventoryItems('all', '')
```

### Mutations (React Query)

#### `useAddInventoryItem()`
Adiciona um novo item ao inventário.

```typescript
const addItem = useAddInventoryItem()

addItem.mutate({
  type: InventoryItemType.HOP,
  hopId: 'hop-id',
  quantity: 100,
  unit: HopInventoryUnit.G,
  // ... outros campos
})
```

#### `useUpdateInventoryItem()`
Atualiza um item existente.

```typescript
const updateItem = useUpdateInventoryItem()

updateItem.mutate({
  itemId: 'item-id',
  updateData: {
    quantity: 150,
    notes: 'Nova observação'
  }
})
```

#### `useUpdateItemQuantity()`
Atualiza apenas a quantidade de um item.

```typescript
const updateQuantity = useUpdateItemQuantity()

updateQuantity.mutate({
  itemId: 'item-id',
  quantity: 50
})
```

#### `useRemoveInventoryItem()`
Remove um item do inventário.

```typescript
const removeItem = useRemoveInventoryItem()

removeItem.mutate('item-id')
```

## Endpoints da API

Todos os endpoints estão em `/inventory`:

- `GET /inventory` - Retorna inventário completo com itens
- `GET /inventory/stats` - Retorna estatísticas do inventário
- `GET /inventory/items` - Retorna todos os itens
- `GET /inventory/items/type/:type` - Retorna itens por tipo
- `GET /inventory/items/expiring` - Retorna itens próximos ao vencimento
- `GET /inventory/items/expired` - Retorna itens vencidos
- `GET /inventory/search?search=term` - Busca itens por termo
- `POST /inventory/items` - Adiciona novo item
- `PATCH /inventory/items/:id` - Atualiza item
- `PATCH /inventory/items/:id/quantity` - Atualiza quantidade
- `DELETE /inventory/items/:id` - Remove item

## Tipos de Itens

### Fermentáveis (Fermentable)
- Maltes
- Açúcares
- Adjuntos

Propriedades específicas:
- `extractPotential`: Potencial de extração
- `moisture`: Umidade
- `protein`: Proteína
- `lotNumber`: Número do lote
- `isQualityAcceptable`: Se a qualidade está aceitável (calculado)

### Lúpulos (Hop)
Propriedades específicas:
- `alphaAcidsAtPurchase`: Alfa ácidos na compra
- `harvestYear`: Ano da colheita
- `storageCondition`: Condição de armazenamento
- `currentAlphaAcids`: Alfa ácidos atuais (calculado com degradação)
- `isStillFresh`: Se ainda está fresco (calculado)

### Leveduras (Yeast)
Propriedades específicas:
- `productionDate`: Data de produção
- `viability`: Viabilidade inicial
- `cellCount`: Contagem de células
- `currentViability`: Viabilidade atual (calculado com degradação)
- `needsStarter`: Se precisa de starter (calculado)

## Propriedades Calculadas (Calculadas no Backend)

Todas as propriedades computadas são calculadas no **backend** e enviadas na resposta da API:

### Propriedades Básicas (todos os itens):
- `totalValue`: Valor total (quantidade × custo por unidade)
- `isExpired`: Se está vencido
- `isNearExpiry`: Se está próximo ao vencimento (≤30 dias)
- `daysUntilExpiry`: Dias até o vencimento

### Propriedades Específicas:

**Fermentáveis:**
- `isQualityAcceptable`: Qualidade aceitável (umidade ≤15%, proteína ≤13%)
- `adjustedExtractPotential`: Potencial de extração ajustado pela umidade

**Lúpulos:**
- `currentAlphaAcids`: Alfa ácidos atuais (calculado com degradação)
- `isStillFresh`: Se ainda está fresco baseado no armazenamento

**Leveduras:**
- `currentViability`: Viabilidade atual (calculado com degradação)
- `needsStarter`: Se precisa de starter (viabilidade <80%)
- `currentCellCount`: Contagem de células viáveis atuais

## Scroll Infinito

A implementação de scroll infinito funciona da seguinte forma:

1. O backend retorna todos os itens de uma vez
2. O hook `useInfiniteInventoryItems` implementa paginação do lado do cliente
3. Carrega itens em lotes de 12 por vez
4. Aplica filtros e busca do lado do cliente
5. Detecta quando o usuário chega ao final do scroll e carrega mais itens

## Filtros Disponíveis

- **Todos**: Mostra todos os itens
- **Fermentáveis**: Apenas fermentáveis
- **Lúpulos**: Apenas lúpulos
- **Leveduras**: Apenas leveduras

## Busca

A busca filtra itens pelo nome do produto (fermentável, lúpulo ou levedura).

## Estados de Carregamento

- Loading inicial: Mostra "Carregando itens..."
- Loading de próxima página: Mostra "Carregando mais itens..." no final da lista
- Fim dos itens: Mostra "X de Y itens carregados"
- Estado vazio: Mostra mensagem apropriada

## Tratamento de Erros

Todos os hooks incluem tratamento de erros com:
- Toast notifications para feedback ao usuário
- Mensagens de erro descritivas
- Estados de erro para exibição na UI

## Cache e Revalidação

- Stale time: 5 minutos (dados são considerados "frescos" por 5 minutos)
- Invalidação automática após mutações (adicionar/atualizar/remover)
- Recarregamento automático em background quando os dados ficam "stale"

## Próximos Passos

- [ ] Implementar modal/formulário para adicionar items
- [ ] Implementar modal/formulário para editar items
- [ ] Adicionar filtros adicionais (vencidos, próximos ao vencimento)
- [ ] Adicionar ordenação (por nome, data, valor)
- [ ] Implementar paginação real no backend para otimização
- [ ] Adicionar gráficos e visualizações
- [ ] Exportar relatórios de inventário

