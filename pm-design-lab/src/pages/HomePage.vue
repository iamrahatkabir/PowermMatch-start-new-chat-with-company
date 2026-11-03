<script setup>
import { designs } from '@/lab/registry'
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-10 sm:px-8">
    <div class="mb-8 flex items-center gap-3">
      <PmLogo />
      <span class="text-sm font-medium text-gray-500">Design Lab</span>
    </div>
    <p v-if="!designs.length" class="text-sm text-gray-500">No designs yet. Run <code>npm run new &lt;slug&gt;</code>.</p>
    <div class="grid gap-4 sm:grid-cols-2">
      <PmCard v-for="d in designs" :key="d.slug" padding="p-6" class="flex flex-col gap-4">
        <div>
          <h2 class="text-lg font-semibold text-gray-900">{{ d.title }}</h2>
          <p v-if="d.question" class="mt-1 text-sm text-gray-600">{{ d.question }}</p>
        </div>
        <ul class="flex flex-col gap-2">
          <li v-for="k in d.keys" :key="k">
            <RouterLink :to="`/d/${d.slug}?v=${k}`" class="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50">
              <span class="flex size-6 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold">{{ k }}</span>
              {{ d.variants?.[k] ?? `Variant ${k}` }}
            </RouterLink>
          </li>
        </ul>
      </PmCard>
    </div>
  </div>
</template>
