'use client'
import Searchbar from "@/components/Searchbar"
import FileList from "@/components/file/FileList"
import FolderList from "@/components/folder/FolderList"
import { app } from "@/config/firebase-config"
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export default function Home() {
	const db = getFirestore(app)
	const router = useRouter()
	const { data: session }  = useSession()
	const [folderList, setFolderList] = useState([])

	const getFolderList = async () => {
		const q = query(
			collection(db, 'Folders'), 
			where('createdBy', '==', session.user.email)
		)
		let querySnapshot = await getDocs(q)
		setFolderList((prevFolderList) => {
			const newFolderList = []
			querySnapshot.forEach((doc) => {
				newFolderList.push(doc.data())
			})
			return newFolderList
		})
	}

	useEffect(() => {
		if (!session) {
			router.push('/login')
		} else {
			getFolderList()
		}
	},[session])

	return (
		<div className='px-8 py-4 pt-8 bg-gray-100'>
			<Searchbar />
			<FolderList folderList={folderList} title={'Recent Folders'} />
			<FileList />
		</div>
	)
}
