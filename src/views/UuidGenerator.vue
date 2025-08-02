<template>
  <div class="h-screen flex flex-col bg-background text-foreground">
    <!-- 顶部标题栏 -->
    <header class="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
      <div class="container mx-auto px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <ToolSwitcher />
            <button @click="$router.push('/')" class="p-2 rounded-lg hover:bg-secondary transition-colors btn-icon" title="返回主页">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div class="flex items-center space-x-2">
              <h1 class="text-xl font-semibold">UUID 生成器</h1>
              <div class="relative group">
                <HelpCircle class="h-5 w-5 text-muted-foreground cursor-pointer" />
                <div class="absolute top-full mt-2 w-64 bg-card border rounded-lg shadow-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <p class="font-bold mb-2">UUID 生成器说明</p>
                  <p class="mb-1">用于生成全局唯一标识符 (UUID)。</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li><strong class="font-semibold">UUID v4:</strong> 基于随机数生成，是最常用的UUID版本。</li>
                  </ul>
                  <p class="font-bold mb-1">按钮说明:</p>
                  <ul class="list-disc list-inside text-xs">
                    <li><strong class="font-semibold">生成 UUID:</strong> 生成一个新的UUID。</li>
                    <li><strong class="font-semibold">复制:</strong> 复制当前显示的UUID到剪贴板。</li>
                    <li><strong class="font-semibold">清空:</strong> 清空UUID显示区域。</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="generateUuid" class="px-3 py-1.5 text-sm rounded-md btn-primary">生成 UUID</button>
            <button @click="clearUuid" :disabled="!uuid" class="px-3 py-1.5 text-sm rounded-md btn-destructive transition-colors disabled:opacity-50">清空</button>
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="flex-1 container mx-auto px-4 py-8 flex justify-center items-center">
      <div class="w-full max-w-xl">
        <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h2 class="text-lg font-semibold mb-4 text-center">生成的 UUID</h2>
          <div class="relative flex items-center space-x-2">
            <input 
              type="text" 
              readonly 
              v-model="uuid" 
              placeholder="点击生成 UUID 按钮"
              class="flex-1 text-center text-xl font-mono p-4 bg-muted border border-border rounded-lg focus:outline-none"
            />
            <button 
              @click="copyUuid" 
              :disabled="!uuid" 
              class="px-4 py-4 rounded-lg btn-secondary disabled:opacity-50 flex items-center justify-center"
              title="复制 UUID"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { HelpCircle } from 'lucide-vue-next';
import ToolSwitcher from '../components/ToolSwitcher.vue';
import ThemeToggleButton from '../components/ThemeToggleButton.vue';

const uuid = ref('');

// Function to generate UUID v4
const generateUuid = () => {
  uuid.value = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const copyUuid = () => {
  if (uuid.value) {
    navigator.clipboard.writeText(uuid.value);
  }
};

const clearUuid = () => {
  uuid.value = '';
};

onMounted(() => {
  generateUuid(); // Generate a UUID on component mount
});
</script>