'use client'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { Logout } from '../Icons'

const UserInfo = () => {
    const { data: session } = useSession()

    return (
        <div className='border-2'>
            {
                session ?
                    <div className='flex gap-2 items-center'>
                        <Image
                            src={session.user.image}
                            alt='user-image'
                            width={40}
                            height={40}
                            className='rounded-full'
                        />
                        <div>
                            <h2 className='text-[15px] font-bold'>{session.user.name}</h2>
                            <h2 className='text-[13px] text-gray-400 mt-[-4px]'>
                                {session.user.email}
                            </h2>
                        </div>
                        <div 
                            className='p-2 rounded-full cursor-pointer'
                            onClick={() => signOut()}
                        >
                            <Logout />
                        </div>
                    </div>
                    :
                    null
            }
        </div>
    )
}

export default UserInfo
