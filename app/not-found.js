import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function notFound (){
    return (
        <div className='flex flex-col min-h-[100vh] justify-center items-center px-4 text-center'>
            <h1 className='text-7xl gradient_title font-bold mb-4'>
                404 error!
            </h1>
            <h2 className='text-2xl font-semibold mb-4'>
                Page not found
            </h2>
            <p className='text-gray-600 mb-8'>
                Oops! The page you are looking for doesn&apos;t exist or has been moved.
            </p>

            <Link href="/">
                <Button>
                    Return Home
                </Button>
            </Link>
        </div>
    )
}