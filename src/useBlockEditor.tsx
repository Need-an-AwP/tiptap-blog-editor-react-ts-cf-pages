import { useEffect, useState } from 'react'
import { useEditor, useEditorState } from '@tiptap/react'
import type { AnyExtension, Editor, Extension, JSONContent } from '@tiptap/core'
import { generateHTML } from '@tiptap/core'
import { ExtensionKit } from '@/extensions/extension-kit'


declare global {
    interface Window {
        editor: Editor | null
    }
}


export const useBlockEditor = () => {
    const editor = useEditor({
        immediatelyRender: true,
        shouldRerenderOnTransaction: false,
        autofocus: true,
        extensions: ExtensionKit() as Extension[],
        content: '',
        editorProps: {
            attributes: {
                autocomplete: 'off',
                autocorrect: 'off',
                autocapitalize: 'off',
                class: 'min-h-full',
            },
        },
    }, [])

    window.editor = editor

    return { editor }
}

export const getEditorHTML = (editor: Editor | null): string => {
    if (!editor) return ''
    const html = generateHTML(editor.getJSON(), ExtensionKit() as Extension[])
    return html
}


