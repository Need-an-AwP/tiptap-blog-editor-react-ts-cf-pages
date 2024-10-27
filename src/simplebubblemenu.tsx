import React, { useCallback, useState, useEffect } from 'react'
import { BubbleMenu, useEditorState } from '@tiptap/react'

import { MenuProps } from '@/components/menus/types'
import { LinkPreviewPanel } from '@/components/panels/LinkPreviewPanel'
import { LinkEditorPanel } from '@/components/panels'


const TiptapBubbleMenu: React.FC<MenuProps> = ({ editor, appendTo }) => {
    const [showEdit, setShowEdit] = useState(false)
    const { link, target } = useEditorState({
        editor,
        selector: ctx => {
            const attrs = ctx.editor.getAttributes('link')
            return { link: attrs.href, target: attrs.target }
        },
    })

    const shouldShow = useCallback(() => {
        const isActive = editor.isActive('link')
        return isActive
    }, [editor])

    const handleEdit = useCallback(() => {
        setShowEdit(true)
    }, [])

    const onSetLink = useCallback(
        (url: string, openInNewTab?: boolean) => {
            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: url, target: openInNewTab ? '_blank' : '' })
                .run()
            setShowEdit(false)
        },
        [editor],
    )

    const onUnsetLink = useCallback(() => {
        console.log('onUnsetLink')
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
        setShowEdit(false)
        return null
    }, [editor])


    return (
        <BubbleMenu
            editor={editor}
            pluginKey="customBubbleMenu"
            shouldShow={shouldShow}
            updateDelay={0}
            tippyOptions={{
                duration: 100,
                placement: 'top',
                popperOptions: {
                    modifiers: [{ name: 'flip', enabled: false }],
                },
                appendTo: appendTo?.current || document.body,
                onHidden: () => {
                    setShowEdit(false)
                },
            }}
        >
            {showEdit ? (
                <LinkEditorPanel initialUrl={link} initialOpenInNewTab={target === '_blank'} onSetLink={onSetLink} />
            ) : (
                <LinkPreviewPanel url={link} onEdit={handleEdit} onClear={onUnsetLink} />
            )}
        </BubbleMenu>
    );
};

export default TiptapBubbleMenu;