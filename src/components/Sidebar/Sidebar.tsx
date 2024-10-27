import { cn } from '@/lib/utils'
import { memo, useCallback } from 'react'
import { Editor } from '@tiptap/react'
import { TableOfContents } from '../TableOfContents'

export const Sidebar = memo(
  ({ editor, isOpen, onClose }: { editor: Editor; isOpen?: boolean; onClose: () => void }) => {
    const handlePotentialClose = useCallback(() => {
      if (window.innerWidth < 1024) {
        onClose()
      }
    }, [onClose])

    const windowClassName = cn(
      'absolute top-0 left-0 bg-white lg:bg-white/30 h-full z-[999] w-0 duration-300 transition-all',
      'dark:bg-black',
      !isOpen && 'border-r-transparent',
      isOpen && 'w-[320px] lg:w-[480px] border-r border-r-neutral-200 dark:border-r-neutral-800',
    )

    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-[998]"
            onClick={onClose}
          />
        )}
        <div className={windowClassName}>
          <div className="w-full h-full overflow-hidden">
            <div className="w-full h-full p-6 overflow-auto">
              <TableOfContents onItemClick={handlePotentialClose} editor={editor} />
            </div>
          </div>
        </div>
      </>
    )
  },
)

Sidebar.displayName = 'TableOfContentSidepanel'
