import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const loading = () => {
  return (
    <div className='space-y-6'>

        <Skeleton className="h-10 w-80 mb-4"/>

        <div className='grid grid-cols-3 gap-4'>
            {[1,2,3].map((i) => (
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <Skeleton className='h-4 w-2/3'/>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                            <Skeleton className='h-6 w-1/2'/>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className='rounded-lg border space-y-4 p-4'>
            <Skeleton className='h-6 w-40'/>
            <Skeleton className='h-64 w-full'/>
        </div>
        
        <div className='space-y-3'>
            {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
            </div>
            ))}
        </div>
    </div>
  )
}

export default loading