"use client"
import SearchBar from '@/components/Searchbar'
import Spinner from '@/components/Spinner'
import FolderList from '@/components/folder/FolderList'
import { app } from '@/config/firebase-config'
import { useParentFolder } from '@/context/ParentFolderContext'
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

const FolderDetails = ({ params }) => {
    const { data: session } = useSession() 
    const { setParentFolder, newFolderCreated, setNewFolderCreated } = useParentFolder()
    const [loading, setLoading] = useState(false)
    const [childFolders, setChildFolders] = useState([])
    const [folder, setFolder] = useState(null)
    const db = getFirestore(app)

    const fetchParentFolder = async () => {
        setLoading(true)
        try {
            const docSnap = await getDoc(
                doc(db, 'Folders', params.folderId)
            )
            if (docSnap.exists()) {
                const currentFolder = docSnap.data()
                setFolder({ ...currentFolder })
                setParentFolder(currentFolder)
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

    useEffect(() => {
        fetchParentFolder()
    }, [])

    useEffect(() => {
        if (folder && session) {
            fetchChildFolders()
        }
        if (newFolderCreated) {
            fetchChildFolders()
            setNewFolderCreated(false)
        }
    }, [folder, session, newFolderCreated, setNewFolderCreated])

    return (
        <div className='px-8 py-4 pt-8 bg-gray-100'>
            <SearchBar />
            {
                folder &&
                (
                    loading?
                    <Spinner />:<FolderList folderList={childFolders} title={folder?.name} />
                )
            }
        </div>
    )
}

export default FolderDetails