import { useState, useEffect } from 'react';
import { assetPath } from '../../utils/assetPath';

export default function DisWebBrowser() {
  const homeUrl = 'https://www.google.com/webhp?igu=1';
  const [url, setUrl] = useState(homeUrl);
  const [displayUrl, setDisplayUrl] = useState('https://www.google.com');

  useEffect(() => {
    const lastVisitedUrl = localStorage.getItem('WebBrowser-url');
    const lastDisplayedUrl = localStorage.getItem('WebBrowser-display-url');
    if (lastVisitedUrl) {
      setUrl(lastVisitedUrl);
      setDisplayUrl(lastDisplayedUrl || '');
      refreshBrowser();
    }
  }, []);

  const storeVisitedUrl = (url: string, displayUrl: string) => {
    localStorage.setItem('WebBrowser-url', url);
    localStorage.setItem('WebBrowser-display-url', displayUrl);
  };

  const refreshBrowser = () => {
    const el = document.getElementById('webBrowserScreen') as HTMLIFrameElement | null;
    if (el) el.src += '';
  };

  const goToHome = () => {
    setUrl(homeUrl);
    setDisplayUrl('https://www.google.com');
    refreshBrowser();
  };

  const checkKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let inputUrl = (e.target as HTMLInputElement).value.trim();
      if (!inputUrl) return;

      if (!inputUrl.startsWith('http://') && !inputUrl.startsWith('https://')) {
        inputUrl = 'https://' + inputUrl;
      }

      const encodedUrl = encodeURI(inputUrl);
      let newDisplayUrl = encodedUrl;

      if (inputUrl.includes('google.com')) {
        newDisplayUrl = 'https://www.google.com';
      }

      setUrl(encodedUrl);
      setDisplayUrl(newDisplayUrl);
      storeVisitedUrl(encodedUrl, newDisplayUrl);
      document.getElementById('chromeUrlBar')?.blur();
    }
  };

  const handleDisplayUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayUrl(e.target.value);
  };

  const renderUrlBar = () => (
    <div className="w-full pt-0.5 pb-1 flex justify-start items-center text-white text-sm border-b border-gray-900">
      <div onClick={refreshBrowser} className="ml-2 mr-1 flex justify-center items-center rounded-full bg-gray-50 bg-opacity-0 hover:bg-opacity-10">
        <img className="w-5" src={assetPath("/assets/status/chrome_refresh.svg")} alt="Chrome Refresh" />
      </div>
      <div onClick={goToHome} className="mr-2 ml-1 flex justify-center items-center rounded-full bg-gray-50 bg-opacity-0 hover:bg-opacity-10">
        <img className="w-5" src={assetPath("/assets/status/chrome_home.svg")} alt="Chrome Home" />
      </div>
      <input
        onKeyDown={checkKey}
        onChange={handleDisplayUrl}
        value={displayUrl}
        id="chromeUrlBar"
        className="outline-none bg-ub-grey rounded-full pl-3 py-0.5 mr-3 w-5/6 text-gray-300 focus:text-white"
        type="url"
        spellCheck={false}
        autoComplete="off"
      />
    </div>
  );

  return (
    <div className="h-full w-full flex flex-col bg-ub-cool-grey">
      {renderUrlBar()}
      <iframe src={url} className="flex-grow" id="webBrowserScreen" frameBorder="0" title="Chrome Url"></iframe>
    </div>
  );
}
