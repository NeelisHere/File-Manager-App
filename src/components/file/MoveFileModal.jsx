'use client'
import { app } from "@/config/firebase-config"
import { collection, doc, getDocs, setDoc, getFirestore, query, where } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useParentFolder } from "@/context/ParentFolderContext"
import Spinner from "@/components/Spinner"
import Image from "next/image"
import toast from "react-hot-toast"

const MoveFileModal = ({ content, type }) => {

    const db = getFirestore(app)
    const router = useRouter()
    const { data: session } = useSession()
    const [loading, setLoading] = useState(false)
    const [folderList, setFolderList] = useState([])
    const { newFileCreated, setNewFileCreated, setNewFolderCreated } = useParentFolder()

    const fetchFolderList = async () => {
        setLoading(true)
        try {
            const fetchFoldersQuery = query(
                collection(db, 'Folders'),
                where('createdBy', '==', session.user.email)
            )
            const querySnapshot = await getDocs(fetchFoldersQuery)
            setFolderList((prev) => {
                const newFolderList = []
                querySnapshot.forEach((doc) => {
                    newFolderList.push(doc.data())
                })
                return newFolderList
            })
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (session && folderList.length === 0) {
            fetchFolderList()
        }
    }, [session, folderList])

    const handleMove = async (folder) => {
        try {
            setLoading(true)
            if (type === 'file') {
                // const file = content
                const docRef = doc(db, 'Files', content.id.toString())
                await setDoc(docRef, { folderId: folder.id }, { merge: true })
            } else {
                // const _folder = content
                const docRef = doc(db, 'Folders', content.id.toString())
                await setDoc(docRef, { parentFolder: folder.id }, { merge: true })
            }
            toast.success(`${type === 'file' ? 'File' : 'Folder'} moved successfully!`)
            router.push('/')
            setNewFileCreated(true)
            setNewFolderCreated(true)
        } catch (error) {
            console.log(error)
            toast.error(`Error moving ${type === 'file' ? 'file' : 'folder'}!`)
        } finally {
            setLoading(false)
        }
    }

    const handleMoveToHome = async () => {
        try {
            setLoading(true)
            if (type === 'file') {
                const file = content
                const docRef = doc(db, 'Files', file.id.toString())
                await setDoc(docRef, { folderId: null }, { merge: true })
            } else {
                const _folder = content
                const docRef = doc(db, 'Folders', _folder.id.toString())
                await setDoc(docRef, { parentFolder: null }, { merge: true })
            }
            toast.success(`${type === 'file' ? 'File' : 'Folder'} moved successfully!`)
            router.push('/')
            setNewFileCreated(true)
            setNewFolderCreated(true)
        } catch (error) {
            console.log(error)
            toast.error(`Error moving ${type === 'file' ? 'file' : 'folder'}!`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-none w-[500px] modal-box bg-white text-black">
            <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg mb-4 text-center">Move To</h3>
            {
                loading ?
                    <Spinner />
                    :
                    <div className="">
                        {
                            folderList?.map((folder, index) => {
                                return (
                                    <div
                                        key={index}
                                        className=' flex gap-3 hover:bg-gray-100 p-2 rounded-md cursor-pointer'
                                        onClick={() => handleMove(folder)}
                                    >
                                        <Image src='/folder.png'
                                            alt='folder'
                                            width={20}
                                            height={20}
                                        />
                                        <h1>{folder.name}</h1>
                                    </div>
                                )
                            })
                        }
                        <div className="mt-4 flex justify-center">
                            <button
                                className="btn text-primary btn-ghost"
                                onClick={handleMoveToHome}
                            >
                                Move to home
                            </button>
                        </div>
                    </div>
            }
        </div>
    )
}

export default MoveFileModal
