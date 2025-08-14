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
              <h1 class="text-xl font-semibold">密码生成器</h1>
              <div class="relative group">
                <HelpCircle class="h-5 w-5 text-muted-foreground cursor-pointer" />
                <div class="absolute top-full mt-2 w-80 bg-card border rounded-lg shadow-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <p class="font-bold mb-2">密码生成器说明</p>
                  <p class="mb-2">基于业界最佳实践生成安全密码。</p>
                  <p class="font-bold mb-1">密码类型:</p>
                  <ul class="list-disc list-inside text-xs mb-2">
                    <li><strong>强密码:</strong> 包含大小写字母、数字和符号，长度12-64位</li>
                    <li><strong>易读密码:</strong> 避免易混淆字符(0,O,l,1等)，便于输入</li>
                    <li><strong>PIN码:</strong> 纯数字密码，适用于银行卡等场景</li>
                    <li><strong>记忆性密码:</strong> 使用词组组合，易于记忆但安全</li>
                  </ul>
                  <p class="text-xs text-muted-foreground">建议使用12位以上强密码以确保安全性</p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button @click="generatePassword" class="px-3 py-1.5 text-sm rounded-md btn-primary">生成密码</button>
            <button @click="clearPasswords" class="px-3 py-1.5 text-sm rounded-md btn-destructive">清空</button>
            <ThemeToggleButton />
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="flex-1 container mx-auto px-4 py-4 flex flex-col">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <!-- 左侧配置面板 -->
        <div class="space-y-4">
          <!-- 密码类型选择 -->
          <div class="bg-card border border-border rounded-lg p-4">
            <h3 class="text-sm font-semibold mb-3">密码类型</h3>
            <div class="space-y-2">
              <label v-for="type in passwordTypes" :key="type.key" class="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  :value="type.key"
                  v-model="selectedType"
                  @change="generatePassword"
                  class="form-radio text-primary"
                />
                <span class="text-sm">{{ type.label }}</span>
              </label>
            </div>
          </div>

          <!-- 密码长度配置 -->
          <div class="bg-card border border-border rounded-lg p-4">
            <h3 class="text-sm font-semibold mb-3">密码长度</h3>
            <div class="space-y-3">
              <div class="flex items-center space-x-4">
                <input
                  type="range"
                  :min="getMinLength()"
                  :max="getMaxLength()"
                  v-model="passwordLength"
                  @input="generatePassword"
                  class="flex-1"
                />
                <span class="text-sm font-mono w-8 text-center">{{ passwordLength }}</span>
              </div>
              <div class="text-xs text-muted-foreground">
                推荐长度: {{ getRecommendedLength() }} 位
              </div>
            </div>
          </div>

          <!-- 强密码选项配置 -->
          <div v-if="selectedType === 'strong'" class="bg-card border border-border rounded-lg p-4">
            <h3 class="text-sm font-semibold mb-3">字符类型</h3>
            <div class="space-y-2">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" v-model="options.uppercase" @change="generatePassword" class="form-checkbox text-primary" />
                <span class="text-sm">大写字母 (A-Z)</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" v-model="options.lowercase" @change="generatePassword" class="form-checkbox text-primary" />
                <span class="text-sm">小写字母 (a-z)</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" v-model="options.numbers" @change="generatePassword" class="form-checkbox text-primary" />
                <span class="text-sm">数字 (0-9)</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" v-model="options.symbols" @change="generatePassword" class="form-checkbox text-primary" />
                <span class="text-sm">符号 (!@#$%^&*)</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" v-model="options.excludeAmbiguous" @change="generatePassword" class="form-checkbox text-primary" />
                <span class="text-sm">排除易混淆字符</span>
              </label>
            </div>
          </div>

          <!-- 记忆性密码配置 -->
          <div v-if="selectedType === 'memorable'" class="bg-card border border-border rounded-lg p-4">
            <h3 class="text-sm font-semibold mb-3">配置选项</h3>
            <div class="space-y-2">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" v-model="memorableOptions.includeNumbers" @change="generatePassword" class="form-checkbox text-primary" />
                <span class="text-sm">包含数字</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" v-model="memorableOptions.capitalizeWords" @change="generatePassword" class="form-checkbox text-primary" />
                <span class="text-sm">单词首字母大写</span>
              </label>
              <div class="space-y-2">
                <label class="text-sm">单词数量: {{ memorableOptions.wordCount }}</label>
                <input
                  type="range"
                  min="3"
                  max="6"
                  v-model="memorableOptions.wordCount"
                  @input="generatePassword"
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧密码显示 -->
        <div class="space-y-4">
          <!-- 生成的密码 -->
          <div class="bg-card border border-border rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold">生成的密码</h3>
              <div class="flex items-center space-x-2">
                <button @click="generatePassword" class="text-xs px-2 py-1 rounded btn-secondary">重新生成</button>
              </div>
            </div>
            <div class="space-y-3">
              <div v-for="(password, index) in generatedPasswords" :key="index" class="flex items-center space-x-2">
                <input
                  type="text"
                  readonly
                  :value="password"
                  class="flex-1 font-mono text-sm p-3 bg-muted border border-border rounded-lg focus:outline-none"
                />
                <button
                  @click="copyPassword(password)"
                  class="px-3 py-3 rounded-lg btn-secondary flex items-center justify-center"
                  title="复制密码"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- 密码强度分析 -->
          <div class="bg-card border border-border rounded-lg p-4">
            <h3 class="text-sm font-semibold mb-3">密码强度分析</h3>
            <div v-if="generatedPasswords.length > 0" class="space-y-3">
              <div class="flex items-center space-x-2">
                <span class="text-sm">强度等级:</span>
                <span :class="getStrengthColor()" class="px-2 py-1 rounded text-xs font-semibold">
                  {{ getStrengthText() }}
                </span>
              </div>
              <div class="space-y-2 text-xs text-muted-foreground">
                <div>熵值: {{ Math.round(calculateEntropy()) }} bits</div>
                <div>破解时间: {{ getEstimatedCrackTime() }}</div>
                <div>字符集大小: {{ getCharsetSize() }}</div>
              </div>
            </div>
          </div>

          <!-- 安全建议 -->
          <div class="bg-card border border-border rounded-lg p-4">
            <h3 class="text-sm font-semibold mb-3">安全建议</h3>
            <ul class="text-xs text-muted-foreground space-y-1">
              <li>• 使用12位以上的密码以确保安全性</li>
              <li>• 不要在多个账户使用相同密码</li>
              <li>• 定期更换重要账户的密码</li>
              <li>• 使用密码管理器存储密码</li>
              <li>• 启用双因素认证增强安全性</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { HelpCircle } from 'lucide-vue-next';
import ToolSwitcher from '../components/ToolSwitcher.vue';
import ThemeToggleButton from '../components/ThemeToggleButton.vue';
import { addDisableSaveShortcut, removeDisableSaveShortcut } from '../utils/keyboardUtils';

// Types
interface PasswordOptions {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

interface MemorableOptions {
  wordCount: number;
  includeNumbers: boolean;
  capitalizeWords: boolean;
}

// 常见单词列表（用于记忆性密码）
const commonWords = [
  'apple', 'bridge', 'chair', 'dream', 'eagle', 'flower', 'guitar', 'house',
  'island', 'jungle', 'kitten', 'lemon', 'mountain', 'ocean', 'piano', 'queen',
  'rabbit', 'sunset', 'tiger', 'umbrella', 'valley', 'whale', 'yellow', 'zebra',
  'anchor', 'basket', 'candle', 'dolphin', 'engine', 'forest', 'garden', 'hammer',
  'iceberg', 'jacket', 'keyboard', 'laptop', 'mirror', 'notebook', 'orange', 'pencil'
];

// State
const selectedType = ref('strong');
const passwordLength = ref(16);
const generatedPasswords = ref<string[]>([]);

const passwordTypes = [
  { key: 'strong', label: '强密码 (推荐)' },
  { key: 'readable', label: '易读密码' },
  { key: 'pin', label: 'PIN码' },
  { key: 'memorable', label: '记忆性密码' }
];

const options = ref<PasswordOptions>({
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false
});

const memorableOptions = ref<MemorableOptions>({
  wordCount: 4,
  includeNumbers: true,
  capitalizeWords: true
});

// Character sets
const charset = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  readableUppercase: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
  readableLowercase: 'abcdefghijkmnpqrstuvwxyz',
  readableNumbers: '23456789',
  ambiguous: '0O1lI|`'
};

// Methods
const getMinLength = () => {
  switch (selectedType.value) {
    case 'pin': return 4;
    case 'memorable': return 3;
    default: return 8;
  }
};

const getMaxLength = () => {
  switch (selectedType.value) {
    case 'pin': return 12;
    case 'memorable': return 6;
    default: return 64;
  }
};

const getRecommendedLength = () => {
  switch (selectedType.value) {
    case 'strong': return 16;
    case 'readable': return 14;
    case 'pin': return 6;
    case 'memorable': return 4;
    default: return 16;
  }
};

const getCharacterSet = () => {
  let chars = '';

  switch (selectedType.value) {
    case 'strong':
      if (options.value.uppercase) chars += charset.uppercase;
      if (options.value.lowercase) chars += charset.lowercase;
      if (options.value.numbers) chars += charset.numbers;
      if (options.value.symbols) chars += charset.symbols;
      break;
    case 'readable':
      chars = charset.readableUppercase + charset.readableLowercase + charset.readableNumbers;
      break;
    case 'pin':
      chars = charset.numbers;
      break;
    default:
      chars = charset.uppercase + charset.lowercase + charset.numbers;
  }

  if (options.value.excludeAmbiguous && selectedType.value === 'strong') {
    for (const char of charset.ambiguous) {
      chars = chars.replace(new RegExp(char, 'g'), '');
    }
  }

  return chars;
};

const generateStrongPassword = (length: number) => {
  const chars = getCharacterSet();
  if (!chars) return '';

  let password = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }

  return password;
};

