import React from 'react'

export default function Navbar() {
  return (
   
      <div className="flex justify-between items-center w-full my-4 px-3 md:px-4">
        <img src="/images-removebg-preview.png" className="w-20 md:w-40 object-contain object-center" />
        {/* <Image src="/images-removebg-preview.png" width={4700} height={4070} alt="logo" className="object-center"></Image> */}
        <p className="text-sm md:text-lg lg:text-xl tracking-widest text-black">Easter Luck Is Here</p>
      </div>
  )
}
