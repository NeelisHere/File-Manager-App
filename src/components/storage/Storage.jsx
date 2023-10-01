'use client'
import React from 'react'
import UserInfo from './UserInfo'
import StorageInfo from './StorageInfo'

const Storage = () => {
    return (
        <div className='border-2'>
            <UserInfo />
            <StorageInfo />
        </div>
    )
}

export default Storage
