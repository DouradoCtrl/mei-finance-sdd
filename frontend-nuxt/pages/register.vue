<template>
  <main class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <UCard>
        <template #header>
          <div class="text-center">
            <h1 class="text-3xl font-bold tracking-tight">MEI Finance</h1>
            <p class="text-sm text-gray-500 mt-1">
              Crie sua conta e organize suas finanças PJ e PF
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
          <UFormGroup label="Nome Completo" name="name" required>
            <UInput
              id="name"
              v-model="name"
              type="text"
              placeholder="Ex: Carlos Silva"
              required
              :disabled="loading"
            />
          </UFormGroup>

          <UFormGroup label="E-mail de Acesso" name="email" required>
            <UInput
              id="email"
              v-model="email"
              type="email"
              placeholder="Ex: carlos@email.com"
              required
              :disabled="loading"
            />
          </UFormGroup>

          <UFormGroup label="CNPJ (Opcional)" name="cnpj">
            <UInput
              id="cnpj"
              v-model="cnpj"
              type="text"
              placeholder="Ex: 12.345.678/0001-99"
              :disabled="loading"
            />
          </UFormGroup>

          <UFormGroup label="Senha (mínimo 6 dígitos)" name="password" required>
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
            Cadastrar
          </UButton>
        </form>

        <template #footer>
          <div class="text-center text-xs text-gray-500">
            Já tem uma conta? 
            <NuxtLink to="/login" class="text-primary hover:underline font-semibold">
              Entrar
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
    }, 1500)
  } else {
    error.value = result.message || 'Falha ao realizar cadastro.'
    loading.value = false
  }
}
</script>