const generateMemorablePassword = () => {
  const words = [];
  const usedIndices = new Set();

  for (let i = 0; i < memorableOptions.value.wordCount; i++) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * commonWords.length);
    } while (usedIndices.has(randomIndex));

    usedIndices.add(randomIndex);
    let word = commonWords[randomIndex];

    if (memorableOptions.value.capitalizeWords) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }

    words.push(word);
  }

  let password = words.join('-');

  if (memorableOptions.value.includeNumbers) {
    const randomNum = Math.floor(Math.random() * 9999) + 1;
    password += randomNum.toString();
  }

  return password;
};

const generatePassword = () => {
  const count = 3; // 生成3个密码供选择
  generatedPasswords.value = [];

  for (let i = 0; i < count; i++) {
    let password = '';

    if (selectedType.value === 'memorable') {
      password = generateMemorablePassword();
    } else {
      password = generateStrongPassword(passwordLength.value);
    }

    if (password) {
      generatedPasswords.value.push(password);
    }
  }
};

const copyPassword = (password: string) => {
  navigator.clipboard.writeText(password);
};

const clearPasswords = () => {
  generatedPasswords.value = [];
};

const getCharsetSize = () => {
  if (selectedType.value === 'memorable') {
    const baseSize = commonWords.length ** memorableOptions.value.wordCount;
    return memorableOptions.value.includeNumbers ? baseSize * 9999 : baseSize;
  }
  return getCharacterSet().length;
};

