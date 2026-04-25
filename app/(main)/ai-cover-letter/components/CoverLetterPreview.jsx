"use client"
import { updateCoverLetter } from '@/actions/coverLetter';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/useFetch';
import MDEditor from '@uiw/react-md-editor'
import { ArrowUpToLine, Edit, Loader2, Monitor, RotateCcw, SquarePen } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner';

const CoverLetterPreview = ({ content, id }) => {
  const [formType, setFormType] = useState("preview");
  const [coverLetterContent, setCoverLetterContent] = useState(content);

  const {
    data: updatedCoverLetter,
    loading: isUpdating,
    error: updateError,
    fetchData: updateCoverLetterFn
  } = useFetch(updateCoverLetter)

  useEffect(() => {
    if (updatedCoverLetter) {
      setCoverLetterContent(updatedCoverLetter);
    }
  }, [updatedCoverLetter])
  
  // useEffect(() => {
  //   if (updatedCoverLetter && !isUpdating) {
  //     toast.success("Cover Letter Updated Successfully!");
  //   }
  //   if (updateError) {
  //     toast.error("Cannot update cover letter!");
  //   }
  // }, [isUpdating])
  

  const onSubmit = async () => {
    try {
      await updateCoverLetterFn(coverLetterContent, id);
      toast.success("Cover Letter Updated Successfully!");
    } catch (error) {
      console.error("Update error: ", error.message);
      toast.error("Cannot update cover letter!");
    }
  }

  return (
    <div>
      <div className='flex justify-between items-center'>
        <div>
          <Button 
            variant="link" 
            className="cursor-pointer pl-0"
            onClick={() => setFormType((prev) => (prev === "preview" ? "edit" : "preview"))}
          >
            {formType === "preview" ? (
              <>
                <Edit className='size-4 pl-0'/>
                Edit Cover Letter
              </>
            ) : (
              <>
                <Monitor className='size-4'/>
                Show preview
              </>
            )}
          </Button>
        </div>
        <div>
          <Button 
            variant="secondary" 
            disabled={isUpdating} 
            className='bg-green-400/55 hover:bg-green-400/35 transition-all cursor-pointer'
            onClick = {onSubmit}
          >
            {isUpdating ? (
              <>
                <Loader2 className='size-4 animate-spin'/>
                Updating
              </>
            ) : (
              <>
                <SquarePen className='size-4'/>
                Update
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className='py-4'>
        <MDEditor 
          value={coverLetterContent} 
          preview={formType} 
          height={700}
          onChange={(val) => setCoverLetterContent(val || "")}
        />
      </div>
    </div>
  )
}

export default CoverLetterPreview