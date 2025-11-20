import React, { useEffect, useMemo } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { useNavigate, useParams } from 'react-router'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v3'
import { Layout } from '../../../shared/components/Layout'
import { Heading, Text } from '../../../shared/components/Typography'
import { Button } from '../../../shared/components/Button'
import { Select } from '../../recipes/components/Select'
import { COLORS } from '../../../shared/styles/colors'
import {
  InventoryItemType,
  FermentableInventoryUnit,
  HopInventoryUnit,
  YeastInventoryUnit,
  CreateInventoryItemInput,
} from '../interfaces/inventory'
import {
  useAddInventoryItem,
  useUpdateInventoryItem,
} from '../hooks/useInventoryMutations'
import { getInventoryItemById } from '../api/inventoryApi'
import { useQuery } from '@tanstack/react-query'
import { useFermentablesList } from '../../fermentable/hooks/useFermentables'
import { useHopsList } from '../../hops/hooks/useHops'
import { useYeastsList } from '../../yeast/hooks/useYeasts'
import { CommonInventoryFields } from '../components/CommonInventoryFields'
import { FermentableInventoryForm } from '../components/FermentableInventoryForm'
import { HopInventoryForm } from '../components/HopInventoryForm'
import { YeastInventoryForm } from '../components/YeastInventoryForm'

const inventoryItemSchema = z
  .object({
    type: z.nativeEnum(InventoryItemType).optional(),
    quantity: z.number().optional(),
    purchaseDate: z.string().optional(),
    bestBeforeDate: z.string().optional(),
    costPerUnit: z.number().optional(),
    notes: z.string().optional(),
    fermentableId: z.string().optional(),
    unit: z.string().optional(),
    extractPotential: z.number().optional(),
    lotNumber: z.string().optional(),
    moisture: z.number().optional(),
    protein: z.number().optional(),
    hopId: z.string().optional(),
    alphaAcidsAtPurchase: z.number().optional(),
    harvestYear: z.number().optional(),
    storageCondition: z.string().optional(),
    yeastId: z.string().optional(),
    productionDate: z.string().optional(),
    viability: z.number().optional(),
    cellCount: z.number().optional(),
    starter: z.boolean().optional(),
    pitchingRate: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Selecione o tipo de item',
        path: ['type'],
      })
      return
    }

    if (!data.quantity || data.quantity <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Quantidade deve ser maior que zero',
        path: ['quantity'],
      })
    }

    if (data.type === InventoryItemType.FERMENTABLE) {
      if (!data.fermentableId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selecione um fermentável',
          path: ['fermentableId'],
        })
      }
      if (!data.unit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selecione a unidade',
          path: ['unit'],
        })
      }
    }

    if (data.type === InventoryItemType.HOP) {
      if (!data.hopId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selecione um lúpulo',
          path: ['hopId'],
        })
      }
      if (!data.unit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selecione a unidade',
          path: ['unit'],
        })
      }
    }

    if (data.type === InventoryItemType.YEAST) {
      if (!data.yeastId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selecione uma levedura',
          path: ['yeastId'],
        })
      }
      if (!data.unit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selecione a unidade',
          path: ['unit'],
        })
      }
    }
  })

export type FormData = z.infer<typeof inventoryItemSchema>

