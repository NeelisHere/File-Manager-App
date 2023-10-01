'use client'
import React from 'react'
import UserInfo from './UserInfo'
import StorageInfo from './StorageInfo'
import { useSession } from 'next-auth/react'
import StorageDetails from './StorageDetails'

const Storage = () => {
    const { data: session } = useSession()
    return (
        session && (
            <div className=''>
                <UserInfo />
                <StorageInfo />
                <StorageDetails />
            </div>
        )
    )
}

export default Storage
