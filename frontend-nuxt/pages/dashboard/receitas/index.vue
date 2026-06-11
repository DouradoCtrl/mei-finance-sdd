<template>
  <div class="p-6 space-y-6 max-w-6xl mx-auto">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl font-bold text-gray-950 dark:text-white">Fluxo de Caixa</h1>
        <p class="text-xs text-gray-400 mt-0.5">
          Organize e classifique seus lançamentos bancários PJ e PF de forma ágil.
        </p>
      </div>
      <UButton 
        icon="i-heroicons-arrow-up-tray"
        color="emerald"
        class="text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-lg"
        @click="openImportModal"
      >
        Importar OFX
      </UButton>
    </div>

    <!-- Filters and Tabs -->
    <div class="flex flex-col gap-4">
      <!-- Main tabs with active underlines -->
      <div class="flex gap-4 border-b border-gray-100 dark:border-zinc-800/80 overflow-x-auto select-none">
        <button
          v-for="tab in mainTabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          class="pb-2.5 px-1 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap"
          :class="[
            activeTab === tab.value
              ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold'
              : 'border-transparent text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Secondary segmented tabs for source selection -->
      <div class="flex bg-gray-100/60 dark:bg-zinc-800/50 p-1 rounded-lg self-start">
        <button
          v-for="src in sourceTabs"
          :key="src.value"
          @click="activeSource = src.value"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all"
          :class="[
            activeSource === src.value
              ? 'bg-white dark:bg-zinc-900 text-gray-950 dark:text-white shadow-sm'
              : 'text-gray-400 dark:text-zinc-500 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          <UIcon :name="src.icon" class="h-3.5 w-3.5 shrink-0" />
          {{ src.label }}
        </button>
      </div>
    </div>

    <!-- KPI Bento Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UCard 
        v-for="kpi in kpiConfig" 
        :key="kpi.label" 
        :ui="{ 
          base: 'overflow-hidden border border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 shadow-none rounded-xl',
          body: { padding: 'p-4 flex flex-col gap-1 items-center text-center' } 
        }"
      >
        <div class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 select-none">
          <UIcon :name="kpi.icon" class="size-4 shrink-0" :class="kpi.iconColor" />
          <span>{{ kpi.label }}</span>
        </div>
        <div 
          class="text-2xl font-semibold tracking-tight mt-1 font-mono"
          :class="kpi.valueClass || 'text-gray-900 dark:text-white'"
        >
          R$ {{ formatCurrency(kpi.value) }}
        </div>
      </UCard>
    </div>

    <!-- Transactions Section -->
    <UCard 
      :ui="{ 
        base: 'overflow-hidden border border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 shadow-none rounded-xl',
        header: { padding: 'p-4 border-b border-gray-100 dark:border-zinc-800/80 bg-gray-50/20 dark:bg-zinc-900/10' },
        body: { padding: 'p-0' }
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white">Lançamentos Conciliados</h3>
            <p class="text-[10px] text-gray-400 font-mono mt-0.5">Valores persistidos no banco de dados</p>
          </div>
        </div>
      </template>

      <!-- UTable component -->
      <UTable 
        :rows="filteredHistory" 
        :columns="columns" 
        :loading="fetchLoading"
        :ui="{
          thead: 'bg-gray-50/50 dark:bg-zinc-900/50 border-b border-gray-100 dark:border-zinc-800/80',
          th: { 
            base: 'text-left rtl:text-right',
            color: 'text-gray-400 dark:text-zinc-500',
            font: 'font-semibold text-[10px] uppercase tracking-wider'
          },
          td: { 
            base: 'whitespace-nowrap',
            color: 'text-gray-600 dark:text-zinc-300',
            font: 'text-xs'
          }
        }"
      >
        <!-- Date Column Slot -->
        <template #transaction_date-data="{ row }">
          <span class="font-mono text-gray-400">{{ formatDate(row.transaction_date) }}</span>
        </template>

        <!-- Description Column Slot -->
        <template #description-data="{ row }">
          <div class="flex flex-col">
            <span class="font-medium text-gray-950 dark:text-white">{{ row.description }}</span>
            <span v-if="row.fit_id" class="text-[9px] text-gray-400 dark:text-zinc-500 font-mono mt-0.5">FITID: {{ row.fit_id }}</span>
          </div>
        </template>

        <!-- Amount Column Slot -->
        <template #amount-data="{ row }">
          <span class="font-mono font-semibold" :class="row.amount > 0 ? 'text-emerald-500' : 'text-rose-500'">
            {{ row.amount > 0 ? '+' : '' }}R$ {{ formatCurrency(row.amount) }}
          </span>
        </template>

        <!-- Classification Actions Slot -->
        <template #classification-data="{ row }">
          <div class="flex gap-1 justify-center">
            <UButton
              size="xs"
              :variant="row.classification === 'business_pj' ? 'solid' : 'outline'"
              color="emerald"
              class="font-bold text-[10px] px-2"
              @click="reclassifySaved(row.id, 'business_pj')"
            >
              PJ
            </UButton>
            <UButton
              size="xs"
              :variant="row.classification === 'personal_pf' ? 'solid' : 'outline'"
              color="sky"
              class="font-bold text-[10px] px-2"
              @click="reclassifySaved(row.id, 'personal_pf')"
            >
              PF
            </UButton>
            <UButton
              size="xs"
              :variant="row.classification === 'transfer' ? 'solid' : 'outline'"
              color="gray"
              class="font-bold text-[10px] px-2"
              @click="reclassifySaved(row.id, 'transfer')"
            >
              Neutro
            </UButton>
          </div>
        </template>

        <!-- Actions Column Slot -->
        <template #actions-data="{ row }">
          <div class="flex justify-center">
            <UButton
              size="xs"
              color="red"
              variant="ghost"
              icon="i-heroicons-trash"
              class="hover:bg-red-50 dark:hover:bg-red-950/20"
              @click="openDeleteDialog(row.id)"
            />
          </div>
        </template>

        <!-- Empty State Slot -->
        <template #empty-state>
          <div class="p-10 text-center select-none">
            <UIcon name="i-heroicons-inbox" class="h-6 w-6 text-gray-300 dark:text-zinc-700 mx-auto mb-2" />
            <p class="text-xs text-gray-400">Nenhum lançamento registrado para estes filtros.</p>
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Import OFX Modal -->
    <UModal v-slot="{ close }" v-model="isImportModalOpen" prevent-close :ui="{ width: 'sm:max-w-2xl md:max-w-3xl' }">
      <div class="flex flex-col max-h-[85vh] overflow-hidden bg-white dark:bg-zinc-950 border border-gray-100 dark:border-zinc-800/80 rounded-xl shadow-xl">
        <!-- Header -->
        <div class="p-5 border-b border-gray-100 dark:border-zinc-800/80 flex justify-between items-center shrink-0">
          <div>
            <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Conciliação de Extrato</h3>
            <p class="text-[10px] text-gray-400 mt-0.5">
              Origem: <span class="font-bold text-gray-700 dark:text-zinc-300 font-mono">{{ activeSource === 'checking_account' ? 'CONTA CORRENTE' : 'CARTÃO DE CRÉDITO' }}</span>
            </p>
          </div>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="close" />
        </div>

        <!-- Scrollable Body -->
        <div class="p-5 overflow-y-auto flex-1">
          <!-- Dropzone file upload -->
          <div v-if="tempTransactions.length === 0" class="py-4 space-y-4">
            <div 
              class="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center gap-2.5 transition-colors cursor-pointer select-none"
              :class="[isDragging ? 'border-emerald-500 bg-emerald-50/10' : 'border-gray-200 dark:border-zinc-800 bg-gray-50/30 dark:bg-zinc-900/10 hover:border-emerald-300']"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
              @click="triggerFileInput"
            >
              <UIcon name="i-heroicons-cloud-arrow-up" class="h-8 w-8 text-gray-400" />
              <p class="text-xs text-gray-500">
                Arraste seu arquivo .ofx aqui ou 
                <span class="text-emerald-500 font-semibold underline">procure nos seus arquivos</span>
              </p>
              <input ref="fileInput" type="file" accept=".ofx" class="hidden" @change="handleFileChange" />
              
              <span v-if="file" class="text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 px-2.5 py-1 rounded text-emerald-600 dark:text-emerald-400 mt-2">
                {{ file.name }}
              </span>
            </div>

            <UButton 
              block 
              color="emerald" 
              class="text-xs font-semibold uppercase tracking-wider py-2"
              :loading="importLoading" 
              :disabled="!file"
              @click="handleUploadOFX"
            >
              Processar Extrato
            </UButton>
          </div>

          <!-- Temp classification table -->
          <div v-else class="space-y-4">
            <div class="border border-gray-100 dark:border-zinc-800/80 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
              <UTable 
                :rows="tempTransactions" 
                :columns="tempColumns"
                :ui="{
                  thead: 'bg-gray-50/50 dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800/80',
                  th: { font: 'font-semibold text-[10px] uppercase tracking-wider' },
                  td: { font: 'text-xs' }
                }"
              >
                <template #transaction_date-data="{ row }">
                  <span class="font-mono text-gray-400">{{ formatDate(row.transaction_date) }}</span>
                </template>

                <template #description-data="{ row }">
                  <div class="flex flex-col">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="font-medium text-gray-950 dark:text-white">{{ row.description }}</span>
                      <span v-if="row.is_duplicate" class="inline-flex items-center gap-1 px-1 py-0.5 rounded text-[9px] font-bold bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                        Duplicada
                      </span>
                    </div>
                  </div>
                </template>

                <template #amount-data="{ row }">
                  <span class="font-mono font-semibold" :class="row.amount > 0 ? 'text-emerald-500' : 'text-rose-500'">
                    {{ row.amount > 0 ? '+' : '' }}R$ {{ formatCurrency(row.amount) }}
                  </span>
                </template>

                <template #classification-data="{ row, index }">
                  <div class="flex gap-1 justify-center">
                    <UButton
                      size="xs"
                      :color="row.classification === 'business_pj' ? 'emerald' : 'gray'"
                      :variant="row.classification === 'business_pj' ? 'solid' : 'outline'"
                      class="font-bold text-[9px] px-1.5"
                      @click="classifyTemp(index, 'business_pj')"
                    >
                      PJ
                    </UButton>
                    <UButton
                      size="xs"
                      :color="row.classification === 'personal_pf' ? 'sky' : 'gray'"
                      :variant="row.classification === 'personal_pf' ? 'solid' : 'outline'"
                      class="font-bold text-[9px] px-1.5"
                      @click="classifyTemp(index, 'personal_pf')"
                    >
                      PF
                    </UButton>
                    <UButton
                      size="xs"
                      :color="row.classification === 'transfer' ? 'gray' : 'gray'"
                      :variant="row.classification === 'transfer' ? 'solid' : 'outline'"
                      class="font-bold text-[9px] px-1.5"
                      @click="classifyTemp(index, 'transfer')"
                    >
                      Neutro
                    </UButton>
                  </div>
                </template>
              </UTable>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-5 border-t border-gray-100 dark:border-zinc-800/80 flex justify-end gap-3 bg-gray-50/50 dark:bg-zinc-900/20 shrink-0">
          <UButton color="gray" variant="ghost" class="text-xs uppercase tracking-wider" @click="close">
            Cancelar
          </UButton>
          <UButton 
            v-if="tempTransactions.length > 0"
            color="emerald"
            class="text-xs font-semibold uppercase tracking-wider"
            icon="i-heroicons-check-circle"
            :loading="confirmLoading"
            @click="handleConfirmImport"
          >
            Confirmar Fechamento
          </UButton>
        </div>
      </div>
    </UModal>

    <!-- Delete Confirmation Modal (Dupla Confirmação) -->
    <UModal v-model="isDeleteDialogOpen" :ui="{ width: 'sm:max-w-[360px]' }">
      <div class="p-6 text-center select-none bg-white dark:bg-zinc-950 rounded-xl border border-gray-100 dark:border-zinc-800/80">
        <div class="w-11 h-11 rounded-full bg-red-50 dark:bg-red-950/20 text-red-500 flex items-center justify-center mx-auto mb-3">
          <UIcon name="i-heroicons-exclamation-triangle" class="size-6 animate-pulse" />
        </div>
        
        <h4 class="text-sm font-semibold text-gray-900 dark:text-white">Excluir Lançamento?</h4>
        <p class="text-[11px] text-gray-400 dark:text-zinc-500 mt-1.5 leading-relaxed">
          Você está prestes a excluir esta transação permanentemente. Esta ação atualizará seus relatórios e removerá os dados do servidor.
        </p>
        
        <div class="mt-5 flex gap-2.5">
          <UButton 
            color="gray" 
            variant="ghost" 
            block 
            class="flex-1 text-xs font-semibold uppercase tracking-wider py-2" 
            @click="isDeleteDialogOpen = false"
          >
            Cancelar
          </UButton>
          <UButton 
            color="red" 
            block 
            class="flex-1 text-xs font-semibold uppercase tracking-wider py-2" 
            @click="confirmDelete"
          >
            Confirmar
          </UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const activeTab = ref<'business_pj' | 'personal_pf' | 'transfer' | 'pending'>('business_pj')