export const SaveStock = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()
  const isEditMode = !!id

  const { mutate: addItem, isPending: isAdding } = useAddInventoryItem()
  const { mutate: updateItem, isPending: isUpdating } = useUpdateInventoryItem()

  const { data: existingItem, isLoading: isLoadingItem } = useQuery({
    queryKey: ['inventory-item', id],
    queryFn: () => getInventoryItemById(id!),
    enabled: isEditMode && !!id,
  })

  const {
    control,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(inventoryItemSchema),
    mode: 'onChange',
    defaultValues: {} as FormData,
  })

  const itemType = watch('type') as InventoryItemType | undefined

  useEffect(() => {
    if (existingItem) {
      const baseData = {
        quantity: existingItem.quantity,
        purchaseDate: existingItem.purchaseDate || undefined,
        bestBeforeDate: existingItem.bestBeforeDate || undefined,
        costPerUnit: existingItem.costPerUnit || undefined,
        notes: existingItem.notes || undefined,
      }

      if (existingItem.type === InventoryItemType.FERMENTABLE) {
        const item = existingItem as {
          type: InventoryItemType.FERMENTABLE
          fermentable?: { id: string }
          unit: string
          extractPotential?: number | null
          lotNumber?: string | null
          moisture?: number | null
          protein?: number | null
        }
        reset({
          ...baseData,
          type: InventoryItemType.FERMENTABLE,
          fermentableId: item.fermentable?.id || '',
          unit: item.unit as FermentableInventoryUnit,
          extractPotential: item.extractPotential || undefined,
          lotNumber: item.lotNumber || undefined,
          moisture: item.moisture || undefined,
          protein: item.protein || undefined,
        } as FormData)
        trigger()
      } else if (existingItem.type === InventoryItemType.HOP) {
        const item = existingItem as {
          type: InventoryItemType.HOP
          hop?: { id: string }
          unit: string
          alphaAcidsAtPurchase?: number | null
          harvestYear?: number | null
          storageCondition?: string | null
        }
        reset({
          ...baseData,
          type: InventoryItemType.HOP,
          hopId: item.hop?.id || '',
          unit: item.unit as HopInventoryUnit,
          alphaAcidsAtPurchase: item.alphaAcidsAtPurchase || undefined,
          harvestYear: item.harvestYear || undefined,
          storageCondition: item.storageCondition || undefined,
        } as FormData)
        trigger()
      } else if (existingItem.type === InventoryItemType.YEAST) {
        const item = existingItem as {
          type: InventoryItemType.YEAST
          yeast?: { id: string }
          unit: string
          productionDate?: string | null
          viability?: number | null
          cellCount?: number | null
          starter?: boolean | null
          pitchingRate?: number | null
        }
        reset({
          ...baseData,
          type: InventoryItemType.YEAST,
          yeastId: item.yeast?.id || '',
          unit: item.unit as YeastInventoryUnit,
          productionDate: item.productionDate || undefined,
          viability: item.viability || undefined,
          cellCount: item.cellCount || undefined,
          starter: item.starter ?? undefined,
          pitchingRate: item.pitchingRate || undefined,
        } as FormData)
        trigger()
      }
    }
  }, [existingItem, reset, trigger])

  const { fermentables } = useFermentablesList()
  const { hops } = useHopsList()
  const { yeasts } = useYeastsList()

  const fermentableOptions = useMemo(
    () =>
      fermentables.map(f => ({
        value: f.id,
        label: f.name,
      })),
    [fermentables],
  )

  const hopOptions = useMemo(
    () =>
      hops.map(h => ({
        value: h.id,
        label: h.name,
      })),
    [hops],
  )

  const yeastOptions = useMemo(
    () =>
      yeasts.map(y => ({
        value: y.id,
        label: y.name,
      })),
    [yeasts],
  )

  const onSubmit = (data: FormData) => {
    if (!data.type) return

    const cleanData: CreateInventoryItemInput = {
      type: data.type,
      quantity: data.quantity!,
      ...(data.purchaseDate && { purchaseDate: data.purchaseDate }),
      ...(data.bestBeforeDate && { bestBeforeDate: data.bestBeforeDate }),
      ...(data.costPerUnit && { costPerUnit: data.costPerUnit }),
      ...(data.notes && { notes: data.notes }),
    } as CreateInventoryItemInput
    if (data.type === InventoryItemType.FERMENTABLE) {
      Object.assign(cleanData, {
        type: InventoryItemType.FERMENTABLE,
        fermentable: data.fermentableId!,
        unit: data.unit as FermentableInventoryUnit,
        ...(data.extractPotential && {
          extractPotential: data.extractPotential,
        }),
        ...(data.lotNumber && { lotNumber: data.lotNumber }),
        ...(data.moisture && { moisture: data.moisture }),
        ...(data.protein && { protein: data.protein }),
      })
    } else if (data.type === InventoryItemType.HOP) {
      Object.assign(cleanData, {
        type: InventoryItemType.HOP,
        hop: data.hopId!,
        unit: data.unit as HopInventoryUnit,
        ...(data.alphaAcidsAtPurchase && {
          alphaAcidsAtPurchase: data.alphaAcidsAtPurchase,
        }),
        ...(data.harvestYear && { harvestYear: data.harvestYear }),
        ...(data.storageCondition && {
          storageCondition: data.storageCondition,
        }),
      })
    } else if (data.type === InventoryItemType.YEAST) {
      Object.assign(cleanData, {
        type: InventoryItemType.YEAST,
        yeast: data.yeastId!,
        unit: data.unit as YeastInventoryUnit,
        ...(data.productionDate && { productionDate: data.productionDate }),
        ...(data.viability && { viability: data.viability }),
        ...(data.cellCount && { cellCount: data.cellCount }),
        ...(data.starter !== undefined && { starter: data.starter }),
        ...(data.pitchingRate && { pitchingRate: data.pitchingRate }),
      })
    }

    if (isEditMode && id) {
      updateItem({ itemId: id, updateData: cleanData })
    } else {
      addItem(cleanData)
    }

    navigate('/stock')
  }

  const handleCancel = () => {
    navigate('/stock')
  }

  if (isEditMode && isLoadingItem) {
    return (
      <Layout activeMenuItem="stock">
        <View style={styles.container}>
          <Text>Carregando...</Text>
        </View>
      </Layout>
    )
  }

  return (
    <Layout activeMenuItem="stock">
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Heading variant="h3" style={styles.title}>
            {isEditMode
              ? 'Editar Item do Estoque'
              : 'Adicionar Item ao Estoque'}
          </Heading>
        </View>

        <View style={styles.form}>
          <View style={styles.section}>
            <Controller
              control={control}
              name="type"
              rules={{ required: 'Selecione o tipo de item' }}
              render={({ field: { value, onChange } }) => (
                <Select
                  label="Tipo de Item *"
                  placeholder="Selecione o tipo"
                  value={value || ''}
                  options={[
                    {
                      value: InventoryItemType.FERMENTABLE,
                      label: 'Fermentável',
                    },
                    { value: InventoryItemType.HOP, label: 'Lúpulo' },
                    { value: InventoryItemType.YEAST, label: 'Levedura' },
                  ]}
                  onSelect={value => {
                    onChange(value as InventoryItemType)
                    reset({ type: value as InventoryItemType } as FormData)
                  }}
                  error={!!errors.type}
                  errorMessage={errors.type?.message}
                  disabled={isEditMode}
                />
              )}
            />
          </View>

          {itemType === InventoryItemType.FERMENTABLE && (
            <FermentableInventoryForm
              control={control}
              errors={errors}
              fermentableOptions={fermentableOptions}
            />
          )}

          {itemType === InventoryItemType.HOP && (
            <HopInventoryForm
              control={control}
              errors={errors}
              hopOptions={hopOptions}
            />
          )}

          {itemType === InventoryItemType.YEAST && (
            <YeastInventoryForm
              control={control}
              errors={errors}
              yeastOptions={yeastOptions}
            />
          )}

          {itemType && (
            <CommonInventoryFields control={control} errors={errors} />
          )}

          <View style={styles.actions}>
            <Button variant="ghost" size="medium" onPress={handleCancel}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="medium"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || !itemType || isAdding || isUpdating}
            >
              {isAdding || isUpdating
                ? 'Salvando...'
                : isEditMode
                  ? 'Atualizar'
                  : 'Adicionar'}
            </Button>
          </View>
        </View>
      </ScrollView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  form: {
    gap: 16,
  },
  section: {
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border.light,
  },
})
