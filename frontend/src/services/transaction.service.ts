import { apiFetch } from '@/lib/api';

export interface ParseParams {
  source: 'checking_account' | 'credit_card';
  format: 'ofx' | 'text';
  raw_text?: string;
  file?: File;
  accessToken: string;
}

export interface TransactionPayload {
  transaction_date: string;
  description: string;
  amount: number;
  source: 'checking_account' | 'credit_card';
  classification: 'pending' | 'business_pj' | 'personal_pf' | 'transfer';
  fit_id?: string | null;
}

/**
 * Envia o extrato (texto ou OFX) para o backend estruturar os dados.
 */
export async function parseStatement(params: ParseParams) {
  const { accessToken, ...restParams } = params;
  let body: any;

  if (restParams.format === 'ofx' && restParams.file) {
    body = new FormData();
    body.append('source', restParams.source);
    body.append('format', restParams.format);
    body.append('file', restParams.file);
  } else {
    body = {
      source: restParams.source,
      format: restParams.format,
      raw_text: restParams.raw_text,
    };
  }

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
