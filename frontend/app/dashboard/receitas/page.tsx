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
  CreditCard,
  Wallet,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/header';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  const [activeTab, setActiveTab] = useState<'business_pj' | 'personal_pf' | 'transfer' | 'pending'>('business_pj');
  const [activeSource, setActiveSource] = useState<'checking_account' | 'credit_card'>('checking_account');

  // Estados dos dados
  const [history, setHistory] = useState<TransactionPayload[]>([]);
  const [tempTransactions, setTempTransactions] = useState<TransactionPayload[]>([]);
  
  // Estados da interface de importação
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  // Loadings e Estados do Dialog de Exclusão
  const [fetchLoading, setFetchLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);

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

    const toastId = toast.loading('Processando arquivo OFX...');
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
      toast.success('Extrato processado com sucesso! Classifique os lançamentos.', { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Falha ao importar o arquivo.', { id: toastId });
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

    const toastId = toast.loading('Salvando lançamentos no banco...');
    setConfirmLoading(true);

    try {
      const response = await confirmTransactions(tempTransactions, session.accessToken);
      if (!response.success) {
        throw new Error(response.message || 'Erro ao salvar lançamentos.');
      }

      toast.success('Transações salvas e conciliação realizada com sucesso!', { id: toastId });
      setTempTransactions([]);
      setFile(null);
      setIsImportModalOpen(false);
      
      // Recarrega histórico para atualizar os KPIs e tabela principal
      await fetchHistory();
    } catch (err: any) {
      toast.error(err.message || 'Falha ao confirmar fechamento.', { id: toastId });
    } finally {
      setConfirmLoading(false);
    }
  };

  // Exclui uma transação salva permanentemente
  const handleDeleteSaved = async (id: number) => {
    if (!session?.accessToken) return;
    
    const toastId = toast.loading('Excluindo transação...');
    try {
      const response = await deleteTransaction(id, session.accessToken);
      if (response.success) {
        setHistory((prev) => prev.filter((tx) => tx.id !== id));
        toast.success('Transação excluída com sucesso!', { id: toastId });
      } else {
        toast.error(response.message || 'Erro ao excluir a transação.', { id: toastId });
      }
    } catch (err) {
      console.error('Erro ao excluir transação:', err);
      toast.error('Erro de conexão ao excluir a transação.', { id: toastId });
    }
  };

  // Altera a classificação de uma transação já persistida no banco
  const handleReclassifySaved = async (id: number, classification: 'business_pj' | 'personal_pf' | 'transfer') => {
    if (!session?.accessToken) return;
    
    const toastId = toast.loading('Atualizando classificação...');
    try {
      const response = await updateTransactionClassification(id, classification, session.accessToken);
      if (response.success) {
        setHistory((prev) =>
          prev.map((tx) => (tx.id === id ? { ...tx, classification } : tx))
        );
        toast.success('Classificação atualizada com sucesso!', { id: toastId });
      } else {
        toast.error(response.message || 'Erro ao alterar a classificação.', { id: toastId });
      }
    } catch (err) {
      console.error('Erro ao alterar classificação:', err);
      toast.error('Erro de conexão ao alterar a classificação.', { id: toastId });
    }
  };

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Receitas e Fluxo de Caixa</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Acompanhe seu faturamento, controle despesas e faça conciliações rápidas via extrato.
            </p>
          </div>
          <Button 
            onClick={() => {
              setTempTransactions([]);
              setFile(null);
              setIsImportModalOpen(true);
            }}
            className="flex items-center gap-2 font-medium"
          >
            <UploadCloud className="h-4 w-4" />
            Importar Extrato OFX
          </Button>
        </div>

        {/* Abas Principais (Pendentes vs PJ vs PF vs Neutro) */}
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
          <TabsList variant="line" className="w-full justify-start border-b border-border pb-px">
            <TabsTrigger value="pending" className="px-4 py-2 cursor-pointer">
              Pendentes
            </TabsTrigger>
            <TabsTrigger value="business_pj" className="px-4 py-2 cursor-pointer">
              Pessoa Jurídica (PJ)
            </TabsTrigger>
            <TabsTrigger value="personal_pf" className="px-4 py-2 cursor-pointer">
              Pessoa Física (PF)
            </TabsTrigger>
            <TabsTrigger value="transfer" className="px-4 py-2 cursor-pointer">
              Neutro / Transferências
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Abas Secundárias (Conta Corrente vs Cartão) */}
        <Tabs value={activeSource} onValueChange={(val) => setActiveSource(val as any)}>
          <TabsList className="bg-muted">
            <TabsTrigger value="checking_account" className="flex items-center gap-1.5 cursor-pointer">
              <Wallet className="h-3.5 w-3.5" />
              Conta Corrente
            </TabsTrigger>
            <TabsTrigger value="credit_card" className="flex items-center gap-1.5 cursor-pointer">
              <CreditCard className="h-3.5 w-3.5" />
              Cartão de Crédito
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Cards de KPIs (Atualizados com base nas seleções de abas) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="w-full">
            <CardHeader className="p-4 pb-3 flex flex-col gap-1 items-center text-center">
              <CardDescription className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  {activeTab === 'business_pj' 
                    ? 'Faturamento (PJ)' 
                    : activeTab === 'personal_pf' 
                    ? 'Entradas (PF)' 
                    : activeTab === 'transfer'
                    ? 'Entradas (Neutras)'
                    : 'Entradas (Pendentes)'}
                </span>
              </CardDescription>
              <CardTitle className="text-2xl font-black tracking-tight text-foreground mt-1 font-mono">
                R$ {kpis.faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="w-full">
            <CardHeader className="p-4 pb-3 flex flex-col gap-1 items-center text-center">
              <CardDescription className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <ArrowDownLeft className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>
                  {activeTab === 'business_pj' 
                    ? 'Gastos (PJ)' 
                    : activeTab === 'personal_pf' 
                    ? 'Saídas (PF)' 
                    : activeTab === 'transfer'
                    ? 'Saídas (Neutras)'
                    : 'Saídas (Pendentes)'}
                </span>
              </CardDescription>
              <CardTitle className="text-2xl font-black tracking-tight text-foreground mt-1 font-mono">
                R$ {kpis.gastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="w-full">
            <CardHeader className="p-4 pb-3 flex flex-col gap-1 items-center text-center">
              <CardDescription className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <TrendingUp className={`w-3.5 h-3.5 shrink-0 ${kpis.lucro >= 0 ? 'text-emerald-400' : 'text-rose-400'}`} />
                <span>
                  {activeTab === 'business_pj' 
                    ? 'Lucro Líquido' 
                    : activeTab === 'personal_pf' 
                    ? 'Saldo (PF)' 
                    : activeTab === 'transfer'
                    ? 'Saldo (Neutro)'
                    : 'Saldo (Pendente)'}
                </span>
              </CardDescription>
              <CardTitle className={`text-2xl font-black tracking-tight mt-1 font-mono ${kpis.lucro >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                R$ {kpis.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabela de Histórico Persistido */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border bg-card/50">
            <h3 className="text-base font-semibold text-foreground">Histórico de Lançamentos</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Transações já conciliadas e gravadas no banco de dados para a origem selecionada.
            </p>
          </div>
          {fetchLoading ? (
            <div className="p-12 flex justify-center items-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              Nenhuma transação encontrada no banco de dados para os filtros selecionados.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-muted/30">
                  <TableHead className="px-4 py-3 font-semibold text-xs tracking-wider uppercase">Data</TableHead>
                  <TableHead className="px-4 py-3 font-semibold text-xs tracking-wider uppercase">Descrição</TableHead>
                  <TableHead className="px-4 py-3 font-semibold text-xs tracking-wider uppercase">Valor</TableHead>
                  <TableHead className="px-4 py-3 text-center font-semibold text-xs tracking-wider uppercase">Classificação</TableHead>
                  <TableHead className="px-4 py-3 text-center font-semibold text-xs tracking-wider uppercase">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((tx) => {
                  const isPositive = tx.amount > 0;
                  return (
                    <TableRow key={tx.id} className="hover:bg-muted/10 transition-colors">
                      <TableCell className="px-4 py-3 font-mono text-muted-foreground">
                        {tx.transaction_date.split('-').reverse().join('/')}
                      </TableCell>
                      <TableCell className="px-4 py-3 whitespace-normal break-words max-w-[150px] sm:max-w-xs">
                        <div className="font-medium text-foreground">{tx.description}</div>
                        {tx.fit_id && (
                          <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                            FITID: {tx.fit_id}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className={`px-4 py-3 font-semibold font-mono ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex justify-center gap-1">
                          <Button
                            size="xs"
                            variant={tx.classification === 'business_pj' ? 'secondary' : 'outline'}
                            onClick={() => handleReclassifySaved(tx.id!, 'business_pj')}
                            className={tx.classification === 'business_pj' ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border-emerald-500/20' : 'text-muted-foreground'}
                          >
                            PJ
                          </Button>
                          <Button
                            size="xs"
                            variant={tx.classification === 'personal_pf' ? 'secondary' : 'outline'}
                            onClick={() => handleReclassifySaved(tx.id!, 'personal_pf')}
                            className={tx.classification === 'personal_pf' ? 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 border-sky-500/20' : 'text-muted-foreground'}
                          >
                            PF
                          </Button>
                          <Button
                            size="xs"
                            variant={tx.classification === 'transfer' ? 'secondary' : 'outline'}
                            onClick={() => handleReclassifySaved(tx.id!, 'transfer')}
                            className={tx.classification === 'transfer' ? 'bg-zinc-500/20 hover:bg-zinc-500/30 text-zinc-300 border-zinc-500/30' : 'text-muted-foreground'}
                          >
                            Neutro
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex justify-center">
                          <Button
                            size="xs"
                            variant="destructive"
                            onClick={() => {
                              console.log('Excluir clicado para transação ID:', tx.id);
                              setTransactionToDelete(tx.id!);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="flex items-center gap-1 font-medium"
                          >
                            <Trash2 className="h-3 w-3" />
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Modal/Dialog de Importação e Conciliação */}
        <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
          <DialogContent className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-background border border-border">
            <DialogHeader className="p-6 pb-4 border-b border-border">
              <DialogTitle className="text-lg font-bold">Conciliação de Extrato OFX</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                Origem selecionada: <span className="font-semibold">{activeSource === 'checking_account' ? 'Conta Corrente' : 'Cartão de Crédito'}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Formulário de Upload */}
              {tempTransactions.length === 0 && (
                <form onSubmit={handleUploadOFX} className="space-y-4 py-4">
                  <div className="border border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center gap-3 bg-muted/10">
                    <UploadCloud className="h-8 w-8 text-muted-foreground animate-pulse" />
                    <div>
                      <Label htmlFor="ofxFile" className="cursor-pointer text-sm font-semibold text-primary hover:underline">
                        Clique para selecionar o arquivo
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">Apenas arquivos no formato .ofx</p>
                    </div>
                    <Input
                      id="ofxFile"
                      type="file"
                      accept=".ofx"
                      required
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {file && (
                      <p className="text-xs font-mono bg-muted/50 border border-border px-2.5 py-1 rounded-md text-foreground mt-2">
                        {file.name}
                      </p>
                    )}
                  </div>

                  <Button type="submit" disabled={importLoading || !file} className="w-full">
                    {importLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando arquivo...
                      </>
                    ) : (
                      'Carregar Extrato'
                    )}
                  </Button>
                </form>
              )}

              {/* Grid de Classificação das Transações Temporárias */}
              {tempTransactions.length > 0 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="border border-border rounded-md overflow-hidden bg-card/20">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead className="text-center">Classificação</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tempTransactions.map((tx, index) => {
                          const isPositive = tx.amount > 0;
                          let rowBg = '';
                          if (tx.is_duplicate) {
                            rowBg = 'bg-yellow-500/5 opacity-60';
                          } else if (tx.classification === 'business_pj') {
                            rowBg = 'bg-emerald-500/5 border-l-2 border-l-emerald-500/80';
                          } else if (tx.classification === 'personal_pf') {
                            rowBg = 'bg-sky-500/5 border-l-2 border-l-sky-500/80';
                          } else if (tx.classification === 'transfer') {
                            rowBg = 'bg-zinc-500/5 border-l-2 border-l-zinc-500/80';
                          }

                          return (
                            <TableRow key={index} className={rowBg}>
                              <TableCell className="font-mono text-muted-foreground">
                                {tx.transaction_date.split('-').reverse().join('/')}
                              </TableCell>
                              <TableCell className="whitespace-normal break-words max-w-[150px] sm:max-w-xs">
                                <div className="font-medium flex items-center gap-1.5">
                                  {tx.description}
                                  {tx.is_duplicate && (
                                    <Badge variant="destructive" className="bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20">
                                      <AlertTriangle className="h-2.5 w-2.5" />
                                      Duplicada
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className={`font-semibold font-mono ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-center gap-1">
                                  <Button
                                    size="xs"
                                    variant={tx.classification === 'business_pj' ? 'secondary' : 'outline'}
                                    onClick={() => handleClassifyTemp(index, 'business_pj')}
                                    className={tx.classification === 'business_pj' ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border-emerald-500/20' : 'text-muted-foreground'}
                                  >
                                    PJ
                                  </Button>
                                  <Button
                                    size="xs"
                                    variant={tx.classification === 'personal_pf' ? 'secondary' : 'outline'}
                                    onClick={() => handleClassifyTemp(index, 'personal_pf')}
                                    className={tx.classification === 'personal_pf' ? 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-500 border-sky-500/20' : 'text-muted-foreground'}
                                  >
                                    PF
                                  </Button>
                                  <Button
                                    size="xs"
                                    variant={tx.classification === 'transfer' ? 'secondary' : 'outline'}
                                    onClick={() => handleClassifyTemp(index, 'transfer')}
                                    className={tx.classification === 'transfer' ? 'bg-zinc-500/20 hover:bg-zinc-500/30 text-zinc-300 border-zinc-500/30' : 'text-muted-foreground'}
                                  >
                                    Neutro
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="p-6 border-t border-border flex justify-end gap-3 bg-muted/20">
              <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>
                Cancelar
              </Button>
              {tempTransactions.length > 0 && (
                <Button 
                  onClick={handleConfirmImport} 
                  disabled={confirmLoading}
                  className="flex items-center gap-2 font-medium"
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
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de Confirmação de Exclusão */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <div className="flex items-center gap-2 text-destructive mb-1">
                <AlertTriangle className="h-5 w-5 animate-bounce" />
                <DialogTitle>Excluir Lançamento</DialogTitle>
              </div>
              <DialogDescription className="pt-2 text-sm text-left">
                Você está prestes a excluir esta transação permanentemente. Esta ação atualizará seus relatórios financeiros.
              </DialogDescription>
              <p className="text-[11px] text-muted-foreground pt-1.5 font-semibold text-left">
                Esta ação é irreversível e removerá permanentemente os registros do banco de dados.
              </p>
            </DialogHeader>
            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  console.log('Confirmar Exclusão clicado para transação ID:', transactionToDelete);
                  if (transactionToDelete !== null) {
                    handleDeleteSaved(transactionToDelete);
                    setIsDeleteDialogOpen(false);
                    setTransactionToDelete(null);
                  }
                }}
              >
                Confirmar Exclusão
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </main>
    </div>
  );
}
