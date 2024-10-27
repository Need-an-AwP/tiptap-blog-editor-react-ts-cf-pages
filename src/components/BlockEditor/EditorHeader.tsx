import { useState, useEffect } from 'react'
import { Editor } from '@tiptap/core'
import { useEditorState } from '@tiptap/react'
import { Toolbar } from '@/components/ui/Toolbar'
import { Icon } from '@/components/ui/Icon'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"



export const EditorHeader = ({ editor, workerAPI, token, isSidebarOpen, toggleSidebar }: {
    editor: Editor,
    workerAPI: string,
    token: string,
    isSidebarOpen?: boolean,
    toggleSidebar?: () => void
}) => {
    const [currentArticle, setCurrentArticle] = useState<any>({})
    const [allArticles, setAllArticles] = useState<any[]>([])
    const [saveTime, setSaveTime] = useState(0)
    const { toast } = useToast()
    // initialize editor
    useEffect(() => {
        editor.commands.setContent({
            type: 'doc',
            content: [],
        })
        setCurrentArticle({
            id: 0,
            title: 'Unsaved New Document',
            content: '',
            create_time: 0,
            update_time: 0,
        })
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${workerAPI}/api/all_doc`);
            const data = await res.json();
            setAllArticles(data)
            console.log(data)
        };
        fetchData();
    }, [saveTime])

    const { characters, words } = useEditorState({
        editor,
        selector: (ctx): { characters: number; words: number } => {
            const { characters, words } = ctx.editor?.storage.characterCount || { characters: () => 0, words: () => 0 }
            return { characters: characters(), words: words() }
        },
    })

    const saveDocument = async () => {
        const content = editor?.getJSON()
        setSaveTime(Date.now())
        try {
            const res = await fetch(`${workerAPI}/api/save_doc`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id: currentArticle.id, title: currentArticle.title, content })
            })
            const data = await res.json()
            console.log(data)
            setCurrentArticle((prev: any) => ({ ...prev, update_time: data.update_time }))

        } catch (error) {
            console.error('Error saving document', error)
        }
    }

    const loadArticle = (id: Number) => {
        const data = allArticles.find(article => article.id === id)
        setCurrentArticle(data)
        console.log(data)
        const content = JSON.parse(data.content)
        editor.commands.setContent(content)

    }

    const createNewDocument = async () => {
        editor.commands.setContent({
            type: 'doc',
            content: [],
        })

        const content = editor?.getJSON()
        try {
            const res = await fetch(`${workerAPI}/api/new_doc`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title: 'Untitled', content })
            })
            const data = await res.json()
            setSaveTime(Date.now()) // just to trigger useEffect
            console.log(data)
            setCurrentArticle({
                id: data.id,
                title: 'Untitled',
                content: '',
                create_time: data.create_time,
                update_time: data.update_time,
            })
        } catch (error) {
            console.error('Error saving document', error)
        }
    }

    const deleteDocument = async () => {
        try {
            const res = await fetch(`${workerAPI}/api/delete_doc`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ id: currentArticle.id })
            })
            const data = await res.json()
            console.log(data)
            setSaveTime(Date.now()) // just to trigger useEffect
            setCurrentArticle({})
        } catch (error) {
            console.error('Error deleting document', error)
        }
    }

    return (
        <div className='flex flex-row justify-between px-2'>
            <div className='flex flex-row items-center gap-2'>
                <Toolbar.Button
                    tooltip={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                    active={isSidebarOpen}
                    className={isSidebarOpen ? 'bg-transparent' : ''}
                    onClick={toggleSidebar}
                >
                    <Icon name={isSidebarOpen ? 'PanelLeftClose' : 'PanelLeft'} />
                </Toolbar.Button>

                <Toolbar.Divider className='mr-2' />

                <div className='flex flex-row items-center gap-2'>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Toolbar.Button tooltip='Select document'>
                                <Icon name='ChevronDown' />
                            </Toolbar.Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='ml-6'>
                            {allArticles.map((article) => (
                                <DropdownMenuItem key={article.id} onClick={() => { loadArticle(article.id) }}>
                                    {article.title}
                                </DropdownMenuItem>
                            ))}

                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={createNewDocument}>
                                Create A new document
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Input
                        value={currentArticle.title}
                        className='bg-transparent font-bold'
                        onChange={(e) => setCurrentArticle((prev: any) => ({ ...prev, title: e.target.value }))}
                        autoResize={true}
                        maxWidth={600}
                    />
                </div>
            </div>

            <div className='flex flex-row items-center gap-2'>
                <Toolbar.Button
                    tooltip='Save document'
                    onClick={saveDocument}
                >
                    <Icon name="Save" />
                </Toolbar.Button>

                <Popover>
                    <PopoverTrigger asChild>
                        <Toolbar.Button
                            tooltip='current doc Info'
                        >
                            <Icon name="Info" />
                        </Toolbar.Button>
                    </PopoverTrigger>
                    <PopoverContent className="space-y-2">
                        <div className="flex flex-col gap-1 text-sm">
                            <p>id: {currentArticle.id}</p>
                            <p>title: {currentArticle.title}</p>
                            <p>create: {new Date(currentArticle.create_time * 1000).toLocaleString()}</p>
                            <p>update: {new Date(currentArticle.update_time * 1000).toLocaleString()}</p>
                        </div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Toolbar.Button variant="secondary" className='bg-red-600 w-full' disabled={!currentArticle.create_time}>
                                    <Icon name="Trash" />Delete This Document
                                </Toolbar.Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>ARE U SURE?🤨</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Deleting this document is irreversible.<br />
                                        Click continue to delete the document.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className='flex justify-end'>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={deleteDocument}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </PopoverContent>
                </Popover>

                <Toolbar.Divider />

                <div className="text-right text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    <div>{words} {words === 1 ? 'word' : 'words'}</div>
                    <div>{characters} {characters === 1 ? 'character' : 'characters'}</div>
                </div>
            </div>
        </div>
    )
}
