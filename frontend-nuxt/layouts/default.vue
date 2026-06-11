<template>
  <div class="min-h-screen flex bg-gray-50 dark:bg-zinc-900">
    <!-- Sidebar for Desktop -->
    <aside 
      class="hidden md:flex flex-col bg-white dark:bg-zinc-950 border-r border-gray-200 dark:border-zinc-800 transition-all duration-300"
      :class="[isCollapsed ? 'w-20' : 'w-64']"
    >
      <!-- Header / Logo -->
      <div class="h-16 flex items-center px-4 border-b border-gray-200 dark:border-zinc-800">
        <NuxtLink to="/dashboard" class="flex items-center gap-3 overflow-hidden">
          <div class="shrink-0 rounded-lg bg-emerald-500 text-white p-2 flex items-center justify-center">
            <UIcon name="i-heroicons-building-library" class="size-5" />
          </div>
          <div v-if="!isCollapsed" class="transition-all duration-200 select-none">
            <div class="font-bold text-sm leading-tight text-gray-950 dark:text-white">MEI Finance</div>
            <div class="text-[10px] text-gray-500 leading-none">PJ/PF Organizado</div>
          </div>
        </NuxtLink>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div v-if="!isCollapsed" class="px-3 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          Financeiro
        </div>
        
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.url"
          :to="item.url"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="[
            route.path === item.url 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
              : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:text-gray-900 dark:hover:text-white'
          ]"
        >
          <UIcon :name="item.icon" class="size-5 shrink-0" />
          <span v-if="!isCollapsed">{{ item.title }}</span>
        </NuxtLink>
      </nav>

      <!-- Sidebar Footer User Menu -->
      <div class="p-3 border-t border-gray-200 dark:border-zinc-800">
        <UDropdown :items="dropdownItems" :popper="{ placement: 'right-end' }" class="w-full">
          <button class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-left transition-colors">
            <UAvatar
              :alt="userName"
              size="sm"
              class="shrink-0"
              :ui="{ background: 'bg-emerald-500 text-white' }"
            />
            <div v-if="!isCollapsed" class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ userFirstName }}
              </p>
              <p class="text-xs text-gray-500 truncate">
                {{ user?.email }}
              </p>
            </div>
            <UIcon v-if="!isCollapsed" name="i-heroicons-chevron-up-down" class="size-4 text-gray-400 shrink-0" />
          </button>

          <template #account="{ item }">
            <div class="text-left px-2 py-1.5">
              <p class="text-xs text-gray-500">Logado como</p>
              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                {{ user?.name }}
              </p>
              <p class="text-xs text-gray-400 truncate mt-0.5">
                {{ user?.email }}
              </p>
            </div>
          </template>
        </UDropdown>
      </div>
    </aside>

    <!-- Mobile Top Navigation / Header -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header class="md:hidden h-16 flex items-center justify-between px-4 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 shrink-0">
        <NuxtLink to="/dashboard" class="flex items-center gap-3">
          <div class="rounded-lg bg-emerald-500 text-white p-2 flex items-center justify-center">
            <UIcon name="i-heroicons-building-library" class="size-5" />
          </div>
          <span class="font-bold text-sm text-gray-950 dark:text-white">MEI Finance</span>
        </NuxtLink>

        <!-- Mobile Menu Trigger -->
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-bars-3"
          class="md:hidden"
          @click="isMobileMenuOpen = true"
        />
      </header>

      <!-- Mobile Slide-over Drawer / Modal -->
      <USlideover v-slot="{ close }" v-model="isMobileMenuOpen" side="left" class="md:hidden">
        <div class="flex flex-col h-full bg-white dark:bg-zinc-950 p-4">
          <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-zinc-800">
            <NuxtLink to="/dashboard" class="flex items-center gap-3" @click="isMobileMenuOpen = false">
              <div class="rounded-lg bg-emerald-500 text-white p-2 flex items-center justify-center">
                <UIcon name="i-heroicons-building-library" class="size-5" />
              </div>
              <span class="font-bold text-sm text-gray-950 dark:text-white">MEI Finance</span>
            </NuxtLink>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" @click="close" />
          </div>

          <!-- Navigation -->
          <nav class="flex-1 py-4 space-y-1.5">
            <NuxtLink 
              v-for="item in navItems" 
              :key="item.url"
              :to="item.url"
              class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="[
                route.path === item.url 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                  : 'text-gray-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
              ]"
              @click="isMobileMenuOpen = false"
            >
              <UIcon :name="item.icon" class="size-5 shrink-0" />
              <span>{{ item.title }}</span>
            </NuxtLink>
          </nav>

          <!-- User Details / Logout -->
          <div class="pt-4 border-t border-gray-200 dark:border-zinc-800 space-y-2">
            <div class="flex items-center gap-3 px-2 py-1.5">
              <UAvatar :alt="userName" size="sm" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ user?.name }}
                </p>
                <p class="text-xs text-gray-500 truncate">
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

      <!-- Main Page Content Area -->
      <div class="flex-1 flex flex-col overflow-y-auto bg-gray-50 dark:bg-zinc-900">
        <!-- Top Bar for Breadcrumbs or Collapse Toggle on Desktop -->
        <header class="hidden md:flex h-16 items-center justify-between px-6 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 shrink-0">
          <div class="flex items-center gap-3">
            <UButton
              color="gray"
              variant="ghost"
              :icon="isCollapsed ? 'i-heroicons-bars-3' : 'i-heroicons-bars-3-bottom-left'"
              @click="isCollapsed = !isCollapsed"
            />
            <span class="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-widest font-mono">
              {{ route.path === '/dashboard' ? 'Painel Geral' : 'Fluxo de Caixa' }}
            </span>
          </div>
        </header>

        <!-- Slot for child pages -->
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
  { title: 'Geral', url: '/dashboard', icon: 'i-heroicons-squares-2x2' },
  { title: 'Receitas', url: '/dashboard/receitas', icon: 'i-heroicons-arrow-trending-up' }
]

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
      label: 'Perfil',
      icon: 'i-heroicons-user',
      click: () => navigateTo('/dashboard/perfil')
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
