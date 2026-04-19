import React from 'react'

const AuthLayout = ({ children }) => {
  return (
    <div className='flex justify-center pt-50 no-scrollbar'>
        {children}
    </div>
  )
}

export default AuthLayout