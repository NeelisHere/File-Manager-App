import { HomeIcon, TrashIcon, StarIcon, FolderIcon } from "@/components/Icons"

const menuList = [
    {
        id: 0,
        title: 'Home',
        icon: <HomeIcon />,
        route: '/'
    },
    {
        id: 1,
        title: 'My files',
        icon: <FolderIcon />,
        route: '/myfiles'
    },
    {
        id: 2,
        title: 'Bookmarks',
        icon: <StarIcon />,
        route: '/bookmarks'
    },
    {
        id: 3,
        title: 'Trash',
        icon: <TrashIcon />,
        route: '/trash'
    }
]

export default menuList