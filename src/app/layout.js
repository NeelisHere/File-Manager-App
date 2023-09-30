import './globals.css'
import SideNavbar from '../components/SideNavbar.jsx'
import Provider from '../components/Provider'
// import Toast from '@/components/Toast'
import { Toaster } from 'react-hot-toast';
import ParentFolderProvider from '@/context/ParentFolderContext';

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
							<div className='grid grid-cols-1 md:grid-cols-4 w-full '>
								<div className='col-span-3'>
									{children}
								</div>
								<div className='bg-green-500'>storage</div>
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