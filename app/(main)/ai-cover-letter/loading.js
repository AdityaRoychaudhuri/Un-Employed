import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const loading = () => {
  return (
    <div className='space-y-6'>
        <div className='flex justify-between'>
            <Skeleton className='h-10 w-80'/>
            <Skeleton className='h-10 w-15'/>
        </div>
        
        <div>
            {[1,2,3,4,5].map((i) => (
                <Card key={i} className='mb-4'>
                    <CardHeader>
                        <CardTitle>
                            <Skeleton className='h-4 w-2/3'/>
                        </CardTitle>
                        <CardDescription>
                            <Skeleton className='h-2 w-1/3'/>
                        </CardDescription>
                        <CardAction className='flex gap-2'>
                            <Skeleton className='size-4'/>
                            <Skeleton className='size-4'/>
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Skeleton className='h-2 w-3/4'/>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  )
}

export default loading