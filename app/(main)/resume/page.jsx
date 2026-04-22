import { getSavedResume } from '@/actions/resume'
import React from 'react'
import ResumeBuilder from './_components/ResumeBuilder';

const Resume = async () => {
  const resume = await getSavedResume();

  return (
    <div className='container mx-auto py-6'>
      <ResumeBuilder initialContent={resume?.content}/>
    </div>
  )
}

export default Resume