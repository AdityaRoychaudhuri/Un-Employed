import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardAction, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import CoverLetterList from './components/CoverLetterList'
import { getCoverLetters } from '@/actions/coverLetter'

const CoverLetterPage = async () => {
  const coverLetters = await getCoverLetters();

  return (
    <div>
      <div className='flex flex-col md:flex-row mb-5 gap-2 items-center justify-between'>
        <h1 className='gradient_title text-6xl font-bold'>
          Cover Letters
        </h1>
        <Link href="/ai-cover-letter/new">
          <Button className="cursor-pointer">
            <Plus className='size-5 mr-2'/>
            New
          </Button>
        </Link>
      </div>
      <CoverLetterList coverLettersList={coverLetters}/>
    </div>
  )
}

export default CoverLetterPage