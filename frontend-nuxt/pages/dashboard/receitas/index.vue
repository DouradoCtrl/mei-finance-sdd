<template>
  <main class="flex-1 p-6 space-y-6 max-w-6xl w-full mx-auto">
    <!-- Cabeçalho da Página com Título e Botão de Ação -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-gray-950 dark:text-white">Receitas e Fluxo de Caixa</h1>
        <p class="text-sm text-gray-500 mt-1">
          Acompanhe seu faturamento, controle despesas e faça conciliações rápidas via extrato.
        </p>
      </div>
      <UButton 
        icon="i-heroicons-cloud-arrow-up"
        class="flex items-center gap-2 font-medium"
        @click="openImportModal"
      >
        Importar Extrato OFX
      </UButton>
    </div>

    <!-- Abas Principais (Pendentes vs PJ vs PF vs Neutro) -->
    <div class="border-b border-gray-200 dark:border-zinc-800 flex gap-4 overflow-x-auto">
      <button
        v-for="tab in mainTabs"
        :key="tab.value"
        @click="activeTab = tab.value"
        class="pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap"
        :class="[
          activeTab === tab.value
            ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
            : 'border-transparent text-gray-500 dark:text-zinc-400 hover:text-gray-700 hover:border-gray-300'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Abas Secundárias (Conta Corrente vs Cartão) -->
    <div class="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg self-start">
      <button
        v-for="src in sourceTabs"
        :key="src.value"
        @click="activeSource = src.value"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
        :class="[
          activeSource === src.value
            ? 'bg-white dark:bg-zinc-900 text-gray-950 dark:text-white shadow-sm'
            : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white'
        ]"
      >
        <UIcon :name="src.icon" class="h-3.5 w-3.5" />
        {{ src.label }}
      </button>
    </div>

    <!-- Cards de KPIs (Atualizados com base nas seleções de abas) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UCard :ui="{ body: { padding: 'p-4 pb-3 flex flex-col gap-1 items-center text-center' } }">
        <div class="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
          <UIcon name="i-heroicons-arrow-up-right" class="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>{{ faturamentoLabel }}</span>
        </div>
        <div class="text-2xl font-black tracking-tight text-gray-950 dark:text-white mt-1 font-mono">
          R$ {{ formatCurrency(kpis.faturamento) }}
        </div>
      </UCard>

      <UCard :ui="{ body: { padding: 'p-4 pb-3 flex flex-col gap-1 items-center text-center' } }">
        <div class="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
          <UIcon name="i-heroicons-arrow-down-left" class="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span>{{ gastosLabel }}</span>
        </div>
        <div class="text-2xl font-black tracking-tight text-gray-950 dark:text-white mt-1 font-mono">
          R$ {{ formatCurrency(kpis.gastos) }}
        </div>
      </UCard>

      <UCard :ui="{ body: { padding: 'p-4 pb-3 flex flex-col gap-1 items-center text-center' } }">
        <div class="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
          <UIcon name="i-heroicons-chart-bar" class="w-3.5 h-3.5 shrink-0" :class="[kpis.lucro >= 0 ? 'text-emerald-500' : 'text-rose-500']" />
          <span>{{ lucroLabel }}</span>
        </div>
        <div class="text-2xl font-black tracking-tight mt-1 font-mono" :class="[kpis.lucro >= 0 ? 'text-emerald-500' : 'text-rose-500']">
          R$ {{ formatCurrency(kpis.lucro) }}
        </div>
      </UCard>
    </div>

    <!-- Tabela de Histórico Persistido -->
    <div class="rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
      <div class="p-6 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
        <h3 class="text-base font-semibold text-gray-950 dark:text-white">Histórico de Lançamentos</h3>
        <p class="text-xs text-gray-500 mt-1">
          Transações já conciliadas e gravadas no banco de dados para a origem selecionada.
        </p>
      </div>

      <div v-if="fetchLoading" class="p-12 flex justify-center items-center">
        <UIcon name="i-heroicons-arrow-path" class="h-6 w-6 animate-spin text-gray-500" />
      </div>

      <div v-else-if="filteredHistory.length === 0" class="p-12 text-center text-sm text-gray-500">
        Nenhuma transação encontrada no banco de dados para os filtros selecionados.
      </div>

      <div v-else class="overflow-x-auto w-full">
        <table class="w-full text-sm text-left">
          <thead class="bg-gray-50 dark:bg-zinc-900 text-xs font-semibold uppercase text-gray-500 dark:text-zinc-400 border-b border-gray-200 dark:border-zinc-800">
            <tr>
              <th class="px-4 py-3">Data</th>
              <th class="px-4 py-3">Descrição</th>
              <th class="px-4 py-3">Valor</th>
              <th class="px-4 py-3 text-center">Classificação</th>
              <th class="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-zinc-800">
            <tr 
              v-for="tx in filteredHistory" 
              :key="tx.id" 
              class="hover:bg-gray-50 dark:hover:bg-zinc-800/20 transition-colors"
            >
              <td class="px-4 py-3 font-mono text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                {{ formatDate(tx.transaction_date) }}
              </td>
              <td class="px-4 py-3 whitespace-normal break-words max-w-[150px] sm:max-w-xs">
                <div class="font-medium text-gray-950 dark:text-white">{{ tx.description }}</div>
                <div v-if="tx.fit_id" class="text-[10px] text-gray-400 dark:text-zinc-500 font-mono mt-0.5">
                  FITID: {{ tx.fit_id }}
                </div>
              </td>
              <td class="px-4 py-3 font-semibold font-mono whitespace-nowrap" :class="[tx.amount > 0 ? 'text-emerald-500' : 'text-rose-500']">
                R$ {{ formatCurrency(tx.amount) }}
              </td>
              <td class="px-4 py-3">
                <div class="flex justify-center gap-1">
                  <UButton
                    size="xs"
                    :variant="tx.classification === 'business_pj' ? 'solid' : 'outline'"
                    color="emerald"
                    @click="handleReclassifySaved(tx.id!, 'business_pj')"
                  >
                    PJ
                  </UButton>
                  <UButton
                    size="xs"
                    :variant="tx.classification === 'personal_pf' ? 'solid' : 'outline'"
                    color="sky"
                    @click="handleReclassifySaved(tx.id!, 'personal_pf')"
                  >
                    PF
                  </UButton>
                  <UButton
                    size="xs"
                    :variant="tx.classification === 'transfer' ? 'solid' : 'outline'"
                    color="gray"
                    @click="handleReclassifySaved(tx.id!, 'transfer')"
                  >
                    Neutro
                  </UButton>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex justify-center">
                  <UButton
                    size="xs"
                    color="red"
                    variant="light"
                    icon="i-heroicons-trash"
                    class="flex items-center gap-1 font-medium"
                    @click="openDeleteDialog(tx.id!)"
                  >
                    Excluir
                  </UButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal/Dialog de Importação e Conciliação -->
    <UModal v-model="isImportModalOpen" prevent-close :ui="{ width: 'sm:max-w-2xl md:max-w-3xl lg:max-w-4xl' }">
      <div class="flex flex-col max-h-[90vh] overflow-hidden bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-lg shadow-xl">
        <div class="p-6 pb-4 border-b border-gray-200 dark:border-zinc-800 shrink-0">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Conciliação de Extrato OFX</h3>
          <p class="text-xs text-gray-500 mt-1">
            Origem selecionada: <span class="font-semibold">{{ activeSource === 'checking_account' ? 'Conta Corrente' : 'Cartão de Crédito' }}</span>
          </p>
        </div>

        <div class="p-6 overflow-y-auto space-y-4 flex-1">
          <!-- Formulário de Upload -->
          <form v-if="tempTransactions.length === 0" @submit.prevent="handleUploadOFX" class="space-y-4 py-4">
            <div class="border border-dashed border-gray-300 dark:border-zinc-700 rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3 bg-gray-50 dark:bg-zinc-900/50">
              <UIcon name="i-heroicons-cloud-arrow-up" class="h-8 w-8 text-gray-400 animate-pulse" />
              <div>
                <label for="ofxFile" class="cursor-pointer text-sm font-semibold text-emerald-500 hover:underline">
                  Clique para selecionar o arquivo
                </label>
                <p class="text-xs text-gray-500 mt-1">Apenas arquivos no formato .ofx</p>
              </div>
              <input
                id="ofxFile"
                type="file"
                accept=".ofx"
                required
                class="hidden"
                @change="handleFileChange"
              />
              <p v-if="file" class="text-xs font-mono bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 px-2.5 py-1 rounded-md text-gray-700 dark:text-zinc-300 mt-2">
                {{ file.name }}
              </p>
            </div>

            <UButton type="submit" block :loading="importLoading" :disabled="!file">
              Carregar Extrato
            </UButton>
          </form>

          <!-- Lista de lançamentos a classificar -->
          <div v-else class="space-y-4">
            <div class="border border-gray-200 dark:border-zinc-800 rounded-md overflow-hidden bg-white dark:bg-zinc-900">
              <div class="overflow-x-auto">
                <table class="w-full text-sm text-left">
                  <thead class="bg-gray-50 dark:bg-zinc-950 text-xs font-semibold uppercase text-gray-500">
                    <tr>
                      <th class="px-4 py-3">Data</th>
                      <th class="px-4 py-3">Descrição</th>
                      <th class="px-4 py-3">Valor</th>
                      <th class="px-4 py-3 text-center">Classificação</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 dark:divide-zinc-800">
                    <tr 
                      v-for="(tx, index) in tempTransactions" 
                      :key="index"
                      :class="[
                        tx.is_duplicate 
                          ? 'bg-amber-500/5 opacity-70' 
                          : tx.classification === 'business_pj'
                          ? 'bg-emerald-500/5 border-l-2 border-l-emerald-500'
                          : tx.classification === 'personal_pf'
                          ? 'bg-sky-500/5 border-l-2 border-l-sky-500'
                          : tx.classification === 'transfer'
                          ? 'bg-zinc-500/5 border-l-2 border-l-zinc-500'
                          : ''
                      ]"
                    >
                      <td class="px-4 py-3 font-mono text-gray-500 dark:text-zinc-400 whitespace-nowrap">
                        {{ formatDate(tx.transaction_date) }}
                      </td>
                      <td class="px-4 py-3 whitespace-normal break-words max-w-[150px] sm:max-w-xs">
                        <div class="font-medium flex items-center gap-1.5 flex-wrap">
                          <span>{{ tx.description }}</span>
                          <span v-if="tx.is_duplicate" class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                            <UIcon name="i-heroicons-exclamation-triangle" class="h-3 w-3" />
                            Duplicada
                          </span>
                        </div>
                      </td>
                      <td class="px-4 py-3 font-semibold font-mono whitespace-nowrap" :class="[tx.amount > 0 ? 'text-emerald-500' : 'text-rose-500']">
                        R$ {{ formatCurrency(tx.amount) }}
                      </td>
                      <td class="px-4 py-3">
                        <div class="flex justify-center gap-1">
                          <UButton
                            size="xs"
                            :variant="tx.classification === 'business_pj' ? 'solid' : 'outline'"
                            color="emerald"
                            @click="handleClassifyTemp(index, 'business_pj')"
                          >
                            PJ
                          </UButton>
                          <UButton
                            size="xs"
                            :variant="tx.classification === 'personal_pf' ? 'solid' : 'outline'"
                            color="sky"
                            @click="handleClassifyTemp(index, 'personal_pf')"
                          >
                            PF
                          </UButton>
                          <UButton
                            size="xs"
                            :variant="tx.classification === 'transfer' ? 'solid' : 'outline'"
                            color="gray"
                            @click="handleClassifyTemp(index, 'transfer')"
                          >
                            Neutro
                          </UButton>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border-t border-gray-200 dark:border-zinc-800 flex justify-end gap-3 bg-gray-50 dark:bg-zinc-900/20 shrink-0">
          <UButton color="gray" variant="ghost" @click="isImportModalOpen = false">
            Cancelar
          </UButton>
          <UButton 
            v-if="tempTransactions.length > 0"
            color="emerald"
            icon="i-heroicons-check-circle"
            :loading="confirmLoading"
            @click="handleConfirmImport"
          >
            Confirmar Fechamento
          </UButton>
        </div>
      </div>
    </UModal>

    <!-- Dialog de Confirmação de Exclusão (Dupla Confirmação) -->
    <UModal v-model="isDeleteDialogOpen" :ui="{ width: 'sm:max-w-[425px]' }">
      <div class="p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-800">
        <div class="flex items-center gap-2 text-red-600 dark:text-red-500 mb-1">
          <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 animate-bounce" />
          <h3 class="text-lg font-bold">Excluir Lançamento</h3>
        </div>
        
        <div class="pt-2 text-sm text-gray-500 dark:text-zinc-400 text-left">
          Você está prestes a excluir esta transação permanentemente. Esta ação atualizará seus relatórios financeiros.
        </div>
        
        <p class="text-[11px] text-gray-400 dark:text-zinc-500 pt-1.5 font-semibold text-left">
          Esta ação é irreversível e removerá permanentemente os registros do banco de dados.
        </p>
        
        <div class="pt-4 flex justify-end gap-3">
          <UButton 
            color="gray" 
            variant="ghost" 
            @click="isDeleteDialogOpen = false"
          >
            Cancelar
          </UButton>
          <UButton 
            color="red" 
            @click="confirmDelete"
          >
            Confirmar Exclusão
          </UButton>
        </div>
      </div>
    </UModal>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface TransactionPayload {
  id?: number
  transaction_date: string
  description: string
  amount: number
  source: 'checking_account' | 'credit_card'
  classification: 'pending' | 'business_pj' | 'personal_pf' | 'transfer'
  fit_id?: string | null
  is_duplicate?: boolean
}

