import { useEffect } from 'react';

const NativeAdBanner = () => {
    useEffect(() => {
        const scriptId = 'adsterra-native-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.id = scriptId;
            script.async = true;
            script.setAttribute('data-cfasync', 'false');
            script.src = '//pl28164378.effectivegatecpm.com/693704e477068732b751368b9111f00e/invoke.js';
            document.body.appendChild(script);
        }
    }, []);

    return <div id="container-693704e477068732b751368b9111f00e"></div>;
};

export default NativeAdBanner;
