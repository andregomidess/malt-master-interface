/** Receita considerada “completa” (não rascunho) para persistência e listagem. */
export function computeRecipeIsDraft(recipe: {
  beerStyle: { id?: string } | null | undefined
  equipment: { id?: string } | null | undefined
  finalVolume: number | null | undefined
  fermentables: { fermentableId: string; amount: number }[]
}): boolean {
  const hasStyle = Boolean(recipe.beerStyle?.id)
  const hasEquipment = Boolean(recipe.equipment?.id)
  const hasVolume = recipe.finalVolume != null && recipe.finalVolume > 0
  const hasFermentables = recipe.fermentables.some(
    f => Boolean(f.fermentableId?.trim()) && f.amount > 0,
  )
  return !(hasStyle && hasEquipment && hasVolume && hasFermentables)
}

/** Itens ausentes para uma brassagem planejada (lúpulo e levedura são opcionais). */
export function getBrewReadinessMessages(recipe: {
  name: string
  equipment: { id?: string } | null | undefined
  finalVolume: number | null | undefined
  fermentables: { fermentableId: string; amount: number }[]
  waters: { waterId: string; amount: number }[]
  mash: { mashProfileId?: string } | null | undefined
}): string[] {
  const msgs: string[] = []
  if (!recipe.name?.trim()) {
    msgs.push('nome da receita')
  }
  if (!recipe.equipment?.id) {
    msgs.push('equipamento')
  }
  if (recipe.finalVolume == null || recipe.finalVolume <= 0) {
    msgs.push('volume final')
  }
  if (!recipe.fermentables.some(f => f.fermentableId?.trim() && f.amount > 0)) {
    msgs.push('pelo menos um fermentável com quantidade')
  }
  if (!recipe.waters.some(w => w.waterId?.trim() && w.amount >= 0)) {
    msgs.push('água (perfil e volume)')
  }
  if (!recipe.mash?.mashProfileId) {
    msgs.push('perfil de mostura')
  }
  return msgs
}
