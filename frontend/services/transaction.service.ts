import { apiFetch } from '@/lib/api';

export interface ParseParams {
  source: 'checking_account' | 'credit_card';
  file: File;
  accessToken: string;
}

export interface TransactionPayload {
  id?: number;
  transaction_date: string;
  description: string;
  alias?: string | null;
  amount: number;
  source: 'checking_account' | 'credit_card';
  bank_name?: string | null;
  classification: 'pending' | 'business_pj' | 'personal_pf' | 'transfer';
  fit_id?: string | null;
  is_duplicate?: boolean;
}

/**
 * Envia o extrato OFX para o backend estruturar os dados.
 */
export async function parseStatement(params: ParseParams) {
  const { accessToken, source, file } = params;
  
  const body = new FormData();
  body.append('source', source);
  body.append('file', file);

  return await apiFetch('/transactions/parse', {
    method: 'POST',
    body,
    accessToken,
  });
}

/**
 * Confirma a classificação das transações importadas salvando-as no banco.
 */
export async function confirmTransactions(
  transactions: TransactionPayload[],
  accessToken: string
) {
  return await apiFetch('/transactions/confirm', {
    method: 'POST',
    body: { transactions },
    accessToken,
  });
}

/**
 * Recupera o histórico de transações salvas do banco de dados.
 */
export async function getTransactions(
  accessToken: string,
  filters?: {
    source?: string;
    classification?: string;
    start_date?: string;
    end_date?: string;
    bank_name?: string;
    search?: string;
  }
) {
  let query = '';
  if (filters) {
    const params = new URLSearchParams();
    if (filters.source) params.append('source', filters.source);
    if (filters.classification) params.append('classification', filters.classification);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.bank_name) params.append('bank_name', filters.bank_name);
    if (filters.search) params.append('search', filters.search);
    const queryString = params.toString();
    if (queryString) query = `?${queryString}`;
  }

  return await apiFetch(`/transactions${query}`, {
    method: 'GET',
    accessToken,
  });
}

/**
 * Exclui uma transação no banco de dados.
 */
export async function deleteTransaction(id: number, accessToken: string) {
  return await apiFetch(`/transactions/${id}`, {
    method: 'DELETE',
    accessToken,
  });
}

/**
 * Altera a classificação de uma transação existente no banco de dados.
 */
export async function updateTransactionClassification(
  id: number,
  classification: 'business_pj' | 'personal_pf' | 'transfer',
  accessToken: string
) {
  return await apiFetch(`/transactions/${id}/classify`, {
    method: 'PATCH',
    body: { classification },
    accessToken,
  });
}

/**
 * Altera o apelido (alias) de uma transação existente no banco de dados.
 */
export async function updateTransactionAlias(
  id: number,
  alias: string | null,
  accessToken: string
) {
  return await apiFetch(`/transactions/${id}/alias`, {
    method: 'PATCH',
    body: { alias },
    accessToken,
  });
}
