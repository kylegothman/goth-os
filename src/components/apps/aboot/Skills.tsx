const badge = (label: string, color: string, logo: string, logoColor = 'ffffff') =>
  `https://img.shields.io/badge/-${encodeURIComponent(label)}-${color}?style=flat&logo=${logo}&logoColor=${logoColor}`;

const LANGUAGES: [string, string][] = [
  ['Python', badge('Python', '3776AB', 'python')],
  ['SQL', badge('SQL', '4479A1', 'postgresql')],
  ['JavaScript', 'https://img.shields.io/badge/-JavaScript-%23F7DF1C?style=flat&logo=javascript&logoColor=000000&color=%23FFCE5A'],
  ['Java', badge('Java', 'ED8B00', 'openjdk')],
  ['TypeScript', badge('TypeScript', '3178C6', 'typescript')],
  ['C++', 'https://img.shields.io/badge/C%2B%2B-00599C?style=flat&logo=c%2B%2B&logoColor=white'],
];

const TOOLS: [string, string][] = [
  ['Terraform', badge('Terraform', '7B42BC', 'terraform')],
  ['Kubernetes', badge('Kubernetes', '326CE5', 'kubernetes')],
  ['Docker', badge('Docker', '2496ED', 'docker')],
  ['GitLab', badge('GitLab', 'FC6D26', 'gitlab')],
  ['Ansible', badge('Ansible', 'EE0000', 'ansible')],
  ['React', badge('React', '61DAFB', 'react')],
  ['Node.js', badge('Node.js', '339933', 'Node.js')],
  ['FastAPI', badge('FastAPI', '009688', 'fastapi')],
  ['PostgreSQL', badge('PostgreSQL', '4169E1', 'postgresql')],
  ['PyTorch', badge('PyTorch', 'EE4C2C', 'pytorch')],
  ['GCP', badge('GCP', '4285F4', 'googlecloud')],
  ['AWS', badge('AWS', '232F3E', 'amazonwebservices')],
];

const BadgeList = ({ items }: { items: [string, string][] }) => (
  <div className="flex flex-wrap justify-center items-start w-full mt-2">
    {items.map(([name, src]) => (
      <img key={name} className="m-1" src={src} alt={name.toLowerCase()} />
    ))}
  </div>
);

export default function Skills() {
  return (
    <>
      <div className="font-medium relative text-2xl mt-2 md:mt-4 mb-4">
        Technical Skills
        <div className="absolute pt-px bg-white mt-px top-full w-full" />
      </div>
      <ul className="tracking-tight text-sm md:text-base w-10/12 emoji-list">
        <li className="list-arrow text-sm md:text-base mt-4 leading-tight tracking-tight">
          I've worked with a wide variety of programming languages & frameworks.
        </li>
        <li className="list-arrow text-sm md:text-base mt-4 leading-tight tracking-tight">
          <div>My sweet spots are <strong className="text-ubt-gedit-orange">Python, platform engineering & cloud infrastructure!</strong></div>
        </li>
        <li className="list-arrow text-sm md:text-base mt-4 leading-tight tracking-tight">
          <div>Here are the tools I reach for most:</div>
        </li>
      </ul>
      <div className="w-full md:w-10/12 flex mt-4">
        <div className="text-sm text-center md:text-base w-1/2 font-bold">Languages</div>
        <div className="text-sm text-center md:text-base w-1/2 font-bold">Tools & Frameworks</div>
      </div>
      <div className="w-full md:w-10/12 flex justify-center items-start font-bold text-center">
        <div className="px-2 w-1/2">
          <BadgeList items={LANGUAGES} />
        </div>
        <div className="px-2 w-1/2">
          <BadgeList items={TOOLS} />
        </div>
      </div>
    </>
  );
}
