import { ref, computed } from 'vue'

export interface Transaction {
  id?: number
  transaction_date: string
  description: string
  amount: number
  source: 'checking_account' | 'credit_card'
  classification: 'pending' | 'business_pj' | 'personal_pf' | 'transfer'
  fit_id?: string | null
  is_duplicate?: boolean
}

export const useTransactions = () => {
  const history = useState<Transaction[]>('transactions_history', () => [])
  const tempTransactions = useState<Transaction[]>('transactions_temp', () => [])
  
  const fetchLoading = ref(false)
  const importLoading = ref(false)
  const confirmLoading = ref(false)

  const { apiFetch } = useAuth()
  const toast = useToast()

  const fetchHistory = async () => {
    fetchLoading.value = true
    try {
      const response: any = await apiFetch('/transactions')
      if (response && response.success) {
        history.value = response.data || []
      } else {
        toast.add({
          title: 'Erro ao carregar',
          description: response?.message || 'Não foi possível buscar as transações.',
          color: 'red'
        })
      }
    } catch (err: any) {
      toast.add({
        title: 'Erro de rede',
        description: err.message || 'Erro ao conectar ao servidor.',
        color: 'red'
      })
    } finally {
      fetchLoading.value = false
    }
  }

  const uploadOFX = async (source: 'checking_account' | 'credit_card', file: File) => {
    importLoading.value = true
    tempTransactions.value = []

    const formData = new FormData()
    formData.append('source', source)
    formData.append('file', file)

    try {
      const response: any = await apiFetch('/transactions/parse', {
        method: 'POST',
        body: formData
      })

      if (response && response.success) {
        tempTransactions.value = response.data || []
        toast.add({
          title: 'Sucesso',
          description: 'Extrato OFX lido com sucesso! Classifique as transações.',
          color: 'green'
        })
        return true
      } else {
        toast.add({
          title: 'Erro na importação',
          description: response?.message || 'Falha ao processar arquivo OFX.',
          color: 'red'
        })
      }
    } catch (err: any) {
      toast.add({
        title: 'Erro na importação',
        description: err.message || 'Falha ao enviar arquivo.',
        color: 'red'
      })
    } finally {
      importLoading.value = false
    }
    return false
  }

  const classifyTemp = (index: number, classification: 'business_pj' | 'personal_pf' | 'transfer') => {
    tempTransactions.value = tempTransactions.value.map((tx, idx) =>
      idx === index ? { ...tx, classification } : tx
    )
  }

  const confirmImport = async () => {
    if (tempTransactions.value.length === 0) return false
    confirmLoading.value = true

    try {
      const response: any = await apiFetch('/transactions/confirm', {
        method: 'POST',
        body: { transactions: tempTransactions.value }
      })

      if (response && response.success) {
        toast.add({
          title: 'Conciliação concluída',
          description: 'Todos os lançamentos foram salvos com sucesso.',
          color: 'green'
        })
        tempTransactions.value = []
        await fetchHistory()
        return true
      } else {
        toast.add({
          title: 'Erro ao salvar',
          description: response?.message || 'Não foi possível confirmar os lançamentos.',
          color: 'red'
        })
      }
    } catch (err: any) {
      toast.add({
        title: 'Erro ao salvar',
        description: err.message || 'Erro de conexão.',
        color: 'red'
      })
    } finally {
      confirmLoading.value = false
    }
    return false
  }

  const reclassifySaved = async (id: number, classification: 'business_pj' | 'personal_pf' | 'transfer') => {
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
          title: 'Reclassificado',
          description: 'Lançamento atualizado com sucesso.',
          color: 'green',
          timeout: 2000
        })
        return true
      } else {
        toast.add({
          title: 'Erro',
          description: response?.message || 'Falha ao atualizar classificação.',
          color: 'red'
        })
      }
    } catch (err: any) {
      toast.add({
        title: 'Erro',
        description: err.message || 'Erro de conexão.',
        color: 'red'
      })
    }
    return false
  }

  const deleteSaved = async (id: number) => {
    try {
      const response: any = await apiFetch(`/transactions/${id}`, {
        method: 'DELETE'
      })

      if (response && response.success) {
        history.value = history.value.filter((tx) => tx.id !== id)
        toast.add({
          title: 'Excluído',
          description: 'Transação removida com sucesso.',
          color: 'green'
        })
        return true
      } else {
        toast.add({
          title: 'Erro ao excluir',
          description: response?.message || 'Não foi possível excluir a transação.',
          color: 'red'
        })
      }
    } catch (err: any) {
      toast.add({
        title: 'Erro ao excluir',
        description: err.message || 'Erro de conexão.',
        color: 'red'
      })
    }
    return false
  }

  return {
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
  }
}