const calculateEntropy = () => {
  if (generatedPasswords.value.length === 0) return 0;

  if (selectedType.value === 'memorable') {
    const wordEntropy = Math.log2(commonWords.length) * memorableOptions.value.wordCount;
    const numberEntropy = memorableOptions.value.includeNumbers ? Math.log2(9999) : 0;
    return wordEntropy + numberEntropy;
  }

  const charsetSize = getCharsetSize();
  return Math.log2(charsetSize) * passwordLength.value;
};

const getStrengthText = () => {
  const entropy = calculateEntropy();
  if (entropy < 30) return '弱';
  if (entropy < 50) return '中等';
  if (entropy < 70) return '强';
  return '极强';
};

const getStrengthColor = () => {
  const entropy = calculateEntropy();
  if (entropy < 30) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  if (entropy < 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  if (entropy < 70) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
};

const getEstimatedCrackTime = () => {
  const entropy = calculateEntropy();
  const attempts = Math.pow(2, entropy - 1); // 平均需要尝试一半的可能性
  const attemptsPerSecond = 1e9; // 假设每秒10亿次尝试
  const seconds = attempts / attemptsPerSecond;

  if (seconds < 60) return '少于1分钟';
  if (seconds < 3600) return `${Math.round(seconds / 60)}分钟`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)}小时`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)}天`;
  if (seconds < 31536000000) return `${Math.round(seconds / 31536000)}年`;
  return '数万年以上';
};

// 初始化生成密码
generatePassword();

// 生命周期钩子
onMounted(() => {
  // 禁用保存快捷键
  addDisableSaveShortcut();
});

onBeforeUnmount(() => {
  // 移除保存快捷键禁用
  removeDisableSaveShortcut();
});
</script>