const activeSource = ref<'checking_account' | 'credit_card'>('checking_account')

const isImportModalOpen = ref(false)
const file = ref<File | null>(null)
const isDragging = ref(false)

const fileInput = ref<HTMLInputElement | null>(null)

const isDeleteDialogOpen = ref(false)
const transactionToDelete = ref<number | null>(null)

// Load state from composable
const {
  history,
  tempTransactions,
  fetchLoading,
  importLoading,
  confirmLoading,
  fetchHistory,
  uploadOFX,
  classifyTemp,
  confirmImport,
  reclassifySaved,
  deleteSaved
} = useTransactions()

const mainTabs = [
  { label: 'Pendentes', value: 'pending' },
  { label: 'Pessoa Jurídica (PJ)', value: 'business_pj' },
  { label: 'Pessoa Física (PF)', value: 'personal_pf' },
  { label: 'Neutro / Transferências', value: 'transfer' }
]

const sourceTabs = [
  { label: 'Conta Corrente', value: 'checking_account', icon: 'i-heroicons-wallet' },
  { label: 'Cartão de Crédito', value: 'credit_card', icon: 'i-heroicons-credit-card' }
]

// UTable configuration columns
const columns = [
  { key: 'transaction_date', label: 'Data', sortable: true },
  { key: 'description', label: 'Descrição' },
  { key: 'amount', label: 'Valor', sortable: true },
  { key: 'classification', label: 'Classificação', align: 'center' },
  { key: 'actions', label: '', align: 'center' }
]

