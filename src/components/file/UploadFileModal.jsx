'use client'
import { doc, getFirestore, setDoc } from "firebase/firestore";
// import React, { useContext } from "react";
import { app } from "@/config/firebase-config";
import { useSession } from "next-auth/react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useParentFolder } from "@/context/ParentFolderContext";
import { useState } from "react";
import Spinner from "../Spinner";
import toast from "react-hot-toast";


const UploadFileModal = () => {
    const { data: session } = useSession();
    const { parentFolder, setParentFolder } = useParentFolder()
    const { setNewFileCreated } = useParentFolder()
    const [loading, setLoading] = useState()

    const docId = Date.now();
    const db = getFirestore(app);
    const storage = getStorage(app);

    const onFileUpload = async (file) => {
        // console.log('File', file)
        if (!file) return;
        if (file?.size > 1000000) {
            toast.error("File is too large")
            return;
        }
        const fileStorageRef = ref(storage, `file/${file.name}`)
        try {
            setLoading(true)
            await uploadBytes(fileStorageRef, file)
            const url = await getDownloadURL(fileStorageRef)
            await setDoc(
                doc(db, 'Files', docId.toString()),
                {
                    id: docId,
                    name: file.name,
                    type: file.name.split('.')[1],
                    size: file.size,
                    modifiedAt: file.lastModified,
                    createdBy: session.user.email,
                    folderId: parentFolder.id,
                    imageURL: url,
                    icon: '/document.png'
                }
            )
            toast.success('File uploaded successfully!')
            setNewFileCreated(true)
        } catch (error) {
            console.log(error)
            toast.error('Error uploading file!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <form method="dialog" className="bg-white modal-box p-9 items-center w-[360px]">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                </button>
                <div
                    className="w-full items-center flex flex-col justify-center gap-3"
                >
                    <div className="flex items-center justify-center w-full">
                        {
                            loading ?
                                <Spinner /> :
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg
                                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 16"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                            />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span className="font-semibold">Click to upload</span> or drag
                                            and drop
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                                        </p>
                                    </div>
                                    <input
                                        id="dropzone-file"
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => onFileUpload(e.target.files[0])}
                                    />
                                </label>
                        }
                    </div>
                </div>
            </form>
        </div>
    )
}

export default UploadFileModal






/*
const UploadFileModal = () => {
    const db = getFirestore(app)
    const [name, setName] = useState('')
    const handleSubmit = async () => {
        // console.log(name)
        // await setDoc(doc(db, "Files", "LA"), {
        //     name: "Los Angeles",
        //     state: "CA",
        //     country: "USA"
        // });
        setName('')
    }
    return (
        <div className="modal-box bg-white">
            <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                <h3 className="font-bold text-lg mb-4 text-center">Create New File</h3>
                <input 
                    type="text"
                    className='bg-white input input-bordered w-full my-4'
                    placeholder='New file name' 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button 
                    className='btn btn-primary w-full my-4'
                    onClick={handleSubmit}
                >
                    Create
                </button>
            </form>
        </div>
    )
}

export default UploadFileModal
*/