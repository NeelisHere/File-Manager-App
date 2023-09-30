'use client'
import Image from "next/image"
import { useRouter } from "next/navigation"

const FolderItem = ({ folder }) => {
    const router = useRouter()
    const handleClick = () => {
        router.push(`/folder/${folder.id}`)
    }
    return (
        <div 
            className="p-6 border-2 flex flex-col items-center justify-center rounded-lg hover:bg-gray-100 transition duration-200 ease-in-out cursor-pointer"
            onClick={handleClick}
        >
            <Image src={'/folder.png'} width={40} height={40} />
            {folder.name}
        </div>
    )
}

export default FolderItem
