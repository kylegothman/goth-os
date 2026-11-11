import { assetPath } from '../../../utils/assetPath';

export type AbootScreen = 'about' | 'education' | 'skills' | 'projects' | 'resume';

const links: { id: AbootScreen; label: string; icon: string }[] = [
  { id: 'about', label: 'Aboot Me', icon: 'about.svg' },
  { id: 'education', label: 'Education', icon: 'education.svg' },
  { id: 'skills', label: 'Skills', icon: 'skills.svg' },
  { id: 'projects', label: 'Projects', icon: 'projects.svg' },
  { id: 'resume', label: 'Resume', icon: 'download.svg' },
];

interface RenderNavLinksProps {
  activeScreen: AbootScreen;
  changeScreen: (screen: AbootScreen) => void;
}

export default function RenderNavLinks({ activeScreen, changeScreen }: RenderNavLinksProps) {
  return (
    <>
      {links.map(({ id, label, icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => changeScreen(id)}
          className={
            (id === activeScreen ? 'bg-white bg-opacity-10 ' : '') +
            'w-28 md:w-full md:rounded-none rounded-sm cursor-default outline-none py-1.5 focus:outline-none duration-100 my-0.5 flex justify-start items-center pl-2 md:pl-2.5'
          }
        >
          <img className="w-3 md:w-4" alt="" src={assetPath(`/assets/icons/SVG/${icon}`)} />
          <span className="ml-1 md:ml-2 text-gray-50">{label}</span>
        </button>
      ))}
    </>
  );
}
