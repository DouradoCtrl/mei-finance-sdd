<template>
  <div class="p-6 max-w-4xl mx-auto space-y-6">
    <div class="space-y-1 select-none animate-fade-in">
      <h1 class="text-xl font-bold text-gray-950 dark:text-white">Bem-vindo, {{ userFirstName }}!</h1>
      <p class="text-xs text-gray-400">Aqui está um resumo do seu perfil e o status da sua sessão.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Session Card -->
      <UCard 
        :ui="{ 
          base: 'md:col-span-2 border border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 shadow-none rounded-xl',
          header: { padding: 'p-4 border-b border-gray-100 dark:border-zinc-800/80 bg-gray-50/20 dark:bg-zinc-900/10' },
          body: { padding: 'p-5 space-y-4' }
        }"
      >
        <template #header>
          <span class="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white">Detalhes do Acesso</span>
        </template>
        
        <p class="text-xs text-gray-500 leading-relaxed">
          Sua conexão segura via token Laravel Sanctum está ativa e as rotas seguras estão protegidas. 
          Você pode gerenciar as receitas PJ e PF na aba de Fluxo de Caixa no menu lateral.
        </p>

        <div class="bg-gray-50 dark:bg-zinc-900/80 rounded-lg p-4 text-[11px] font-mono text-gray-600 dark:text-zinc-300 space-y-1.5 border border-gray-100 dark:border-zinc-800/50">
          <div class="flex justify-between border-b border-gray-100 dark:border-zinc-800/30 pb-1">
            <span class="text-gray-400">Usuário</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ user?.name }}</span>
          </div>
          <div class="flex justify-between border-b border-gray-100 dark:border-zinc-800/30 pb-1">
            <span class="text-gray-400">E-mail</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ user?.email }}</span>
          </div>
          <div class="flex justify-between border-b border-gray-100 dark:border-zinc-800/30 pb-1">
            <span class="text-gray-400">CNPJ</span>
            <span class="font-semibold text-gray-900 dark:text-white font-mono">{{ user?.cnpj || 'Não Cadastrado' }}</span>
          </div>
          <div class="flex justify-between border-b border-gray-100 dark:border-zinc-800/30 pb-1">
            <span class="text-gray-400">Perfil</span>
            <span class="font-semibold uppercase text-[9px] bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-gray-500 dark:text-zinc-400">{{ user?.role }}</span>
          </div>
          <div class="flex justify-between pt-0.5">
            <span class="text-gray-400">Status</span>
            <span class="font-bold text-emerald-500 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Ativo
            </span>
          </div>
        </div>
      </UCard>

      <!-- Quick actions Bento Card -->
      <UCard 
        :ui="{ 
          base: 'border border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 shadow-none rounded-xl',
          header: { padding: 'p-4 border-b border-gray-100 dark:border-zinc-800/80 bg-gray-50/20 dark:bg-zinc-900/10' },
          body: { padding: 'p-5 flex flex-col gap-3 justify-center h-full min-h-[160px]' }
        }"
      >
        <template #header>
          <span class="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white">Acesso Rápido</span>
        </template>
        
        <p class="text-[11px] text-gray-400 leading-relaxed text-center mb-1 select-none">
          Importe seu extrato bancário e comece a reconciliação.
        </p>

        <UButton
          to="/dashboard/receitas"
          color="emerald"
          icon="i-heroicons-banknotes"
          block
          class="text-xs font-semibold uppercase tracking-wider py-2 rounded-lg"
        >
          Fluxo de Caixa
        </UButton>
      </UCard>
    </div>

    <!-- Metodologia Footer text -->
    <div class="text-center pt-8 select-none">
      <span class="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
        MEI Finance — Desenvolvido sob a Metodologia SDD
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { user } = useAuth()
const userFirstName = computed(() => (user.value?.name || 'Microempreendedor').split(' ')[0])
</script>
