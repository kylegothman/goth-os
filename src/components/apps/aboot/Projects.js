import React from 'react';


export  default function Projects() {

    const project_list = [
        {
            name: "Goth-OS Portfolio",
            date: "Apr 2023",
            link: "https://github.com/kylegothman/kgoth-os",
            description: [
                "Personal portfolio website built using React & tailwind CSS",
            ],
            domains: ["javascript", "react", "tailwindcss"]
        },
        {
            name: "Groove Box",
            date: "Apr 2023",
            link: "https://github.com/kylegothman/groove-box",
            description: [
                "A 16 beat step sequencer built using the ToneJS library",
            ],
            domains: ["javascript", "sass"]
        },
        {
            name: "See-Food",
            date: "Feb 2023",
            link: "https://github.com/kylegothman/see-food",
            description: [
                "A food recognition app that rewards you when you upload a picture of a hotdog. Backend is built with nodeJS and the frontend is built with React and Chakra-UI",
            ],
            domains: ["javascript", "nodeJS", "postgreSQL", "ai", "chakra-ui"]
        },
        {
            name: "Background Generator",
            date: "Dec 2022",
            link: "https://github.com/kylegothman/background-generator",
            description: [
                "A visual tool for creating gradient backgrounds",
            ],
            domains: ["javascript", "HTML5", "CSS3"]
        },
        {
            name: "Robinhood Day Trading Bot",
            date: "Nov 2022",
            link: "https://github.com/kylegothman/robinhood-crypto-bot",
            description: [
                "A day trading crypto bot that uses Robinhood's API",
            ],
            domains: ["python"]
        },
    ];

    const tag_colors = {
        "javascript": "yellow-300",
        "PostGreSQL": "red-600",
        "AI": "red-500",
        "firebase auth": "red-400",
        "chakra-ui": "yellow-400",
        "flutter": "blue-400",
        "dart": "blue-500",
        "react-native": "purple-500",
        "html5": "pink-600",
        "sass": "pink-400",
        "tensorflow": "yellow-600",
        "django": "green-600",
        "python": "green-200",
        "codeforces-api": "gray-300",
        "tailwindcss": "blue-300",
        "React": "purple-600"
    }

    return (
        <>
            <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
                Projects
                <div className="absolute pt-px bg-white mt-px top-full w-full">
                </div>

            </div>
                <iframe src="https://github.com/sponsors/kylegothman/card" title="sponsor kylegothman" className='my-4 w-5/6 md:w-3/4'></iframe>

            {
                project_list.map((project, index) => {
                    const projectNameFromLink = project.link.split('/')
                    const projectName = projectNameFromLink[projectNameFromLink.length - 1]
                    return (
                        <a key={index} href={project.link} target="_blank" rel="noreferrer" className="flex w-full flex-col px-4">
                            <div className="w-full py-1 px-2 my-2 border border-gray-50 border-opacity-10 rounded hover:bg-gray-50 hover:bg-opacity-5 cursor-pointer">
                                <div className="flex flex-wrap justify-between items-center">
                                    <div className='flex justify-center items-center'>
                                        <div className=" text-base md:text-lg mr-2">{project.name.toLowerCase()}</div>
                                        <iframe src={`https://ghbtns.com/github-btn.html?user=vivek9patel&repo=${projectName}&type=star&count=true`} frameBorder="0" scrolling="0" width="150" height="20" title={project.name.toLowerCase()+"-star"}></iframe>
                                    </div>
                                    <div className="text-gray-300 font-light text-sm">{project.date}</div>
                                </div>
                                <ul className=" tracking-normal leading-tight text-sm font-light ml-4 mt-1">
                                    {
                                        project.description.map((desc, index) => {
                                            return <li key={index} className="list-disc mt-1 text-gray-100">{desc}</li>;
                                        })
                                    }
                                </ul>
                                <div className="flex flex-wrap items-start justify-start text-xs py-2">
                                    {
                                        (project.domains ?
                                            project.domains.map((domain, index) => {
                                                const borderColorClass = `border-${tag_colors[domain]}`
                                                const textColorClass = `text-${tag_colors[domain]}`

                                                return <span key={index} className={`px-1.5 py-0.5 w-max border ${borderColorClass} ${textColorClass} m-1 rounded-full`}>{domain}</span>
                                            })

                                            : null)
                                    }
                                </div>
                            </div>
                        </a>
                    )
                })
            }
        </>
    )
}