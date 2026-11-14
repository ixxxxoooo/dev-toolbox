import { ref } from 'vue'
import { loadFromStorage, saveToStorage } from '../utils/localStorage'
import i18n from '@/locales'
import { showToast } from './useToast'

/** 单条历史记录的最大长度（字符）。超大文本不进历史，避免几条记录就占满 localStorage 配额 */
export const MAX_HISTORY_ITEM_LENGTH = 200 * 1024

export interface HistoryItem {
    id: string
    content: string
    timestamp: number
}

export function useHistory(key: string, maxItems: number = 50) {
    const history = ref<HistoryItem[]>(loadFromStorage(`history-${key}`, []))

    // 写入失败（多半是配额不足）时，逐步丢弃最旧的记录再重试，保证最新的记录一定能存下
    const persist = () => {
        const storageKey = `history-${key}`
        while (!saveToStorage(storageKey, history.value) && history.value.length > 1) {
            history.value = history.value.slice(0, Math.ceil(history.value.length / 2))
        }
    }

    const addHistory = (content: string) => {
        if (!content || !content.trim()) return
        if (content.length > MAX_HISTORY_ITEM_LENGTH) {
            showToast(i18n.global.t('common.messages.historyItemTooLarge'), 'info', 3000)
            return
        }
        const trimmedContent = content.trim()

        // Remove existing item with same content to move it to the top
        const filteredHistory = history.value.filter(item => item.content.trim() !== trimmedContent)

        const newItem: HistoryItem = {
            id: crypto.randomUUID(),
            content,
            timestamp: Date.now()
        }

        history.value = [newItem, ...filteredHistory].slice(0, maxItems)
        persist()
    }

    const deleteHistory = (id: string) => {
        history.value = history.value.filter(item => item.id !== id)
        persist()
    }

    const clearHistory = () => {
        history.value = []
        persist()
    }

    const updateMaxItems = (newLimit: number) => {
        maxItems = newLimit
        if (history.value.length > maxItems) {
            history.value = history.value.slice(0, maxItems)
            persist()
        }
    }

    return {
        history,
        addHistory,
        deleteHistory,
        clearHistory,
        updateMaxItems
    }
}
