import FolderItem from '@/components/folder/FolderItem'

const FolderList = ({ folderList, title }) => {
    // console.log('->', folderList)
    return (
        <div className='bg-white my-8 p-5 rounded-lg'>
            <div className='flex justify-between'>
                <h2 className='text-[24px] font-bold items-center '>{title}</h2>
                <span className='flex items-center text-blue-400 font-normal text-[16px]'>View All</span>
            </div>
            <div className='mt-4 grid grid-col-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2'>
                {
                    folderList.map((folder, index) => {
                        return (
                            <FolderItem key={index} folder={folder} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default FolderList
