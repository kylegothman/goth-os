import { assetPath } from '../../../utils/assetPath';

export default function About() {
  return (
    <>
      <div className="w-20 md:w-28 my-4 bg-white rounded-full">
        <img className="w-full" src={assetPath("/images/logos/bitmoji.png")} alt="Goth Logo" />
      </div>
      <div className="mt-4 md:mt-8 text-lg md:text-2xl text-center px-1">
        <div>my name is <span className="font-bold">Kyle Gothman</span>,</div>
        <div className="font-normal ml-1">and I'm a <span className="text-pink-600 font-bold">Software Engineer!</span></div>
      </div>
      <div className="mt-4 relative md:my-8 pt-px bg-white w-32 md:w-48" />
      <ul className="mt-4 leading-tight tracking-tight text-sm md:text-base w-5/6 md:w-3/4 emoji-list">
        <li className="list-pc">
          I'm a Software Engineering student at the University of Texas at Dallas, graduating Dec 2026. I've spent three summers interning at H-E-B Digital Technology, building infrastructure automation, CI/CD security tooling, and cloud storage provisioning. ( Hit me up{' '}
          <a href="mailto:kyle.gothman@gmail.com"><u>kyle.gothman@gmail.com</u></a> )
        </li>
        <li className="mt-3 list-building">
          These days I build systems that run without me: an autonomous stock trading system that's been live since May 2026, and Hammerpick, an auction deal-finder that indexes ~115K listings a day. Both run on the Kubernetes homelab in my closet.
        </li>
        <li className="mt-3 list-time">
          When I'm not coding, I'm making music in Ableton, gaming, or training for my next HYROX race.
        </li>
        <li className="mt-3 list-star">
          Big fan of Python, Terraform, and automating anything that annoys me twice.
        </li>
      </ul>
    </>
  );
}
