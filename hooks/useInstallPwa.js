import { useEffect, useState } from "react";

function IsSafari() {
	let userAgentString = navigator.userAgent;

	// Detect Chrome
	let chromeAgent = userAgentString.indexOf("Chrome") > -1;

	// Detect Safari
	let safariAgent = userAgentString.indexOf("Safari") > -1;

	// Discard Safari since it also matches Chrome
	if (chromeAgent && safariAgent) safariAgent = false;

	return safariAgent;
}

const useInstallPwa = () => {
	const [ev, setEv] = useState();
	const [showPWAPrompt, setShowPWAPrompt] = useState(false);
	const [Prompt, setPrompt] = useState();

	useEffect(() => {
		window.addEventListener("beforeinstallprompt", (event) => {
			event.preventDefault();
			setEv(event);
		});
	}, []);

	function installPwa() {
		ev?.prompt();
		// const { IOSPwaPrompt } = await import(
		// 	"react-ios-pwa-prompt"
		// );
		// setPrompt(<IOSPwaPrompt />);
	}

    return {installPwa}
};

export default useInstallPwa;
