export default function Education() {
  const courses = [
    "Data Structures & Algorithms",
    "Operating Systems",
    "Distributed Systems",
    "Databases",
    "Machine Learning",
    "Artificial Intelligence",
    "Software Architecture",
    "Requirements Engineering",
    "Quantum Computing",
  ];

  return (
    <>
      <div className="font-medium relative text-2xl mt-2 md:mt-4 mb-4">
        Education
        <div className="absolute pt-px bg-white mt-px top-full w-full" />
      </div>
      <ul className="w-10/12 mt-4 ml-4 px-0 md:px-1">
        <li className="list-disc">
          <div className="text-lg md:text-xl text-left font-bold leading-tight">
            University of Texas at Dallas
          </div>
          <div className="text-sm text-gray-300 mt-0.5">Richardson, TX</div>
          <div className="text-sm text-gray-400 mt-0.5 italic">
            B.S. in Software Engineering
          </div>
          <div className="text-sm text-gray-400 mt-0.5">Expected Dec 2026</div>
          <div className="mt-3">
            <div className="text-sm font-semibold text-gray-300 mb-1">Coursework:</div>
            <div className="flex flex-wrap gap-1.5">
              {courses.map((course) => (
                <span
                  key={course}
                  className="text-xs px-2 py-0.5 border border-gray-500 text-gray-300 rounded-full"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>
        </li>
      </ul>
    </>
  );
}
