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
  amount: number;
  source: 'checking_account' | 'credit_card';
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
  filters?: { source?: string; classification?: string }
) {
  let query = '';
  if (filters) {
    const params = new URLSearchParams();
    if (filters.source) params.append('source', filters.source);
    if (filters.classification) params.append('classification', filters.classification);
    const queryString = params.toString();
    if (queryString) query = `?${queryString}`;
  }

  return await apiFetch(`/transactions${query}`, {
    method: 'GET',
    accessToken,
  });
}
