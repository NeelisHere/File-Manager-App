'use client'
import { signIn } from "next-auth/react"
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const Login = () => {
    const { data: session } = useSession()
	const router = useRouter()
	useEffect(() => {
		// console.log(session)
		if (session) {
			router.push('/')
		}
	}, [router, session])
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <button 
                className="btn btn-primary"
                onClick={() => {
                    signIn('google')
                    // console.log(session)
                }}
            >
                Login with Google
            </button>
        </div>
    )
}

export default Login
