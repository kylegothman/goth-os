// Full class strings (not `border-${color}`) so Tailwind's scanner keeps them in the build.
// Keys are lower-case; lookups are case-insensitive.
const tagClasses: Record<string, string> = {
    "javascript": "border-yellow-300 text-yellow-300",
    "typescript": "border-sky-400 text-sky-400",
    "postgresql": "border-red-600 text-red-600",
    "ai": "border-red-500 text-red-500",
    "firebase auth": "border-red-400 text-red-400",
    "chakra-ui": "border-yellow-400 text-yellow-400",
    "flutter": "border-blue-400 text-blue-400",
    "dart": "border-blue-500 text-blue-500",
    "react-native": "border-purple-500 text-purple-500",
    "html5": "border-pink-600 text-pink-600",
    "sass": "border-pink-400 text-pink-400",
    "tensorflow": "border-yellow-600 text-yellow-600",
    "django": "border-green-600 text-green-600",
    "python": "border-green-200 text-green-200",
    "codeforces-api": "border-gray-300 text-gray-300",
    "tailwindcss": "border-blue-300 text-blue-300",
    "react": "border-purple-600 text-purple-600",
};
const DEFAULT_TAG_CLASSES = "border-gray-400 text-gray-300";
const tagClassesFor = (domain: string) => tagClasses[domain.toLowerCase()] ?? DEFAULT_TAG_CLASSES;

interface Project {
    name: string;
    date: string;
    link: string;
    description: string[];
    domains: string[];
}

const project_list: Project[] = [
    {
        name: "Autonomous Trading System",
        date: "May 2026",
        link: "https://github.com/kylegothman/trading-system",
        description: [
            "An autonomous equities trading system trading real money through the Alpaca API since May 2026: a weekly momentum strategy screens ~3,700 US stocks down to a 15-position portfolio, with 19 consecutive weekly rebalances and counting",
            "Validated with a 255-week point-in-time backtest, random-portfolio nulls, and leakage-safe walk-forward testing; 316+ tests, all runnable offline. The repo covers the architecture and the full validation story",
        ],
        domains: ["python", "ai"],
    },
    {
        name: "Hammerpick",
        date: "Sep 2026",
        link: "https://github.com/kylegothman/hammerpick-showcase",
        description: [
            "An auction deal-finder in private beta: a rate-limited crawler records roughly 100K closed auctions a day into PostgreSQL with about 90% fewer requests than the obvious design, a nightly hunt prices live listings against real comparable sales, and a Chrome extension puts the picks on the auction pages",
            "An AI agent reviews the overnight shortlist through an MCP server and writes its recommendations back; about 830 server tests",
        ],
        domains: ["python", "postgresql", "javascript"],
    },
    {
        name: "QuantumCanvas",
        date: "Apr 2026",
        link: "https://github.com/kylegothman/Quantum-Canvas",
        description: [
            "A browser-based quantum circuit composer and simulator: drag gates onto qubit wires, watch the state evolve across Bloch spheres and amplitude views, then export to QASM 2.0 or Qiskit",
            "137 tests cover the gate math and QASM round-trips. Try it live at kylegothman.github.io/Quantum-Canvas",
        ],
        domains: ["typescript", "react", "tailwindcss"],
    },
    {
        name: "3D Space Invaders",
        date: "Jul 2026",
        link: "https://github.com/kylegothman/3D-Space-Invaders",
        description: [
            "A 3D remake of Space Invaders, playable right here on the Goth OS desktop",
        ],
        domains: ["javascript"],
    },
    {
        name: "Goth-OS Portfolio",
        date: "Apr 2023",
        link: "https://github.com/kylegothman/goth-os",
        description: [
            "Personal portfolio website built using React & tailwind CSS",
        ],
        domains: ["javascript", "react", "tailwindcss"],
    },
    {
        name: "Groove Box",
        date: "Apr 2023",
        link: "https://github.com/kylegothman/groove-box",
        description: [
            "A 16 beat step sequencer built using the ToneJS library",
        ],
        domains: ["javascript", "sass"],
    },
    {
        name: "See-Food",
        date: "Feb 2023",
        link: "https://github.com/kylegothman/see-food",
        description: [
            "A food recognition app that rewards you when you upload a picture of a hotdog. Backend is built with nodeJS and the frontend is built with React and Chakra-UI",
        ],
        domains: ["javascript", "nodeJS", "postgreSQL", "ai", "chakra-ui"],
    },
];

export default function Projects() {
    return (
        <>
            <div className=" font-medium relative text-2xl mt-2 md:mt-4 mb-4">
                Projects
                <div className="absolute pt-px bg-white mt-px top-full w-full">
                </div>

            </div>
                <iframe src="https://github.com/sponsors/kylegothman/card" title="sponsor kylegothman" className='my-4 w-5/6 md:w-3/4'></iframe>

            {
                project_list.map((project) => {
                    const projectNameFromLink = project.link.split('/')
                    const projectName = projectNameFromLink[projectNameFromLink.length - 1]
                    return (
                        <a key={project.link} href={project.link} target="_blank" rel="noreferrer" className="flex w-full flex-col px-4">
                            <div className="w-full py-1 px-2 my-2 border border-gray-50 border-opacity-10 rounded hover:bg-gray-50 hover:bg-opacity-5 cursor-pointer">
                                <div className="flex flex-wrap justify-between items-center">
                                    <div className='flex justify-center items-center'>
                                        <div className=" text-base md:text-lg mr-2">{project.name.toLowerCase()}</div>
                                        <iframe src={`https://ghbtns.com/github-btn.html?user=kylegothman&repo=${projectName}&type=star&count=true`} frameBorder="0" scrolling="0" width="150" height="20" title={project.name.toLowerCase()+"-star"}></iframe>
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
                                        project.domains.map((domain) => (
                                            <span key={domain} className={`px-1.5 py-0.5 w-max border ${tagClassesFor(domain)} m-1 rounded-full`}>{domain}</span>
                                        ))
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
