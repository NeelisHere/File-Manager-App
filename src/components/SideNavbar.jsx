'use client'
import Image from "next/image"
// import { CreateIcon, FolderPlusIcon, FilePlusIcon } from "./Icons"
import menuList from "@/data/menuList"
import { useState } from "react"
import CreateFolderModal from "./folder/CreateFolderModal"
import UploadFileModal from "./file/UploadFileModal"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const SideNavbar = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    const { data: session } = useSession()
    const route = useRouter()
    return (
        session && (
            <div className='border-2 p-5 w-[20%] bg-white h-screen sticky top-0 z-10'>
                <div className='w-[100%] flex justify-center mt-6'>
                    <Image src={'/next.svg'} alt="app-logo" width={150} height={60} />
                </div>
                <div className="my-8 py-2">
                    <button
                        className="btn btn-primary w-[100%] my-1"
                        onClick={() => document.getElementById('upload-file-modal').showModal()}
                    >
                        upload new files
                    </button>
                    <button
                        className="btn btn-primary w-[100%] my-1"
                        onClick={() => document.getElementById('create-folder-modal').showModal()}
                    >
                        create new folders
                    </button>
                </div>
                <div className="my-8 py-2">
                    {
                        menuList.map((menu, index) => {
                            return (
                                <button
                                    key={index}
                                    className={
                                        `btn btn-ghost 
                                        ${index === activeIndex ? 'bg-gray-200' : ''} 
                                        border-2 
                                        justify-start w-[100%]`
                                    }
                                    onClick={() => {
                                        setActiveIndex(index)
                                        route.push(menu.route)
                                    }}
                                >
                                    {menu.icon}
                                    {menu.title}
                                </button>
                            )
                        })
                    }
                </div>
                <dialog id="create-folder-modal" className="modal">
                    <CreateFolderModal />
                </dialog>
                <dialog id="upload-file-modal" className="modal">
                    <UploadFileModal />
                </dialog>
            </div>
        )
    )
}

export default SideNavbar
