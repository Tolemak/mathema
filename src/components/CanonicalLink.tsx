import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { canonicalUrl } from '../utils/canonicalUrl';

const CanonicalLink: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const url = canonicalUrl(pathname);
    document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', url);
    document.head.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', url);
  }, [pathname]);
  return null;
};

export default CanonicalLink;
