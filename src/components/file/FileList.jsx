'use client'
import { useState } from "react"
import FileItem from "./FileItem"
import MoveFileModal from "./MoveFileModal"

const FileList = ({ fileList, title }) => {
    const [currentFile, setCurrentFile] = useState(null)
    return (
        <div className='bg-white my-8 p-5 rounded-lg'>
            <h2 className='text-[24px] font-bold items-center '>{title}</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 text-[13px] font-semibold border-b-[1px] pb-2 mt-3 border-gray-300 text-gray-400'
            >
                <h2>Name</h2>
                <div className='grid grid-cols-3'>
                    <h2>Modified</h2>
                    <h2>Size</h2>
                    <h2></h2>

                </div>
            </div>
            {
                fileList?.map((item, index) => (
                    <div key={index}>
                        <FileItem 
                            key={index} 
                            file={item} 
                            // currentFile={currentFile}
                            setCurrentFile={setCurrentFile}
                        />
                    </div>
                ))
            }
            <dialog id="move-file-modal" className="modal">
                <MoveFileModal file={currentFile} />
            </dialog>
        </div>
    )
}

export default FileList
