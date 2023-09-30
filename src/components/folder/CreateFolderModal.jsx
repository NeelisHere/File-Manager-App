'use client'
import React, { useState } from 'react'
import { getFirestore } from "firebase/firestore";
import { app } from '@/config/firebase-config';
import { doc, setDoc } from "firebase/firestore";
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useParentFolder } from '@/context/ParentFolderContext';

const CreateFolderModal = () => {
    const db = getFirestore(app)
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const { data: session } = useSession()
    const { parentFolder, setNewFolderCreated} = useParentFolder()

    const handleSubmit = async () => {
        // console.log(name)
        const docId = Date.now().toString()
        try {
            setLoading(true)
            await setDoc(
                doc(db, "Folders", docId),
                {
                    name: name,
                    id: docId,
                    createdBy: session.user.email,
                    parentFolder: parentFolder?.id || null
                }
            )
            toast.success('Folder created successfully!')
            setNewFolderCreated(true)
        } catch (error) {
            console.log(error)
            toast.error('Error creating new folder!')
        } finally {
            setName('')
            setLoading(false)
        }
    }
    return (
        <div className="modal-box bg-white">
            <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                <h3 className="font-bold text-lg mb-4 text-center">Create New Folder</h3>
                <input
                    type="text"
                    className='bg-white input input-bordered w-full my-4'
                    placeholder='New folder name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button
                    className={`btn btn-primary w-full my-4`}
                    disabled={loading? 'disabled' : ''}
                    onClick={handleSubmit}
                >
                    {
                        loading?
                        <span className='loading loading-spinner loading-xs text-white'></span>
                        :
                        <>Create</>
                    }
                    
                </button>
            </form>
        </div>
    )
}

export default CreateFolderModal
