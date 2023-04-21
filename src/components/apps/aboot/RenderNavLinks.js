import React from "react";

export default function RenderNavLinks({ changeScreen }) {
    return (
        <>
            <div id="about" tabIndex="0" onFocus={changeScreen} className="w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5">
                <img className="w-3 md:w-4" alt="about" src={process.env.PUBLIC_URL + "/assets/icons/SVG/about.svg"}/>
                <span className="ml-1 md:ml-2 text-gray-50">Aboot Me</span>
            </div>
            <div id="education" tabIndex="0" onFocus={changeScreen} className="w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5">
                <img className="w-3 md:w-4" alt="education" src={process.env.PUBLIC_URL + "/assets/icons/SVG/education.svg"} />
                <span className="ml-1 md:ml-2 text-gray-50">Education</span>
            </div>
            <div id="skills" tabIndex="0" onFocus={changeScreen} className="w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5">
                <img className="w-3 md:w-4" alt="skills" src={process.env.PUBLIC_URL + "/assets/icons/SVG/skills.svg"} />
                <span className="ml-1 md:ml-2 text-gray-50">Skills</span>
            </div>
            <div id="projects" tabIndex="0" onFocus={changeScreen} className="w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5">
                <img className="w-3 md:w-4" alt="projects" src={process.env.PUBLIC_URL + "/assets/icons/SVG/projects.svg"} />
                <span className="ml-1 md:ml-2 text-gray-50">Projects</span>
            </div>
            <div id="resume" tabIndex="0" onFocus={changeScreen} className="w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5">
                <img className="w-3 md:w-4" alt="resume" src={process.env.PUBLIC_URL + "/assets/icons/SVG/download.svg"} />
                <span className="ml-1 md:ml-2 text-gray-50">Resume</span>
            </div>
        </>
    )
}