const tempColumns = [
  { key: 'transaction_date', label: 'Data' },
  { key: 'description', label: 'Descrição' },
  { key: 'amount', label: 'Valor' },
  { key: 'classification', label: 'Classificação', align: 'center' }
]

// Filter data
const filteredHistory = computed(() => {
  return history.value.filter(
    (tx) => tx.source === activeSource.value && tx.classification === activeTab.value
  )
})

// Calculations for dynamic KPI config
const kpis = computed(() => {
  let faturamento = 0
  let gastos = 0

  filteredHistory.value.forEach((tx) => {
    if (tx.amount > 0) {
      faturamento += tx.amount
    } else {
      gastos += Math.abs(tx.amount)
    }
  })

  return {
    faturamento,
    gastos,
    lucro: faturamento - gastos
  }
})

const kpiConfig = computed(() => {
  let labelFat = 'Faturamento (PJ)'
  let labelGas = 'Gastos (PJ)'
  let labelLuc = 'Lucro Líquido'

  if (activeTab.value === 'personal_pf') {
    labelFat = 'Entradas (PF)'
    labelGas = 'Saídas (PF)'
    labelLuc = 'Saldo (PF)'
  } else if (activeTab.value === 'transfer') {
    labelFat = 'Entradas (Neutro)'
    labelGas = 'Saídas (Neutro)'
    labelLuc = 'Saldo (Neutro)'
  } else if (activeTab.value === 'pending') {
    labelFat = 'Entradas (Pendentes)'
    labelGas = 'Saídas (Pendentes)'
    labelLuc = 'Saldo (Pendente)'
  }

  return [
    {
      label: labelFat,
      value: kpis.value.faturamento,
      icon: 'i-heroicons-arrow-up-circle',
      iconColor: 'text-emerald-500'
    },
    {
      label: labelGas,
      value: kpis.value.gastos,
      icon: 'i-heroicons-arrow-down-circle',
      iconColor: 'text-rose-500'
    },
    {
      label: labelLuc,
      value: kpis.value.lucro,
      icon: 'i-heroicons-scale',
      iconColor: kpis.value.lucro >= 0 ? 'text-emerald-500' : 'text-rose-500',
      valueClass: kpis.value.lucro >= 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'
    }
  ]
})

// Triggering OFX upload triggers
const openImportModal = () => {
  tempTransactions.value = []
  file.value = null
  isImportModalOpen.value = true
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    file.value = target.files[0]
  }
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
    file.value = e.dataTransfer.files[0]
  }
}

const handleUploadOFX = async () => {
  if (!file.value) return
  const success = await uploadOFX(activeSource.value, file.value)
  if (!success) {
    file.value = null
  }
}

const handleConfirmImport = async () => {
  const success = await confirmImport()
  if (success) {
    isImportModalOpen.value = false
  }
}

// Delete confirmations dialog
const openDeleteDialog = (id: number) => {
  transactionToDelete.value = id
  isDeleteDialogOpen.value = true
}

const confirmDelete = async () => {
  if (transactionToDelete.value === null) return
  const id = transactionToDelete.value
  isDeleteDialogOpen.value = false
  transactionToDelete.value = null
  await deleteSaved(id)
}

// Format utilities
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return dateStr.split('-').reverse().join('/')
}

const formatCurrency = (val: number) => {
  return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

onMounted(() => {
  fetchHistory()
})
</script>
