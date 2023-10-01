'use client'
import { createContext, useContext, useState } from "react"

const ParentFolderContext = createContext()
export const useParentFolder = () => useContext(ParentFolderContext)

const ParentFolderProvider = ({ children }) => {
    const [parentFolder, setParentFolder] = useState([])
    const [newFolderCreated, setNewFolderCreated] = useState(false)
    const [newFileCreated, setNewFileCreated] = useState(false)
    return (
        <ParentFolderContext.Provider 
            value={{ 
                parentFolder, setParentFolder,
                newFolderCreated, setNewFolderCreated,
                newFileCreated, setNewFileCreated 
            }}
        >
            { children }
        </ParentFolderContext.Provider>
    )
}

export default ParentFolderProvider
