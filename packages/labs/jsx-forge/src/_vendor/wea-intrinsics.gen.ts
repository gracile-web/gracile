/* eslint-disable */ /* prettier-ignore */
// @ts-nocheck

interface BaseHTMLElements {
	"a": {
		attributes: {
			"attributionsrc": string;
			/** @deprecated */ "charset": string;
			/** @deprecated */ "coords": string;
			"download": string;
			"href": string;
			"hreflang": string;
			/** @deprecated */ "name": string;
			"ping": string;
			"referrerpolicy": 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
			"rel": string;
			/** @deprecated */ "rev": string;
			/** @deprecated */ "shape": 'rect' | 'circle' | 'poly' | 'default';
			"target": '_self' | '_blank' | '_parent' | '_top' | (string & {});
			"type": string;
		};
		properties: {
			"attributionSrc": string;
			/** @deprecated */ "charset": string;
			/** @deprecated */ "coords": string;
			"download": string;
			"hash": string;
			"host": string;
			"hostname": string;
			"href": string;
			"hreflang": string;
			/** @deprecated */ "name": string;
			"password": string;
			"pathname": string;
			"ping": string;
			"port": string;
			"protocol": string;
			"referrerPolicy": 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
			"relList": string;
			/** @deprecated */ "rev": string;
			"search": string;
			/** @deprecated */ "shape": 'rect' | 'circle' | 'poly' | 'default';
			"target": '_self' | '_blank' | '_parent' | '_top' | (string & {});
			"text": string;
			"type": string;
			"username": string;
		};
		events: {};
	};
	"abbr": {
		attributes: {};
		properties: {};
		events: {};
	};
	/** @deprecated */ "acronym": {
		attributes: {};
		properties: {};
		events: {};
	};
	"address": {
		attributes: {};
		properties: {};
		events: {};
	};
	/** @deprecated */ "applet": {
		attributes: {};
		properties: {};
		events: {};
	};
	"area": {
		attributes: {
			"alt": string;
			"attributionsrc": string;
			"coords": string;
			"download": string;
			"href": string;
			/** @deprecated */ "nohref": boolean;
			"ping": string;
			"referrerpolicy": 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
			"rel": string;
			"shape": 'rect' | 'circle' | 'poly' | 'default';
			"target": '_self' | '_blank' | '_parent' | '_top' | (string & {});
		};
		properties: {
			"alt": string;
			"attributionSrc": string;
			"coords": string;
			"download": string;
			"hash": string;
			"host": string;
			"hostname": string;
			"href": string;
			/** @deprecated */ "noHref": boolean;
			"password": string;
			"pathname": string;
			"ping": string;
			"port": string;
			"protocol": string;
			"referrerPolicy": 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
			"relList": string;
			"search": string;
			"shape": 'rect' | 'circle' | 'poly' | 'default';
			"target": '_self' | '_blank' | '_parent' | '_top' | (string & {});
			"username": string;
		};
		events: {};
	};
	"article": {
		attributes: {};
		properties: {};
		events: {};
	};
	"aside": {
		attributes: {};
		properties: {};
		events: {};
	};
	"audio": {
		attributes: {
			"autoplay": boolean;
			"controls": boolean;
			"controlslist": 'nodownload' | 'nofullscreen' | 'noplaybackrate' | 'noremoteplayback' | (string & {});
			"crossorigin": 'anonymous' | 'use-credentials' | '';
			"disableremoteplayback": boolean;
			"loop": boolean;
			"muted": boolean;
			"preload": 'none' | 'metadata' | 'auto' | '';
			"src": string;
		};
		properties: {
			"autoplay": boolean;
			"controls": boolean;
			"controlsList": string;
			"crossOrigin": 'anonymous' | 'use-credentials' | '';
			"currentTime": number;
			"defaultMuted": boolean;
			"defaultPlaybackRate": number;
			"disableRemotePlayback": boolean;
			"loop": boolean;
			"playbackRate": number;
			"preload": 'none' | 'metadata' | 'auto' | '';
			"preservesPitch": boolean;
			"src": string;
			"srcObject": MediaStream | MediaSource | Blob | File;
			"volume": number;
		};
		events: {
			"encrypted": MediaEncryptedEvent;
			"waitingforkey": Event;
		};
	};
	"b": {
		attributes: {};
		properties: {};
		events: {};
	};
	"base": {
		attributes: {
			"href": string;
			"target": '_self' | '_blank' | '_parent' | '_top' | (string & {});
		};
		properties: {
			"href": string;
			"target": '_self' | '_blank' | '_parent' | '_top' | (string & {});
		};
		events: {};
	};
	/** @deprecated */ "basefont": {
		attributes: {};
		properties: {};
		events: {};
	};
	"bdi": {
		attributes: {};
		properties: {};
		events: {};
	};
	"bdo": {
		attributes: {
			"dir": 'ltr' | 'rtl';
		};
		properties: {};
		events: {};
	};
	/** @deprecated */ "bgsound": {
		attributes: {};
		properties: {};
		events: {};
	};
	/** @deprecated */ "big": {
		attributes: {};
		properties: {};
		events: {};
	};
	/** @deprecated */ "blink": {
		attributes: {};
		properties: {};
		events: {};
	};
	"blockquote": {
		attributes: {
			"cite": string;
		};
		properties: {
			"cite": string;
		};
		events: {};
	};
	"body": {
		attributes: {
			/** @deprecated */ "alink": string;
			/** @deprecated */ "background": string;
			/** @deprecated */ "bgcolor": string;
			/** @deprecated */ "link": string;
			/** @deprecated */ "text": string;
			/** @deprecated */ "vlink": string;
		};
		properties: {
			/** @deprecated */ "aLink": string;
			/** @deprecated */ "background": string;
			/** @deprecated */ "bgColor": string;
			/** @deprecated */ "link": string;
			/** @deprecated */ "text": string;
			/** @deprecated */ "vLink": string;
		};
		events: {
			"afterprint": Event;
			"beforeprint": Event;
			"beforeunload": BeforeUnloadEvent;
			"blur": FocusEvent;
			"error": ErrorEvent;
			"focus": FocusEvent;
			"gamepadconnected": GamepadEvent;
			"gamepaddisconnected": GamepadEvent;
			"hashchange": HashChangeEvent;
			"languagechange": Event;
			"load": Event;
			"message": MessageEvent;
			"messageerror": MessageEvent;
			"offline": Event;
			"online": Event;
			"pagehide": PageTransitionEvent;
			"pagereveal": PageRevealEvent;
			"pageshow": PageTransitionEvent;
			"pageswap": PageSwapEvent;
			"popstate": PopStateEvent;
			"rejectionhandled": PromiseRejectionEvent;
			"resize": UIEvent;
			"scroll": Event;
			"storage": StorageEvent;
			"unhandledrejection": PromiseRejectionEvent;
			"unload": Event;
		};
	};
	"br": {
		attributes: {
			/** @deprecated */ "clear": string;
		};
		properties: {
			/** @deprecated */ "clear": string;
		};
		events: {};
	};
	"button": {
		attributes: {
			"command": 'show-modal' | 'close' | 'show-popover' | 'hide-popover' | 'toggle-popover' | (string & {});
			"commandfor": string;
			"disabled": boolean;
			"form": string;
			"formaction": string;
			"formenctype": 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
			"formmethod": 'post' | 'get' | 'dialog';
			"formnovalidate": boolean;
			"formtarget": '_self' | '_blank' | '_parent' | '_top' | (string & {});
			"name": string;
			"popovertarget": string;
			"popovertargetaction": 'hide' | 'show' | 'toggle';
			"type": 'submit' | 'reset' | 'button' | 'menu';
			"value": string;
		};
		properties: {
			"command": 'show-modal' | 'close' | 'show-popover' | 'hide-popover' | 'toggle-popover' | (string & {});
			"commandForElement": Element;
			"disabled": boolean;
			"formAction": string;
			"formEnctype": 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
			"formMethod": 'post' | 'get' | 'dialog';
			"formNoValidate": boolean;
			"formTarget": string;
			"name": string;
			"popoverTargetAction": 'hide' | 'show' | 'toggle';
			"popoverTargetElement": Element;
			"type": 'submit' | 'reset' | 'button' | 'menu';
			"value": string;
		};
		events: {};
	};
	"canvas": {
		attributes: {
			"height": number | string;
			/** @deprecated */ "moz-opaque": boolean;
			"width": number | string;
		};
		properties: {
			"height": number | string;
			/** @deprecated */ "mozOpaque": boolean;
			"mozPrintCallback": event;
			"width": number | string;
		};
		events: {};
	};
	"caption": {
		attributes: {
			/** @deprecated */ "align": 'left' | 'center' | 'right';
		};
		properties: {
			/** @deprecated */ "align": 'left' | 'center' | 'right';
		};
		events: {};
	};
	/** @deprecated */ "center": {
		attributes: {};
		properties: {};
		events: {};
	};
	"cite": {
		attributes: {};
		properties: {};
		events: {};
	};
	"code": {
		attributes: {};
		properties: {};
		events: {};
	};
	"col": {
		attributes: {
			/** @deprecated */ "align": 'left' | 'center' | 'right' | 'justify' | 'char';
			/** @deprecated */ "char": string;
			/** @deprecated */ "charoff": string;
			"span": number | string;
			/** @deprecated */ "valign": 'baseline' | 'bottom' | 'middle' | 'top';
			/** @deprecated */ "width": number | string;
		};
		properties: {
			/** @deprecated */ "align": 'left' | 'center' | 'right' | 'justify' | 'char';
			/** @deprecated */ "ch": string;
			/** @deprecated */ "chOff": string;
			"span": number | string;
			/** @deprecated */ "vAlign": string;
			/** @deprecated */ "width": number | string;
		};
		events: {};
	};
	"colgroup": {
		attributes: {
			/** @deprecated */ "align": 'left' | 'center' | 'right' | 'justify' | 'char';
			/** @deprecated */ "char": string;
			/** @deprecated */ "charoff": string;
			"span": number | string;
			/** @deprecated */ "valign": 'baseline' | 'bottom' | 'middle' | 'top';
			/** @deprecated */ "width": number | string;
		};
		properties: {
			/** @deprecated */ "align": 'left' | 'center' | 'right' | 'justify' | 'char';
			/** @deprecated */ "ch": string;
			/** @deprecated */ "chOff": string;
			"span": number | string;
			/** @deprecated */ "vAlign": string;
			/** @deprecated */ "width": number | string;
		};
		events: {};
	};
	/** @deprecated */ "content": {
		attributes: {};
		properties: {};
		events: {};
	};
	"data": {
		attributes: {
			"value": string | string[] | number;
		};
		properties: {
			"value": string | string[] | number;
		};
		events: {};
	};
	"datalist": {
		attributes: {};
		properties: {};
		events: {};
	};
	"dd": {
		attributes: {};
		properties: {};
		events: {};
	};
	"del": {
		attributes: {
			"cite": string;
			"datetime": string;
		};
		properties: {
			"cite": string;
			"dateTime": string;
		};
		events: {};
	};
	"details": {
		attributes: {
			"name": string;
			"open": boolean;
		};
		properties: {
			"name": string;
			"open": boolean;
		};
		events: {
			"toggle": ToggleEvent;
		};
	};
	"dfn": {
		attributes: {};
		properties: {};
		events: {};
	};
	"dialog": {
		attributes: {
			"closedby": 'any' | 'closerequest' | 'none';
			"open": boolean;
		};
		properties: {
			"closedBy": string;
			"open": boolean;
			"returnValue": string;
		};
		events: {
			"cancel": Event;
			"close": Event;
		};
	};
	/** @deprecated */ "dir": {
		attributes: {
			/** @deprecated */ "compact": boolean;
		};
		properties: {
			/** @deprecated */ "compact": boolean;
		};
		events: {};
	};
	"div": {
		attributes: {
			/** @deprecated */ "align": string;
		};
		properties: {
			/** @deprecated */ "align": string;
		};
		events: {};
	};
	"dl": {
		attributes: {
			/** @deprecated */ "compact": boolean;
		};
		properties: {
			/** @deprecated */ "compact": boolean;
		};
		events: {};
	};
	"dt": {
		attributes: {};
		properties: {};
		events: {};
	};
	"em": {
		attributes: {};
		properties: {};
		events: {};
	};
	"embed": {
		attributes: {
			/** @deprecated */ "align": 'left' | 'right' | 'justify' | 'center';
			"height": number | string;
			/** @deprecated */ "name": string;
			"src": string;
			"type": string;
			"width": number | string;
		};
		properties: {
			/** @deprecated */ "align": 'left' | 'right' | 'justify' | 'center';
			"height": number | string;
			/** @deprecated */ "name": string;
			"src": string;
			"type": string;
			"width": number | string;
		};
		events: {};
	};
	"fencedframe": {
		attributes: {
			"allow": string;
			"height": string;
			"sandbox": string;
			"width": string;
		};
		properties: {
			"allow": string;
			"config": unknown;
			"height": string;
			"sandbox": string;
			"width": string;
		};
		events: {};
	};
	"fieldset": {
		attributes: {
			"disabled": boolean;
			"form": string;
			"name": string;
		};
		properties: {
			"disabled": boolean;
			"name": string;
		};
		events: {};
	};
	"figcaption": {
		attributes: {};
		properties: {};
		events: {};
	};
	"figure": {
		attributes: {};
		properties: {};
		events: {};
	};
	/** @deprecated */ "font": {
		attributes: {
			/** @deprecated */ "color": string;
			/** @deprecated */ "face": string;
			/** @deprecated */ "size": string;
		};
		properties: {
			/** @deprecated */ "color": string;
			/** @deprecated */ "face": string;
			/** @deprecated */ "size": string;
		};
		events: {};
	};
	"footer": {
		attributes: {};
		properties: {};
		events: {};
	};
	"form": {
		attributes: {
			"accept-charset": string;
			"action": string;
			"autocomplete": 'on' | 'off';
			"enctype": 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
			"method": 'post' | 'get' | 'dialog';
			"name": string;
			"novalidate": boolean;
			"rel": string;
			"target": '_self' | '_blank' | '_parent' | '_top' | (string & {});
		};
		properties: {
			"acceptCharset": string;
			"action": string;
			"autocomplete": 'on' | 'off';
			"encoding": 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
			"method": 'post' | 'get' | 'dialog';
			"name": string;
			"noValidate": boolean;
			"relList": string;
			"target": '_self' | '_blank' | '_parent' | '_top' | (string & {});
		};
		events: {};
	};
	/** @deprecated */ "frame": {
		attributes: {
			/** @deprecated */ "frameborder": string;
			/** @deprecated */ "longdesc": string;
			/** @deprecated */ "marginheight": string;
			/** @deprecated */ "marginwidth": string;
			/** @deprecated */ "name": string;
			/** @deprecated */ "noresize": boolean;
			/** @deprecated */ "scrolling": string;
			/** @deprecated */ "src": string;
		};
		properties: {
			/** @deprecated */ "frameBorder": string;
			/** @deprecated */ "longDesc": string;
			/** @deprecated */ "marginHeight": string;
			/** @deprecated */ "marginWidth": string;
			/** @deprecated */ "name": string;
			/** @deprecated */ "noResize": boolean;
			/** @deprecated */ "scrolling": string;
			/** @deprecated */ "src": string;
		};
		events: {};
	};
	/** @deprecated */ "frameset": {
		attributes: {
			/** @deprecated */ "cols": string;
			/** @deprecated */ "rows": string;
		};
		properties: {
			/** @deprecated */ "cols": string;
			/** @deprecated */ "rows": string;
		};
		events: {
			"afterprint": Event;
			"beforeprint": Event;
			"beforeunload": BeforeUnloadEvent;
			"blur": FocusEvent;
			"error": ErrorEvent;
			"focus": FocusEvent;
			"gamepadconnected": GamepadEvent;
			"gamepaddisconnected": GamepadEvent;
			"hashchange": HashChangeEvent;
			"languagechange": Event;
			"load": Event;
			"message": MessageEvent;
			"messageerror": MessageEvent;
			"offline": Event;
			"online": Event;
			"pagehide": PageTransitionEvent;
			"pagereveal": PageRevealEvent;
			"pageshow": PageTransitionEvent;
			"pageswap": PageSwapEvent;
			"popstate": PopStateEvent;
			"rejectionhandled": PromiseRejectionEvent;
			"resize": UIEvent;
			"scroll": Event;
			"storage": StorageEvent;
			"unhandledrejection": PromiseRejectionEvent;
			"unload": Event;
		};
	};
	"h1": {
		attributes: {
			/** @deprecated */ "align": string;
		};
		properties: {
			/** @deprecated */ "align": string;
		};
		events: {};
	};
	"h2": {
		attributes: {
			/** @deprecated */ "align": string;
		};
		properties: {
			/** @deprecated */ "align": string;
		};
		events: {};
	};
	"h3": {
		attributes: {
			/** @deprecated */ "align": string;
		};
		properties: {
			/** @deprecated */ "align": string;
		};
		events: {};
	};
	"h4": {
		attributes: {
			/** @deprecated */ "align": string;
		};
		properties: {
			/** @deprecated */ "align": string;
		};
		events: {};
	};
	"h5": {
		attributes: {
			/** @deprecated */ "align": string;
		};
		properties: {
			/** @deprecated */ "align": string;
		};
		events: {};
	};
	"h6": {
		attributes: {
			/** @deprecated */ "align": string;
		};
		properties: {
			/** @deprecated */ "align": string;
		};
		events: {};
	};
	"head": {
		attributes: {};
		properties: {};
		events: {};
	};
	"header": {
		attributes: {};
		properties: {};
		events: {};
	};
	"hgroup": {
		attributes: {};
		properties: {};
		events: {};
	};
	"hr": {
		attributes: {
			/** @deprecated */ "align": string;
			/** @deprecated */ "color": string;
			/** @deprecated */ "noshade": boolean;
			/** @deprecated */ "size": string;
			/** @deprecated */ "width": string;
		};
		properties: {
			/** @deprecated */ "align": string;
			/** @deprecated */ "color": string;
			/** @deprecated */ "noShade": boolean;
			/** @deprecated */ "size": string;
			/** @deprecated */ "width": string;
		};
		events: {};
	};
	"html": {
		attributes: {
			/** @deprecated */ "version": string;
		};
		properties: {
			/** @deprecated */ "version": string;
		};
		events: {};
	};
	"i": {
		attributes: {};
		properties: {};
		events: {};
	};
	"iframe": {
		attributes: {
			"adauctionheaders": boolean;
			/** @deprecated */ "align": string;
			"allow": string;
			"allowfullscreen": boolean;
			/** @deprecated */ "allowpaymentrequest": boolean;
			"browsingtopics": boolean;
			"credentialless": boolean;
			"csp": string;
			/** @deprecated */ "frameborder": number | string;
			"height": number | string;
			"loading": 'eager' | 'lazy';
			/** @deprecated */ "longdesc": string;
			/** @deprecated */ "marginheight": number | string;
			/** @deprecated */ "marginwidth": number | string;
			"name": string;
			"privatetoken": string;
			"referrerpolicy": 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
			"sandbox": 'allow-downloads-without-user-activation' | 'allow-downloads' | 'allow-forms' | 'allow-modals' | 'allow-orientation-lock' | 'allow-pointer-lock' | 'allow-popups' | 'allow-popups-to-escape-sandbox' | 'allow-presentation' | 'allow-same-origin' | 'allow-scripts' | 'allow-storage-access-by-user-activation' | 'allow-top-navigation' | 'allow-top-navigation-by-user-activation' | 'allow-top-navigation-to-custom-protocols' | string;
			/** @deprecated */ "scrolling": 'yes' | 'no' | 'auto';
			"sharedstoragewritable": boolean;
			"src": string;
			"srcdoc": string;
			"width": number | string;
		};
		properties: {
			"adAuctionHeaders": boolean;
			/** @deprecated */ "align": string;
			"allow": string;
			"allowFullscreen": boolean;
			/** @deprecated */ "allowPaymentRequest": boolean;
			"browsingTopics": boolean;
			"credentialless": boolean;
			"csp": string;
			/** @deprecated */ "frameBorder": number | string;
			"height": number | string;
			"loading": 'eager' | 'lazy';
			/** @deprecated */ "longDesc": string;
			/** @deprecated */ "marginHeight": number;
			/** @deprecated */ "marginWidth": number;
			"name": string;
			"privateToken": string;
			"referrerPolicy": 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
			"sandbox": 'allow-downloads-without-user-activation' | 'allow-downloads' | 'allow-forms' | 'allow-modals' | 'allow-orientation-lock' | 'allow-pointer-lock' | 'allow-popups' | 'allow-popups-to-escape-sandbox' | 'allow-presentation' | 'allow-same-origin' | 'allow-scripts' | 'allow-storage-access-by-user-activation' | 'allow-top-navigation' | 'allow-top-navigation-by-user-activation' | 'allow-top-navigation-to-custom-protocols' | string;
			/** @deprecated */ "scrolling": 'yes' | 'no' | 'auto';
			"sharedStorageWritable": boolean;
			"src": string;
			"srcdoc": string;
			"width": number | string;
		};
		events: {};
	};
	/** @deprecated */ "image": {
		attributes: {};
		properties: {};
		events: {};
	};
	"img": {
		attributes: {
			/** @deprecated */ "align": 'top' | 'middle' | 'bottom' | 'left' | 'right';
			"alt": string;
			"attributionsrc": string;
			/** @deprecated */ "border": string;
			"browsingtopics": boolean;
			"crossorigin": 'anonymous' | 'use-credentials' | '';
			"decoding": 'sync' | 'async' | 'auto';
			"fetchpriority": 'high' | 'low' | 'auto';
			"height": number | string;
			/** @deprecated */ "hspace": number | string;
			"ismap": boolean;
			"loading": 'eager' | 'lazy';
			/** @deprecated */ "longdesc": string;
			/** @deprecated */ "lowsrc": string;
			/** @deprecated */ "name": string;
			"referrerpolicy": 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
			"sharedstoragewritable": boolean;
			"sizes": string;
			"src": string;
			"srcset": string;
			"usemap": string;
			/** @deprecated */ "vspace": number | string;
			"width": number | string;
		};
		properties: {
			/** @deprecated */ "align": 'top' | 'middle' | 'bottom' | 'left' | 'right';
			"alt": string;
			"attributionSrc": string;
			/** @deprecated */ "border": string;
			"browsingTopics": boolean;
			"crossOrigin": 'anonymous' | 'use-credentials' | '';
			"decoding": 'sync' | 'async' | 'auto';
			"fetchPriority": string;
			"height": number | string;
			/** @deprecated */ "hspace": number | string;
			"isMap": boolean;
			"loading": 'eager' | 'lazy';
			/** @deprecated */ "longDesc": string;
			/** @deprecated */ "lowsrc": string;
			/** @deprecated */ "name": string;
			"referrerPolicy": 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
			"sharedStorageWritable": boolean;
			"sizes": string;
			"src": string;
			"srcset": string;
			"useMap": string;
			/** @deprecated */ "vspace": number | string;
			"width": number | string;
		};
		events: {};
	};
	"input": {
		attributes: {
			"accept": string;
			/** @deprecated */ "align": string;
			"alt": string;
			"autocomplete": 'additional-name' | 'address-level1' | 'address-level2' | 'address-level3' | 'address-level4' | 'address-line1' | 'address-line2' | 'address-line3' | 'bday' | 'bday-day' | 'bday-month' | 'bday-year' | 'billing' | 'cc-additional-name' | 'cc-csc' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-family-name' | 'cc-given-name' | 'cc-name' | 'cc-number' | 'cc-type' | 'country' | 'country-name' | 'current-password' | 'email' | 'family-name' | 'fax' | 'given-name' | 'home' | 'honorific-prefix' | 'honorific-suffix' | 'impp' | 'language' | 'mobile' | 'name' | 'new-password' | 'nickname' | 'off' | 'on' | 'organization' | 'organization-title' | 'pager' | 'photo' | 'postal-code' | 'sex' | 'shipping' | 'street-address' | 'tel' | 'tel-area-code' | 'tel-country-code' | 'tel-extension' | 'tel-local' | 'tel-local-prefix' | 'tel-local-suffix' | 'tel-national' | 'transaction-amount' | 'transaction-currency' | 'url' | 'username' | 'work' | (string & {});
			"capture": 'user' | 'environment';
			"checked": boolean;
			"dirname": string;
			"disabled": boolean;
			"form": string;
			"formaction": string;
			"formenctype": 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
			"formmethod": 'post' | 'get' | 'dialog';
			"formnovalidate": boolean;
			"formtarget": string;
			"height": number | string;
			"incremental": boolean;
			"list": string;
			"max": number | string;
			"maxlength": number | string;
			"min": number | string;
			"minlength": number | string;
			"multiple": boolean;
			"name": string;
			"pattern": string;
			"placeholder": string;
			"popovertarget": string;
			"popovertargetaction": 'hide' | 'show' | 'toggle';
			"readonly": boolean;
			"required": boolean;
			"results": number;
			"size": number | string;
			"src": string;
			"step": number | string;
			"type": 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week' | (string & {});
			/** @deprecated */ "usemap": string;
			"webkitdirectory": boolean;
			"width": number | string;
		};
		properties: {
			"accept": string;
			/** @deprecated */ "align": string;
			"alt": string;
			"autocomplete": 'additional-name' | 'address-level1' | 'address-level2' | 'address-level3' | 'address-level4' | 'address-line1' | 'address-line2' | 'address-line3' | 'bday' | 'bday-day' | 'bday-month' | 'bday-year' | 'billing' | 'cc-additional-name' | 'cc-csc' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-family-name' | 'cc-given-name' | 'cc-name' | 'cc-number' | 'cc-type' | 'country' | 'country-name' | 'current-password' | 'email' | 'family-name' | 'fax' | 'given-name' | 'home' | 'honorific-prefix' | 'honorific-suffix' | 'impp' | 'language' | 'mobile' | 'name' | 'new-password' | 'nickname' | 'off' | 'on' | 'organization' | 'organization-title' | 'pager' | 'photo' | 'postal-code' | 'sex' | 'shipping' | 'street-address' | 'tel' | 'tel-area-code' | 'tel-country-code' | 'tel-extension' | 'tel-local' | 'tel-local-prefix' | 'tel-local-suffix' | 'tel-national' | 'transaction-amount' | 'transaction-currency' | 'url' | 'username' | 'work' | (string & {});
			"checked": boolean;
			"defaultChecked": boolean;
			"defaultValue": string;
			"dirName": string;
			"disabled": boolean;
			"files": FileList;
			"formAction": string;
			"formEnctype": 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
			"formMethod": 'post' | 'get' | 'dialog';
			"formNoValidate": boolean;
			"formTarget": string;
			"height": number | string;
			"incremental": boolean;
			"indeterminate": boolean;
			"max": number | string;
			"maxLength": number | string;
			"min": number | string;
			"minLength": number | string;
			"multiple": boolean;
			"name": string;
			"pattern": string;
			"placeholder": string;
			"popoverTargetAction": string;
			"popoverTargetElement": Element;
			"readOnly": boolean;
			"required": boolean;
			"selectionDirection": string;
			"selectionEnd": number;
			"selectionStart": number;
			"size": number | string;
			"src": string;
			"step": number | string;
			"type": 'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week' | (string & {});
			/** @deprecated */ "useMap": string;
			"value": boolean;
			"valueAsDate": Date;
			"valueAsNumber": number;
			"webkitdirectory": boolean;
			"width": number | string;
		};
		events: {
			"cancel": Event;
			"change": Event;
		};
	};
	"ins": {
		attributes: {
			"cite": string;
			"datetime": string;
		};
		properties: {
			"cite": string;
			"dateTime": string;
		};
		events: {};
	};
	/** @deprecated */ "isindex": {
		attributes: {};
		properties: {};
		events: {};
	};
	"kbd": {
		attributes: {};
		properties: {};
		events: {};
	};
	/** @deprecated */ "keygen": {
		attributes: {
			/** @deprecated */ "form": string;
		};
		properties: {};
		events: {};
	};
	"label": {
		attributes: {
			"for": string;
		};
		properties: {
			"htmlFor": string;
		};
		events: {};
	};
	"legend": {
		attributes: {
			/** @deprecated */ "align": string;
		};
		properties: {
			/** @deprecated */ "align": string;
		};
		events: {};
	};
	"li": {
		attributes: {
			/** @deprecated */ "type": '1' | 'a' | 'A' | 'i' | 'I';
			"value": number | string;
		};
		properties: {
			/** @deprecated */ "type": '1' | 'a' | 'A' | 'i' | 'I';
			"value": number | string;
		};
		events: {};
	};
	"link": {
		attributes: {
			"as": 'audio' | 'document' | 'embed' | 'fetch' | 'font' | 'image' | 'object' | 'script' | 'style' | 'track' | 'video' | 'worker';
			"blocking": 'render';
			/** @deprecated */ "charset": string;
			"crossorigin": 'anonymous' | 'use-credentials' | '';
			"disabled": boolean;
			"fetchpriority": 'high' | 'low' | 'auto';
			"href": string;
			"hreflang": string;
			"imagesizes": string;
			"imagesrcset": string;
			"integrity": string;
			"media": string;
			"referrerpolicy": 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
			"rel": string;
			/** @deprecated */ "rev": string;
			"sizes": string;
			/** @deprecated */ "target": string;
			"type": string;
		};
		properties: {
			"as": 'audio' | 'document' | 'embed' | 'fetch' | 'font' | 'image' | 'object' | 'script' | 'style' | 'track' | 'video' | 'worker';
			"blocking": 'render';
			/** @deprecated */ "charset": string;
			"crossOrigin": 'anonymous' | 'use-credentials' | '';
			"disabled": boolean;
			"fetchPriority": string;
			"href": string;
			"hreflang": string;
			"imageSizes": string;
			"imageSrcset": string;
			"integrity": string;
			"media": string;
			"referrerPolicy": 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
			"relList": string;
			/** @deprecated */ "rev": string;
			"sizes": string;
			/** @deprecated */ "target": string;
			"type": string;
		};
		events: {};
	};
	/** @deprecated */ "listing": {
		attributes: {
			/** @deprecated */ "width": number;
		};
		properties: {
			/** @deprecated */ "width": number;
		};
		events: {};
	};
	"main": {
		attributes: {};
		properties: {};
		events: {};
	};
	"map": {
		attributes: {
			"name": string;
		};
		properties: {
			"name": string;
		};
		events: {};
	};
	"mark": {
		attributes: {};
		properties: {};
		events: {};
	};
	/** @deprecated */ "marquee": {
		attributes: {
			/** @deprecated */ "behavior": string;
			/** @deprecated */ "bgcolor": string;
			/** @deprecated */ "direction": string;
			/** @deprecated */ "height": string;
			/** @deprecated */ "hspace": number;
			/** @deprecated */ "loop": number;
			/** @deprecated */ "scrollamount": number;
			/** @deprecated */ "scrolldelay": number;
			/** @deprecated */ "truespeed": boolean;
			/** @deprecated */ "vspace": number;
			/** @deprecated */ "width": string;
		};
		properties: {
			/** @deprecated */ "behavior": string;
			/** @deprecated */ "bgColor": string;
			/** @deprecated */ "direction": string;
			/** @deprecated */ "height": string;
			/** @deprecated */ "hspace": number;
			/** @deprecated */ "loop": number;
			/** @deprecated */ "scrollAmount": number;
			/** @deprecated */ "scrollDelay": number;
			/** @deprecated */ "trueSpeed": boolean;
			/** @deprecated */ "vspace": number;
			/** @deprecated */ "width": string;
		};
		events: {};
	};
	"menu": {
		attributes: {
			/** @deprecated */ "compact": boolean;
		};
		properties: {
			/** @deprecated */ "compact": boolean;
		};
		events: {};
	};
	/** @deprecated */ "menuitem": {
		attributes: {};
		properties: {};
		events: {};
	};
	"meta": {
		attributes: {
			"charset": string;
			"content": string;
			"http-equiv": 'content-security-policy' | 'content-type' | 'default-style' | 'x-ua-compatible' | 'refresh';
			"media": string;
			"name": string;
			/** @deprecated */ "scheme": string;
		};
		properties: {
			"content": string;
			"httpEquiv": string;
			"media": string;
			"name": string;
			/** @deprecated */ "scheme": string;
		};
		events: {};
	};
	"meter": {
		attributes: {
			"form": string;
			"high": number | string;
			"low": number | string;
			"max": number | string;
			"min": number | string;
			"optimum": number | string;
			"value": string | string[] | number;
		};
		properties: {
			"high": number | string;
			"low": number | string;
			"max": number | string;
			"min": number | string;
			"optimum": number | string;
			"value": string | string[] | number;
		};
		events: {};
	};
	/** @deprecated */ "multicol": {
		attributes: {};
		properties: {};
		events: {};
	};
	"nav": {
		attributes: {};
		properties: {};
		events: {};
	};
	/** @deprecated */ "nextid": {
		attributes: {};
		properties: {};
		events: {};
	};
	/** @deprecated */ "nobr": {
		attributes: {};
		properties: {};
		events: {};
	};
	/** @deprecated */ "noembed": {
		attributes: {};
		properties: {};
		events: {};
	};
	/** @deprecated */ "noframes": {
		attributes: {};
		properties: {};
		events: {};
	};
	"noindex": {
		attributes: {};
		properties: {};
		events: {};
	};
	"noscript": {
		attributes: {};
		properties: {};
		events: {};
	};
	"object": {
		attributes: {
			/** @deprecated */ "align": string;
			/** @deprecated */ "archive": string;
			/** @deprecated */ "border": string;
			/** @deprecated */ "code": string;
			/** @deprecated */ "codebase": string;
			/** @deprecated */ "codetype": string;
			"data": string;
			/** @deprecated */ "declare": boolean;
			"form": string;
			"height": number | string;
			/** @deprecated */ "hspace": number | string;
			"name": string;
			/** @deprecated */ "standby": string;
			"type": string;
			/** @deprecated */ "usemap": string;
			/** @deprecated */ "vspace": number | string;
			"width": number | string;
			"wmode": string;
		};
		properties: {
			/** @deprecated */ "align": string;
			/** @deprecated */ "archive": string;
			/** @deprecated */ "border": string;
			/** @deprecated */ "code": string;
			/** @deprecated */ "codeBase": string;
			/** @deprecated */ "codeType": string;
			"data": string;
			/** @deprecated */ "declare": boolean;
			"height": number | string;
			/** @deprecated */ "hspace": number | string;
			"name": string;
			/** @deprecated */ "standby": string;
			"type": string;
			/** @deprecated */ "useMap": string;
			/** @deprecated */ "vspace": number | string;
			"width": number | string;
		};
		events: {};
	};
	"ol": {
		attributes: {
			/** @deprecated */ "compact": boolean;
			"reversed": boolean;
			"start": number | string;
			"type": '1' | 'a' | 'A' | 'i' | 'I';
		};
		properties: {
			/** @deprecated */ "compact": boolean;
			"reversed": boolean;
			"start": number | string;
			"type": '1' | 'a' | 'A' | 'i' | 'I';
		};
		events: {};
	};
	"optgroup": {
		attributes: {
			"disabled": boolean;
			"label": string;
		};
		properties: {
			"disabled": boolean;
			"label": string;
		};
		events: {};
	};
	"option": {
		attributes: {
			"disabled": boolean;
			"label": string;
			"selected": boolean;
			"value": string | string[] | number;
		};
		properties: {
			"defaultSelected": boolean;
			"disabled": boolean;
			"label": string;
			"text": string;
			"value": string | string[] | number;
		};
		events: {};
	};
	"output": {
		attributes: {
			"for": string;
			"form": string;
			"name": string;
		};
		properties: {
			"defaultValue": string;
			"htmlFor": string;
			"name": string;
			"value": string;
		};
		events: {};
	};
	"p": {
		attributes: {
			/** @deprecated */ "align": string;
		};
		properties: {
			/** @deprecated */ "align": string;
		};
		events: {};
	};
	/** @deprecated */ "param": {
		attributes: {
			/** @deprecated */ "name": string;
			/** @deprecated */ "type": string;
			/** @deprecated */ "value": string | number;
			/** @deprecated */ "valuetype": 'data' | 'ref' | 'object';
		};
		properties: {
			/** @deprecated */ "name": string;
			/** @deprecated */ "type": string;
			/** @deprecated */ "value": string | number;
			/** @deprecated */ "valueType": string;
		};
		events: {};
	};
	"picture": {
		attributes: {};
		properties: {};
		events: {};
	};
	/** @deprecated */ "plaintext": {
		attributes: {};
		properties: {};
		events: {};
	};
	/** @deprecated */ "portal": {
		attributes: {};
		properties: {};
		events: {};
	};
	"pre": {
		attributes: {
			/** @deprecated */ "width": number;
		};
		properties: {
			/** @deprecated */ "width": number;
		};
		events: {};
	};
	"progress": {
		attributes: {
			"max": number | string;
			"value": string | string[] | number;
		};
		properties: {
			"max": number | string;
			"value": string | string[] | number;
		};
		events: {};
	};
	"q": {
		attributes: {
			"cite": string;
		};
		properties: {
			"cite": string;
		};
		events: {};
	};
	/** @deprecated */ "rb": {
		attributes: {};
		properties: {};
		events: {};
	};
	"rp": {
		attributes: {};
		properties: {};
		events: {};
	};
	"rt": {
		attributes: {};
		properties: {};
		events: {};
	};
	/** @deprecated */ "rtc": {
		attributes: {};
		properties: {};
		events: {};
	};
	"ruby": {
		attributes: {};
		properties: {};
		events: {};
	};
	"s": {
		attributes: {};
		properties: {};
		events: {};
	};
	"samp": {
		attributes: {};
		properties: {};
		events: {};
	};
	"script": {
		attributes: {
			"async": boolean;
			"attributionsrc": string;
			"blocking": 'render';
			/** @deprecated */ "charset": string;
			"crossorigin": 'anonymous' | 'use-credentials' | '';
			"defer": boolean;
			/** @deprecated */ "event": string;
			"fetchpriority": 'high' | 'low' | 'auto';
			"for": string;
			"integrity": string;
			"nomodule": boolean;
			"referrerpolicy": 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
			"src": string;
			"type": 'importmap' | 'module' | 'speculationrules' | (string & {});
		};
		properties: {
			"async": boolean;
			"attributionSrc": string;
			"blocking": 'render';
			/** @deprecated */ "charset": string;
			"crossOrigin": 'anonymous' | 'use-credentials' | '';
			"defer": boolean;
			/** @deprecated */ "event": string;
			"fetchPriority": string;
			/** @deprecated */ "htmlFor": string;
			"innerText": string;
			"integrity": string;
			"noModule": boolean;
			"referrerPolicy": 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
			"src": string;
			"text": string;
			"textContent": string | number;
			"type": 'importmap' | 'module' | 'speculationrules' | (string & {});
		};
		events: {};
	};
	"search": {
		attributes: {};
		properties: {};
		events: {};
	};
	"section": {
		attributes: {};
		properties: {};
		events: {};
	};
	"select": {
		attributes: {
			"autocomplete": 'additional-name' | 'address-level1' | 'address-level2' | 'address-level3' | 'address-level4' | 'address-line1' | 'address-line2' | 'address-line3' | 'bday' | 'bday-day' | 'bday-month' | 'bday-year' | 'billing' | 'cc-additional-name' | 'cc-csc' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-family-name' | 'cc-given-name' | 'cc-name' | 'cc-number' | 'cc-type' | 'country' | 'country-name' | 'current-password' | 'email' | 'family-name' | 'fax' | 'given-name' | 'home' | 'honorific-prefix' | 'honorific-suffix' | 'impp' | 'language' | 'mobile' | 'name' | 'new-password' | 'nickname' | 'off' | 'on' | 'organization' | 'organization-title' | 'pager' | 'photo' | 'postal-code' | 'sex' | 'shipping' | 'street-address' | 'tel' | 'tel-area-code' | 'tel-country-code' | 'tel-extension' | 'tel-local' | 'tel-local-prefix' | 'tel-local-suffix' | 'tel-national' | 'transaction-amount' | 'transaction-currency' | 'url' | 'username' | 'work' | (string & {});
			"disabled": boolean;
			"form": string;
			"multiple": boolean;
			"name": string;
			"required": boolean;
			"size": number | string;
		};
		properties: {
			"autocomplete": 'additional-name' | 'address-level1' | 'address-level2' | 'address-level3' | 'address-level4' | 'address-line1' | 'address-line2' | 'address-line3' | 'bday' | 'bday-day' | 'bday-month' | 'bday-year' | 'billing' | 'cc-additional-name' | 'cc-csc' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-family-name' | 'cc-given-name' | 'cc-name' | 'cc-number' | 'cc-type' | 'country' | 'country-name' | 'current-password' | 'email' | 'family-name' | 'fax' | 'given-name' | 'home' | 'honorific-prefix' | 'honorific-suffix' | 'impp' | 'language' | 'mobile' | 'name' | 'new-password' | 'nickname' | 'off' | 'on' | 'organization' | 'organization-title' | 'pager' | 'photo' | 'postal-code' | 'sex' | 'shipping' | 'street-address' | 'tel' | 'tel-area-code' | 'tel-country-code' | 'tel-extension' | 'tel-local' | 'tel-local-prefix' | 'tel-local-suffix' | 'tel-national' | 'transaction-amount' | 'transaction-currency' | 'url' | 'username' | 'work' | (string & {});
			"disabled": boolean;
			"length": number;
			"multiple": boolean;
			"name": string;
			"required": boolean;
			"selectedIndex": number;
			"size": number | string;
			"value": string | string[] | number;
		};
		events: {
			"change": Event;
		};
	};
	"selectedcontent": {
		attributes: {};
		properties: {};
		events: {};
	};
	/** @deprecated */ "shadow": {
		attributes: {};
		properties: {};
		events: {};
	};
	"slot": {
		attributes: {
			"name": string;
		};
		properties: {
			"name": string;
		};
		events: {};
	};
	"small": {
		attributes: {};
		properties: {};
		events: {};
	};
	"source": {
		attributes: {
			"height": number | string;
			"media": string;
			"sizes": string;
			"src": string;
			"srcset": string;
			"type": string;
			"width": number | string;
		};
		properties: {
			"height": number | string;
			"media": string;
			"sizes": string;
			"src": string;
			"srcset": string;
			"type": string;
			"width": number | string;
		};
		events: {};
	};
	/** @deprecated */ "spacer": {
		attributes: {};
		properties: {};
		events: {};
	};
	"span": {
		attributes: {};
		properties: {};
		events: {};
	};
	/** @deprecated */ "strike": {
		attributes: {};
		properties: {};
		events: {};
	};
	"strong": {
		attributes: {};
		properties: {};
		events: {};
	};
	"style": {
		attributes: {
			"blocking": 'render';
			"media": string;
			/** @deprecated */ "type": string;
		};
		properties: {
			"blocking": 'render';
			"disabled": boolean;
			"media": string;
			/** @deprecated */ "type": string;
		};
		events: {};
	};
	"sub": {
		attributes: {};
		properties: {};
		events: {};
	};
	"summary": {
		attributes: {};
		properties: {};
		events: {};
	};
	"sup": {
		attributes: {};
		properties: {};
		events: {};
	};
	"table": {
		attributes: {
			/** @deprecated */ "align": string;
			/** @deprecated */ "bgcolor": string;
			/** @deprecated */ "border": string;
			/** @deprecated */ "cellpadding": string;
			/** @deprecated */ "cellspacing": string;
			/** @deprecated */ "frame": string;
			/** @deprecated */ "rules": string;
			/** @deprecated */ "summary": string;
			/** @deprecated */ "width": number | string;
		};
		properties: {
			/** @deprecated */ "align": string;
			/** @deprecated */ "bgColor": string;
			/** @deprecated */ "border": string;
			"caption": HTMLTableCaptionElement;
			/** @deprecated */ "cellPadding": number | string;
			/** @deprecated */ "cellSpacing": number | string;
			/** @deprecated */ "frame": string;
			/** @deprecated */ "rules": string;
			/** @deprecated */ "summary": string;
			"tFoot": HTMLTableSectionElement;
			"tHead": HTMLTableSectionElement;
			/** @deprecated */ "width": number | string;
		};
		events: {};
	};
	"tbody": {
		attributes: {
			/** @deprecated */ "align": string;
			/** @deprecated */ "char": string;
			/** @deprecated */ "charoff": string;
			/** @deprecated */ "valign": string;
		};
		properties: {
			/** @deprecated */ "align": string;
			/** @deprecated */ "ch": string;
			/** @deprecated */ "chOff": string;
			/** @deprecated */ "vAlign": string;
		};
		events: {};
	};
	"td": {
		attributes: {
			/** @deprecated */ "abbr": string;
			/** @deprecated */ "align": 'left' | 'center' | 'right' | 'justify' | 'char';
			/** @deprecated */ "axis": string;
			/** @deprecated */ "bgcolor": string;
			/** @deprecated */ "char": string;
			/** @deprecated */ "charoff": string;
			"colspan": number | string;
			"headers": string;
			/** @deprecated */ "height": number | string;
			/** @deprecated */ "nowrap": boolean;
			"rowspan": number | string;
			/** @deprecated */ "scope": 'col' | 'row' | 'rowgroup' | 'colgroup';
			/** @deprecated */ "valign": 'baseline' | 'bottom' | 'middle' | 'top';
			/** @deprecated */ "width": number | string;
		};
		properties: {
			/** @deprecated */ "abbr": string;
			/** @deprecated */ "align": 'left' | 'center' | 'right' | 'justify' | 'char';
			/** @deprecated */ "axis": string;
			/** @deprecated */ "bgColor": string;
			/** @deprecated */ "ch": string;
			/** @deprecated */ "chOff": string;
			"colSpan": number | string;
			"headers": string;
			/** @deprecated */ "height": number | string;
			/** @deprecated */ "noWrap": boolean;
			"rowSpan": number | string;
			/** @deprecated */ "scope": 'col' | 'row' | 'rowgroup' | 'colgroup';
			/** @deprecated */ "vAlign": string;
			/** @deprecated */ "width": number | string;
		};
		events: {};
	};
	"template": {
		attributes: {
			"shadowrootclonable": boolean;
			"shadowrootdelegatesfocus": boolean;
			"shadowrootmode": 'open' | 'closed';
			"shadowrootserializable": boolean;
		};
		properties: {
			"shadowRootClonable": boolean;
			"shadowRootDelegatesFocus": boolean;
			"shadowRootMode": string;
			"shadowRootSerializable": boolean;
		};
		events: {};
	};
	"textarea": {
		attributes: {
			"autocomplete": 'additional-name' | 'address-level1' | 'address-level2' | 'address-level3' | 'address-level4' | 'address-line1' | 'address-line2' | 'address-line3' | 'bday' | 'bday-day' | 'bday-month' | 'bday-year' | 'billing' | 'cc-additional-name' | 'cc-csc' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-family-name' | 'cc-given-name' | 'cc-name' | 'cc-number' | 'cc-type' | 'country' | 'country-name' | 'current-password' | 'email' | 'family-name' | 'fax' | 'given-name' | 'home' | 'honorific-prefix' | 'honorific-suffix' | 'impp' | 'language' | 'mobile' | 'name' | 'new-password' | 'nickname' | 'off' | 'on' | 'organization' | 'organization-title' | 'pager' | 'photo' | 'postal-code' | 'sex' | 'shipping' | 'street-address' | 'tel' | 'tel-area-code' | 'tel-country-code' | 'tel-extension' | 'tel-local' | 'tel-local-prefix' | 'tel-local-suffix' | 'tel-national' | 'transaction-amount' | 'transaction-currency' | 'url' | 'username' | 'work' | (string & {});
			"cols": number | string;
			"dirname": string;
			"disabled": boolean;
			"form": string;
			"maxlength": number | string;
			"minlength": number | string;
			"name": string;
			"placeholder": string;
			"readonly": boolean;
			"required": boolean;
			"rows": number | string;
			"wrap": 'hard' | 'soft' | 'off';
		};
		properties: {
			"autocomplete": 'additional-name' | 'address-level1' | 'address-level2' | 'address-level3' | 'address-level4' | 'address-line1' | 'address-line2' | 'address-line3' | 'bday' | 'bday-day' | 'bday-month' | 'bday-year' | 'billing' | 'cc-additional-name' | 'cc-csc' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-family-name' | 'cc-given-name' | 'cc-name' | 'cc-number' | 'cc-type' | 'country' | 'country-name' | 'current-password' | 'email' | 'family-name' | 'fax' | 'given-name' | 'home' | 'honorific-prefix' | 'honorific-suffix' | 'impp' | 'language' | 'mobile' | 'name' | 'new-password' | 'nickname' | 'off' | 'on' | 'organization' | 'organization-title' | 'pager' | 'photo' | 'postal-code' | 'sex' | 'shipping' | 'street-address' | 'tel' | 'tel-area-code' | 'tel-country-code' | 'tel-extension' | 'tel-local' | 'tel-local-prefix' | 'tel-local-suffix' | 'tel-national' | 'transaction-amount' | 'transaction-currency' | 'url' | 'username' | 'work' | (string & {});
			"cols": number | string;
			"defaultValue": string;
			"dirName": string;
			"disabled": boolean;
			"maxLength": number | string;
			"minLength": number | string;
			"name": string;
			"placeholder": string;
			"readOnly": boolean;
			"required": boolean;
			"rows": number | string;
			"selectionDirection": string;
			"selectionEnd": number;
			"selectionStart": number;
			"value": string | string[] | number;
			"wrap": 'hard' | 'soft' | 'off';
		};
		events: {
			"change": Event;
		};
	};
	"tfoot": {
		attributes: {
			/** @deprecated */ "align": string;
			/** @deprecated */ "char": string;
			/** @deprecated */ "charoff": string;
			/** @deprecated */ "valign": string;
		};
		properties: {
			/** @deprecated */ "align": string;
			/** @deprecated */ "ch": string;
			/** @deprecated */ "chOff": string;
			/** @deprecated */ "vAlign": string;
		};
		events: {};
	};
	"th": {
		attributes: {
			"abbr": string;
			/** @deprecated */ "align": 'left' | 'center' | 'right' | 'justify' | 'char';
			/** @deprecated */ "axis": string;
			/** @deprecated */ "bgcolor": string;
			/** @deprecated */ "char": string;
			/** @deprecated */ "charoff": string;
			"colspan": number | string;
			"headers": string;
			/** @deprecated */ "height": string;
			/** @deprecated */ "nowrap": boolean;
			"rowspan": number | string;
			"scope": 'col' | 'row' | 'rowgroup' | 'colgroup';
			/** @deprecated */ "valign": 'baseline' | 'bottom' | 'middle' | 'top';
			/** @deprecated */ "width": number | string;
		};
		properties: {
			"abbr": string;
			/** @deprecated */ "align": 'left' | 'center' | 'right' | 'justify' | 'char';
			/** @deprecated */ "axis": string;
			/** @deprecated */ "bgColor": string;
			/** @deprecated */ "ch": string;
			/** @deprecated */ "chOff": string;
			"colSpan": number | string;
			"headers": string;
			/** @deprecated */ "height": string;
			/** @deprecated */ "noWrap": boolean;
			"rowSpan": number | string;
			"scope": 'col' | 'row' | 'rowgroup' | 'colgroup';
			/** @deprecated */ "vAlign": string;
			/** @deprecated */ "width": number | string;
		};
		events: {};
	};
	"thead": {
		attributes: {
			/** @deprecated */ "align": string;
			/** @deprecated */ "char": string;
			/** @deprecated */ "charoff": string;
			/** @deprecated */ "valign": string;
		};
		properties: {
			/** @deprecated */ "align": string;
			/** @deprecated */ "ch": string;
			/** @deprecated */ "chOff": string;
			/** @deprecated */ "vAlign": string;
		};
		events: {};
	};
	"time": {
		attributes: {
			"datetime": string;
		};
		properties: {
			"dateTime": string;
		};
		events: {};
	};
	"title": {
		attributes: {};
		properties: {
			"text": string;
		};
		events: {};
	};
	"tr": {
		attributes: {
			/** @deprecated */ "align": string;
			/** @deprecated */ "bgcolor": string;
			/** @deprecated */ "char": string;
			/** @deprecated */ "charoff": string;
			/** @deprecated */ "valign": string;
		};
		properties: {
			/** @deprecated */ "align": string;
			/** @deprecated */ "bgColor": string;
			/** @deprecated */ "ch": string;
			/** @deprecated */ "chOff": string;
			/** @deprecated */ "vAlign": string;
		};
		events: {};
	};
	"track": {
		attributes: {
			"default": boolean;
			"kind": 'alternative' | 'descriptions' | 'main' | 'main-desc' | 'translation' | 'commentary' | 'subtitles' | 'captions' | 'chapters' | 'metadata';
			"label": string;
			"src": string;
			"srclang": string;
		};
		properties: {
			"default": boolean;
			"kind": 'alternative' | 'descriptions' | 'main' | 'main-desc' | 'translation' | 'commentary' | 'subtitles' | 'captions' | 'chapters' | 'metadata';
			"label": string;
			"src": string;
			"srclang": string;
		};
		events: {};
	};
	/** @deprecated */ "tt": {
		attributes: {};
		properties: {};
		events: {};
	};
	"u": {
		attributes: {};
		properties: {};
		events: {};
	};
	"ul": {
		attributes: {
			/** @deprecated */ "compact": boolean;
			/** @deprecated */ "type": string;
		};
		properties: {
			/** @deprecated */ "compact": boolean;
			/** @deprecated */ "type": string;
		};
		events: {};
	};
	"var": {
		attributes: {};
		properties: {};
		events: {};
	};
	"video": {
		attributes: {
			"autoplay": boolean;
			"controls": boolean;
			"controlslist": 'nodownload' | 'nofullscreen' | 'noplaybackrate' | 'noremoteplayback' | (string & {});
			"crossorigin": 'anonymous' | 'use-credentials' | '';
			"disablepictureinpicture": boolean;
			"disableremoteplayback": boolean;
			"height": number | string;
			"loop": boolean;
			"muted": boolean;
			"playsinline": boolean;
			"poster": string;
			"preload": 'none' | 'metadata' | 'auto' | '';
			"src": string;
			"width": number | string;
		};
		properties: {
			"autoplay": boolean;
			"controls": boolean;
			"controlsList": string;
			"crossOrigin": 'anonymous' | 'use-credentials' | '';
			"currentTime": number;
			"defaultMuted": boolean;
			"defaultPlaybackRate": number;
			"disablePictureInPicture": boolean;
			"disableRemotePlayback": boolean;
			"height": number | string;
			"loop": boolean;
			"playbackRate": number;
			"playsInline": boolean;
			"poster": string;
			"preload": 'none' | 'metadata' | 'auto' | '';
			"preservesPitch": boolean;
			"src": string;
			"srcObject": MediaStream | MediaSource | Blob | File;
			"volume": number;
			"width": number | string;
		};
		events: {
			"encrypted": MediaEncryptedEvent;
			"enterpictureinpicture": PictureInPictureEvent;
			"leavepictureinpicture": PictureInPictureEvent;
			"resize": UIEvent;
			"waitingforkey": Event;
		};
	};
	"wbr": {
		attributes: {};
		properties: {};
		events: {};
	};
	"webview": {
		attributes: {};
		properties: {};
		events: {};
	};
	/** @deprecated */ "xmp": {
		attributes: {
			/** @deprecated */ "width": number;
		};
		properties: {
			/** @deprecated */ "width": number;
		};
		events: {};
	};
}
interface BaseSVGElements {
	a: {
		attributes: {
			download: boolean;
			href: string;
			hreflang: string;
			hrefLang: string;
			media: string;
			ping: string;
			referrerpolicy: string;
			rel: string;
			target: '_self' | '_blank' | '_parent' | '_top';
			type: string;
		};
		properties: {
			referrerPolicy:
				| ''
				| 'no-referrer'
				| 'no-referrer-when-downgrade'
				| 'origin'
				| 'origin-when-cross-origin'
				| 'same-origin'
				| 'strict-origin'
				| 'strict-origin-when-cross-origin'
				| 'unsafe-url';
			relList: string;
		};
		events: {};
	};
	altGlyph: {
		attributes: {};
		properties: {};
		events: {};
	};
	altGlyphDef: {
		attributes: {};
		properties: {};
		events: {};
	};
	altGlyphItem: {
		attributes: {};
		properties: {};
		events: {};
	};
	animate: {
		attributes: {
			accumulate: 'none' | 'sum';
			additive: 'replace' | 'sum';
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			attributeName: string;
			attributeType: 'CSS' | 'XML' | 'auto';
			'baseline-shift': number | string;
			begin: string;
			by: number | string;
			calcMode: 'discrete' | 'linear' | 'paced' | 'spline';
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			dur: string;
			'enable-background': string;
			end: string;
			externalResourcesRequired: 'true' | 'false';
			fill: 'freeze' | 'remove' | string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			from: number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			keySplines: string;
			keyTimes: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			max: string;
			min: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			repeatCount: number | 'indefinite';
			repeatDur: string;
			requiredExtensions: string;
			requiredFeatures: string;
			restart: 'always' | 'whenNotActive' | 'never';
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			to: number | string;
			'unicode-bidi': string;
			values: string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
		};
		properties: {};
		events: {};
	};
	animateColor: {
		attributes: {};
		properties: {};
		events: {};
	};
	animateMotion: {
		attributes: {
			accumulate: 'none' | 'sum';
			additive: 'replace' | 'sum';
			attributeName: string;
			begin: string;
			by: number | string;
			calcMode: 'discrete' | 'linear' | 'paced' | 'spline';
			dur: string;
			end: string;
			externalResourcesRequired: 'true' | 'false';
			fill: 'freeze' | 'remove';
			from: number | string;
			keyPoints: string;
			keySplines: string;
			keyTimes: string;
			max: string;
			min: string;
			origin: 'default';
			path: string;
			repeatCount: number | 'indefinite';
			repeatDur: string;
			requiredExtensions: string;
			requiredFeatures: string;
			restart: 'always' | 'whenNotActive' | 'never';
			rotate: number | string | 'auto' | 'auto-reverse';
			systemLanguage: string;
			to: number | string;
			values: string;
		};
		properties: {};
		events: {};
	};
	animateTransform: {
		attributes: {
			accumulate: 'none' | 'sum';
			additive: 'replace' | 'sum';
			attributeName: string;
			attributeType: 'CSS' | 'XML' | 'auto';
			begin: string;
			by: number | string;
			calcMode: 'discrete' | 'linear' | 'paced' | 'spline';
			dur: string;
			end: string;
			externalResourcesRequired: 'true' | 'false';
			fill: 'freeze' | 'remove';
			from: number | string;
			keySplines: string;
			keyTimes: string;
			max: string;
			min: string;
			repeatCount: number | 'indefinite';
			repeatDur: string;
			requiredExtensions: string;
			requiredFeatures: string;
			restart: 'always' | 'whenNotActive' | 'never';
			systemLanguage: string;
			to: number | string;
			type: 'translate' | 'scale' | 'rotate' | 'skewX' | 'skewY';
			values: string;
		};
		properties: {};
		events: {};
	};
	circle: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			cx: number | string;
			cy: number | string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			r: number | string;
			requiredExtensions: string;
			requiredFeatures: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			transform: string;
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
		};
		properties: {};
		events: {};
	};
	clipPath: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			clipPathUnits: 'userSpaceOnUse' | 'objectBoundingBox';
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			requiredExtensions: string;
			requiredFeatures: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			transform: string;
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
		};
		properties: {};
		events: {};
	};
	'color-profile': {
		attributes: {};
		properties: {};
		events: {};
	};
	cursor: {
		attributes: {};
		properties: {};
		events: {};
	};
	defs: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			requiredExtensions: string;
			requiredFeatures: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			transform: string;
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
		};
		properties: {};
		events: {};
	};
	desc: {
		attributes: {
			class: string;
			style: string;
		};
		properties: {};
		events: {};
	};
	ellipse: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			cx: number | string;
			cy: number | string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			requiredExtensions: string;
			requiredFeatures: string;
			rx: number | string;
			ry: number | string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			transform: string;
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
		};
		properties: {};
		events: {};
	};
	feBlend: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			in: string;
			in2: string;
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			mode: 'normal' | 'multiply' | 'screen' | 'darken' | 'lighten';
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			result: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	feColorMatrix: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			in: string;
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			result: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			type: 'matrix' | 'saturate' | 'hueRotate' | 'luminanceToAlpha';
			'unicode-bidi': string;
			values: string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	feComponentTransfer: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			in: string;
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			result: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	feComposite: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			in: string;
			in2: string;
			k1: number | string;
			k2: number | string;
			k3: number | string;
			k4: number | string;
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			operator: 'over' | 'in' | 'out' | 'atop' | 'xor' | 'arithmetic';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			result: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	feConvolveMatrix: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			bias: number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			divisor: number | string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			edgeMode: 'duplicate' | 'wrap' | 'none';
			'enable-background': string;
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			in: string;
			kernelMatrix: string;
			kernelUnitLength: number | string;
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			order: number | string;
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			preserveAlpha: 'true' | 'false';
			result: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			targetX: number | string;
			targetY: number | string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	feDiffuseLighting: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			diffuseConstant: number | string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			in: string;
			kernelUnitLength: number | string;
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			result: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			surfaceScale: number | string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	feDisplacementMap: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			in: string;
			in2: string;
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			result: string;
			scale: number | string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			xChannelSelector: 'R' | 'G' | 'B' | 'A';
			y: number | string;
			yChannelSelector: 'R' | 'G' | 'B' | 'A';
		};
		properties: {};
		events: {};
	};
	feDistantLight: {
		attributes: {
			azimuth: number | string;
			elevation: number | string;
		};
		properties: {};
		events: {};
	};
	feDropShadow: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			dx: number | string;
			dy: number | string;
			'enable-background': string;
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			result: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			stdDeviation: number | string;
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	feFlood: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			result: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	feFuncA: {
		attributes: {
			amplitude: number | string;
			exponent: number | string;
			intercept: number | string;
			offset: number | string;
			slope: number | string;
			tableValues: string;
			type: 'identity' | 'table' | 'discrete' | 'linear' | 'gamma';
		};
		properties: {};
		events: {};
	};
	feFuncB: {
		attributes: {
			amplitude: number | string;
			exponent: number | string;
			intercept: number | string;
			offset: number | string;
			slope: number | string;
			tableValues: string;
			type: 'identity' | 'table' | 'discrete' | 'linear' | 'gamma';
		};
		properties: {};
		events: {};
	};
	feFuncG: {
		attributes: {
			amplitude: number | string;
			exponent: number | string;
			intercept: number | string;
			offset: number | string;
			slope: number | string;
			tableValues: string;
			type: 'identity' | 'table' | 'discrete' | 'linear' | 'gamma';
		};
		properties: {};
		events: {};
	};
	feFuncR: {
		attributes: {
			amplitude: number | string;
			exponent: number | string;
			intercept: number | string;
			offset: number | string;
			slope: number | string;
			tableValues: string;
			type: 'identity' | 'table' | 'discrete' | 'linear' | 'gamma';
		};
		properties: {};
		events: {};
	};
	feGaussianBlur: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			in: string;
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			result: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			stdDeviation: number | string;
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	feImage: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			crossorigin: string;
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			href: string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			preserveAspectRatio:
				| 'none'
				| 'xMinYMin'
				| 'xMidYMin'
				| 'xMaxYMin'
				| 'xMinYMid'
				| 'xMidYMid'
				| 'xMaxYMid'
				| 'xMinYMax'
				| 'xMidYMax'
				| 'xMaxYMax'
				| 'xMinYMin meet'
				| 'xMidYMin meet'
				| 'xMaxYMin meet'
				| 'xMinYMid meet'
				| 'xMidYMid meet'
				| 'xMaxYMid meet'
				| 'xMinYMax meet'
				| 'xMidYMax meet'
				| 'xMaxYMax meet'
				| 'xMinYMin slice'
				| 'xMidYMin slice'
				| 'xMaxYMin slice'
				| 'xMinYMid slice'
				| 'xMidYMid slice'
				| 'xMaxYMid slice'
				| 'xMinYMax slice'
				| 'xMidYMax slice'
				| 'xMaxYMax slice';
			result: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {
			crossOrigin: string;
		};
		events: {};
	};
	feMerge: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			result: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	feMergeNode: {
		attributes: {
			in: string;
		};
		properties: {};
		events: {};
	};
	feMorphology: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			in: string;
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			operator: 'erode' | 'dilate';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			radius: number | string;
			result: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	feOffset: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			dx: number | string;
			dy: number | string;
			'enable-background': string;
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			in: string;
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			result: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	fePointLight: {
		attributes: {
			x: number | string;
			y: number | string;
			z: number | string;
		};
		properties: {};
		events: {};
	};
	feSpecularLighting: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			in: string;
			kernelUnitLength: number | string;
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			result: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			specularConstant: string;
			specularExponent: string;
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			surfaceScale: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	feSpotLight: {
		attributes: {
			limitingConeAngle: number | string;
			pointsAtX: number | string;
			pointsAtY: number | string;
			pointsAtZ: number | string;
			specularExponent: number | string;
			x: number | string;
			y: number | string;
			z: number | string;
		};
		properties: {};
		events: {};
	};
	feTile: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			in: string;
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			result: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	feTurbulence: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			baseFrequency: number | string;
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			numOctaves: number | string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			result: string;
			seed: number | string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			stitchTiles: 'stitch' | 'noStitch';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			type: 'fractalNoise' | 'turbulence';
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	filter: {
		attributes: {
			class: string;
			externalResourcesRequired: 'true' | 'false';
			filterRes: number | string;
			filterUnits: 'userSpaceOnUse' | 'objectBoundingBox';
			height: number | string;
			primitiveUnits: 'userSpaceOnUse' | 'objectBoundingBox';
			style: string;
			width: number | string;
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	font: {
		attributes: {};
		properties: {};
		events: {};
	};
	'font-face': {
		attributes: {};
		properties: {};
		events: {};
	};
	'font-face-format': {
		attributes: {};
		properties: {};
		events: {};
	};
	'font-face-name': {
		attributes: {};
		properties: {};
		events: {};
	};
	'font-face-src': {
		attributes: {};
		properties: {};
		events: {};
	};
	'font-face-uri': {
		attributes: {};
		properties: {};
		events: {};
	};
	foreignObject: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			requiredExtensions: string;
			requiredFeatures: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			transform: string;
			'unicode-bidi': string;
			viewBox: string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	g: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			requiredExtensions: string;
			requiredFeatures: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			transform: string;
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
		};
		properties: {};
		events: {};
	};
	glyph: {
		attributes: {};
		properties: {};
		events: {};
	};
	glyphRef: {
		attributes: {};
		properties: {};
		events: {};
	};
	hkern: {
		attributes: {};
		properties: {};
		events: {};
	};
	image: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			crossorigin: string;
			cursor: string;
			decoding: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			href: string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			preserveAspectRatio:
				| 'none'
				| 'xMinYMin'
				| 'xMidYMin'
				| 'xMaxYMin'
				| 'xMinYMid'
				| 'xMidYMid'
				| 'xMaxYMid'
				| 'xMinYMax'
				| 'xMidYMax'
				| 'xMaxYMax'
				| 'xMinYMin meet'
				| 'xMidYMin meet'
				| 'xMaxYMin meet'
				| 'xMinYMid meet'
				| 'xMidYMid meet'
				| 'xMaxYMid meet'
				| 'xMinYMax meet'
				| 'xMidYMax meet'
				| 'xMaxYMax meet'
				| 'xMinYMin slice'
				| 'xMidYMin slice'
				| 'xMaxYMin slice'
				| 'xMinYMid slice'
				| 'xMidYMid slice'
				| 'xMaxYMid slice'
				| 'xMinYMax slice'
				| 'xMidYMax slice'
				| 'xMaxYMax slice'
				| 'defer none'
				| 'defer xMinYMin'
				| 'defer xMidYMin'
				| 'defer xMaxYMin'
				| 'defer xMinYMid'
				| 'defer xMidYMid'
				| 'defer xMaxYMid'
				| 'defer xMinYMax'
				| 'defer xMidYMax'
				| 'defer xMaxYMax'
				| 'defer xMinYMin meet'
				| 'defer xMidYMin meet'
				| 'defer xMaxYMin meet'
				| 'defer xMinYMid meet'
				| 'defer xMidYMid meet'
				| 'defer xMaxYMid meet'
				| 'defer xMinYMax meet'
				| 'defer xMidYMax meet'
				| 'defer xMaxYMax meet'
				| 'defer xMinYMin slice'
				| 'defer xMidYMin slice'
				| 'defer xMaxYMin slice'
				| 'defer xMinYMid slice'
				| 'defer xMidYMid slice'
				| 'defer xMaxYMid slice'
				| 'defer xMinYMax slice'
				| 'defer xMidYMax slice'
				| 'defer xMaxYMax slice';
			requiredExtensions: string;
			requiredFeatures: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			transform: string;
			'unicode-bidi': string;
			viewBox: string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {
			crossOrigin: string;
		};
		events: {};
	};
	line: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			requiredExtensions: string;
			requiredFeatures: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			transform: string;
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x1: number | string;
			x2: number | string;
			y1: number | string;
			y2: number | string;
		};
		properties: {};
		events: {};
	};
	linearGradient: {
		attributes: {
			class: string;
			externalResourcesRequired: 'true' | 'false';
			gradientTransform: string;
			gradientUnits: 'userSpaceOnUse' | 'objectBoundingBox';
			href: string;
			spreadMethod: 'pad' | 'reflect' | 'repeat';
			style: string;
			x1: number | string;
			x2: number | string;
			y1: number | string;
			y2: number | string;
		};
		properties: {};
		events: {};
	};
	marker: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			markerHeight: number | string;
			'marker-mid': string;
			'marker-start': string;
			markerUnits: 'strokeWidth' | 'userSpaceOnUse';
			markerWidth: number | string;
			mask: string;
			opacity: number | string | 'inherit';
			orient: string;
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			preserveAspectRatio:
				| 'none'
				| 'xMinYMin'
				| 'xMidYMin'
				| 'xMaxYMin'
				| 'xMinYMid'
				| 'xMidYMid'
				| 'xMaxYMid'
				| 'xMinYMax'
				| 'xMidYMax'
				| 'xMaxYMax'
				| 'xMinYMin meet'
				| 'xMidYMin meet'
				| 'xMaxYMin meet'
				| 'xMinYMid meet'
				| 'xMidYMid meet'
				| 'xMaxYMid meet'
				| 'xMinYMax meet'
				| 'xMidYMax meet'
				| 'xMaxYMax meet'
				| 'xMinYMin slice'
				| 'xMidYMin slice'
				| 'xMaxYMin slice'
				| 'xMinYMid slice'
				| 'xMidYMid slice'
				| 'xMaxYMid slice'
				| 'xMinYMax slice'
				| 'xMidYMax slice'
				| 'xMaxYMax slice';
			refX: number | string;
			refY: number | string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			viewBox: string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
		};
		properties: {};
		events: {};
	};
	mask: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			maskContentUnits: 'userSpaceOnUse' | 'objectBoundingBox';
			maskUnits: 'userSpaceOnUse' | 'objectBoundingBox';
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			requiredExtensions: string;
			requiredFeatures: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	metadata: {
		attributes: {};
		properties: {};
		events: {};
	};
	'missing-glyph': {
		attributes: {};
		properties: {};
		events: {};
	};
	mpath: {
		attributes: {};
		properties: {};
		events: {};
	};
	path: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			d: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: number | string;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			requiredExtensions: string;
			requiredFeatures: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			transform: string;
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
		};
		properties: {};
		events: {};
	};
	pattern: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			href: string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			patternContentUnits: 'userSpaceOnUse' | 'objectBoundingBox';
			patternTransform: string;
			patternUnits: 'userSpaceOnUse' | 'objectBoundingBox';
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			preserveAspectRatio:
				| 'none'
				| 'xMinYMin'
				| 'xMidYMin'
				| 'xMaxYMin'
				| 'xMinYMid'
				| 'xMidYMid'
				| 'xMaxYMid'
				| 'xMinYMax'
				| 'xMidYMax'
				| 'xMaxYMax'
				| 'xMinYMin meet'
				| 'xMidYMin meet'
				| 'xMaxYMin meet'
				| 'xMinYMid meet'
				| 'xMidYMid meet'
				| 'xMaxYMid meet'
				| 'xMinYMax meet'
				| 'xMidYMax meet'
				| 'xMaxYMax meet'
				| 'xMinYMin slice'
				| 'xMidYMin slice'
				| 'xMaxYMin slice'
				| 'xMinYMid slice'
				| 'xMidYMid slice'
				| 'xMaxYMid slice'
				| 'xMinYMax slice'
				| 'xMidYMax slice'
				| 'xMaxYMax slice';
			requiredExtensions: string;
			requiredFeatures: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			viewBox: string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	polygon: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			points: string;
			requiredExtensions: string;
			requiredFeatures: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			transform: string;
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
		};
		properties: {};
		events: {};
	};
	polyline: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			points: string;
			requiredExtensions: string;
			requiredFeatures: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			transform: string;
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
		};
		properties: {};
		events: {};
	};
	radialGradient: {
		attributes: {
			class: string;
			cx: number | string;
			cy: number | string;
			externalResourcesRequired: 'true' | 'false';
			fx: number | string;
			fy: number | string;
			gradientTransform: string;
			gradientUnits: 'userSpaceOnUse' | 'objectBoundingBox';
			href: string;
			r: number | string;
			spreadMethod: 'pad' | 'reflect' | 'repeat';
			style: string;
		};
		properties: {};
		events: {};
	};
	rect: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			requiredExtensions: string;
			requiredFeatures: string;
			rx: number | string;
			ry: number | string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			transform: string;
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	script: {
		attributes: {
			async: boolean;
			blocking: unknown;
			charset: unknown;
			charSet: string;
			crossorigin: string;
			defer: boolean;
			fetchPriority: unknown;
			integrity: string;
			nomodule: unknown;
			noModule: boolean;
			nonce: string;
			referrerpolicy: unknown;
			referrerPolicy:
				| ''
				| 'no-referrer'
				| 'no-referrer-when-downgrade'
				| 'origin'
				| 'origin-when-cross-origin'
				| 'same-origin'
				| 'strict-origin'
				| 'strict-origin-when-cross-origin'
				| 'unsafe-url';
			src: string;
			type: string;
		};
		properties: {
			crossOrigin: string;
		};
		events: {};
	};
	set: {
		attributes: {
			begin: string;
			class: string;
			dur: string;
			end: string;
			externalResourcesRequired: 'true' | 'false';
			fill: 'freeze' | 'remove';
			max: string;
			min: string;
			repeatCount: number | 'indefinite';
			repeatDur: string;
			requiredExtensions: string;
			requiredFeatures: string;
			restart: 'always' | 'whenNotActive' | 'never';
			style: string;
			systemLanguage: string;
		};
		properties: {};
		events: {};
	};
	stop: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			offset: number | string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
		};
		properties: {};
		events: {};
	};
	style: {
		attributes: {
			blocking: unknown;
			media: string;
			nonce: string;
			/** @deprecated */ scoped: boolean;
			title: string;
			/** @deprecated */ type: string;
		};
		properties: {
			disabled: boolean;
		};
		events: {};
	};
	svg: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			/** @deprecated */ baseProfile: string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			contentScriptType: string;
			contentStyleType: string;
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			preserveAspectRatio:
				| 'none'
				| 'xMinYMin'
				| 'xMidYMin'
				| 'xMaxYMin'
				| 'xMinYMid'
				| 'xMidYMid'
				| 'xMaxYMid'
				| 'xMinYMax'
				| 'xMidYMax'
				| 'xMaxYMax'
				| 'xMinYMin meet'
				| 'xMidYMin meet'
				| 'xMaxYMin meet'
				| 'xMinYMid meet'
				| 'xMidYMid meet'
				| 'xMaxYMid meet'
				| 'xMinYMax meet'
				| 'xMidYMax meet'
				| 'xMaxYMax meet'
				| 'xMinYMin slice'
				| 'xMidYMin slice'
				| 'xMaxYMin slice'
				| 'xMinYMid slice'
				| 'xMidYMid slice'
				| 'xMaxYMid slice'
				| 'xMinYMax slice'
				| 'xMidYMax slice'
				| 'xMaxYMax slice';
			requiredExtensions: string;
			requiredFeatures: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			/** @deprecated */ version: string;
			viewBox: string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			xmlns: string;
			'xmlns:xlink': string;
			y: number | string;
			/** @deprecated */ zoomAndPan: 'disable' | 'magnify';
		};
		properties: {
			currentScale: number;
		};
		events: {};
	};
	switch: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			requiredExtensions: string;
			requiredFeatures: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			transform: string;
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
		};
		properties: {};
		events: {};
	};
	symbol: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			preserveAspectRatio:
				| 'none'
				| 'xMinYMin'
				| 'xMidYMin'
				| 'xMaxYMin'
				| 'xMinYMid'
				| 'xMidYMid'
				| 'xMaxYMid'
				| 'xMinYMax'
				| 'xMidYMax'
				| 'xMaxYMax'
				| 'xMinYMin meet'
				| 'xMidYMin meet'
				| 'xMaxYMin meet'
				| 'xMinYMid meet'
				| 'xMidYMid meet'
				| 'xMaxYMid meet'
				| 'xMinYMax meet'
				| 'xMidYMax meet'
				| 'xMaxYMax meet'
				| 'xMinYMin slice'
				| 'xMidYMin slice'
				| 'xMaxYMin slice'
				| 'xMinYMid slice'
				| 'xMidYMid slice'
				| 'xMaxYMid slice'
				| 'xMinYMax slice'
				| 'xMidYMax slice'
				| 'xMaxYMax slice';
			refX: number | string;
			refY: number | string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			viewBox: string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	text: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			dx: number | string;
			dy: number | string;
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			lengthAdjust: 'spacing' | 'spacingAndGlyphs';
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			requiredExtensions: string;
			requiredFeatures: string;
			rotate: number | string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			textLength: number | string;
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			transform: string;
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	textPath: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			href: string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			method: 'align' | 'stretch';
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			requiredExtensions: string;
			requiredFeatures: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			spacing: 'auto' | 'exact';
			startOffset: number | string;
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
		};
		properties: {};
		events: {};
	};
	title: {
		attributes: {};
		properties: {};
		events: {};
	};
	tref: {
		attributes: {};
		properties: {};
		events: {};
	};
	tspan: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			dx: number | string;
			dy: number | string;
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			lengthAdjust: 'spacing' | 'spacingAndGlyphs';
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			requiredExtensions: string;
			requiredFeatures: string;
			rotate: number | string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			textLength: number | string;
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	use: {
		attributes: {
			'alignment-baseline':
				| 'auto'
				| 'baseline'
				| 'before-edge'
				| 'text-before-edge'
				| 'middle'
				| 'central'
				| 'after-edge'
				| 'text-after-edge'
				| 'ideographic'
				| 'alphabetic'
				| 'hanging'
				| 'mathematical'
				| 'inherit';
			'baseline-shift': number | string;
			class: string;
			clip: string;
			'clip-path': string;
			'clip-rule': 'nonzero' | 'evenodd' | 'inherit';
			color: string;
			'color-interpolation': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-interpolation-filters': 'auto' | 'sRGB' | 'linearRGB' | 'inherit';
			'color-profile': string;
			'color-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeQuality'
				| 'inherit';
			cursor: string;
			direction: 'ltr' | 'rtl' | 'inherit';
			display: string;
			'dominant-baseline':
				| 'auto'
				| 'text-bottom'
				| 'alphabetic'
				| 'ideographic'
				| 'middle'
				| 'central'
				| 'mathematical'
				| 'hanging'
				| 'text-top'
				| 'inherit';
			'enable-background': string;
			externalResourcesRequired: 'true' | 'false';
			fill: string;
			'fill-opacity': number | string | 'inherit';
			'fill-rule': 'nonzero' | 'evenodd' | 'inherit';
			filter: string;
			'flood-color': string;
			'flood-opacity': number | string | 'inherit';
			'font-family': string;
			'font-size': string;
			'font-size-adjust': number | string;
			'font-stretch': string;
			'font-style': 'normal' | 'italic' | 'oblique' | 'inherit';
			'font-variant': string;
			'font-weight': number | string;
			'glyph-orientation-horizontal': string;
			'glyph-orientation-vertical': string;
			height: number | string;
			href: string;
			'image-rendering':
				| 'auto'
				| 'optimizeQuality'
				| 'optimizeSpeed'
				| 'inherit';
			kerning: string;
			'letter-spacing': number | string;
			'lighting-color': string;
			'marker-end': string;
			'marker-mid': string;
			'marker-start': string;
			mask: string;
			opacity: number | string | 'inherit';
			overflow: 'visible' | 'hidden' | 'scroll' | 'auto' | 'inherit';
			pathLength: string | number;
			'pointer-events':
				| 'bounding-box'
				| 'visiblePainted'
				| 'visibleFill'
				| 'visibleStroke'
				| 'visible'
				| 'painted'
				| 'color'
				| 'fill'
				| 'stroke'
				| 'all'
				| 'none'
				| 'inherit';
			requiredExtensions: string;
			requiredFeatures: string;
			'shape-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'crispEdges'
				| 'geometricPrecision'
				| 'inherit';
			'stop-color': string;
			'stop-opacity': number | string | 'inherit';
			stroke: string;
			'stroke-dasharray': string;
			'stroke-dashoffset': number | string;
			'stroke-linecap': 'butt' | 'round' | 'square' | 'inherit';
			'stroke-linejoin':
				| 'arcs'
				| 'bevel'
				| 'miter'
				| 'miter-clip'
				| 'round'
				| 'inherit';
			'stroke-miterlimit': number | string | 'inherit';
			'stroke-opacity': number | string | 'inherit';
			'stroke-width': number | string;
			style: string;
			systemLanguage: string;
			'text-anchor': 'start' | 'middle' | 'end' | 'inherit';
			'text-decoration':
				| 'none'
				| 'underline'
				| 'overline'
				| 'line-through'
				| 'blink'
				| 'inherit';
			'text-rendering':
				| 'auto'
				| 'optimizeSpeed'
				| 'optimizeLegibility'
				| 'geometricPrecision'
				| 'inherit';
			transform: string;
			'unicode-bidi': string;
			visibility: 'visible' | 'hidden' | 'collapse' | 'inherit';
			width: number | string;
			'word-spacing': number | string;
			'writing-mode':
				| 'lr-tb'
				| 'rl-tb'
				| 'tb-rl'
				| 'lr'
				| 'rl'
				| 'tb'
				| 'inherit';
			x: number | string;
			y: number | string;
		};
		properties: {};
		events: {};
	};
	view: {
		attributes: {
			externalResourcesRequired: 'true' | 'false';
			preserveAspectRatio:
				| 'none'
				| 'xMinYMin'
				| 'xMidYMin'
				| 'xMaxYMin'
				| 'xMinYMid'
				| 'xMidYMid'
				| 'xMaxYMid'
				| 'xMinYMax'
				| 'xMidYMax'
				| 'xMaxYMax'
				| 'xMinYMin meet'
				| 'xMidYMin meet'
				| 'xMaxYMin meet'
				| 'xMinYMid meet'
				| 'xMidYMid meet'
				| 'xMaxYMid meet'
				| 'xMinYMax meet'
				| 'xMidYMax meet'
				| 'xMaxYMax meet'
				| 'xMinYMin slice'
				| 'xMidYMin slice'
				| 'xMaxYMin slice'
				| 'xMinYMid slice'
				| 'xMidYMid slice'
				| 'xMaxYMid slice'
				| 'xMinYMax slice'
				| 'xMidYMax slice'
				| 'xMaxYMax slice';
			viewBox: string;
			viewTarget: string;
			/** @deprecated */ zoomAndPan: 'disable' | 'magnify';
		};
		properties: {};
		events: {};
	};
	vkern: {
		attributes: {};
		properties: {};
		events: {};
	};
}
interface BaseElement {
	attributes: {
		'aria-atomic': boolean | 'false' | 'true';
		'aria-autocomplete': 'none' | 'inline' | 'list' | 'both';
		'aria-braillelabel': string;
		'aria-brailleroledescription': string;
		'aria-busy': boolean | 'false' | 'true';
		'aria-checked': boolean | 'false' | 'mixed' | 'true';
		'aria-colcount': number | string;
		'aria-colindex': number | string;
		'aria-colindextext': number | string;
		'aria-colspan': number | string;
		'aria-current':
			| boolean
			| 'false'
			| 'true'
			| 'page'
			| 'step'
			| 'location'
			| 'date'
			| 'time';
		'aria-description': string;
		'aria-disabled': boolean | 'false' | 'true';
		'aria-expanded': boolean | 'false' | 'true';
		'aria-haspopup':
			| boolean
			| 'false'
			| 'true'
			| 'menu'
			| 'listbox'
			| 'tree'
			| 'grid'
			| 'dialog';
		'aria-hidden': boolean | 'false' | 'true';
		'aria-invalid': boolean | 'false' | 'true' | 'grammar' | 'spelling';
		'aria-keyshortcuts': string;
		'aria-label': string;
		'aria-level': number | string;
		'aria-live': 'off' | 'assertive' | 'polite';
		'aria-modal': boolean | 'false' | 'true';
		'aria-multiline': boolean | 'false' | 'true';
		'aria-multiselectable': boolean | 'false' | 'true';
		'aria-orientation': 'horizontal' | 'vertical';
		'aria-placeholder': string;
		'aria-posinset': number | string;
		'aria-pressed': boolean | 'false' | 'mixed' | 'true';
		'aria-readonly': boolean | 'false' | 'true';
		'aria-relevant':
			| 'additions'
			| 'additions removals'
			| 'additions text'
			| 'all'
			| 'removals'
			| 'removals additions'
			| 'removals text'
			| 'text'
			| 'text additions'
			| 'text removals';
		'aria-required': boolean | 'false' | 'true';
		'aria-roledescription': string;
		'aria-rowcount': number | string;
		'aria-rowindex': number | string;
		'aria-rowindextext': number | string;
		'aria-rowspan': number | string;
		'aria-selected': boolean | 'false' | 'true';
		'aria-setsize': number | string;
		'aria-sort': 'none' | 'ascending' | 'descending' | 'other';
		'aria-valuemax': number | string;
		'aria-valuemin': number | string;
		'aria-valuenow': number | string;
		'aria-valuetext': string;
		class: string;
		elementtiming: string;
		id: string;
		part: string;
		role:
			| 'alert'
			| 'alertdialog'
			| 'application'
			| 'article'
			| 'banner'
			| 'button'
			| 'cell'
			| 'checkbox'
			| 'columnheader'
			| 'combobox'
			| 'complementary'
			| 'contentinfo'
			| 'definition'
			| 'dialog'
			| 'directory'
			| 'document'
			| 'feed'
			| 'figure'
			| 'form'
			| 'grid'
			| 'gridcell'
			| 'group'
			| 'heading'
			| 'img'
			| 'link'
			| 'list'
			| 'listbox'
			| 'listitem'
			| 'log'
			| 'main'
			| 'marquee'
			| 'math'
			| 'menu'
			| 'menubar'
			| 'menuitem'
			| 'menuitemcheckbox'
			| 'menuitemradio'
			| 'meter'
			| 'navigation'
			| 'none'
			| 'note'
			| 'option'
			| 'presentation'
			| 'progressbar'
			| 'radio'
			| 'radiogroup'
			| 'region'
			| 'row'
			| 'rowgroup'
			| 'rowheader'
			| 'scrollbar'
			| 'search'
			| 'searchbox'
			| 'separator'
			| 'slider'
			| 'spinbutton'
			| 'status'
			| 'switch'
			| 'tab'
			| 'table'
			| 'tablist'
			| 'tabpanel'
			| 'term'
			| 'textbox'
			| 'timer'
			| 'toolbar'
			| 'tooltip'
			| 'tree'
			| 'treegrid'
			| 'treeitem';
		slot: string;
	};
	properties: {
		ariaActiveDescendantElement: Element;
		ariaAtomic: boolean | 'true' | 'false';
		ariaAutoComplete: 'none' | 'inline' | 'list' | 'both';
		ariaBrailleLabel: string;
		ariaBrailleRoleDescription: string;
		ariaBusy: boolean | 'true' | 'false';
		ariaChecked: boolean | 'false' | 'mixed' | 'true';
		ariaColCount: number;
		ariaColIndex: number;
		ariaColIndexText: number | string;
		ariaColSpan: number;
		ariaCurrent:
			| boolean
			| 'false'
			| 'true'
			| 'page'
			| 'step'
			| 'location'
			| 'date'
			| 'time';
		ariaDescription: string;
		ariaDisabled: boolean | 'true' | 'false';
		ariaExpanded: boolean | 'true' | 'false';
		ariaHasPopup:
			| boolean
			| 'false'
			| 'true'
			| 'menu'
			| 'listbox'
			| 'tree'
			| 'grid'
			| 'dialog';
		ariaHidden: boolean | 'true' | 'false';
		ariaInvalid: boolean | 'false' | 'true' | 'grammar' | 'spelling';
		ariaKeyShortcuts: string;
		ariaLabel: string;
		ariaLevel: number;
		ariaLive: 'off' | 'assertive' | 'polite';
		ariaModal: boolean | 'true' | 'false';
		ariaMultiLine: boolean | 'true' | 'false';
		ariaMultiSelectable: boolean | 'true' | 'false';
		ariaOrientation: 'horizontal' | 'vertical';
		ariaPlaceholder: string;
		ariaPosInSet: number;
		ariaPressed: boolean | 'false' | 'mixed' | 'true';
		ariaReadOnly: boolean | 'true' | 'false';
		ariaRelevant:
			| 'additions'
			| 'additions removals'
			| 'additions text'
			| 'all'
			| 'removals'
			| 'removals additions'
			| 'removals text'
			| 'text'
			| 'text additions'
			| 'text removals';
		ariaRequired: boolean | 'true' | 'false';
		ariaRoleDescription: string;
		ariaRowCount: number;
		ariaRowIndex: number;
		ariaRowIndexText: number | string;
		ariaRowSpan: number;
		ariaSelected: boolean | 'true' | 'false';
		ariaSetSize: number;
		ariaSort: 'none' | 'ascending' | 'descending' | 'other';
		ariaValueMax: number;
		ariaValueMin: number;
		ariaValueNow: number;
		ariaValueText: string;
		classList: string;
		className: string;
		elementTiming: string;
		id: string;
		innerHTML: string;
		outerHTML: string;
		part: string;
		role:
			| 'alert'
			| 'alertdialog'
			| 'application'
			| 'article'
			| 'banner'
			| 'button'
			| 'cell'
			| 'checkbox'
			| 'columnheader'
			| 'combobox'
			| 'complementary'
			| 'contentinfo'
			| 'definition'
			| 'dialog'
			| 'directory'
			| 'document'
			| 'feed'
			| 'figure'
			| 'form'
			| 'grid'
			| 'gridcell'
			| 'group'
			| 'heading'
			| 'img'
			| 'link'
			| 'list'
			| 'listbox'
			| 'listitem'
			| 'log'
			| 'main'
			| 'marquee'
			| 'math'
			| 'menu'
			| 'menubar'
			| 'menuitem'
			| 'menuitemcheckbox'
			| 'menuitemradio'
			| 'meter'
			| 'navigation'
			| 'none'
			| 'note'
			| 'option'
			| 'presentation'
			| 'progressbar'
			| 'radio'
			| 'radiogroup'
			| 'region'
			| 'row'
			| 'rowgroup'
			| 'rowheader'
			| 'scrollbar'
			| 'search'
			| 'searchbox'
			| 'separator'
			| 'slider'
			| 'spinbutton'
			| 'status'
			| 'switch'
			| 'tab'
			| 'table'
			| 'tablist'
			| 'tabpanel'
			| 'term'
			| 'textbox'
			| 'timer'
			| 'toolbar'
			| 'tooltip'
			| 'tree'
			| 'treegrid'
			| 'treeitem';
		scrollLeft: number;
		scrollTop: number;
		slot: string;
	};
	events: {
		abort: UIEvent;
		animationcancel: AnimationEvent;
		animationend: AnimationEvent;
		animationiteration: AnimationEvent;
		animationstart: AnimationEvent;
		auxclick: PointerEvent;
		beforeinput: InputEvent;
		beforematch: Event;
		beforetoggle: ToggleEvent;
		beforexrselect: Event;
		blur: FocusEvent;
		cancel: Event;
		canplay: Event;
		canplaythrough: Event;
		change: Event;
		click: PointerEvent;
		close: Event;
		command: CommandEvent;
		compositionend: CompositionEvent;
		compositionstart: CompositionEvent;
		compositionupdate: CompositionEvent;
		contentvisibilityautostatechange: ContentVisibilityAutoStateChangeEvent;
		contextlost: Event;
		contextmenu: PointerEvent;
		contextrestored: Event;
		copy: ClipboardEvent;
		cuechange: Event;
		cut: ClipboardEvent;
		dblclick: MouseEvent;
		drag: DragEvent;
		dragend: DragEvent;
		dragenter: DragEvent;
		dragexit: DragEvent;
		dragleave: DragEvent;
		dragover: DragEvent;
		dragstart: DragEvent;
		drop: DragEvent;
		durationchange: Event;
		emptied: Event;
		ended: Event;
		error: ErrorEvent;
		focus: FocusEvent;
		focusin: FocusEvent;
		focusout: FocusEvent;
		formdata: FormDataEvent;
		fullscreenchange: Event;
		fullscreenerror: Event;
		gotpointercapture: PointerEvent;
		input: InputEvent;
		invalid: Event;
		keydown: KeyboardEvent;
		keypress: KeyboardEvent;
		keyup: KeyboardEvent;
		load: Event;
		loadeddata: Event;
		loadedmetadata: Event;
		loadstart: Event;
		lostpointercapture: PointerEvent;
		mousedown: MouseEvent;
		mouseenter: MouseEvent;
		mouseleave: MouseEvent;
		mousemove: MouseEvent;
		mouseout: MouseEvent;
		mouseover: MouseEvent;
		mouseup: MouseEvent;
		paste: ClipboardEvent;
		pause: Event;
		play: Event;
		playing: Event;
		pointercancel: PointerEvent;
		pointerdown: PointerEvent;
		pointerenter: PointerEvent;
		pointerleave: PointerEvent;
		pointermove: PointerEvent;
		pointerout: PointerEvent;
		pointerover: PointerEvent;
		pointerrawupdate: Event;
		pointerup: PointerEvent;
		progress: ProgressEvent;
		ratechange: Event;
		reset: Event;
		resize: UIEvent;
		scroll: Event;
		scrollend: Event;
		scrollsnapchange: SnapEvent;
		scrollsnapchanging: SnapEvent;
		securitypolicyviolation: SecurityPolicyViolationEvent;
		seeked: Event;
		seeking: Event;
		select: Event;
		selectionchange: Event;
		selectstart: Event;
		slotchange: Event;
		stalled: Event;
		submit: SubmitEvent;
		suspend: Event;
		timeupdate: Event;
		toggle: ToggleEvent;
		touchcancel: TouchEvent;
		touchend: TouchEvent;
		touchmove: TouchEvent;
		touchstart: TouchEvent;
		transitioncancel: TransitionEvent;
		transitionend: TransitionEvent;
		transitionrun: TransitionEvent;
		transitionstart: TransitionEvent;
		volumechange: Event;
		waiting: Event;
		wheel: WheelEvent;
	};
}
interface BaseHTMLElement {
	attributes: {
		accesskey: string;
		autocapitalize:
			| 'off'
			| 'none'
			| 'on'
			| 'sentences'
			| 'words'
			| 'characters';
		autocorrect: 'on' | 'off';
		autofocus: boolean;
		contenteditable: 'true' | 'false' | boolean | 'plaintext-only' | 'inherit';
		dir: 'ltr' | 'rtl' | 'auto';
		draggable: boolean | 'false' | 'true';
		enterkeyhint:
			| 'enter'
			| 'done'
			| 'go'
			| 'next'
			| 'previous'
			| 'search'
			| 'send';
		hidden: boolean | 'hidden' | 'until-found';
		inert: boolean;
		inputmode:
			| 'decimal'
			| 'email'
			| 'none'
			| 'numeric'
			| 'search'
			| 'tel'
			| 'text'
			| 'url';
		lang: string;
		popover: boolean | 'manual' | 'auto';
		spellcheck: 'true' | 'false' | boolean;
		style: string;
		tabindex: number | string;
		title: string;
		translate: 'yes' | 'no';
		virtualkeyboardpolicy: string;
		writingsuggestions: string;
	};
	properties: {
		accessKey: string;
		autocapitalize:
			| 'off'
			| 'none'
			| 'on'
			| 'sentences'
			| 'words'
			| 'characters';
		autocorrect: 'on' | 'off';
		autofocus: boolean;
		contentEditable: boolean | 'plaintext-only' | 'inherit';
		dir: 'ltr' | 'rtl' | 'auto';
		draggable: boolean | 'false' | 'true';
		editContext: EditContext;
		enterKeyHint: string;
		hidden: boolean | 'hidden' | 'until-found';
		inert: boolean;
		innerText: string | number;
		inputMode:
			| 'none'
			| 'text'
			| 'tel'
			| 'url'
			| 'email'
			| 'numeric'
			| 'decimal'
			| 'search';
		lang: string;
		nonce: string;
		outerText: string;
		popover: boolean | 'manual' | 'auto';
		spellcheck: 'true' | 'false' | boolean;
		style: string;
		tabIndex: number | string;
		title: string;
		translate: 'yes' | 'no';
		virtualKeyboardPolicy: string;
		writingSuggestions: string;
	};
	events: {};
}
interface BaseSVGElement {
	attributes: {
		autofocus: boolean;
		id: string;
		style: string;
		tabindex: number | string;
	};
	properties: {
		autofocus: boolean;
		id: string;
		nonce: string;
		style: string;
		tabIndex: number | string;
	};
	events: {};
}
export type {
	BaseElement,
	BaseHTMLElement,
	BaseHTMLElements,
	BaseSVGElement,
	BaseSVGElements,
};
