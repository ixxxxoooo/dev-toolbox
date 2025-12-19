<template>
  <div class="h-full flex flex-col bg-background text-foreground">
    <!-- Compact Toolbar -->
    <div class="flex items-center justify-between h-[49px] px-4 border-b border-border bg-card/50 backdrop-blur-sm">
      <div class="flex items-center space-x-4 overflow-x-auto no-scrollbar">
        <!-- Title & Icon -->
        <div class="flex items-center space-x-2 text-primary flex-shrink-0 mr-2">
          <KeyRound class="w-5 h-5" />
          <span class="font-semibold text-sm hidden sm:inline">{{ $t('tools.password.name') }}</span>
        </div>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center space-x-2 flex-shrink-0 ml-4">
        <button @click="generatePassword" class="px-3 py-1.5 text-xs font-medium rounded-md btn-primary flex items-center space-x-1.5 transition-colors">
          <RefreshCw class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ $t('common.generate') }}</span>
        </button>
        <button @click="clearPasswords" class="px-3 py-1.5 text-xs font-medium rounded-md btn-destructive transition-colors flex items-center space-x-1.5">
          <Trash2 class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ $t('common.clear') }}</span>
        </button>
        <div class="h-4 w-px bg-border mx-1"></div>
        <button @click="showHelp = !showHelp" class="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground">
          <HelpCircle class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <main class="flex-1 container mx-auto px-4 py-6 flex flex-col overflow-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        <!-- Left Panel: Configuration -->
        <div class="space-y-6">
          <!-- Password Type Selection -->
          <div class="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 class="text-sm font-semibold mb-4 flex items-center">
              <Settings2 class="w-4 h-4 mr-2 text-primary" />
              {{ $t('tools.password.passwordType') }}
            </h3>
            <div class="space-y-3">
              <label v-for="type in passwordTypes" :key="type.key" class="flex items-start space-x-3 p-3 rounded-lg border border-transparent hover:bg-muted/50 hover:border-border cursor-pointer transition-all" :class="selectedType === type.key ? 'bg-muted/50 border-primary/50' : ''">
                <input
                  type="radio"
                  :value="type.key"
                  v-model="selectedType"
                  @change="generatePassword"
                  class="mt-1 form-radio text-primary focus:ring-primary"
                />
                <div class="flex-1">
                  <div class="text-sm font-medium" :class="selectedType === type.key ? 'text-primary' : ''">{{ $t(type.label) }}</div>
                  <div class="text-xs text-muted-foreground mt-0.5">{{ $t(type.description) }}</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Length Configuration -->
          <div class="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 class="text-sm font-semibold mb-4 flex items-center">
              <Ruler class="w-4 h-4 mr-2 text-primary" />
              {{ $t('tools.password.passwordLength') }}
            </h3>
            <div class="space-y-4">
              <div class="flex items-center space-x-4">
                <input
                  type="range"
                  :min="getMinLength()"
                  :max="getMaxLength()"
                  v-model="passwordLength"
                  @input="generatePassword"
                  class="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div class="w-12 h-8 flex items-center justify-center bg-muted rounded font-mono text-sm font-bold">
                  {{ passwordLength }}
                </div>
              </div>
              <div class="text-xs text-muted-foreground flex items-center">
                <Info class="w-3 h-3 mr-1" />
                {{ $t('tools.password.recommendedLength') }}: {{ getRecommendedLength() }} {{ $t('tools.password.characters') }}
              </div>
            </div>
          </div>

          <!-- Advanced Options -->
          <div v-if="selectedType === 'strong'" class="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 class="text-sm font-semibold mb-4 flex items-center">
              <Sliders class="w-4 h-4 mr-2 text-primary" />
              {{ $t('tools.password.characterTypes') }}
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <label class="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-muted/50 transition-colors">
                <input type="checkbox" v-model="options.uppercase" @change="generatePassword" class="rounded border-muted-foreground/30 text-primary focus:ring-primary" />
                <span class="text-sm">{{ $t('tools.password.uppercase') }} (A-Z)</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-muted/50 transition-colors">
                <input type="checkbox" v-model="options.lowercase" @change="generatePassword" class="rounded border-muted-foreground/30 text-primary focus:ring-primary" />
                <span class="text-sm">{{ $t('tools.password.lowercase') }} (a-z)</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-muted/50 transition-colors">
                <input type="checkbox" v-model="options.numbers" @change="generatePassword" class="rounded border-muted-foreground/30 text-primary focus:ring-primary" />
                <span class="text-sm">{{ $t('tools.password.numbers') }} (0-9)</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-muted/50 transition-colors">
                <input type="checkbox" v-model="options.symbols" @change="generatePassword" class="rounded border-muted-foreground/30 text-primary focus:ring-primary" />
                <span class="text-sm">{{ $t('tools.password.symbols') }} (!@#$)</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-muted/50 transition-colors col-span-2">
                <input type="checkbox" v-model="options.excludeAmbiguous" @change="generatePassword" class="rounded border-muted-foreground/30 text-primary focus:ring-primary" />
                <span class="text-sm">{{ $t('tools.password.excludeAmbiguous') }} (0 O 1 l I | `)</span>
              </label>
            </div>
          </div>

          <!-- Memorable Options -->
          <div v-if="selectedType === 'memorable'" class="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 class="text-sm font-semibold mb-4 flex items-center">
              <Sliders class="w-4 h-4 mr-2 text-primary" />
              {{ $t('tools.password.configOptions') }}
            </h3>
            <div class="space-y-3">
              <label class="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-muted/50 transition-colors">
                <input type="checkbox" v-model="memorableOptions.includeNumbers" @change="generatePassword" class="rounded border-muted-foreground/30 text-primary focus:ring-primary" />
                <span class="text-sm">{{ $t('tools.password.numbers') }}</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-muted/50 transition-colors">
                <input type="checkbox" v-model="memorableOptions.capitalizeWords" @change="generatePassword" class="rounded border-muted-foreground/30 text-primary focus:ring-primary" />
                <span class="text-sm">{{ $t('tools.password.capitalizeWords') }}</span>
              </label>
              <div class="p-2">
                <label class="text-sm mb-2 block">{{ $t('tools.password.wordCount') }}: {{ memorableOptions.wordCount }}</label>
                <input
                  type="range"
                  min="3"
                  max="6"
                  v-model="memorableOptions.wordCount"
                  @input="generatePassword"
                  class="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel: Results -->
        <div class="space-y-6">
          <!-- Generated Passwords -->
          <div class="bg-card border border-border rounded-xl p-6 shadow-sm h-full flex flex-col">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-sm font-semibold flex items-center">
                <List class="w-4 h-4 mr-2 text-primary" />
                {{ $t('tools.password.generatedPasswords') }}
              </h3>
              <button @click="generatePassword" class="text-xs px-2 py-1 rounded btn-secondary flex items-center space-x-1">
                <RefreshCw class="w-3 h-3" />
                <span>{{ $t('common.buttons.regenerate') }}</span>
              </button>
            </div>
            <div class="space-y-3 flex-1">
              <div v-for="(password, index) in generatedPasswords" :key="index" class="relative group">
                <input
                  type="text"
                  readonly
                  :value="password"
                  class="w-full font-mono text-sm p-4 pr-12 bg-muted/30 border border-border rounded-lg focus:outline-none focus:border-primary transition-colors text-foreground"
                />
                <div class="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    @click="copyPassword(password)"
                    class="p-2 rounded-md hover:bg-background hover:text-primary transition-colors shadow-sm border border-border"
                    :title="$t('tools.password.copyPassword')"
                  >
                    <Copy class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Strength Analysis -->
            <div class="mt-6 pt-6 border-t border-border">
              <h3 class="text-sm font-semibold mb-3 flex items-center">
                <ShieldCheck class="w-4 h-4 mr-2 text-primary" />
                {{ $t('tools.password.strengthAnalysis') }}
              </h3>
              <div v-if="generatedPasswords.length > 0" class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-muted-foreground">{{ $t('tools.password.strengthLevel') }}</span>
                  <span :class="getStrengthColor()" class="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide">
                    {{ getStrengthText() }}
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-muted/30 p-3 rounded-lg">
                    <div class="text-xs text-muted-foreground mb-1">{{ $t('tools.password.entropy') }}</div>
                    <div class="text-sm font-mono font-medium">{{ Math.round(calculateEntropy()) }} bits</div>
                  </div>
                  <div class="bg-muted/30 p-3 rounded-lg">
                    <div class="text-xs text-muted-foreground mb-1">{{ $t('tools.password.crackTimeDesc') }}</div>
                    <div class="text-sm font-medium">{{ getEstimatedCrackTime() }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Advice -->
          <div class="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-6">
            <h3 class="text-sm font-semibold mb-3 flex items-center text-blue-700 dark:text-blue-400">
              <Lightbulb class="w-4 h-4 mr-2" />
              {{ $t('tools.password.securityAdvice') }}
            </h3>
            <ul class="text-xs text-muted-foreground space-y-2 list-disc list-inside">
              <li>{{ $t('tools.password.advice.length') }}</li>
              <li>{{ $t('tools.password.advice.unique') }}</li>
              <li>{{ $t('tools.password.advice.regular') }}</li>
              <li>{{ $t('tools.password.advice.manager') }}</li>
              <li>{{ $t('tools.password.advice.twoFactor') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </main>

    <!-- Help Modal -->
    <div v-if="showHelp" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showHelp = false">
      <div class="bg-card border border-border rounded-xl shadow-2xl max-w-lg w-full p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold">{{ $t('tools.password.name') }} Help</h3>
          <button @click="showHelp = false" class="text-muted-foreground hover:text-foreground">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="space-y-4 text-sm">
          <p>{{ $t('tools.password.description') }}</p>
          <div>
            <p class="font-bold mb-2">{{ $t('tools.password.passwordType') }}:</p>
            <ul class="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>{{ $t('tools.password.types.strong') }}:</strong> {{ $t('tools.password.types.strongDesc') }}</li>
              <li><strong>{{ $t('tools.password.types.readable') }}:</strong> {{ $t('tools.password.types.readableDesc') }}</li>
              <li><strong>{{ $t('tools.password.types.pin') }}:</strong> {{ $t('tools.password.types.pinDesc') }}</li>
              <li><strong>{{ $t('tools.password.types.memorable') }}:</strong> {{ $t('tools.password.types.memorableDesc') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { HelpCircle, KeyRound, RefreshCw, Trash2, Settings2, Ruler, Info, Sliders, List, Copy, ShieldCheck, Lightbulb, X } from 'lucide-vue-next';
import { addDisableSaveShortcut, removeDisableSaveShortcut } from '../utils/keyboardUtils';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

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

const commonWords = [
  'apple', 'bridge', 'chair', 'dream', 'eagle', 'flower', 'guitar', 'house',
  'island', 'jungle', 'kitten', 'lemon', 'mountain', 'ocean', 'piano', 'queen',
  'rabbit', 'sunset', 'tiger', 'umbrella', 'valley', 'whale', 'yellow', 'zebra',
  'anchor', 'basket', 'candle', 'dolphin', 'engine', 'forest', 'garden', 'hammer',
  'iceberg', 'jacket', 'keyboard', 'laptop', 'mirror', 'notebook', 'orange', 'pencil'
];

const selectedType = ref('strong');
const passwordLength = ref(16);
const generatedPasswords = ref<string[]>([]);
const showHelp = ref(false);

const passwordTypes = [
  { key: 'strong', label: 'tools.password.types.strong', description: 'tools.password.types.strongDesc' },
  { key: 'readable', label: 'tools.password.types.readable', description: 'tools.password.types.readableDesc' },
  { key: 'pin', label: 'tools.password.types.pin', description: 'tools.password.types.pinDesc' },
  { key: 'memorable', label: 'tools.password.types.memorable', description: 'tools.password.types.memorableDesc' }
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
      chars = chars.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
    }
  }
  return chars;
};

const generateStrongPassword = (length: number) => {
  const chars = getCharacterSet();
  if (!chars) return '';
  let password = '';
  const array = new Uint32Array(length);
  // if (window.crypto && window.crypto.getRandomValues) {
  //   window.crypto.getRandomValues(array);
  // } else {
    // Fallback for environments where crypto is not available (e.g. build time)
    for (let i = 0; i < length; i++) {
      array[i] = Math.floor(Math.random() * 4294967296);
    }
  // }
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
  const count = 3;
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
  return charsetSize > 0 ? Math.log2(charsetSize) * passwordLength.value : 0;
};

const getStrengthText = () => {
  const entropy = calculateEntropy();
  if (entropy < 30) return $t('tools.password.strength.weak');
  if (entropy < 50) return $t('tools.password.strength.medium');
  if (entropy < 70) return $t('tools.password.strength.strong');
  return $t('tools.password.strength.veryStrong');
};

const getStrengthColor = () => {
  const entropy = calculateEntropy();
  if (entropy < 30) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
  if (entropy < 50) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
  if (entropy < 70) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
  return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
};

const getEstimatedCrackTime = () => {
  const entropy = calculateEntropy();
  const attempts = Math.pow(2, entropy - 1);
  const attemptsPerSecond = 1e9;
  const seconds = attempts / attemptsPerSecond;
  if (seconds < 60) return $t('tools.password.crackTime.lessThanMinute');
  if (seconds < 3600) return $t('tools.password.crackTime.minutes', { count: Math.round(seconds / 60) });
  if (seconds < 86400) return $t('tools.password.crackTime.hours', { count: Math.round(seconds / 3600) });
  if (seconds < 31536000) return $t('tools.password.crackTime.days', { count: Math.round(seconds / 86400) });
  if (seconds < 31536000000) return $t('tools.password.crackTime.years', { count: Math.round(seconds / 31536000) });
  return $t('tools.password.crackTime.centuries');
};

onMounted(() => {
  generatePassword();
  addDisableSaveShortcut();
});

onBeforeUnmount(() => {
  removeDisableSaveShortcut();
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>