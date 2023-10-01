'use client'
import Searchbar from "@/components/Searchbar"
import Spinner from "@/components/Spinner"
import FileList from "@/components/file/FileList"
import { useParentFolder } from "@/context/ParentFolderContext"
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

const Bookmarks = () => {
    const [fileList, setFileList] = useState([])
    const { data: session }  = useSession()
	const [loading, setLoading] = useState(false)
    const { newFileCreated, setNewFileCreated } = useParentFolder()
    const db = getFirestore()

    const fetchFileList = async () => {
		setLoading(true)
        try {
            // setChildFolders([])
            const fetchFilesQuery = query(
                collection(db, 'Files'),
                where('createdBy', '==', session.user.email),
                where('isBookmarked', '==', true),
            )
            const querySnapshot = await getDocs(fetchFilesQuery)
            setFileList((prev) => {
                const newFileList = []
                querySnapshot.forEach((doc) => {
                    newFileList.push(doc.data())
                })
                return newFileList
            })

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
	}

    useEffect(() => {
        fetchFileList()
    }, [newFileCreated])

    return (
        <div className='px-8 py-4 pt-8 bg-gray-100'>
			<Searchbar />
			{
				loading?
				<Spinner />:
				<FileList fileList={fileList} title={'Bookmarks'} />
			}
		</div>
    )
}

export default Bookmarks
