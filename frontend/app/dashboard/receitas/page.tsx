'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Loader2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  TrendingDown,
  Wallet,
  CreditCard,
  Trash2,
  AlertTriangle,
  Clock,
  Building2,
  User,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { GlowCard, GlowButton, GlowBadge } from '@/components/custom/GlowUI';
import { GlowDialog } from '@/components/custom/GlowDialog';
import { GlowUpload } from '@/components/custom/GlowUpload';
import { 
  GlowTable, 
  GlowTableHeader, 
  GlowTableBody, 
  GlowTableRow, 
  GlowTableHead, 
  GlowTableCell, 
  GlowTableContainer 
} from '@/components/custom/GlowTable';
import { 
  getTransactions, 
  parseStatement, 
  confirmTransactions, 
  deleteTransaction,
  updateTransactionClassification,
  TransactionPayload 
} from '@/services/transaction.service';
import { cn } from '@/lib/utils';

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

  const kpiConfig = useMemo(() => {
    let labelFat = 'Faturamento (PJ)';
    let labelGas = 'Gastos (PJ)';
    let labelLuc = 'Lucro Líquido';

    if (activeTab === 'personal_pf') {
      labelFat = 'Entradas (PF)';
      labelGas = 'Saídas (PF)';
      labelLuc = 'Saldo (PF)';
    } else if (activeTab === 'transfer') {
      labelFat = 'Entradas (Neutro)';
      labelGas = 'Saídas (Neutro)';
      labelLuc = 'Saldo (Neutro)';
    } else if (activeTab === 'pending') {
      labelFat = 'Entradas (Pendentes)';
      labelGas = 'Saídas (Pendentes)';
      labelLuc = 'Saldo (Pendente)';
    }

    const isLucroPositive = kpis.lucro >= 0;
    
    return [
      {
        label: labelFat,
        value: kpis.faturamento,
        icon: ArrowUpRight,
        iconColor: 'text-emerald-500 dark:text-emerald-400',
        iconBg: 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/30 dark:border-emerald-900/20',
        indicatorBg: 'bg-emerald-500',
        bgGradient: 'bg-gradient-to-r from-emerald-50/15 to-transparent dark:from-emerald-950/5',
        glowShadow: 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.03)] hover:shadow-[0_0_20px_rgba(16,185,129,0.12)] hover:border-emerald-500/30',
      },
      {
        label: labelGas,
        value: kpis.gastos,
        icon: ArrowDownLeft,
        iconColor: 'text-rose-500 dark:text-rose-400',
        iconBg: 'bg-rose-50 dark:bg-rose-950/30 border border-rose-100/30 dark:border-rose-900/20',
        indicatorBg: 'bg-rose-500',
        bgGradient: 'bg-gradient-to-r from-rose-50/15 to-transparent dark:from-rose-950/5',
        glowShadow: 'shadow-[0_0_15px_-3px_rgba(244,63,94,0.03)] hover:shadow-[0_0_20px_rgba(244,63,94,0.12)] hover:border-rose-500/30',
      },
      {
        label: labelLuc,
        value: kpis.lucro,
        icon: isLucroPositive ? TrendingUp : TrendingDown,
        iconColor: isLucroPositive ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400',
        iconBg: isLucroPositive
          ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/30 dark:border-emerald-900/20'
          : 'bg-rose-50 dark:bg-rose-950/30 border border-rose-100/30 dark:border-rose-900/20',
        indicatorBg: isLucroPositive ? 'bg-emerald-500' : 'bg-rose-500',
        bgGradient: isLucroPositive
          ? 'bg-gradient-to-r from-emerald-50/15 to-transparent dark:from-emerald-950/5'
          : 'bg-gradient-to-r from-rose-50/15 to-transparent dark:from-rose-950/5',
        glowShadow: isLucroPositive
          ? 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.03)] hover:shadow-[0_0_20px_rgba(16,185,129,0.12)] hover:border-emerald-500/30'
          : 'shadow-[0_0_15px_-3px_rgba(244,63,94,0.03)] hover:shadow-[0_0_20px_rgba(244,63,94,0.12)] hover:border-rose-500/30',
        valueClass: isLucroPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400',
      },
    ];
  }, [kpis, activeTab]);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  // Envia arquivo OFX para o backend estruturar temporariamente na tela
  const handleUploadOFX = async () => {
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
        <div className="flex flex-col items-center gap-2 select-none">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          <p className="text-xs text-zinc-400">Carregando Receitas...</p>
        </div>
      </div>
    );
  }

  const mainTabs = useMemo(() => {
    return [
      { 
        label: 'Pendentes', 
        value: 'pending' as const, 
        desc: 'Aguardando conciliação', 
        icon: Clock,
        indicatorBg: 'bg-amber-500',
        dotColor: 'bg-amber-500',
        iconBg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-100/30 dark:border-amber-900/20 text-amber-500 dark:text-amber-400',
        bgGradient: 'bg-gradient-to-br from-amber-500/5 to-transparent dark:from-amber-500/2',
        glowShadow: 'shadow-[0_0_15px_-3px_rgba(245,158,11,0.03)] hover:shadow-[0_0_20px_rgba(245,158,11,0.08)] hover:border-amber-500/20'
      },
      { 
        label: 'Pessoa Jurídica (PJ)', 
        value: 'business_pj' as const, 
        desc: 'Controle da empresa', 
        icon: Building2,
        indicatorBg: 'bg-emerald-500',
        dotColor: 'bg-emerald-500',
        iconBg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100/30 dark:border-emerald-900/20 text-emerald-500 dark:text-emerald-400',
        bgGradient: 'bg-gradient-to-br from-emerald-500/5 to-transparent dark:from-emerald-500/2',
        glowShadow: 'shadow-[0_0_15px_-3px_rgba(16,185,129,0.03)] hover:shadow-[0_0_20px_rgba(16,185,129,0.08)] hover:border-emerald-500/20'
      },
      { 
        label: 'Pessoa Física (PF)', 
        value: 'personal_pf' as const, 
        desc: 'Despesas pessoais', 
        icon: User,
        indicatorBg: 'bg-sky-500',
        dotColor: 'bg-sky-500',
        iconBg: 'bg-sky-50 dark:bg-sky-950/30 border-sky-100/30 dark:border-sky-900/20 text-sky-500 dark:text-sky-400',
        bgGradient: 'bg-gradient-to-br from-sky-500/5 to-transparent dark:from-sky-500/2',
        glowShadow: 'shadow-[0_0_15px_-3px_rgba(14,165,233,0.03)] hover:shadow-[0_0_20px_rgba(14,165,233,0.08)] hover:border-sky-500/20'
      },
      { 
        label: 'Neutro / Transf.', 
        value: 'transfer' as const, 
        desc: 'Movimentações isentas', 
        icon: RefreshCw,
        indicatorBg: 'bg-zinc-550 dark:bg-zinc-650',
        dotColor: 'bg-zinc-550 dark:bg-zinc-650',
        iconBg: 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-150 dark:border-zinc-700/50 text-zinc-500 dark:text-zinc-400',
        bgGradient: 'bg-gradient-to-br from-zinc-500/5 to-transparent dark:from-zinc-500/2',
        glowShadow: 'shadow-[0_0_15px_-3px_rgba(113,113,122,0.03)] hover:shadow-[0_0_20px_rgba(113,113,122,0.08)] hover:border-zinc-500/20'
      },
    ];
  }, []);

  const sourceTabs = [
    { label: 'Conta Corrente', value: 'checking_account', icon: Wallet },
    { label: 'Cartão de Crédito', value: 'credit_card', icon: CreditCard },
  ] as const;

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 p-6 space-y-6 max-w-6xl w-full mx-auto">
        
        {/* Cabeçalho da Página com Título e Botão de Ação */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-950 dark:text-white">Fluxo de Caixa</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Acompanhe seu faturamento, controle despesas e faça conciliações rápidas via extrato.
            </p>
          </div>
          <GlowButton 
            onClick={() => {
              setTempTransactions([]);
              setFile(null);
              setIsImportModalOpen(true);
            }}
            className="text-xs font-semibold uppercase tracking-wider px-3.5 py-2 rounded-lg"
          >
            Importar Extrato OFX
          </GlowButton>
        </div>

        {/* Filtro de Contexto (Bento Cards de Escopo) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 select-none">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "relative overflow-hidden p-4 rounded-2xl border flex flex-col items-start gap-2.5 text-left transition-all duration-300 cursor-pointer hover:-translate-y-0.5",
                  isActive
                    ? cn(
                        "bg-white dark:bg-zinc-950 border-zinc-200/80 dark:border-zinc-800",
                        tab.glowShadow,
                        tab.bgGradient
                      )
                    : "bg-white/40 dark:bg-zinc-950/40 border-zinc-150 dark:border-zinc-800/40 text-zinc-450 dark:text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-white/60 dark:hover:bg-zinc-900/40"
                )}
              >
                {/* Active left indicator bar */}
                {isActive && <div className={cn("absolute left-0 top-0 bottom-0 w-1", tab.indicatorBg)} />}

                <div className="flex items-center justify-between w-full">
                  <div className={cn(
                    "p-1.5 rounded-lg shrink-0 border",
                    isActive ? tab.iconBg : "bg-zinc-50 dark:bg-zinc-900/60 border-zinc-100 dark:border-zinc-800/30 text-zinc-400 dark:text-zinc-550"
                  )}>
                    <Icon className="size-4" />
                  </div>
                  {/* Small active dot */}
                  {isActive && <span className={cn("w-1.5 h-1.5 rounded-full animate-ping", tab.dotColor)} />}
                </div>

                <div className="space-y-0.5">
                  <h4 className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    isActive ? "text-zinc-900 dark:text-white" : "text-zinc-400 dark:text-zinc-500"
                  )}>
                    {tab.label}
                  </h4>
                  <p className="text-[9px] text-zinc-400 dark:text-zinc-500 leading-tight">
                    {tab.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filtros de Origem (Pills com Glow e Vidro) */}
        <div className="flex items-center gap-2 select-none">
          {sourceTabs.map((src) => {
            const Icon = src.icon;
            const isActive = activeSource === src.value;
            return (
              <button
                key={src.value}
                onClick={() => setActiveSource(src.value)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-300 border cursor-pointer",
                  isActive
                    ? "border-emerald-500/50 bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]"
                    : "border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-950/40 text-zinc-400 dark:text-zinc-500 hover:border-zinc-350 dark:hover:border-zinc-700 hover:text-zinc-950 dark:hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0 transition-transform duration-300", isActive && "scale-105")} />
                <span>{src.label}</span>
              </button>
            );
          })}
        </div>

        {/* Cards de KPIs (Atualizados com base nas seleções de abas) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kpiConfig.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <GlowCard
                key={kpi.label}
                glow={false}
                className={cn(
                  "relative overflow-hidden p-5 flex flex-col gap-3.5 justify-center items-start text-left pl-7 hover:-translate-y-0.5 transition-all duration-300",
                  kpi.bgGradient,
                  kpi.glowShadow
                )}
              >
                {/* Dynamic indicator bar based on KPI color */}
                <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", kpi.indicatorBg)} />

                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 select-none">
                    {kpi.label}
                  </span>
                  <div className={cn("p-1.5 rounded-lg shrink-0", kpi.iconBg)}>
                    <Icon className={cn("size-4", kpi.iconColor)} />
                  </div>
                </div>
                <div className={cn("text-2xl font-semibold tracking-tight font-mono", kpi.valueClass || "text-zinc-900 dark:text-white")}>
                  R$ {kpi.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </GlowCard>
            );
          })}
        </div>

        {/* Tabela de Histórico Persistido */}
        <GlowTableContainer>
          <div className="p-5 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/20 dark:bg-zinc-900/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-white">Lançamentos Conciliados</h3>
            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Valores persistidos no banco de dados</p>
          </div>

          {fetchLoading ? (
            <div className="p-12 flex justify-center items-center">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-405" />
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-400 select-none">
              Nenhum lançamento registrado para estes filtros.
            </div>
          ) : (
            <GlowTable>
              <GlowTableHeader>
                <GlowTableRow>
                  <GlowTableHead>Data</GlowTableHead>
                  <GlowTableHead>Descrição</GlowTableHead>
                  <GlowTableHead>Valor</GlowTableHead>
                  <GlowTableHead className="text-center">Classificação</GlowTableHead>
                  <GlowTableHead className="text-center"></GlowTableHead>
                </GlowTableRow>
              </GlowTableHeader>
              <GlowTableBody>
                {filteredHistory.map((tx) => {
                  const isPositive = tx.amount > 0;
                  return (
                    <GlowTableRow key={tx.id}>
                      <GlowTableCell className="font-mono text-zinc-450 dark:text-zinc-500 whitespace-nowrap">
                        {tx.transaction_date.split('-').reverse().join('/')}
                      </GlowTableCell>
                      <GlowTableCell className="whitespace-normal break-words max-w-[150px] sm:max-w-xs">
                        <div className="font-medium text-zinc-950 dark:text-white">{tx.description}</div>
                        {tx.fit_id && (
                          <div className="text-[9px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">
                            FITID: {tx.fit_id}
                          </div>
                        )}
                      </GlowTableCell>
                      <GlowTableCell className={cn("font-semibold font-mono", isPositive ? "text-emerald-500" : "text-rose-500")}>
                        {isPositive ? '+' : ''}R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </GlowTableCell>
                      <GlowTableCell>
                        <div className="flex justify-center">
                          <div className="inline-flex bg-zinc-100/80 dark:bg-zinc-900/60 p-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/40 select-none shadow-inner">
                            <button
                              type="button"
                              onClick={() => handleReclassifySaved(tx.id!, 'business_pj')}
                              className={cn(
                                "px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer",
                                tx.classification === 'business_pj'
                                  ? "bg-emerald-500 text-white shadow-sm"
                                  : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                              )}
                            >
                              PJ
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReclassifySaved(tx.id!, 'personal_pf')}
                              className={cn(
                                "px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer",
                                tx.classification === 'personal_pf'
                                  ? "bg-sky-500 text-white shadow-sm"
                                  : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                              )}
                            >
                              PF
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReclassifySaved(tx.id!, 'transfer')}
                              className={cn(
                                "px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer",
                                tx.classification === 'transfer'
                                  ? "bg-zinc-500 dark:bg-zinc-700 text-white shadow-sm"
                                  : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                              )}
                            >
                              Neutro
                            </button>
                          </div>
                        </div>
                      </GlowTableCell>
                      <GlowTableCell>
                        <div className="flex justify-center">
                          <GlowButton
                            variant="ghost"
                            onClick={() => {
                              setTransactionToDelete(tx.id!);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                          >
                            <Trash2 className="size-4" />
                          </GlowButton>
                        </div>
                      </GlowTableCell>
                    </GlowTableRow>
                  );
                })}
              </GlowTableBody>
            </GlowTable>
          )}
        </GlowTableContainer>

        {/* Modal/Dialog de Importação e Conciliação */}
        <GlowDialog
          open={isImportModalOpen}
          onOpenChange={setIsImportModalOpen}
          title="Conciliação de Extrato"
          description={`Origem: ${activeSource === 'checking_account' ? 'CONTA CORRENTE' : 'CARTÃO DE CRÉDITO'}`}
          className="max-w-3xl lg:max-w-5xl w-full"
        >
          <div className="space-y-4">
            {tempTransactions.length === 0 ? (
              <div className="space-y-4">
                <GlowUpload
                  onFileSelect={handleFileSelect}
                  selectedFile={file}
                  loading={importLoading}
                />
                <GlowButton
                  onClick={handleUploadOFX}
                  disabled={!file || importLoading}
                  loading={importLoading}
                  className="w-full py-2.5"
                >
                  Processar Extrato
                </GlowButton>
              </div>
            ) : (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                <GlowTableContainer>
                  <GlowTable>
                    <GlowTableHeader>
                      <GlowTableRow>
                        <GlowTableHead>Data</GlowTableHead>
                        <GlowTableHead>Descrição</GlowTableHead>
                        <GlowTableHead>Valor</GlowTableHead>
                        <GlowTableHead className="text-center">Classificação</GlowTableHead>
                      </GlowTableRow>
                    </GlowTableHeader>
                    <GlowTableBody>
                      {tempTransactions.map((tx, index) => {
                        const isPositive = tx.amount > 0;
                        return (
                          <GlowTableRow 
                            key={index}
                            className={cn(
                              tx.is_duplicate && "bg-amber-500/5 opacity-70",
                              tx.classification === 'business_pj' && "bg-emerald-500/5 border-l-2 border-l-emerald-500",
                              tx.classification === 'personal_pf' && "bg-sky-500/5 border-l-2 border-l-sky-500",
                              tx.classification === 'transfer' && "bg-zinc-500/5 border-l-2 border-l-zinc-500"
                            )}
                          >
                            <GlowTableCell className="font-mono text-zinc-450 dark:text-zinc-500 whitespace-nowrap">
                              {tx.transaction_date.split('-').reverse().join('/')}
                            </GlowTableCell>
                            <GlowTableCell className="whitespace-normal break-words max-w-[150px] sm:max-w-xs">
                              <div className="font-medium flex items-center gap-1.5 flex-wrap text-zinc-950 dark:text-white">
                                <span>{tx.description}</span>
                                {tx.is_duplicate && (
                                  <GlowBadge color="amber">Duplicada</GlowBadge>
                                )}
                              </div>
                            </GlowTableCell>
                            <GlowTableCell className={cn("font-semibold font-mono", isPositive ? "text-emerald-500" : "text-rose-500")}>
                              {isPositive ? '+' : ''}R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </GlowTableCell>
                            <GlowTableCell>
                              <div className="flex justify-center">
                                <div className="inline-flex bg-zinc-100/80 dark:bg-zinc-900/60 p-0.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800/40 select-none shadow-inner">
                                  <button
                                    type="button"
                                    onClick={() => handleClassifyTemp(index, 'business_pj')}
                                    className={cn(
                                      "px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer",
                                      tx.classification === 'business_pj'
                                        ? "bg-emerald-500 text-white shadow-sm"
                                        : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                                    )}
                                  >
                                    PJ
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleClassifyTemp(index, 'personal_pf')}
                                    className={cn(
                                      "px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer",
                                      tx.classification === 'personal_pf'
                                        ? "bg-sky-500 text-white shadow-sm"
                                        : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                                    )}
                                  >
                                    PF
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleClassifyTemp(index, 'transfer')}
                                    className={cn(
                                      "px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer",
                                      tx.classification === 'transfer'
                                        ? "bg-zinc-500 dark:bg-zinc-700 text-white shadow-sm"
                                        : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                                    )}
                                  >
                                    Neutro
                                  </button>
                                </div>
                              </div>
                            </GlowTableCell>
                          </GlowTableRow>
                        );
                      })}
                    </GlowTableBody>
                  </GlowTable>
                </GlowTableContainer>
              </div>
            )}

            {tempTransactions.length > 0 && (
              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                <GlowButton variant="ghost" onClick={() => setIsImportModalOpen(false)}>
                  Cancelar
                </GlowButton>
                <GlowButton 
                  variant="primary" 
                  loading={confirmLoading}
                  onClick={handleConfirmImport}
                >
                  Confirmar Fechamento
                </GlowButton>
              </div>
            )}
          </div>
        </GlowDialog>

        {/* Dialog de Confirmação de Exclusão (Dupla Confirmação) */}
        <GlowDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          title={
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-red-500 animate-pulse shrink-0" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                Excluir Lançamento
              </h3>
            </div>
          }
          className="max-w-[360px]"
        >
          <div className="select-none p-1">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Você está prestes a excluir esta transação permanentemente. Esta ação atualizará seus relatórios e removerá os dados do servidor.
            </p>
            
            <div className="mt-5 flex gap-2.5">
              <GlowButton 
                variant="ghost" 
                onClick={() => setIsDeleteDialogOpen(false)}
                className="flex-1 py-2" 
              >
                Cancelar
              </GlowButton>
              <GlowButton 
                variant="danger" 
                onClick={() => {
                  if (transactionToDelete !== null) {
                    handleDeleteSaved(transactionToDelete);
                    setIsDeleteDialogOpen(false);
                    setTransactionToDelete(null);
                  }
                }}
                className="flex-1 py-2" 
              >
                Confirmar
              </GlowButton>
            </div>
          </div>
        </GlowDialog>

      </main>
    </div>
  );
}
