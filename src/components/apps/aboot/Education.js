import React from 'react';

export default function Education() {
    return (
        <>
        <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
            Education
            <div className="absolute pt-px bg-white mt-px top-full w-full">
             
            </div>
        </div>
        <ul className=" w-10/12  mt-4 ml-4 px-0 md:px-1">
            <li className="list-disc">
                <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                    University of North Texas - Studied Marketing & Communcations
                </div>
                <div className=" text-sm text-gray-400 mt-0.5">Spring 2015</div>
            </li>
            <li className="list-disc mt-5">
                <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                    Harvard CS50 - Introduction to Computer Science
                </div>
                <div className=" text-sm text-gray-400 mt-0.5">Fall 2022</div>
            </li>
            <li className="list-disc mt-5">
                <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                    Zero To Mastery - Complete Python Developer in 2023
                </div>
                <div className=" text-sm text-gray-400 mt-0.5">Fall 2022</div>
            </li>
            <li className="list-disc mt-5">
                <div className=" text-lg md:text-xl text-left font-bold leading-tight">
                    Zero To Mastery - Complete Web Developer in 2023
                </div>
                <div className=" text-sm text-gray-400 mt-0.5">Spring 2023</div>
            </li>
        </ul>
    </>
    )
}