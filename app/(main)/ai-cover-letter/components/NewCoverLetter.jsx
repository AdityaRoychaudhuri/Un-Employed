"use client";
import React, { useEffect } from 'react'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth, useUser } from '@clerk/clerk-react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { coverLetterSchema } from '@/app/lib/schema'
import useFetch from '@/hooks/useFetch'
import { generateCoverLetter } from '@/actions/coverLetter'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {  useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const NewCoverLetter = () => {
  const { user } = useUser();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(coverLetterSchema)
  })

  const {
    data: coverLetterData,
    loading: isGenerating,
    fetchData: generateCoverLetterFn,
  } = useFetch(generateCoverLetter);

  useEffect(() => {
    if (coverLetterData) {
      toast.success("Successfully generated");
      router.push(`/ai-cover-letter/${coverLetterData?.id}`);
      reset();
    }
  }, [coverLetterData])
  

  const onSubmit = async (data) => {
    try {
      await generateCoverLetterFn(data);
    } catch (error) {
      toast.error("Failed to generate cover letter");
    }
  }

  return (
    <div className='space-y-2'>
      <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Provide information about the position you're appyling for</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor="companyName">
                    Company Name
                  </Label>
                  <Input 
                    placeholder='Type the company name' 
                    id='companyName'
                    {...register("companyName")}
                    />

                    {errors.companyName && (
                      <p className='text-sm text-red-500/75'>
                        {errors.companyName.message}
                      </p>
                    )}
                </div>
                <div className='space-y-2'>
                  <Label htmlFor="jobTitle">
                    Job Title
                  </Label>
                  <Input 
                    placeholder='Enter job title' 
                    id='jobTitle'
                    {...register("jobTitle")}
                  />

                  {errors.jobTitle && (
                    <p className='text-sm text-red-500/75'>
                      {errors.jobTitle.message}
                    </p>
                  )}
                </div>
              </div>
              <div className='space-y-4'>
                <Label htmlFor='jobDescription'>
                  Job Description
                </Label>
                <Textarea
                  id="jobDescription" 
                  placeholder="Paste the job description here" 
                  className="h-32"
                  {...register("jobDescription")}
                />

                {errors.jobDescription && (
                  <p className='text-sm text-red-500/75'>
                    {errors.jobDescription.message}
                  </p>
                )}
              </div>
              <div className='flex justify-end'>
                <Button type="submit" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className='size-4 animate-spin'/>
                      Generating
                    </>
                  ) : (
                    "Generater Cover Letter"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
    </div>
  )
}

export default NewCoverLetter