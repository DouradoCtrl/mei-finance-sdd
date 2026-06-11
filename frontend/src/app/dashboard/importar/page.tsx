'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2, ArrowUpRight, ArrowDownLeft, FileText, CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/header';
import { parseStatement, confirmTransactions, TransactionPayload } from '@/services/transaction.service';

export default function ImportacaoPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Estados do formulário de importação
  const [source, setSource] = useState<'checking_account' | 'credit_card'>('checking_account');
  const [format, setFormat] = useState<'ofx' | 'text'>('text');
  const [rawText, setRawText] = useState('');
  const [file, setFile] = useState<File | null>(null);

  // Estados da UI
  const [transactions, setTransactions] = useState<TransactionPayload[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Proteger rota no frontend
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Cálculo dinâmico do resumo financeiro em tempo real
  const summary = useMemo(() => {
    let receitaPj = 0;
    let despesaPj = 0;
    let retiradaPf = 0;

    transactions.forEach((tx) => {
      const val = tx.amount;
      if (tx.classification === 'business_pj') {
        if (val > 0) {
          receitaPj += val;
        } else {
          despesaPj += Math.abs(val);
        }
      } else if (tx.classification === 'personal_pf') {
        retiradaPf += Math.abs(val);
      }
    });

    return {
      receitaPj,
      despesaPj,
      retiradaPf,
      lucroLiquido: receitaPj - despesaPj,
    };
  }, [transactions]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Carregando painel...</p>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Envia o extrato para o backend parsear
  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setTransactions([]);
    setLoading(true);

    try {
      const token = session?.accessToken || '';
      const response = await parseStatement({
        source,
        format,
        raw_text: format === 'text' ? rawText : undefined,
        file: format === 'ofx' ? (file || undefined) : undefined,
        accessToken: token,
      });

      if (!response.success) {
        throw new Error(response.message || 'Falha ao processar o extrato.');
      }

      setTransactions(response.data || []);
      setSuccess('Extrato importado com sucesso! Classifique os itens abaixo.');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro no processamento do extrato.');
    } finally {
      setLoading(false);
    }
  };

  // Altera a classificação de uma transação específica na lista em memória
  const handleClassify = (index: number, classification: 'business_pj' | 'personal_pf' | 'transfer') => {
    setTransactions((prev) =>
      prev.map((tx, idx) => (idx === index ? { ...tx, classification } : tx))
    );
  };

  // Envia as transações classificadas para o banco de dados
  const handleConfirm = async () => {
    setError('');
    setSuccess('');
    setConfirmLoading(true);

    try {
      const token = session?.accessToken || '';
      const response = await confirmTransactions(transactions, token);

      if (!response.success) {
        throw new Error(response.message || 'Erro ao salvar as transações.');
      }

      setSuccess('Transações salvas e conciliação realizada com sucesso!');
      setTransactions([]);
      setRawText('');
      setFile(null);
    } catch (err: any) {
      setError(err.message || 'Falha ao confirmar transações.');
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <Header />

      <main className="flex-1 p-6 space-y-6 max-w-6xl w-full mx-auto">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Card de Configuração e Upload */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Importar Novo Extrato</CardTitle>
              <CardDescription>
                Selecione a origem e o formato para estruturar suas transações.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleProcess}>
              <CardContent className="space-y-4">
                {error && <div className="text-sm text-red-500">{error}</div>}
                {success && <div className="text-sm text-green-500">{success}</div>}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="source">Origem do Extrato</Label>
                    <select
                      id="source"
                      value={source}
                      onChange={(e: any) => setSource(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="checking_account">Conta Corrente</option>
                      <option value="credit_card">Cartão de Crédito</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="format">Formato</Label>
                    <select
                      id="format"
                      value={format}
                      onChange={(e: any) => setFormat(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="text">Texto Bruto (Colagem)</option>
                      <option value="ofx">OFX (Arquivo Bancário)</option>
                    </select>
                  </div>
                </div>

                {format === 'text' ? (
                  <div className="space-y-2">
                    <Label htmlFor="rawText">Cole o Extrato de Texto</Label>
                    <textarea
                      id="rawText"
                      required
                      value={rawText}
                      onChange={(e) => setRawText(e.target.value)}
                      placeholder="Ex: 10/06/2026 PIX RECEBIDO JOAO R$ 1500,00&#10;11/06/2026 ALUGUEL R$ -450,00"
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="file">Selecione o Arquivo .ofx</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".ofx"
                      required
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Processar Extrato'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Painel de Resumo Dinâmico */}
          <Card className="w-full md:w-80 flex flex-col justify-between">
            <CardHeader>
              <CardTitle>Resumo Dinâmico</CardTitle>
              <CardDescription>Cálculos consolidados em tempo real.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-muted-foreground">Receitas PJ</span>
                <span className="font-semibold text-green-500">
                  R$ {summary.receitaPj.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-muted-foreground">Despesas PJ</span>
                <span className="font-semibold text-red-500">
                  R$ {summary.despesaPj.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm text-muted-foreground">Retiradas PF</span>
                <span className="font-semibold text-sky-500">
                  R$ {summary.retiradaPf.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-medium">Lucro Líquido (PJ)</span>
                <span className={`font-bold ${summary.lucroLiquido >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  R$ {summary.lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </CardContent>
            {transactions.length > 0 && (
              <CardFooter className="pt-4 border-t">
                <Button onClick={handleConfirm} disabled={confirmLoading} className="w-full bg-emerald-600 hover:bg-emerald-700">
                  {confirmLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirmando...
                    </>
                  ) : (
                    'Confirmar Fechamento'
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>

        {/* Lista de Transações para Classificação */}
        {transactions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Classificar Lançamentos</CardTitle>
              <CardDescription>
                Selecione PJ, PF ou Neutro para cada transação antes de confirmar.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 font-medium text-muted-foreground">
                    <th className="p-4">Data</th>
                    <th className="p-4">Descrição</th>
                    <th className="p-4">Valor</th>
                    <th className="p-4">Origem</th>
                    <th className="p-4 text-center">Classificação</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => {
                    const isPositive = tx.amount > 0;
                    let rowClass = 'hover:bg-muted/30';
                    if (tx.classification === 'business_pj') {
                      rowClass = 'bg-emerald-500/10 border-l-4 border-l-emerald-500 hover:bg-emerald-500/15';
                    } else if (tx.classification === 'personal_pf') {
                      rowClass = 'bg-sky-500/10 border-l-4 border-l-sky-500 hover:bg-sky-500/15';
                    } else if (tx.classification === 'transfer') {
                      rowClass = 'bg-zinc-500/10 border-l-4 border-l-zinc-500 hover:bg-zinc-500/15';
                    }

                    return (
                      <tr key={index} className={`border-b transition-colors ${rowClass}`}>
                        <td className="p-4 font-mono">
                          {tx.transaction_date.split('-').reverse().join('/')}
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{tx.description}</div>
                          {tx.fit_id && (
                            <div className="text-[10px] text-muted-foreground font-mono">
                              FITID: {tx.fit_id}
                            </div>
                          )}
                        </td>
                        <td className={`p-4 font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                            {tx.source === 'checking_account' ? 'Conta Corrente' : 'Cartão'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <Button
                              size="sm"
                              variant={tx.classification === 'business_pj' ? 'default' : 'outline'}
                              onClick={() => handleClassify(index, 'business_pj')}
                              className={tx.classification === 'business_pj' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                            >
                              PJ
                            </Button>
                            <Button
                              size="sm"
                              variant={tx.classification === 'personal_pf' ? 'default' : 'outline'}
                              onClick={() => handleClassify(index, 'personal_pf')}
                              className={tx.classification === 'personal_pf' ? 'bg-sky-600 hover:bg-sky-700 text-white' : ''}
                            >
                              PF
                            </Button>
                            <Button
                              size="sm"
                              variant={tx.classification === 'transfer' ? 'default' : 'outline'}
                              onClick={() => handleClassify(index, 'transfer')}
                              className={tx.classification === 'transfer' ? 'bg-zinc-600 hover:bg-zinc-700 text-white' : ''}
                            >
                              Neutro
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
