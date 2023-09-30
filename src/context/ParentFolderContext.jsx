'use client'
import { createContext, useContext, useState } from "react"

const ParentFolderContext = createContext()
export const useParentFolder = () => useContext(ParentFolderContext)

const ParentFolderProvider = ({ children }) => {
    const [parentFolder, setParentFolder] = useState(null)
    const [newFolderCreated, setNewFolderCreated] = useState(false)
    
    return (
        <ParentFolderContext.Provider 
            value={{ 
                parentFolder, setParentFolder,
                newFolderCreated, setNewFolderCreated 
            }}
        >
            { children }
        </ParentFolderContext.Provider>
    )
}

export default ParentFolderProvider
