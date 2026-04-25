import { getCoverLetter } from '@/actions/coverLetter';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import CoverLetterPreview from '../components/CoverLetterPreview';

const CoverLetter = async ({ params }) => {
  const { id } = await params;
  const coverLetter = await getCoverLetter(id);

  return (
    <div className='container mx-auto py-6 md:my-6'>
      <div className='flex flex-col space-y-2'>
        <Link href="/ai-cover-letter" className=' max-w-fit'>
          <Button variant="link" className="cursor-pointer gap-2 pl-0">
            <ArrowLeft className='size-4'/>
            Back to cover letters
          </Button>
        </Link>

        <h1 className='gradient_title text-6xl mb-6'>
          {coverLetter?.jobTitle} <span className='text-4xl'>&nbsp;&nbsp; @ &nbsp;&nbsp;</span>  {coverLetter?.companyName}
        </h1>
      </div>

      <CoverLetterPreview content={coverLetter?.content} id={id}/>
    </div>
  )
}

export default CoverLetter