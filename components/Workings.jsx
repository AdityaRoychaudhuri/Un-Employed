import React from 'react'
import { howItWorks } from '@/data/howItWorks'

const Workings = () => {
  return (
    <section className='w-full py-12 md:py-24 lg:py-32 bg-background'>
        <div className='container mx-auto'>
            <div className='text-center max-w-3xl mx-auto mb-12'>
                <h2 className='text-3xl font-bold mb-4'>
                    How it Works
                </h2>
                <p className='text-muted-foreground'>
                    Four simple steps to accelerate your career growth
                </p>
            </div>
            <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto'>
                {howItWorks.map((work, index) => (
                    <div key={index}
                        className='bg-background/60 backdrop-blur-md flex flex-col text-center items-center space-y-2 border-2 hover:border-white/20 p-4 rounded-3xl hover:scale-110 duration-300'
                    >
                        <div className='w-16 h-16 rounded-full bg-primary/10 flex justify-center items-center'>
                            {work.icon}
                        </div>
                        <h3 className='text-xl font-bold mb-2'>{work.title}</h3>
                        <p className='text-muted-foreground'>{work.description}</p>
                    </div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default Workings