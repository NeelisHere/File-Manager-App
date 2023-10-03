import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore'
import React, { useEffect, useRef, useState } from 'react'
import { app } from '@/config/firebase-config'
import { useSession } from 'next-auth/react'
import { useParentFolder } from '@/context/ParentFolderContext'

const StorageInfo = () => {
    const db = getFirestore(app)
    // const totalSizeUsed = useRef(0)
    const { newFileCreated } = useParentFolder()
    const [totalSizeUsed, setTotalSizeUsed] = useState(0)
    const { data: session } = useSession()

    const getAllfiles = async () => {
        const storageQuery = query(
            collection(db, 'Files'),
            where('createdBy', '==', session.user.email)
        )
        const querySnapshot = await getDocs(storageQuery)
        setTotalSizeUsed((prev) => {
            let totalSize = 0
            querySnapshot.forEach((doc) => {
                totalSize += doc.data()['size']
            })
            return totalSize
        })
    }

    useEffect(() => {
        if (session) {
            getAllfiles()
        }
    }, [session, newFileCreated])

    return (
        <div className='mt-7'>
            <h2 className="text-[22px] font-bold">
                {(totalSizeUsed/(1024**2)).toFixed(2)+" MB"} {" "}
                <span className="text-[14px] font-medium">
                    used of{" "}
                </span>{" "}
                1 GB
            </h2>
            <div className='w-full bg-gray-200 h-2.5 flex'>
                <div className='bg-blue-600 h-2.5 w-[25%]'></div>
                <div className='bg-green-600 h-2.5 w-[35%]'></div>
                <div className='bg-yellow-400 h-2.5 w-[15%]'></div>
            </div>
        </div>
    )
}

export default StorageInfo