const activeTab = ref<'business_pj' | 'personal_pf' | 'transfer' | 'pending'>('business_pj')
const activeSource = ref<'checking_account' | 'credit_card'>('checking_account')

const history = ref<TransactionPayload[]>([])
const tempTransactions = ref<TransactionPayload[]>([])

const isImportModalOpen = ref(false)
const file = ref<File | null>(null)

const fetchLoading = ref(false)
const importLoading = ref(false)
const confirmLoading = ref(false)

const isDeleteDialogOpen = ref(false)
const transactionToDelete = ref<number | null>(null)

const { apiFetch } = useAuth()
const toast = useToast()

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

// Labels dinâmicos para os cards baseados na aba atual
const faturamentoLabel = computed(() => {
  switch (activeTab.value) {
    case 'business_pj': return 'Faturamento (PJ)'
    case 'personal_pf': return 'Entradas (PF)'
    case 'transfer': return 'Entradas (Neutras)'
    default: return 'Entradas (Pendentes)'
  }
})

const gastosLabel = computed(() => {
  switch (activeTab.value) {
    case 'business_pj': return 'Gastos (PJ)'
    case 'personal_pf': return 'Saídas (PF)'
    case 'transfer': return 'Saídas (Neutras)'
    default: return 'Saídas (Pendentes)'
  }
})

