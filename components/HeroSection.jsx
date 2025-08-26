"use client"

import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

const HeroSection = () => {
  const imageRef = useRef(null)

  // useeEffect  hook to take the current scroll position and also the scroll threshold
  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const windowScrollPos = window.scrollY;
      const windowScrollThresh = 100;
      
      if(windowScrollPos > windowScrollThresh){
        imageElement.classList.add("scrolled")
      }else {
        imageElement.classList.remove("scrolled");
      }
    }

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  },[])

  return (
    <section className='w-full pt-36 md:pt-48 pb-10'>
        <div className='space-y-6 text-center'>
            <div className='space-y-6 mx-auto'>
                <h1 className='gradient_title text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl'>
                    Your AI Career Coach for
                    <br />
                    Professional Success
                </h1>
                <p className='mx-auto max-w-[600px] text-muted-foreground md:text-xll'>
                  Advance your career with guidance, interview prep, AI-powered tools for job success.
                </p>
            </div>

            <div className='flex justify-center space-x-4'>
              <Link href="/dashboard">
                <Button size="lg" className="px-8">
                  Get started
                </Button>
              </Link>
              <Link href="/dashboard"> {/* Enter any link */}
                <Button size="lg" className="px-8" variant="outline">
                  Get started
                </Button>
              </Link>
            </div>

            <div className='hero-image-wrapper mt-5 md:mt-0'>
              <div ref={imageRef} className='hero-image'>
                <Image
                  src="/banner3.jpeg"
                  width={1240}
                  height={720}
                  alt='banner.jpeg'
                  className='rounded-lg shadow-2xl border mx-auto'
                  priority // priority tag to load first
                />
              </div>
            </div>


        </div>
    </section>
  )
}

export default HeroSection