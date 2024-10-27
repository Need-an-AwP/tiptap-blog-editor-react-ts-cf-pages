import { useState, useRef, useEffect } from 'react'
import './App.css'
import '@fontsource/inter/100.css'
import '@fontsource/inter/200.css'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import 'cal-sans'

import { cn } from "@/lib/utils";
import { HeroHighlight, Highlight } from "@/components/ui/background-hero-highlight";

import { Sidebar } from '@/components/Sidebar'
import { useSidebar } from '@/hooks/useSidebar'
import { EditorContent } from '@tiptap/react'
import { useBlockEditor } from './useBlockEditor'
import { EditorHeader } from './components/BlockEditor/EditorHeader'
import { LinkMenu, TextMenu, ContentItemMenu } from '@/components/menus'
import { ColumnsMenu } from '@/extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '@/extensions/Table/menus'
import ImageBlockMenu from '@/extensions/ImageBlock/components/ImageBlockMenu'
import { LoginCard } from './components/LoginCard'

const workerAPI = "https://wokerd1-blue-math-ewq.1790414525klz.workers.dev"


function App() {
    const { editor } = useBlockEditor()
    const leftSidebar = useSidebar()
    const menuContainerRef = useRef(null)
    const newRef = useRef(null)
    const [needsLogin, setNeedsLogin] = useState(true)
    const [token, setToken] = useState<string>('')

    if (!editor) {
        return null
    }

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken')
        if (storedToken) {
            setToken(storedToken)
        }
    }, [])

    return (
        <>
            {needsLogin && (
                <LoginCard workerAPI={workerAPI} setNeedsLogin={setNeedsLogin} token={token} />
            )}
            <HeroHighlight />
            <div ref={newRef} className={cn("flex flex-col relative z-10 min-h-screen w-[calc(100vw-20px)]", needsLogin && "pointer-events-none")}>
                <Sidebar isOpen={leftSidebar.isOpen} onClose={leftSidebar.close} editor={editor} />
                <div className='sticky top-0  w-full max-w-full  border-b border-neutral-200 border-opacity-50 py-2'>
                    <EditorHeader
                        editor={editor}
                        workerAPI={workerAPI}
                        token={token}
                        isSidebarOpen={leftSidebar.isOpen}
                        toggleSidebar={leftSidebar.toggle}
                    />
                </div>
                <div className='flex-1 max-h-[calc(100vh-50px)] w-full justify-center overflow-y-auto overflow-x-hidden doc-scrollbar'>
                    <div className='flex flex-col mb-[30vh] w-full mx-auto'>
                        <EditorContent editor={editor} className="flex-1" />

                        <ContentItemMenu editor={editor} />
                        <LinkMenu editor={editor} appendTo={newRef} />
                        <TextMenu editor={editor} />
                        {/* using new ref need customize function */}
                        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
                        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
                        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
                        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
                    </div>
                </div>
            </div>
        </>

    )
}

export default App
