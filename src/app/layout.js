import './globals.css'
import SideNavbar from '../components/SideNavbar.jsx'
import Provider from '../components/Provider'
// import Toast from '@/components/Toast'
import { Toaster } from 'react-hot-toast';
import ParentFolderProvider from '@/context/ParentFolderContext';
import Storage from '@/components/storage/Storage';

export const metadata = {
	title: 'Cloud-File-Manager',
	description: 'Manage files and folders in the cloud.'
}

const RootLayout = ({ children }) => {

	return (
		<html lang='en'>
			<body>
				<Provider>
					<ParentFolderProvider>
						<main className="flex">
							<SideNavbar />
							<div className='grid grid-cols-4 md:grid-cols-4 w-full '>
								<div className='col-span-3'>
									{children}
								</div>
								<div className='bg-white h-screen sticky top-0 z-10 p-5 order-first md:order-last border-2'>
									<Storage />
								</div>
							</div>
						</main>
					</ParentFolderProvider>
					<Toaster />
				</Provider>
			</body>
		</html>
	)
}

export default RootLayout