'use client'
import Image from "next/image"
import moment from 'moment'
import toast from "react-hot-toast"
import { StarIcon, TrashIcon } from "../Icons"


const FileItem = ({ file }) => {
    const deleteFile = () => {}
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
                <div className="cursor-pointer flex items-center justify-center " onClick={() => deleteFile(file)}>
                    <TrashIcon />
                </div>
                <div className="cursor-pointer flex items-center justify-center" onClick={() => {}}>
                    <StarIcon />
                </div>
            </div>
        </div>
    )
}

export default FileItem
