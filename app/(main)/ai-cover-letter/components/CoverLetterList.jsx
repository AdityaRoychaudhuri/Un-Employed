"use client"
import React from 'react'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { Delete, DeleteIcon, Eye, Loader2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogHeader, AlertDialogFooter } from '@/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'
import useFetch from '@/hooks/useFetch'
import { deleteCoverLetter } from '@/actions/coverLetter'
import { toast } from 'sonner'

const CoverLetterList = ({ coverLettersList }) => {
    const router = useRouter();
    const {
        data: deletedCoverLetter,
        loading: isDeleting,
        fetchData: deleteCoverLetterFn
    } = useFetch(deleteCoverLetter);

    const handleDelete = async (id) => {
        try {
            await deleteCoverLetterFn(id);
            toast.success("Cover-letter deleted successfully");
            router.refresh();
        } catch (error) {
            toast.error(error.message || "Failed to delete cover letter");
        }
    }

    if (coverLettersList?.length <= 0) {
        return (
            <Card>
                <CardHeader>
                <CardTitle>No Cover Letters Yet</CardTitle>
                <CardDescription>
                    Create your first cover letter to get started
                </CardDescription>
                </CardHeader>
            </Card>
        )
    }

  return (
    <div>
        {coverLettersList.map((item, id) => (
            <Card className="mb-4" key={id}>
                <CardHeader>
                    <CardTitle>
                        {item.jobTitle} at {item.companyName}
                    </CardTitle>
                    <CardDescription>
                        Created {format(new Date(item.createdAt), "PPP")}
                    </CardDescription>
                    <CardAction className="flex space-x-2">
                        <AlertDialog>
                            <Button
                                className="cursor-pointer"
                                variant="outline"
                                onClick={() => router.push(`/ai-cover-letter/${item.id}`)}
                            >
                                <Eye className='size-4'/>
                            </Button>

                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="cursor-pointer"
                                >
                                    <Trash2 className='size-4'/>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete Cover Letter?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently
                                        delete your cover letter for {item.jobTitle} at{" "}
                                        {item.companyName}.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => handleDelete(item.id)}
                                        disabled={isDeleting}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Loader2 className='size-4 animate-spin'/>
                                                Deleting
                                            </>
                                        ) : (
                                            <>
                                                Delete
                                            </>
                                        )}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <div className='text-muted-foreground text-sm line-clamp-3'>
                        {item.jobDesc}
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
  )
}

export default CoverLetterList