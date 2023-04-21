import React from 'react';

export default function About() {
    return (
        <>
            <div className="w-20 md:w-28 my-4 bg-white rounded-full">
                <img className="w-full" src={process.env.PUBLIC_URL + "/images/logos/bitmoji.png"} alt="Goth Logo" />
            </div>
            <div className=" mt-4 md:mt-8 text-lg md:text-2xl text-center px-1">
                <div>my name is <span className="font-bold">Kyle Gothman</span>,</div>
                <div className="font-normal ml-1">and I'm a <span className="text-pink-600 font-bold">Software Engineer!</span></div>
            </div>
            <div className=" mt-4 relative md:my-8 pt-px bg-white w-32 md:w-48">
            </div>
            <ul className=" mt-4 leading-tight tracking-tight text-sm md:text-base w-5/6 md:w-3/4 emoji-list">
                <li className=" list-pc">I'm a Full Stack Software Engineer who's been design & building industry utilized applications since my second year of college. Since then, I've worked in startups, taken on freelance projects and worked private consulting. ( Hit me up <a className='text-underline' href='kyle.gothman@gmail.com'><u>kyle.gothman@gmail.com</u></a> )</li>
                <li className=" mt-3 list-building"> I enjoy building awesome software that tackle real-world challenges while also captivating users.</li>
                <li className=" mt-3 list-time"> When I am not coding my next project, I like to spend my time making music, practicing yoga or listening <u className=' cursor-pointer '><a href="https://www.youtube.com/@lexfridman" target="_blank" rel="noreferrer">Lex Fridman</a></u> podcasts.</li>
                <li className=" mt-3 list-star"> And I also have interest in game design & projection mapping!</li>
            </ul>
        </>
    )
}