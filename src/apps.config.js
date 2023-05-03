import DisMusicPlayer from './components/apps/MusicPlayer';
import DisWebBrowser from './components/apps/WebBrowser';
import WebBrowser from './components/icons/WebBrowser';
import MusicPlayer from './components/icons/MusicPlayer';
import GrooveBox from './components/icons/GrooveBox';
import Calculator from './components/icons/Calculator';
import Aboot from './components/icons/Aboot';
import Pong from './components/icons/Pong';
import DisPong from './components/apps/pong/Pong';
import DisCalculator from './components/apps/Calculator';
import DisGrooveBox from './components/apps/GrooveBox';
import DisAboot from './components/apps/aboot/Aboot';

const apps = [
    {
        id: "Aboot",
        title: "Aboot",
        icon: <Aboot/>,
        disabled: false,
        desktop_shortcut: false,
        screen: <DisAboot/>,
    },
    {
        id: "web-browser",
        title: "Web Browser",
        icon: <WebBrowser/>,
        disabled: false,
        desktop_shortcut: false,
        screen: <DisWebBrowser/>,
    },
    {
        id: "music-player",
        title: "Music Player",
        icon: <MusicPlayer/>,
        disabled: false,
        desktop_shortcut: false,
        screen: <DisMusicPlayer/>,
    },
    {
        id: "Pong",
        title: "Pong",
        icon: <Pong/>,
        disabled: false,
        desktop_shortcut: false,
        screen: <DisPong/>,
    },
    {
        id: "Calculator",
        title: "Calculator",
        icon: <Calculator/>,
        disabled: false,
        desktop_shortcut: false,
        screen: <DisCalculator/>,
    },
    {
        id: "GrooveBox",
        title: "GrooveBox",
        icon: <GrooveBox/>,
        disabled: false,
        desktop_shortcut: false,
        screen: <DisGrooveBox/>,
    },

]
export default apps;