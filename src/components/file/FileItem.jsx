'use client'
import Image from "next/image"
import moment from 'moment'
import toast from "react-hot-toast"
import { StarIcon, StarSolidIcon, TrashIcon } from "../Icons"
import { useEffect, useState } from "react"
import { doc, getFirestore, setDoc } from "firebase/firestore"
import { app } from "@/config/firebase-config"
// import { useSession } from "next-auth/react"
import Spinner from "../Spinner"
import { useParentFolder } from "@/context/ParentFolderContext"


const FileItem = ({ file }) => {
    const { setNewFileCreated } = useParentFolder()
    const [loading, setLoading] = useState(false)
    const db = getFirestore(app)

    const moveToTrash = () => { }

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
            <div className="flex gap-2 items-center" onClick={() => window.open(file.imageURL)}>
                <Image
                    src={file.icon}
                    alt="file-icon"
                    width={26}
                    height={20}
                    on
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

                <h2 className="text-[15px] w-full col-span-2 ">
                    {(file.size / 1024 ** 2).toFixed(2) + " MB"}
                </h2>
                <div 
                    className="cursor-pointer flex items-center justify-center" 
                    onClick={() => moveToTrash(file)}
                >
                    <TrashIcon />
                </div>
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
            </div>
        </div>
    )
}

export default FileItem
