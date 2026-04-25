import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import NewCoverLetter from '../components/NewCoverLetter'

const page = () => {
  return (
    <div className='container mx-auto py-6'>
      <div className='flex flex-col space-y-2'>
        <Link href='/ai-cover-letter' className='max-w-fit'>
          <Button variant="link" className='pl-0 gap-2 cursor-pointer'>
            <ArrowLeft className='size-4'/>
            Back to cover letters
          </Button>
        </Link>
        <div className='pb-6'>
          <h1 className='gradient_title text-6xl font-bold'>
            Create cover letter
          </h1>
          <p className='text-muted-foreground'>
            Generate a tailored cover letter for your job application
          </p>
        </div>
      </div>

      <NewCoverLetter/>
    </div>
  )
}

export default page