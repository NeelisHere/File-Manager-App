import React, { useEffect, useRef, useState } from 'react'
import StorageDetailItem from './StorageDetailItem';
import { useSession } from 'next-auth/react';
import { useParentFolder } from '@/context/ParentFolderContext';
import { classifyFiles } from '@/utils/classifyFiles';
import { getFirestore, collection, getDocs, query, where  } from 'firebase/firestore';
import { app } from '@/config/firebase-config';

function StorageDetails() {
    const { data: session } = useSession()
    const db = getFirestore(app)
    const { newFileCreated } = useParentFolder()

    const initialStorageList = [
        {
            id: 1,
            type: "Images",
            totalFile: 0,
            size: 0,
            logo: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
        },
        {
            id: 2,
            type: "Videos",
            totalFile: 0,
            size: 0,
            logo: 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z'
        },
        {
            id: 3,
            type: "Documents",
            totalFile: 0,
            size: 0,
            logo: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'
        },
        {
            id: 4,
            type: "Others",
            totalFile: 0,
            size: 0,
            logo: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
        },
    ];

    const [ storageList, setStorageList ] = useState(initialStorageList)

    const fetchFileList = async () => {
        try {
            const fetchFilesQuery = query(
                collection(db, 'Files'),
                where('createdBy', '==', session.user.email)
            )
            const querySnapshot = await getDocs(fetchFilesQuery)
            querySnapshot.forEach((doc) => {
                const currentFile = doc.data()
                const fileCategory = classifyFiles(currentFile.name)
                setStorageList((prev) => {
                    let newList = initialStorageList
                    newList[fileCategory - 1].totalFile += 1
                    newList[fileCategory - 1].size += currentFile.size
                    return newList
                })
            })
        } catch (error) {
            console.log(error)
        }
	}

    useEffect(() => {
        if (session) {
            fetchFileList()
        }
    }, [session, newFileCreated])
    
    return (
        <div className='my-8'>
            {
                storageList?.map((item, index) => (
                    <StorageDetailItem item={item} key={index} />
                ))
            }
        </div>
    )
}

export default StorageDetails
