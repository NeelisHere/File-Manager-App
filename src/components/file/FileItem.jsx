'use client'
import Image from "next/image"
import moment from 'moment'
import toast from "react-hot-toast"
import { CopyIcon, MoveIcon, StarIcon, StarSolidIcon, TrashIcon, VerticalDotsIcon } from "../Icons"
import { useEffect, useState } from "react"
import { deleteDoc, doc, getFirestore, setDoc } from "firebase/firestore"
import { app } from "@/config/firebase-config"
// import { useSession } from "next-auth/react"
import Spinner from "../Spinner"
import { useParentFolder } from "@/context/ParentFolderContext"
import MoveFileModal from "./MoveFileModal"


const FileItem = ({ file, setCurrentFile }) => {
    const { setNewFileCreated } = useParentFolder()
    const [loading, setLoading] = useState(false)
    const db = getFirestore(app)

    const handleDuplicateFile = async () => {
        const docId = Date.now().toString()
        try {
            setLoading(true)
            await setDoc(
                doc(db, 'Files', docId),
                { ...file, id: docId }
            )
            setNewFileCreated(true)
            toast.success('Duplicate file created successfully!')
        } catch (error) {
            console.log(error)
            toast.error('Error creating duplicate file!')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteFile = async (file) => {
        // toast(file.id)
        try {
            setLoading(true)
            await deleteDoc(doc(db, 'Files', file.id.toString()))
            setNewFileCreated(true)
            toast.success('File deleted successfully!')
        } catch (error) {
            console.log(error)
            toast.error('Error deleting file!')
        } finally {
            setLoading(false)
        }
    }

    const bookmarkFile = async () => {
        setLoading(true)
        try {
            const docRef = doc(db, 'Files', file.id.toString())
            await setDoc(docRef, { isBookmarked: !file.isBookmarked }, { merge: true })
            const message = !file.isBookmarked ?
                'File bookmarked successfully!' : 'File removed from bookmarks!'
            toast.success(message)
            setNewFileCreated(true)
        } catch (error) {
            console.log(error)
            toast.error('Failed to bookmark file!')
        }
        setLoading(false)
    }

    return (
        <div
            className="grid grid-cols-1
            md:grid-cols-2 justify-between
            cursor-pointer hover:bg-gray-100
            p-3 rounded-md"
        >
            <div 
                className="flex gap-2 items-center" 
                onClick={() => {
                    if (typeof window !== "undefined") {
                        window.open(file.imageURL)
                    }
                }}
            >
                <Image
                    src={file.icon}
                    alt="file-icon"
                    width={26}
                    height={20}
                />
                <h2 className="text-[15px] truncate">
                    {file.name}
                </h2>
            </div>
            <div className="grid grid-cols-6 place-content-start">
                <h2 className="text-[15px] col-span-2">
                    {moment(file.modifiedAt).format("MMM DD, YYYY")}
                    {/* { file.modifiedAt } */}
                </h2>
                <h2 className="text-[15px] w-full col-span-2">
                    {(file.size / 1024 ** 2).toFixed(2) + " MB"}
                </h2>

                <div
                    className="cursor-pointer flex items-center justify-center"
                    onClick={() => bookmarkFile()}
                >
                    {
                        loading ? <Spinner /> : (
                            file.isBookmarked ? <StarSolidIcon /> : <StarIcon />
                        )
                    }
                </div>
                
                {
                    <div className="dropdown flex justify-center">
                        <label tabIndex={0} className="cursor-pointer">
                            <VerticalDotsIcon />
                        </label>
                        <ul tabIndex={0} className="bg-white cursor-pointer dropdown-content z-[1] menu p-2 shadow rounded-box w-52">
                            <li
                                className=''
                                onClick={()=>{
                                    setCurrentFile(file)
                                    document.getElementById('move-file-modal').showModal()
                                }}
                            >
                                <a>
                                    {loading ? <Spinner /> : <MoveIcon />}
                                    Move to
                                </a>
                                {/* <dialog id="move-file-modal" className="modal">
                                    <MoveFileModal file={file} />
                                </dialog> */}
                            </li>

                            <li
                                className=''
                                onClick={handleDuplicateFile}
                            >
                                <a>
                                    {loading ? <Spinner /> : <CopyIcon />}
                                    Make duplicate
                                </a>
                            </li>

                            <li>
                                <a onClick={() => handleDeleteFile(file)}>
                                    {
                                        loading ? <Spinner /> : <TrashIcon />
                                    }
                                    Delete File
                                </a>
                            </li>

                        </ul>
                    </div>
                }
            </div>
        </div>
    )
}

export default FileItem
