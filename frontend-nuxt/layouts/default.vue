<template>
  <div class="min-h-screen flex bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-zinc-100">
    <!-- Sidebar for Desktop -->
    <aside 
      class="hidden md:flex flex-col bg-white dark:bg-zinc-950 border-r border-gray-100 dark:border-zinc-800/80 transition-all duration-300 shrink-0"
      :class="[isCollapsed ? 'w-16' : 'w-64']"
    >
      <!-- Logo Header -->
      <div class="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-zinc-800/80">
        <NuxtLink to="/dashboard" class="flex items-center gap-2.5 overflow-hidden">
          <div class="shrink-0 w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-sm tracking-widest shadow-sm">
            MF
          </div>
          <div v-if="!isCollapsed" class="flex flex-col select-none animate-fade-in">
            <span class="font-semibold text-xs tracking-tight text-gray-900 dark:text-white leading-tight">MEI Finance</span>
            <span class="text-[9px] text-gray-400 font-mono leading-none">PJ & PF Organizado</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.url"
          :to="item.url"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all group"
          :class="[
            route.path === item.url 
              ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' 
              : 'text-gray-400 dark:text-zinc-500 hover:bg-gray-50 dark:hover:bg-zinc-900/50 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          <UIcon :name="item.icon" class="size-5 shrink-0 transition-transform group-hover:scale-105" />
          <span v-if="!isCollapsed" class="truncate">{{ item.title }}</span>
        </NuxtLink>
      </nav>

      <!-- Footer / User Profile -->
      <div class="p-3 border-t border-gray-100 dark:border-zinc-800/80">
        <UDropdown :items="dropdownItems" :popper="{ placement: 'right-end' }" class="w-full">
          <button class="w-full flex items-center gap-3 p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors text-left">
            <UAvatar
              :alt="userName"
              size="sm"
              class="shrink-0"
              :ui="{ background: 'bg-emerald-500 text-white' }"
            />
            <div v-if="!isCollapsed" class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-gray-900 dark:text-white truncate">
                {{ userFirstName }}
              </p>
              <p class="text-[10px] text-gray-400 truncate font-mono">
                {{ user?.email }}
              </p>
            </div>
            <UIcon v-if="!isCollapsed" name="i-heroicons-chevron-up-down" class="size-4 text-gray-400 shrink-0" />
          </button>

          <template #account>
            <div class="text-left px-2 py-1.5 select-none">
              <p class="text-[9px] font-mono text-gray-400 uppercase tracking-wider">Conta ativa</p>
              <p class="text-xs font-semibold text-gray-900 dark:text-white truncate mt-0.5">
                {{ user?.name }}
              </p>
              <p class="text-[10px] text-gray-500 truncate font-mono">
                {{ user?.email }}
              </p>
            </div>
          </template>
        </UDropdown>
      </div>
    </aside>

    <!-- Content Area -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <!-- Desktop Header -->
      <header class="hidden md:flex h-16 items-center justify-between px-6 bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800/80 shrink-0">
        <div class="flex items-center gap-3">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-bars-2"
            class="text-gray-400 hover:text-gray-900 dark:hover:text-white"
            @click="isCollapsed = !isCollapsed"
          />
          <span class="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest font-mono select-none">
            {{ currentPathName }}
          </span>
        </div>
      </header>

      <!-- Mobile Header -->
      <header class="md:hidden h-16 flex items-center justify-between px-4 bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 shrink-0">
        <NuxtLink to="/dashboard" class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm">
            MF
          </div>
          <span class="font-bold text-sm tracking-tight text-gray-950 dark:text-white">MEI Finance</span>
        </NuxtLink>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-bars-3"
          @click="isMobileMenuOpen = true"
        />
      </header>

      <!-- Mobile Slideover Menu -->
      <USlideover v-model="isMobileMenuOpen" side="left" class="md:hidden">
        <div class="flex flex-col h-full bg-white dark:bg-zinc-950 p-4">
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-zinc-800">
            <NuxtLink to="/dashboard" class="flex items-center gap-2.5" @click="isMobileMenuOpen = false">
              <div class="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                MF
              </div>
              <span class="font-bold text-sm text-gray-950 dark:text-white">MEI Finance</span>
            </NuxtLink>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="isMobileMenuOpen = false" />
          </div>

          <nav class="flex-1 py-4 space-y-1">
            <NuxtLink 
              v-for="item in navItems" 
              :key="item.url"
              :to="item.url"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
              :class="[
                route.path === item.url 
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' 
                  : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-900'
              ]"
              @click="isMobileMenuOpen = false"
            >
              <UIcon :name="item.icon" class="size-5 shrink-0" />
              <span>{{ item.title }}</span>
            </NuxtLink>
          </nav>

          <div class="pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-3">
            <div class="flex items-center gap-3 px-2">
              <UAvatar :alt="userName" size="sm" />
              <div class="flex-1 min-w-0">
                <p class="text-xs font-semibold text-gray-900 dark:text-white truncate">
                  {{ user?.name }}
                </p>
                <p class="text-[10px] text-gray-400 truncate font-mono">
                  {{ user?.email }}
                </p>
              </div>
            </div>
            <UButton
              color="red"
              variant="light"
              icon="i-heroicons-arrow-left-on-rectangle"
              block
              @click="handleLogout"
            >
              Sair
            </UButton>
          </div>
        </div>
      </USlideover>

      <!-- Main Slot Content -->
      <div class="flex-1 overflow-y-auto">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { user, logout } = useAuth()

const isCollapsed = ref(false)
const isMobileMenuOpen = ref(false)

const navItems = [
  { title: 'Painel Geral', url: '/dashboard', icon: 'i-heroicons-squares-2x2' },
  { title: 'Fluxo de Caixa', url: '/dashboard/receitas', icon: 'i-heroicons-banknotes' }
]

const currentPathName = computed(() => {
  if (route.path === '/dashboard') return 'Painel Geral'
  if (route.path === '/dashboard/receitas') return 'Fluxo de Caixa'
  return ''
})

const userName = computed(() => user.value?.name || 'Microempreendedor')
const userFirstName = computed(() => userName.value.split(' ')[0])

const handleLogout = async () => {
  await logout()
}

const dropdownItems = computed(() => [
  [
    {
      label: 'account_info',
      slot: 'account',
      disabled: true
    }
  ],
  [
    {
      label: 'Sair',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      click: handleLogout
    }
  ]
])
</script>
