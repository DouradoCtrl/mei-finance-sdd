<template>
  <main class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <UCard>
        <template #header>
          <div class="text-center">
            <h1 class="text-3xl font-bold tracking-tight">MEI Finance</h1>
            <p class="text-sm text-gray-500 mt-1">
              Gerencie suas contas PJ e PF de forma inteligente
            </p>
          </div>
        </template>

        <div v-if="error" class="mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-2.5 rounded">
          {{ error }}
        </div>

        <div v-if="success" class="mb-4 text-sm text-green-500 bg-green-50 dark:bg-green-950/20 p-2.5 rounded">
          {{ success }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <UFormGroup label="E-mail" name="email" required>
            <UInput
              id="email"
              v-model="email"
              type="email"
              placeholder="Ex: carlos@email.com"
              required
              :disabled="loading"
            />
          </UFormGroup>

          <UFormGroup label="Senha" name="password" required>
            <UInput
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              :disabled="loading"
            />
          </UFormGroup>

          <UButton
            type="submit"
            block
            :loading="loading"
          >
            Entrar
          </UButton>
        </form>

        <template #footer>
          <div class="text-center text-xs text-gray-500">
            Ainda não tem cadastro? 
            <NuxtLink to="/register" class="text-primary hover:underline font-semibold">
              Criar conta
            </NuxtLink>
          </div>
        </template>
      </UCard>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: false
})

const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)

const { login } = useAuth()

const handleSubmit = async () => {
  error.value = ''
  success.value = ''
  loading.value = true

  const result = await login(email.value, password.value)
  if (result.success) {
    success.value = 'Acesso concedido! Carregando painel...'
    setTimeout(() => {
      navigateTo('/dashboard')
    }, 1500)
  } else {
    error.value = result.message || 'Erro ao tentar acessar. Tente novamente.'
    loading.value = false
  }
}
</script>