const lucroLabel = computed(() => {
  switch (activeTab.value) {
    case 'business_pj': return 'Lucro Líquido'
    case 'personal_pf': return 'Saldo (PF)'
    case 'transfer': return 'Saldo (Neutro)'
    default: return 'Saldo (Pendente)'
  }
})

// Busca histórico
const fetchHistory = async () => {
  fetchLoading.value = true
  try {
    const response: any = await apiFetch('/transactions', { method: 'GET' })
    if (response && response.success) {
      history.value = response.data || []
    } else {
      toast.add({
        title: 'Erro ao carregar histórico',
        description: response?.message || 'Falha ao buscar dados',
        color: 'red'
      })
    }
  } catch (err: any) {
    toast.add({
      title: 'Erro de conexão',
      description: err.message || 'Falha ao buscar dados no backend',
      color: 'red'
    })
  } finally {
    fetchLoading.value = false
  }
}

// Filtra histórico
const filteredHistory = computed(() => {
  return history.value.filter(
    (tx) => tx.source === activeSource.value && tx.classification === activeTab.value
  )
})

// KPIs baseados nos lançamentos filtrados
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

// Abre modal de importação
const openImportModal = () => {
  tempTransactions.value = []
  file.value = null
  isImportModalOpen.value = true
}

// Controla upload
const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    file.value = target.files[0]
  }
}

