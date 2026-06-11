<template>
  <main class="flex-1 p-6 flex flex-col justify-center items-center">
    <UCard class="max-w-lg w-full">
      <template #header>
        <div class="text-center">
          <h2 class="text-xl font-bold text-gray-950 dark:text-white">Bem-vindo ao MEI Finance!</h2>
          <p class="text-xs text-gray-500 mt-1">
            Sua conta está criada e sua autenticação está funcionando sob a metodologia do SDD.
          </p>
        </div>
      </template>

      <div class="space-y-4">
        <p class="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
          Esta é a Dashboard segura protegida por token Laravel Sanctum com controle de sessão gerenciado pelo Nuxt.
        </p>
        
        <div class="bg-gray-100 dark:bg-zinc-800 rounded-xl p-4 text-xs font-mono overflow-x-auto space-y-1 text-gray-800 dark:text-zinc-300">
          <div>Session status: Authenticated</div>
          <div>User: {{ user?.email }}</div>
          <div>CNPJ: {{ user?.cnpj || 'Não cadastrado' }}</div>
          <div>Role: {{ user?.role || 'default' }}</div>
          <div>Status: {{ user?.active ? 'Active (Ativo)' : 'Inactive (Inativo)' }}</div>
        </div>
      </div>
    </UCard>

    <p class="text-xs text-gray-400 dark:text-zinc-500 mt-6">
      Módulo 001-autenticacao finalizado. Pronto para iniciar o módulo 002-importacao-extrato.
    </p>
  </main>
</template>

<script setup lang="ts">
const { user } = useAuth()
</script>
