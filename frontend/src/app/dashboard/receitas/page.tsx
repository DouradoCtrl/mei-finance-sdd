'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Loader2, 
  UploadCloud, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  CreditCard,
  Wallet,
  X,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/header';
import { 
  getTransactions, 
  parseStatement, 
  confirmTransactions, 
  deleteTransaction,
  updateTransactionClassification,
  TransactionPayload 
} from '@/services/transaction.service';

export default function ReceitasPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // Abas e Filtros principais
  const [activeTab, setActiveTab] = useState<'business_pj' | 'personal_pf' | 'transfer'>('business_pj');
  const [activeSource, setActiveSource] = useState<'checking_account' | 'credit_card'>('checking_account');

  // Estados dos dados
  const [history, setHistory] = useState<TransactionPayload[]>([]);
  const [tempTransactions, setTempTransactions] = useState<TransactionPayload[]>([]);
  
  // Estados da interface de importação
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  // Loadings e Mensagens
  const [fetchLoading, setFetchLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Proteger rota no frontend
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Carrega histórico do banco
  const fetchHistory = async () => {
    if (!session?.accessToken) return;
    setFetchLoading(true);
    try {
      const response = await getTransactions(session.accessToken);
      if (response.success) {
        setHistory(response.data || []);
      } else {
        console.error('Falha ao buscar transações:', response.message);
      }
    } catch (err) {
      console.error('Erro ao buscar histórico:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchHistory();
    }
  }, [status, session]);

  // Filtra o histórico com base nas abas selecionadas
  const filteredHistory = useMemo(() => {
    return history.filter(
      (tx) => tx.source === activeSource && tx.classification === activeTab
    );
  }, [history, activeTab, activeSource]);

  // Cálculo dinâmico dos KPIs da aba e origem ativas (baseado no histórico persistido do banco)
  const kpis = useMemo(() => {
    let faturamento = 0; // Entradas
    let gastos = 0;      // Saídas

    filteredHistory.forEach((tx) => {
      if (tx.amount > 0) {
        faturamento += tx.amount;
      } else {
        gastos += Math.abs(tx.amount);
      }
    });

    return {
      faturamento,
      gastos,
      lucro: faturamento - gastos,
    };
  }, [filteredHistory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Envia arquivo OFX para o backend estruturar temporariamente na tela
  const handleUploadOFX = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !session?.accessToken) return;

    setError('');
    setImportLoading(true);
    setTempTransactions([]);

    try {
      const response = await parseStatement({
        source: activeSource,
        file,
        accessToken: session.accessToken,
      });

      if (!response.success) {
        throw new Error(response.message || 'Erro ao processar o arquivo OFX.');
      }

      setTempTransactions(response.data || []);
      setSuccess('Extrato processado com sucesso! Classifique os lançamentos abaixo.');
    } catch (err: any) {
      setError(err.message || 'Falha ao importar o arquivo.');
    } finally {
      setImportLoading(false);
    }
  };

  // Classifica transação temporária em memória
  const handleClassifyTemp = (index: number, classification: 'business_pj' | 'personal_pf' | 'transfer') => {
    setTempTransactions((prev) =>
      prev.map((tx, idx) => (idx === index ? { ...tx, classification } : tx))
    );
  };

  // Salva transações classificadas no banco de dados e recarrega a página
  const handleConfirmImport = async () => {
    if (!session?.accessToken) return;

    setError('');
    setConfirmLoading(true);

    try {
      const response = await confirmTransactions(tempTransactions, session.accessToken);
      if (!response.success) {
        throw new Error(response.message || 'Erro ao salvar lançamentos.');
      }

      setSuccess('Transações salvas e conciliação realizada com sucesso!');
      setTempTransactions([]);
      setFile(null);
      setIsImportModalOpen(false);
      
      // Recarrega histórico para atualizar os KPIs e tabela principal
      await fetchHistory();
    } catch (err: any) {
      setError(err.message || 'Falha ao confirmar fechamento.');
    } finally {
      setConfirmLoading(false);
    }
  };

  // Exclui uma transação salva permanentemente
  const handleDeleteSaved = async (id: number) => {
    if (!session?.accessToken) return;
    if (!window.confirm('Tem certeza de que deseja excluir esta transação permanentemente?')) return;
    
    try {
      const response = await deleteTransaction(id, session.accessToken);
      if (response.success) {
        setHistory((prev) => prev.filter((tx) => tx.id !== id));
      } else {
        alert(response.message || 'Erro ao excluir a transação.');
      }
    } catch (err) {
      console.error('Erro ao excluir transação:', err);
      alert('Erro de conexão ao excluir a transação.');
    }
  };

  // Altera a classificação de uma transação já persistida no banco
  const handleReclassifySaved = async (id: number, classification: 'business_pj' | 'personal_pf' | 'transfer') => {
    if (!session?.accessToken) return;
    
    try {
      const response = await updateTransactionClassification(id, classification, session.accessToken);
      if (response.success) {
        setHistory((prev) =>
          prev.map((tx) => (tx.id === id ? { ...tx, classification } : tx))
        );
      } else {
        alert(response.message || 'Erro ao alterar a classificação.');
      }
    } catch (err) {
      console.error('Erro ao alterar classificação:', err);
      alert('Erro de conexão ao alterar a classificação.');
    }
  };

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Carregando Receitas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <Header />

      <main className="flex-1 p-6 space-y-6 max-w-6xl w-full mx-auto">
        
        {/* Cabeçalho da Página com Título e Botão de Ação */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Receitas e Fluxo de Caixa</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe seu faturamento, controle despesas e faça conciliações rápidas via extrato.
            </p>
          </div>
          <Button 
            onClick={() => {
              setError('');
              setSuccess('');
              setTempTransactions([]);
              setFile(null);
              setIsImportModalOpen(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
          >
            <UploadCloud className="h-4 w-4" />
            Importar Extrato OFX
          </Button>
        </div>

        {/* Abas Principais (PJ vs PF vs Neutro) */}
        <div className="flex border-b border-muted">
          <button
            onClick={() => setActiveTab('business_pj')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-[2px] ${
              activeTab === 'business_pj'
                ? 'border-emerald-500 text-emerald-500 font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Pessoa Jurídica (PJ)
          </button>
          <button
            onClick={() => setActiveTab('personal_pf')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-[2px] ${
              activeTab === 'personal_pf'
                ? 'border-sky-500 text-sky-500 font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Pessoa Física (PF)
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-[2px] ${
              activeTab === 'transfer'
                ? 'border-zinc-500 text-zinc-500 font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Neutro / Transferências
          </button>
        </div>

        {/* Abas Secundárias (Conta Corrente vs Cartão) */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={activeSource === 'checking_account' ? 'default' : 'outline'}
            onClick={() => setActiveSource('checking_account')}
            className="flex items-center gap-1.5"
          >
            <Wallet className="h-3.5 w-3.5" />
            Conta Corrente
          </Button>
          <Button
            size="sm"
            variant={activeSource === 'credit_card' ? 'default' : 'outline'}
            onClick={() => setActiveSource('credit_card')}
            className="flex items-center gap-1.5"
          >
            <CreditCard className="h-3.5 w-3.5" />
            Cartão de Crédito
          </Button>
        </div>

        {/* Cards de KPIs (Atualizados com base nas seleções de abas) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {activeTab === 'business_pj' 
                  ? 'Faturamento (Receitas)' 
                  : activeTab === 'personal_pf' 
                  ? 'Entradas PF' 
                  : 'Entradas Neutras'}
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                R$ {kpis.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {activeTab === 'business_pj' 
                  ? 'Gastos (Despesas)' 
                  : activeTab === 'personal_pf' 
                  ? 'Saídas PF' 
                  : 'Saídas Neutras'}
              </CardTitle>
              <ArrowDownLeft className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">
                R$ {kpis.gastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card className={`border-l-4 ${kpis.lucro >= 0 ? 'border-l-emerald-500' : 'border-l-rose-500'}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {activeTab === 'business_pj' 
                  ? 'Lucro Líquido' 
                  : activeTab === 'personal_pf' 
                  ? 'Saldo PF' 
                  : 'Saldo Neutro'}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${kpis.lucro >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                R$ {kpis.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabela de Histórico Persistido */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Lançamentos</CardTitle>
            <CardDescription>
              Transações já conciliadas e gravadas no banco de dados para a origem selecionada.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            {fetchLoading ? (
              <div className="p-8 flex justify-center items-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Nenhuma transação encontrada no banco de dados para os filtros selecionados.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 font-medium text-muted-foreground">
                    <th className="p-4">Data</th>
                    <th className="p-4">Descrição</th>
                    <th className="p-4">Valor</th>
                    <th className="p-4 text-center">Classificação</th>
                    <th className="p-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((tx) => {
                    const isPositive = tx.amount > 0;
                    return (
                      <tr key={tx.id} className="border-b hover:bg-muted/30 transition-colors">
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
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-1.5">
                            <Button
                              size="xs"
                              variant={tx.classification === 'business_pj' ? 'default' : 'outline'}
                              onClick={() => handleReclassifySaved(tx.id!, 'business_pj')}
                              className={tx.classification === 'business_pj' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'h-7 text-xs'}
                            >
                              PJ
                            </Button>
                            <Button
                              size="xs"
                              variant={tx.classification === 'personal_pf' ? 'default' : 'outline'}
                              onClick={() => handleReclassifySaved(tx.id!, 'personal_pf')}
                              className={tx.classification === 'personal_pf' ? 'bg-sky-600 hover:bg-sky-700 text-white' : 'h-7 text-xs'}
                            >
                              PF
                            </Button>
                            <Button
                              size="xs"
                              variant={tx.classification === 'transfer' ? 'default' : 'outline'}
                              onClick={() => handleReclassifySaved(tx.id!, 'transfer')}
                              className={tx.classification === 'transfer' ? 'bg-zinc-600 hover:bg-zinc-700 text-white' : 'h-7 text-xs'}
                            >
                              Neutro
                            </Button>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <Button
                            size="xs"
                            variant="destructive"
                            onClick={() => handleDeleteSaved(tx.id!)}
                            className="h-7 text-xs flex items-center gap-1 mx-auto"
                          >
                            <Trash2 className="h-3 w-3" />
                            Excluir
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Modal/Overlay de Importação e Conciliação */}
        {isImportModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-background border rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl">
              
              <div className="p-6 border-b flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Conciliação de Extrato OFX</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Origem selecionada: <span className="font-semibold">{activeSource === 'checking_account' ? 'Conta Corrente' : 'Cartão de Crédito'}</span>
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsImportModalOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                {error && <div className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-sm">{error}</div>}
                {success && <div className="p-3 bg-green-500/10 text-green-500 border border-green-500/20 rounded text-sm">{success}</div>}

                {/* Formulário de Upload */}
                {tempTransactions.length === 0 && (
                  <form onSubmit={handleUploadOFX} className="space-y-4 py-4">
                    <div className="border-2 border-dashed border-muted rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3">
                      <UploadCloud className="h-10 w-10 text-muted-foreground animate-pulse" />
                      <div>
                        <Label htmlFor="ofxFile" className="cursor-pointer text-sm font-semibold text-emerald-500 hover:underline">
                          Clique para selecionar
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">Apenas arquivos extrato no formato .ofx</p>
                      </div>
                      <Input
                        id="ofxFile"
                        type="file"
                        accept=".ofx"
                        required
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      {file && <p className="text-xs font-mono bg-muted px-2 py-1 rounded text-foreground">{file.name}</p>}
                    </div>

                    <Button type="submit" disabled={importLoading || !file} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                      {importLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando Extrato...
                        </>
                      ) : (
                        'Processar Extrato'
                      )}
                    </Button>
                  </form>
                )}

                {/* Grid de Classificação das Transações Temporárias */}
                {tempTransactions.length > 0 && (
                  <div className="space-y-4">
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b bg-muted/40 font-medium text-muted-foreground">
                            <th className="p-3">Data</th>
                            <th className="p-3">Descrição</th>
                            <th className="p-3">Valor</th>
                            <th className="p-3 text-center">Classificação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tempTransactions.map((tx, index) => {
                            const isPositive = tx.amount > 0;
                            let rowBg = '';
                            if (tx.is_duplicate) {
                              rowBg = 'bg-yellow-500/5 opacity-60';
                            } else if (tx.classification === 'business_pj') {
                              rowBg = 'bg-emerald-500/10 border-l-4 border-l-emerald-500';
                            } else if (tx.classification === 'personal_pf') {
                              rowBg = 'bg-sky-500/10 border-l-4 border-l-sky-500';
                            } else if (tx.classification === 'transfer') {
                              rowBg = 'bg-zinc-500/10 border-l-4 border-l-zinc-500';
                            }

                            return (
                              <tr key={index} className={`border-b transition-colors ${rowBg}`}>
                                <td className="p-3 font-mono">
                                  {tx.transaction_date.split('-').reverse().join('/')}
                                </td>
                                <td className="p-3">
                                  <div className="font-medium flex items-center gap-1.5">
                                    {tx.description}
                                    {tx.is_duplicate && (
                                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-yellow-500/20 text-yellow-600 border border-yellow-500/30">
                                        <AlertTriangle className="h-2.5 w-2.5" />
                                        Duplicada
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className={`p-3 font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                  R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                                <td className="p-3">
                                  <div className="flex justify-center gap-1.5">
                                    <Button
                                      size="xs"
                                      variant={tx.classification === 'business_pj' ? 'default' : 'outline'}
                                      onClick={() => handleClassifyTemp(index, 'business_pj')}
                                      className={tx.classification === 'business_pj' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'h-7 text-xs'}
                                    >
                                      PJ
                                    </Button>
                                    <Button
                                      size="xs"
                                      variant={tx.classification === 'personal_pf' ? 'default' : 'outline'}
                                      onClick={() => handleClassifyTemp(index, 'personal_pf')}
                                      className={tx.classification === 'personal_pf' ? 'bg-sky-600 hover:bg-sky-700 text-white' : 'h-7 text-xs'}
                                    >
                                      PF
                                    </Button>
                                    <Button
                                      size="xs"
                                      variant={tx.classification === 'transfer' ? 'default' : 'outline'}
                                      onClick={() => handleClassifyTemp(index, 'transfer')}
                                      className={tx.classification === 'transfer' ? 'bg-zinc-600 hover:bg-zinc-700 text-white' : 'h-7 text-xs'}
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
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t flex justify-end gap-3 bg-muted/20">
                <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>
                  Cancelar
                </Button>
                {tempTransactions.length > 0 && (
                  <Button 
                    onClick={handleConfirmImport} 
                    disabled={confirmLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                  >
                    {confirmLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Confirmar Fechamento
                      </>
                    )}
                  </Button>
                )}
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