const handleUploadOFX = async () => {
  if (!file.value) return

  importLoading.value = true
  tempTransactions.value = []

  const formData = new FormData()
  formData.append('source', activeSource.value)
  formData.append('file', file.value)

  try {
    const response: any = await apiFetch('/transactions/parse', {
      method: 'POST',
      body: formData
    })

    if (response && response.success) {
      tempTransactions.value = response.data || []
      toast.add({
        title: 'Arquivo processado!',
        description: 'Extrato processado com sucesso. Classifique os lançamentos.',
        color: 'green'
      })
    } else {
      toast.add({
        title: 'Falha no upload',
        description: response?.message || 'Erro ao processar o arquivo.',
        color: 'red'
      })
    }
  } catch (err: any) {
    toast.add({
      title: 'Erro de conexão',
      description: err.message || 'Erro ao processar arquivo.',
      color: 'red'
    })
  } finally {
    importLoading.value = false
  }
}

// Classifica lançamento temporário na memória
const handleClassifyTemp = (index: number, classification: 'business_pj' | 'personal_pf' | 'transfer') => {
  tempTransactions.value = tempTransactions.value.map((tx, idx) => 
    idx === index ? { ...tx, classification } : tx
  )
}

// Confirma importação
const handleConfirmImport = async () => {
  confirmLoading.value = true
  try {
    const response: any = await apiFetch('/transactions/confirm', {
      method: 'POST',
      body: { transactions: tempTransactions.value }
    })

    if (response && response.success) {
      toast.add({
        title: 'Lançamentos salvos!',
        description: 'Transações salvas e conciliação realizada com sucesso.',
        color: 'green'
      })
      tempTransactions.value = []
      file.value = null
      isImportModalOpen.value = false
      await fetchHistory()
    } else {
      toast.add({
        title: 'Erro ao salvar',
        description: response?.message || 'Falha ao salvar lançamentos.',
        color: 'red'
      })
    }
  } catch (err: any) {
    toast.add({
      title: 'Erro de conexão',
      description: err.message || 'Falha ao salvar lançamentos.',
      color: 'red'
    })
  } finally {
    confirmLoading.value = false
  }
}

