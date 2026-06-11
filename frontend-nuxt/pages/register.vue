<template>
  <main class="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-zinc-900">
    <div class="w-full max-w-sm space-y-6">
      <!-- Logo and Intro -->
      <div class="text-center space-y-2 select-none animate-fade-in">
        <div class="inline-flex w-10 h-10 rounded-xl bg-emerald-500 text-white items-center justify-center font-bold text-base shadow-sm">
          MF
        </div>
        <h1 class="text-xl font-bold tracking-tight text-gray-950 dark:text-white">Criar Nova Conta</h1>
        <p class="text-xs text-gray-400">
          Gerencie suas finanças PJ e PF no mesmo lugar.
        </p>
      </div>

      <!-- Main Register Card -->
      <UCard 
        :ui="{ 
          base: 'border border-gray-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 shadow-none rounded-2xl',
          body: { padding: 'p-6 space-y-4' }
        }"
      >
        <div v-if="error" class="text-xs text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg border border-red-100 dark:border-red-900/50">
          {{ error }}
        </div>

        <div v-if="success" class="text-xs text-green-500 bg-green-50 dark:bg-green-950/20 px-3 py-2 rounded-lg border border-green-100 dark:border-green-900/50">
          {{ success }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <UFormGroup label="Nome Completo" name="name" :ui="{ label: { wrapper: 'mb-1', text: 'text-[10px] font-bold uppercase tracking-wider text-gray-400' } }">
            <UInput
              id="name"
              v-model="name"
              type="text"
              placeholder="Carlos Silva"
              required
              size="md"
              :disabled="loading"
              :ui="{ rounded: 'rounded-lg' }"
            />
          </UFormGroup>

          <UFormGroup label="E-mail de Acesso" name="email" :ui="{ label: { wrapper: 'mb-1', text: 'text-[10px] font-bold uppercase tracking-wider text-gray-400' } }">
            <UInput
              id="email"
              v-model="email"
              type="email"
              placeholder="carlos@email.com"
              required
              size="md"
              :disabled="loading"
              :ui="{ rounded: 'rounded-lg' }"
            />
          </UFormGroup>

          <UFormGroup label="CNPJ (Opcional)" name="cnpj" :ui="{ label: { wrapper: 'mb-1', text: 'text-[10px] font-bold uppercase tracking-wider text-gray-400' } }">
            <UInput
              id="cnpj"
              v-model="cnpj"
              type="text"
              placeholder="12.345.678/0001-99"
              size="md"
              :disabled="loading"
              :ui="{ rounded: 'rounded-lg' }"
            />
          </UFormGroup>

          <UFormGroup label="Senha (mínimo 6 dígitos)" name="password" :ui="{ label: { wrapper: 'mb-1', text: 'text-[10px] font-bold uppercase tracking-wider text-gray-400' } }">
            <UInput
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              size="md"
              :disabled="loading"
              :ui="{ rounded: 'rounded-lg' }"
            />
          </UFormGroup>

          <UButton
            type="submit"
            block
            color="emerald"
            class="text-xs font-semibold uppercase tracking-wider py-2.5 rounded-lg mt-2"
            :loading="loading"
          >
            Cadastrar Conta
          </UButton>
        </form>
      </UCard>

      <!-- Footer navigation links -->
      <p class="text-center text-xs text-gray-400 select-none">
        Já possui cadastro? 
        <NuxtLink to="/login" class="text-emerald-500 hover:text-emerald-600 font-semibold underline">
          Entrar na sua conta
        </NuxtLink>
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: false
})

const name = ref('')
const email = ref('')
const cnpj = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const { register } = useAuth()

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  loading.value = true

  if (password.value.length < 6) {
    error.value = 'A senha deve conter no mínimo 6 caracteres.'
    loading.value = false
    return
  }

  const result = await register({
    name: name.value,
    email: email.value,
    cnpj: cnpj.value || null,
    password: password.value
  })

  if (result.success) {
    success.value = 'Cadastro realizado com sucesso! Conectando...'
    setTimeout(() => {
      navigateTo('/dashboard')
    }, 1200)
  } else {
    error.value = result.message || 'Falha ao realizar cadastro. Tente novamente.'
    loading.value = false
  }
}
</script>
