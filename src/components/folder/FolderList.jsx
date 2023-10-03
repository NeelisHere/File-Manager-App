import FolderItem from '@/components/folder/FolderItem'
import { app } from '@/config/firebase-config'
import { useParentFolder } from '@/context/ParentFolderContext'
import { collection, getFirestore, query, getDocs, updateDoc, where, deleteDoc, doc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { MoveIcon } from '../Icons'
import MoveFileModal from '../file/MoveFileModal'

const FolderList = ({ folderList, title, parentFolderId }) => {
    const router = useRouter()
    const [loading, setLoading] = useState()
    const db = getFirestore(app)
    const { setNewFolderCreated, setNewFileCreated } = useParentFolder()

    const handleDeleteFolder = async () => {
        // folderId = parentFolderId -> folderId = null, (all the folders and files)
        try {
            setLoading(true)
            //================ move all files to home ===================
            const filesQuery = query(
                collection(db, 'Files'),
                where('folderId', '==', parentFolderId)
            );
            const filesSnapshot = await getDocs(filesQuery);
            filesSnapshot.forEach((doc) => {
                updateDoc(doc.ref, { folderId: null });
            });
            //============== move all the folders to home =====================
            const foldersQuery = query(
                collection(db, 'Folders'),
                where('parentFolder', '==', parentFolderId)
            );
            const foldersSnapshot = await getDocs(foldersQuery);
            foldersSnapshot.forEach((doc) => {
                updateDoc(doc.ref, { parentFolder: null });
            });
            //================ delete the actual folder ===================
            await deleteDoc(doc(db, 'Folders', parentFolderId))
            //===================================
            setNewFolderCreated(true)
            setNewFileCreated(true)
            toast.success('Folder deleted!')
            if (typeof window !== "undefined") {
                const splittedRoute = window.location.pathname.split('/')
                const deletedFolderId = splittedRoute[splittedRoute.length]
                if (deletedFolderId !== '') {
                    toast.success('All sub-files and folders are shifted to the home folder.')
                }
                router.push('/')
            } else {
                throw new Error()
            }
        } catch (error) {
            console.log(error)
            toast.error('Failed to delete folder!')
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='bg-white my-8 p-5 rounded-lg'>
            <div className='flex justify-between'>
                <h2 className='text-[24px] font-bold items-center '>{title}</h2>
                {
                    (typeof window !== "undefined") &&
                    (window.location.pathname !== '/') &&
                    <div className="flex items-center justify-center gap-8">
                        <button
                            className='btn btn-ghost text-primary flex items-center font-normal text-[14px]'
                            onClick={()=>document.getElementById('move-folder-modal').showModal()}
                        >
                            <MoveIcon /> Move
                        </button>
                        <dialog id="move-folder-modal" className="modal">
                            {/* <MoveFolderModal 
                                content={{ id: window.location.pathname.split('/').slice(-1).pop() }} 
                                type={'folder'} 
                            /> */}
                        </dialog>
                        <span
                            className='btn btn-ghost flex items-center text-red-400 font-normal text-[14px]'
                            onClick={handleDeleteFolder}
                        >
                            Delete
                        </span>
                    </div>
                }

            </div>
            <div className='mt-4 grid grid-col-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2'>
                {
                    folderList.map((folder, index) => {
                        return (
                            <FolderItem key={index} folder={folder} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default FolderList
