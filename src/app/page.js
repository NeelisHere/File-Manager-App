'use client'
import Searchbar from "@/components/Searchbar"
import FileList from "@/components/file/FileList"
import FolderList from "@/components/folder/FolderList"
import { app } from "@/config/firebase-config"
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { useParentFolder } from "@/context/ParentFolderContext"
import Spinner from "@/components/Spinner"

export default function Home() {
	const db = getFirestore(app)
	const router = useRouter()
	const { data: session }  = useSession()
	const [loading, setLoading] = useState(false)
	const [childFolders, setChildFolders] = useState([])
	const [fileList, setFileList] = useState([])
	const { newFolderCreated, setNewFolderCreated, newFileCreated, setNewFileCreated } = useParentFolder()

	const fetchChildFolders = async () => {
        setLoading(true)
        try {
            // setChildFolders([])
            const fetchChildFoldersQuery = query(
                collection(db, 'Folders'),
                where('createdBy', '==', session.user.email),
                where('parentFolder', '==', null)
            )
            const querySnapshot = await getDocs(fetchChildFoldersQuery)
            setChildFolders((prev) => {
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

	const fetchFileList = async () => {
		setLoading(true)
        try {
            // setChildFolders([])
            const fetchFilesQuery = query(
                collection(db, 'Files'),
                where('createdBy', '==', session.user.email),
                where('folderId', '==', null)
            )
            const querySnapshot = await getDocs(fetchFilesQuery)
            setFileList((prev) => {
                const newFileList = []
                querySnapshot.forEach((doc) => {
                    newFileList.push(doc.data())
                })
                return newFileList
            })
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
	}

	useEffect(() => {
        if (session) {
            fetchChildFolders()
			fetchFileList()
        }
        if (newFolderCreated) {
            fetchChildFolders()
            setNewFolderCreated(false)
        }
		if (newFileCreated) {
            fetchFileList()
            setNewFileCreated(false)
        }
    }, [session, newFolderCreated, setNewFolderCreated, newFileCreated, setNewFileCreated])

	return (
		<div className='px-8 py-4 pt-8 bg-gray-100'>
			<Searchbar />
			{
				loading?
				<Spinner />:
				<FolderList folderList={childFolders} title={'Home'} />
			}
			{
				loading?
				<Spinner />:
				<FileList fileList={fileList} title={'Home'} />
			}
		</div>
	)
}
