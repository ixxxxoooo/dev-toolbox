import * as monaco from 'monaco-editor'

export const EDITOR_THEMES = [
    { id: 'auto', name: 'Auto', colors: ['#1e1e1e', '#ffffff'], type: 'auto' },
    { id: 'vs-dark', name: 'VS Code Dark', colors: ['#1e1e1e', '#333333'], type: 'dark' },
    { id: 'one-dark', name: 'One Dark', colors: ['#282c34', '#abb2bf'], type: 'dark' },
    { id: 'dracula', name: 'Dracula', colors: ['#282a36', '#f8f8f2'], type: 'dark' },
    { id: 'github-dark', name: 'GitHub Dark', colors: ['#0d1117', '#c9d1d9'], type: 'dark' },
    { id: 'tokyo-night', name: 'Tokyo Night', colors: ['#1a1b26', '#a9b1d6'], type: 'dark' },
    { id: 'night-owl', name: 'Night Owl', colors: ['#011627', '#d6deeb'], type: 'dark' },
    { id: 'monokai', name: 'Monokai', colors: ['#272822', '#f8f8f2'], type: 'dark' },
    { id: 'vs', name: 'VS Code Light', colors: ['#ffffff', '#000000'], type: 'light' },
]

export function defineCustomThemes() {
    // One Dark
    monaco.editor.defineTheme('one-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '5c6370', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'c678dd' },
            { token: 'string', foreground: '98c379' },
            { token: 'number', foreground: 'd19a66' },
            { token: 'type', foreground: 'e5c07b' },
            { token: 'function', foreground: '61afef' },
        ],
        colors: {
            'editor.background': '#282c34',
            'editor.foreground': '#abb2bf',
            'editorCursor.foreground': '#528bff',
            'editor.lineHighlightBackground': '#2c313c',
            'editorLineNumber.foreground': '#4b5263',
            'editor.selectionBackground': '#3e4451',
        }
    })

    // Dracula
    monaco.editor.defineTheme('dracula', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '6272a4' },
            { token: 'keyword', foreground: 'ff79c6' },
            { token: 'string', foreground: 'f1fa8c' },
            { token: 'number', foreground: 'bd93f9' },
            { token: 'type', foreground: '8be9fd' },
            { token: 'function', foreground: '50fa7b' },
        ],
        colors: {
            'editor.background': '#282a36',
            'editor.foreground': '#f8f8f2',
            'editor.lineHighlightBackground': '#44475a',
            'editorLineNumber.foreground': '#6272a4',
            'editor.selectionBackground': '#44475a',
        }
    })

    // GitHub Dark
    monaco.editor.defineTheme('github-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '8b949e' },
            { token: 'keyword', foreground: 'ff7b72' },
            { token: 'string', foreground: 'a5d6ff' },
            { token: 'function', foreground: 'd2a8ff' },
        ],
        colors: {
            'editor.background': '#0d1117',
            'editor.foreground': '#c9d1d9',
            'editor.lineHighlightBackground': '#161b22',
            'editorLineNumber.foreground': '#484f58',
            'editor.selectionBackground': '#21262d',
        }
    })

    // Tokyo Night
    monaco.editor.defineTheme('tokyo-night', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '565f89', fontStyle: 'italic' },
            { token: 'keyword', foreground: '9d7cd8' },
            { token: 'string', foreground: '9ece6a' },
            { token: 'number', foreground: 'ff9e64' },
            { token: 'function', foreground: '7aa2f7' },
        ],
        colors: {
            'editor.background': '#1a1b26',
            'editor.foreground': '#a9b1d6',
            'editor.lineHighlightBackground': '#1f2335',
            'editorLineNumber.foreground': '#3b4261',
            'editor.selectionBackground': '#33467c',
        }
    })

    // Monokai
    monaco.editor.defineTheme('monokai', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '75715e' },
            { token: 'keyword', foreground: 'f92672' },
            { token: 'string', foreground: 'e6db74' },
            { token: 'number', foreground: 'ae81ff' },
            { token: 'function', foreground: 'a6e22e' },
        ],
        colors: {
            'editor.background': '#272822',
            'editor.foreground': '#f8f8f2',
            'editor.lineHighlightBackground': '#3e3d32',
            'editorLineNumber.foreground': '#75715e',
            'editor.selectionBackground': '#49483e',
        }
    })

    // Night Owl
    monaco.editor.defineTheme('night-owl', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'comment', foreground: '637777', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'c792ea' },
            { token: 'string', foreground: 'ecc48d' },
            { token: 'number', foreground: 'f78c6c' },
            { token: 'function', foreground: '82aaff' },
        ],
        colors: {
            'editor.background': '#011627',
            'editor.foreground': '#d6deeb',
            'editor.lineHighlightBackground': '#010e17',
            'editorLineNumber.foreground': '#4b6479',
            'editor.selectionBackground': '#1d3b53',
        }
    })
}