// Reclassifica lançamento salvo no banco
const handleReclassifySaved = async (id: number, classification: 'business_pj' | 'personal_pf' | 'transfer') => {
  try {
    const response: any = await apiFetch(`/transactions/${id}/classify`, {
      method: 'PATCH',
      body: { classification }
    })

    if (response && response.success) {
      history.value = history.value.map((tx) =>
        tx.id === id ? { ...tx, classification } : tx
      )
      toast.add({
        title: 'Classificação atualizada',
        description: 'Classificação atualizada com sucesso.',
        color: 'green'
      })
    } else {
      toast.add({
        title: 'Erro ao reclassificar',
        description: response?.message || 'Erro ao alterar classificação.',
        color: 'red'
      })
    }
  } catch (err: any) {
    toast.add({
      title: 'Erro de conexão',
      description: err.message || 'Erro ao alterar classificação.',
      color: 'red'
    })
  }
}

// Exclui lançamento com dupla confirmação
const openDeleteDialog = (id: number) => {
  transactionToDelete.value = id
  isDeleteDialogOpen.value = true
}

const confirmDelete = async () => {
  if (transactionToDelete.value === null) return
  const id = transactionToDelete.value
  isDeleteDialogOpen.value = false
  transactionToDelete.value = null

  try {
    const response: any = await apiFetch(`/transactions/${id}`, {
      method: 'DELETE'
    })

    if (response && response.success) {
      history.value = history.value.filter((tx) => tx.id !== id)
      toast.add({
        title: 'Lançamento excluído',
        description: 'Transação excluída com sucesso.',
        color: 'green'
      })
    } else {
      toast.add({
        title: 'Erro ao excluir',
        description: response?.message || 'Erro ao excluir transação.',
        color: 'red'
      })
    }
  } catch (err: any) {
    toast.add({
      title: 'Erro de conexão',
      description: err.message || 'Erro de conexão ao excluir transação.',
      color: 'red'
    })
  }
}

// Formatadores
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
