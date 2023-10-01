'use client'
import Searchbar from "@/components/Searchbar"
import FileList from "@/components/file/FileList"
import { app } from "@/config/firebase-config"
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useParentFolder } from "@/context/ParentFolderContext"
import Spinner from "@/components/Spinner"

const MyFiles = () => {
    const db = getFirestore(app)
	const router = useRouter()
	const { data: session }  = useSession()
	const [loading, setLoading] = useState(false)
	const [fileList, setFileList] = useState([])
	const { newFileCreated, setNewFileCreated } = useParentFolder()

    const fetchFileList = async () => {
		setLoading(true)
        try {
            // setChildFolders([])
            const fetchFilesQuery = query(
                collection(db, 'Files'),
                where('createdBy', '==', session.user.email)
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
        if (session) {
			fetchFileList()
        }
        if (!session) {
            router.push('/login')
        }
		if (newFileCreated) {
            fetchFileList()
            setNewFileCreated(false)
        }
    }, [session, newFileCreated, setNewFileCreated])

    return (
        <div className='px-8 py-4 pt-8 bg-gray-100'>
			<Searchbar />
			{
				loading?
				<Spinner />:
				<FileList fileList={fileList} title={'All My Files'} />
			}
		</div>
    )
}

export default MyFiles
