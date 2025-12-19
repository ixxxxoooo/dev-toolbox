import { ref } from 'vue'
import { loadFromStorage, saveToStorage } from '../utils/localStorage'

export interface HistoryItem {
    id: string
    content: string
    timestamp: number
}

export function useHistory(key: string, maxItems: number = 50) {
    const history = ref<HistoryItem[]>(loadFromStorage(`history-${key}`, []))

    const addHistory = (content: string) => {
        if (!content || !content.trim()) return
        const trimmedContent = content.trim()

        // Remove existing item with same content to move it to the top
        const filteredHistory = history.value.filter(item => item.content.trim() !== trimmedContent)

        const newItem: HistoryItem = {
            id: crypto.randomUUID(),
            content,
            timestamp: Date.now()
        }

        history.value = [newItem, ...filteredHistory].slice(0, maxItems)
        saveToStorage(`history-${key}`, history.value)
    }

    const deleteHistory = (id: string) => {
        history.value = history.value.filter(item => item.id !== id)
        saveToStorage(`history-${key}`, history.value)
    }

    const clearHistory = () => {
        history.value = []
        saveToStorage(`history-${key}`, history.value)
    }

    return {
        history,
        addHistory,
        deleteHistory,
        clearHistory
    }
}
