import React from 'react'
import logo from '../assets/logo.png'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    
        <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-30 text-sm text-gray-500'>
            <div className='flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor border-b'>
                <div >
                    <img src={logo} alt="logo" className='h-8 md:h-9' />
                    <p className='max-w-80 mt-3'>
                        RentMent is a peer-to-peer renting platform designed to provide easy access to a wide selection of products. Whether for personal, travel, or professional needs - we make renting simple, affordable, and reliable.
                    </p>
                    <div className='flex items-center gap-3 mt-6'>
                        <a href='#'><img src={assets.facebook_logo} className='w-5 h-5' alt="" /></a>
                        <a href='#'><img src={assets.instagram_logo} className='w-5 h-5' alt="" /></a>
                        <a href='#'><img src={assets.twitter_logo} className='w-5 h-5' alt="" /></a>
                        <a href='#'><img src={assets.gmail_logo} className='w-5 h-5' alt="" /></a>
                    </div>
                </div>

                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Quick Links</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><a href="/">Home</a></li>
                        <li><a href="/products">Browse Products</a></li>
                        <li><a href="#">List Your Product</a></li>
                        <li><a href="#">About Us</a></li>
                    </ul>
                </div>

                <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Resources</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Terms of Service</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>

                 <div>
                    <h2 className='text-base font-medium text-gray-800 uppercase'>Contact</h2>
                    <ul className='mt-3 flex flex-col gap-1.5'>
                        <li><a href="#">45 Innovation Tower</a></li>
                        <li><a href="#">Indore, MP - 452001</a></li>
                        <li><a href="#">+91 1234567890</a></li>
                        <li><a href="#">support@rentment.com</a></li>
                    </ul>
                </div>

            </div>
            
            <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>© {new Date().getFullYear()} RentMent. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                    <li><a href="#">Privacy</a></li>
                    <li>|</li>
                    <li><a href="#">Terms</a></li>
                    <li>|</li>
                    <li><a href="#">Cookies</a></li>
                </ul>
            </div>
        </div>
    );
};

export default Footer
