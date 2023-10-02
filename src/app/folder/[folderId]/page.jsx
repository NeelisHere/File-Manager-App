"use client"
import SearchBar from '@/components/Searchbar'
import Spinner from '@/components/Spinner'
import FileList from '@/components/file/FileList'
import FolderList from '@/components/folder/FolderList'
import { app } from '@/config/firebase-config'
import { useParentFolder } from '@/context/ParentFolderContext'
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const FolderDetails = ({ params }) => {
    const { data: session } = useSession() 
    const router = useRouter()
    const { 
        parentFolder, setParentFolder, 
        newFolderCreated, setNewFolderCreated, 
        newFileCreated, setNewFileCreated 
    } = useParentFolder()
    const [loading, setLoading] = useState(false)
    const [childFolders, setChildFolders] = useState([])
    const [fileList, setFileList] = useState([])
    const [folder, setFolder] = useState(null)
    const db = getFirestore(app)

    useEffect(() => {
        //hack to fix the issue of loosing the navigation stack when the browser is reloaded
        if (params.folderId && parentFolder.length === 0) {
            router.push('/')
        }
    }, [])

    const fetchParentFolder = async () => {
        setLoading(true)
        try {
            const docSnap = await getDoc(
                doc(db, 'Folders', params.folderId)
            )
            if (docSnap.exists()) {
                const currentFolder = docSnap.data()
                setFolder({ ...currentFolder })
                // setParentFolder(currentFolder)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchChildFolders = async () => {
        setLoading(true)
        try {
            // setChildFolders([])
            const fetchChildFoldersQuery = query(
                collection(db, 'Folders'),
                where('createdBy', '==', session.user.email),
                where('parentFolder', '==', params.folderId)
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
                where('folderId', '==', params.folderId)
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

    const handleNavigation = async (p) => {
        let targetIndex = null;
        parentFolder.forEach((parent, index) => {
            if (parent.id === p.id) {
                targetIndex = index
            }
        })
        setParentFolder(parentFolder.filter((p, index) => index <= targetIndex))
        router.push(`/folder/${p.id}`)
    }

    useEffect(() => {
        fetchParentFolder()
    }, [])

    useEffect(() => {
        if (folder && session) {
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
    }, [folder, session, newFolderCreated, setNewFolderCreated, newFileCreated, setNewFileCreated])

    return (
        <div className='px-8 py-4 pt-8 bg-gray-100'>
            <SearchBar />
            <div className='border-2'>
                {/* {console.log('->->', parentFolder)} */}
                {
                    parentFolder?.map((p, index) => {
                        return(
                            <button 
                                key={index} 
                                className='btn btn-link'
                                onClick={() => handleNavigation(p)}    
                            >
                                {p.name}
                            </button>
                        )
                    })
                }
            </div>
            {
                folder &&
                (
                    loading?
                    <Spinner />:<FolderList folderList={childFolders} title={folder?.name} />
                )
            }
            {
                folder &&
                (
                    loading?
                    <Spinner />:<FileList fileList={fileList} title={folder?.name} />
                )
            }
        </div>
    )
}

export default FolderDetails