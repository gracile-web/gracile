import express from 'express';
import { Writable } from 'node:stream';
import require$$0$6 from 'tty';
import { html as html$1, render } from '@lit-labs/ssr';
import { collectResult } from '@lit-labs/ssr/lib/render-result.js';
import require$$0$1, { Readable } from 'stream';
import 'fast-glob';
import require$$0$5 from 'fs';
import require$$1$2 from 'url';
import require$$0$3 from 'http';
import require$$0$2 from 'util';
import require$$1$1 from 'https';
import require$$3 from 'zlib';
import require$$1 from 'buffer';
import require$$2 from 'crypto';
import require$$0$4 from 'querystring';
import require$$3$1 from 'stream/web';
import { join } from 'path';

function _mergeNamespaces(n, m) {
    for (var i = 0; i < m.length; i++) {
        const e = m[i];
        if (typeof e !== 'string' && !Array.isArray(e)) { for (const k in e) {
            if (k !== 'default' && !(k in n)) {
                const d = Object.getOwnPropertyDescriptor(e, k);
                if (d) {
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: () => e[k]
                    });
                }
            }
        } }
    }
    return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: 'Module' }));
}

let cwd = process.env['__GRACILE_PROJECT_CWD'] || process.cwd();
function setCurrentWorkingDirectory(root) {
    if (root && root !== cwd) {
        cwd = root;
    }
    process.env['__GRACILE_PROJECT_CWD'] = cwd;
    return cwd;
}

const routeImports = new Map();

routeImports.set('/', () => import('./chunk/(home).js'));
routeImports.set('/about/', () => import('./chunk/about.js'));
routeImports.set('/{:test}/', () => import('./chunk/_test_.js'));

const routes$1 = new Map([
  [
    "/",
    {
      "filePath": "src/routes/(home).ts",
      "pattern": {},
      "hasParams": false,
      "pageAssets": [
        "src/routes/(home).client.ts",
        "src/routes/(home).css"
      ],
      "prerender": null
    }
  ],
  [
    "/about/",
    {
      "filePath": "src/routes/about.ts",
      "pattern": {},
      "hasParams": false,
      "pageAssets": [],
      "prerender": null
    }
  ],
  [
    "/{:test}/",
    {
      "filePath": "src/routes/[test].ts",
      "pattern": {},
      "hasParams": true,
      "pageAssets": [],
      "prerender": null
    }
  ]
]);

const routeAssets = new Map();


routeAssets.set('/about/', "\t<script type=\"module\" crossorigin src=\"/assets/document.client-Cu8CxlfV.js\"></script>\n\n\t<link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n");


routeAssets.set('/{:test}/', "\t<script type=\"module\" crossorigin src=\"/assets/document.client-Cu8CxlfV.js\"></script>\n\n\t<link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n");


routeAssets.set('/', "\t<script type=\"module\" crossorigin src=\"/assets/index-DyfSbze4.js\"></script>\n\n\t<link rel=\"modulepreload\" crossorigin href=\"/assets/document.client-Cu8CxlfV.js\">\n\n\t<link rel=\"stylesheet\" crossorigin href=\"/assets/document-aADsc6DG.css\">\n\n\t<link rel=\"stylesheet\" crossorigin href=\"/assets/index-C17FHxsp.css\">\n");

/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck TODO: Implement stubs
const logger = {
    info(msg, options) {
        // throw new Error('Function not implemented.');
    },
    warn(msg, options) {
        // throw new Error('Function not implemented.');
    },
    warnOnce(msg, options) {
        // throw new Error('Function not implemented.');
    },
    error(msg, options) {
        // throw new Error('Function not implemented.');
    },
    clearScreen(type) {
        // throw new Error('Function not implemented.');
    },
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    hasErrorLogged(error) {
        // throw new Error('Function not implemented.');
    },
    hasWarned: false,
};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getAugmentedNamespace(n) {
  if (n.__esModule) return n;
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
			if (this instanceof a) {
        return Reflect.construct(f, arguments, this.constructor);
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}

function commonjsRequire(path) {
	throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}

var nodePonyfill = {};

function isNextJs() {
  return Object.keys(globalThis).some(key => key.startsWith('__NEXT'))
}

var shouldSkipPonyfill$2 = function shouldSkipPonyfill() {
  // Bun and Deno already have a Fetch API
  if (globalThis.Deno) {
    return true
  }
  if (process.versions.bun) {
    return true
  }
  if (isNextJs()) {
    return true
  }
  return false
};

var urlpattern;
var hasRequiredUrlpattern;

function requireUrlpattern () {
	if (hasRequiredUrlpattern) return urlpattern;
	hasRequiredUrlpattern = 1;
var M=Object.defineProperty;var Pe=Object.getOwnPropertyDescriptor;var Re=Object.getOwnPropertyNames;var Ee=Object.prototype.hasOwnProperty;var Oe=(e,t)=>{for(var r in t)M(e,r,{get:t[r],enumerable:!0});},ke=(e,t,r,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of Re(t))!Ee.call(e,a)&&a!==r&&M(e,a,{get:()=>t[a],enumerable:!(n=Pe(t,a))||n.enumerable});return e};var Te=e=>ke(M({},"__esModule",{value:!0}),e);var Ne={};Oe(Ne,{URLPattern:()=>Y});urlpattern=Te(Ne);var R=class{type=3;name="";prefix="";value="";suffix="";modifier=3;constructor(t,r,n,a,c,l){this.type=t,this.name=r,this.prefix=n,this.value=a,this.suffix=c,this.modifier=l;}hasCustomName(){return this.name!==""&&typeof this.name!="number"}},Ae=/[$_\p{ID_Start}]/u,ye=/[$_\u200C\u200D\p{ID_Continue}]/u,v=".*";function we(e,t){return (/^[\x00-\x7F]*$/).test(e)}function D(e,t=!1){let r=[],n=0;for(;n<e.length;){let a=e[n],c=function(l){if(!t)throw new TypeError(l);r.push({type:"INVALID_CHAR",index:n,value:e[n++]});};if(a==="*"){r.push({type:"ASTERISK",index:n,value:e[n++]});continue}if(a==="+"||a==="?"){r.push({type:"OTHER_MODIFIER",index:n,value:e[n++]});continue}if(a==="\\"){r.push({type:"ESCAPED_CHAR",index:n++,value:e[n++]});continue}if(a==="{"){r.push({type:"OPEN",index:n,value:e[n++]});continue}if(a==="}"){r.push({type:"CLOSE",index:n,value:e[n++]});continue}if(a===":"){let l="",s=n+1;for(;s<e.length;){let i=e.substr(s,1);if(s===n+1&&Ae.test(i)||s!==n+1&&ye.test(i)){l+=e[s++];continue}break}if(!l){c(`Missing parameter name at ${n}`);continue}r.push({type:"NAME",index:n,value:l}),n=s;continue}if(a==="("){let l=1,s="",i=n+1,o=!1;if(e[i]==="?"){c(`Pattern cannot start with "?" at ${i}`);continue}for(;i<e.length;){if(!we(e[i])){c(`Invalid character '${e[i]}' at ${i}.`),o=!0;break}if(e[i]==="\\"){s+=e[i++]+e[i++];continue}if(e[i]===")"){if(l--,l===0){i++;break}}else if(e[i]==="("&&(l++,e[i+1]!=="?")){c(`Capturing groups are not allowed at ${i}`),o=!0;break}s+=e[i++];}if(o)continue;if(l){c(`Unbalanced pattern at ${n}`);continue}if(!s){c(`Missing pattern at ${n}`);continue}r.push({type:"REGEX",index:n,value:s}),n=i;continue}r.push({type:"CHAR",index:n,value:e[n++]});}return r.push({type:"END",index:n,value:""}),r}function F(e,t={}){let r=D(e);t.delimiter??="/#?",t.prefixes??="./";let n=`[^${S(t.delimiter)}]+?`,a=[],c=0,l=0,i=new Set,o=h=>{if(l<r.length&&r[l].type===h)return r[l++].value},f=()=>o("OTHER_MODIFIER")??o("ASTERISK"),d=h=>{let u=o(h);if(u!==void 0)return u;let{type:p,index:A}=r[l];throw new TypeError(`Unexpected ${p} at ${A}, expected ${h}`)},T=()=>{let h="",u;for(;u=o("CHAR")??o("ESCAPED_CHAR");)h+=u;return h},xe=h=>h,L=t.encodePart||xe,I="",U=h=>{I+=h;},$=()=>{I.length&&(a.push(new R(3,"","",L(I),"",3)),I="");},X=(h,u,p,A,Z)=>{let g=3;switch(Z){case"?":g=1;break;case"*":g=0;break;case"+":g=2;break}if(!u&&!p&&g===3){U(h);return}if($(),!u&&!p){if(!h)return;a.push(new R(3,"","",L(h),"",g));return}let m;p?p==="*"?m=v:m=p:m=n;let O=2;m===n?(O=1,m=""):m===v&&(O=0,m="");let P;if(u?P=u:p&&(P=c++),i.has(P))throw new TypeError(`Duplicate name '${P}'.`);i.add(P),a.push(new R(O,P,L(h),m,L(A),g));};for(;l<r.length;){let h=o("CHAR"),u=o("NAME"),p=o("REGEX");if(!u&&!p&&(p=o("ASTERISK")),u||p){let g=h??"";t.prefixes.indexOf(g)===-1&&(U(g),g=""),$();let m=f();X(g,u,p,"",m);continue}let A=h??o("ESCAPED_CHAR");if(A){U(A);continue}if(o("OPEN")){let g=T(),m=o("NAME"),O=o("REGEX");!m&&!O&&(O=o("ASTERISK"));let P=T();d("CLOSE");let be=f();X(g,m,O,P,be);continue}$(),d("END");}return a}function S(e){return e.replace(/([.+*?^${}()[\]|/\\])/g,"\\$1")}function B(e){return e&&e.ignoreCase?"ui":"u"}function q(e,t,r){return W(F(e,r),t,r)}function k(e){switch(e){case 0:return "*";case 1:return "?";case 2:return "+";case 3:return ""}}function W(e,t,r={}){r.delimiter??="/#?",r.prefixes??="./",r.sensitive??=!1,r.strict??=!1,r.end??=!0,r.start??=!0,r.endsWith="";let n=r.start?"^":"";for(let s of e){if(s.type===3){s.modifier===3?n+=S(s.value):n+=`(?:${S(s.value)})${k(s.modifier)}`;continue}t&&t.push(s.name);let i=`[^${S(r.delimiter)}]+?`,o=s.value;if(s.type===1?o=i:s.type===0&&(o=v),!s.prefix.length&&!s.suffix.length){s.modifier===3||s.modifier===1?n+=`(${o})${k(s.modifier)}`:n+=`((?:${o})${k(s.modifier)})`;continue}if(s.modifier===3||s.modifier===1){n+=`(?:${S(s.prefix)}(${o})${S(s.suffix)})`,n+=k(s.modifier);continue}n+=`(?:${S(s.prefix)}`,n+=`((?:${o})(?:`,n+=S(s.suffix),n+=S(s.prefix),n+=`(?:${o}))*)${S(s.suffix)})`,s.modifier===0&&(n+="?");}let a=`[${S(r.endsWith)}]|$`,c=`[${S(r.delimiter)}]`;if(r.end)return r.strict||(n+=`${c}?`),r.endsWith.length?n+=`(?=${a})`:n+="$",new RegExp(n,B(r));r.strict||(n+=`(?:${c}(?=${a}))?`);let l=!1;if(e.length){let s=e[e.length-1];s.type===3&&s.modifier===3&&(l=r.delimiter.indexOf(s)>-1);}return l||(n+=`(?=${c}|${a})`),new RegExp(n,B(r))}var x={delimiter:"",prefixes:"",sensitive:!0,strict:!0},J={delimiter:".",prefixes:"",sensitive:!0,strict:!0},Q={delimiter:"/",prefixes:"/",sensitive:!0,strict:!0};function ee(e,t){return e.length?e[0]==="/"?!0:!t||e.length<2?!1:(e[0]=="\\"||e[0]=="{")&&e[1]=="/":!1}function te(e,t){return e.startsWith(t)?e.substring(t.length,e.length):e}function Ce(e,t){return e.endsWith(t)?e.substr(0,e.length-t.length):e}function _(e){return !e||e.length<2?!1:e[0]==="["||(e[0]==="\\"||e[0]==="{")&&e[1]==="["}var re=["ftp","file","http","https","ws","wss"];function N(e){if(!e)return !0;for(let t of re)if(e.test(t))return !0;return !1}function ne(e,t){if(e=te(e,"#"),t||e==="")return e;let r=new URL("https://example.com");return r.hash=e,r.hash?r.hash.substring(1,r.hash.length):""}function se(e,t){if(e=te(e,"?"),t||e==="")return e;let r=new URL("https://example.com");return r.search=e,r.search?r.search.substring(1,r.search.length):""}function ie(e,t){return t||e===""?e:_(e)?K(e):j(e)}function ae(e,t){if(t||e==="")return e;let r=new URL("https://example.com");return r.password=e,r.password}function oe(e,t){if(t||e==="")return e;let r=new URL("https://example.com");return r.username=e,r.username}function ce(e,t,r){if(r||e==="")return e;if(t&&!re.includes(t))return new URL(`${t}:${e}`).pathname;let n=e[0]=="/";return e=new URL(n?e:"/-"+e,"https://example.com").pathname,n||(e=e.substring(2,e.length)),e}function le(e,t,r){return z(t)===e&&(e=""),r||e===""?e:G(e)}function fe(e,t){return e=Ce(e,":"),t||e===""?e:y(e)}function z(e){switch(e){case"ws":case"http":return "80";case"wws":case"https":return "443";case"ftp":return "21";default:return ""}}function y(e){if(e==="")return e;if(/^[-+.A-Za-z0-9]*$/.test(e))return e.toLowerCase();throw new TypeError(`Invalid protocol '${e}'.`)}function he(e){if(e==="")return e;let t=new URL("https://example.com");return t.username=e,t.username}function ue(e){if(e==="")return e;let t=new URL("https://example.com");return t.password=e,t.password}function j(e){if(e==="")return e;if(/[\t\n\r #%/:<>?@[\]^\\|]/g.test(e))throw new TypeError(`Invalid hostname '${e}'`);let t=new URL("https://example.com");return t.hostname=e,t.hostname}function K(e){if(e==="")return e;if(/[^0-9a-fA-F[\]:]/g.test(e))throw new TypeError(`Invalid IPv6 hostname '${e}'`);return e.toLowerCase()}function G(e){if(e===""||/^[0-9]*$/.test(e)&&parseInt(e)<=65535)return e;throw new TypeError(`Invalid port '${e}'.`)}function de(e){if(e==="")return e;let t=new URL("https://example.com");return t.pathname=e[0]!=="/"?"/-"+e:e,e[0]!=="/"?t.pathname.substring(2,t.pathname.length):t.pathname}function pe(e){return e===""?e:new URL(`data:${e}`).pathname}function ge(e){if(e==="")return e;let t=new URL("https://example.com");return t.search=e,t.search.substring(1,t.search.length)}function me(e){if(e==="")return e;let t=new URL("https://example.com");return t.hash=e,t.hash.substring(1,t.hash.length)}var H=class{#i;#n=[];#t={};#e=0;#s=1;#l=0;#o=0;#d=0;#p=0;#g=!1;constructor(t){this.#i=t;}get result(){return this.#t}parse(){for(this.#n=D(this.#i,!0);this.#e<this.#n.length;this.#e+=this.#s){if(this.#s=1,this.#n[this.#e].type==="END"){if(this.#o===0){this.#b(),this.#f()?this.#r(9,1):this.#h()?this.#r(8,1):this.#r(7,0);continue}else if(this.#o===2){this.#u(5);continue}this.#r(10,0);break}if(this.#d>0)if(this.#A())this.#d-=1;else continue;if(this.#T()){this.#d+=1;continue}switch(this.#o){case 0:this.#P()&&this.#u(1);break;case 1:if(this.#P()){this.#C();let t=7,r=1;this.#E()?(t=2,r=3):this.#g&&(t=2),this.#r(t,r);}break;case 2:this.#S()?this.#u(3):(this.#x()||this.#h()||this.#f())&&this.#u(5);break;case 3:this.#O()?this.#r(4,1):this.#S()&&this.#r(5,1);break;case 4:this.#S()&&this.#r(5,1);break;case 5:this.#y()?this.#p+=1:this.#w()&&(this.#p-=1),this.#k()&&!this.#p?this.#r(6,1):this.#x()?this.#r(7,0):this.#h()?this.#r(8,1):this.#f()&&this.#r(9,1);break;case 6:this.#x()?this.#r(7,0):this.#h()?this.#r(8,1):this.#f()&&this.#r(9,1);break;case 7:this.#h()?this.#r(8,1):this.#f()&&this.#r(9,1);break;case 8:this.#f()&&this.#r(9,1);break;}}this.#t.hostname!==void 0&&this.#t.port===void 0&&(this.#t.port="");}#r(t,r){switch(this.#o){case 0:break;case 1:this.#t.protocol=this.#c();break;case 2:break;case 3:this.#t.username=this.#c();break;case 4:this.#t.password=this.#c();break;case 5:this.#t.hostname=this.#c();break;case 6:this.#t.port=this.#c();break;case 7:this.#t.pathname=this.#c();break;case 8:this.#t.search=this.#c();break;case 9:this.#t.hash=this.#c();break;}this.#o!==0&&t!==10&&([1,2,3,4].includes(this.#o)&&[6,7,8,9].includes(t)&&(this.#t.hostname??=""),[1,2,3,4,5,6].includes(this.#o)&&[8,9].includes(t)&&(this.#t.pathname??=this.#g?"/":""),[1,2,3,4,5,6,7].includes(this.#o)&&t===9&&(this.#t.search??="")),this.#R(t,r);}#R(t,r){this.#o=t,this.#l=this.#e+r,this.#e+=r,this.#s=0;}#b(){this.#e=this.#l,this.#s=0;}#u(t){this.#b(),this.#o=t;}#m(t){return t<0&&(t=this.#n.length-t),t<this.#n.length?this.#n[t]:this.#n[this.#n.length-1]}#a(t,r){let n=this.#m(t);return n.value===r&&(n.type==="CHAR"||n.type==="ESCAPED_CHAR"||n.type==="INVALID_CHAR")}#P(){return this.#a(this.#e,":")}#E(){return this.#a(this.#e+1,"/")&&this.#a(this.#e+2,"/")}#S(){return this.#a(this.#e,"@")}#O(){return this.#a(this.#e,":")}#k(){return this.#a(this.#e,":")}#x(){return this.#a(this.#e,"/")}#h(){if(this.#a(this.#e,"?"))return !0;if(this.#n[this.#e].value!=="?")return !1;let t=this.#m(this.#e-1);return t.type!=="NAME"&&t.type!=="REGEX"&&t.type!=="CLOSE"&&t.type!=="ASTERISK"}#f(){return this.#a(this.#e,"#")}#T(){return this.#n[this.#e].type=="OPEN"}#A(){return this.#n[this.#e].type=="CLOSE"}#y(){return this.#a(this.#e,"[")}#w(){return this.#a(this.#e,"]")}#c(){let t=this.#n[this.#e],r=this.#m(this.#l).index;return this.#i.substring(r,t.index)}#C(){let t={};Object.assign(t,x),t.encodePart=y;let r=q(this.#c(),void 0,t);this.#g=N(r);}};var V=["protocol","username","password","hostname","port","pathname","search","hash"],E="*";function Se(e,t){if(typeof e!="string")throw new TypeError("parameter 1 is not of type 'string'.");let r=new URL(e,t);return {protocol:r.protocol.substring(0,r.protocol.length-1),username:r.username,password:r.password,hostname:r.hostname,port:r.port,pathname:r.pathname,search:r.search!==""?r.search.substring(1,r.search.length):void 0,hash:r.hash!==""?r.hash.substring(1,r.hash.length):void 0}}function b(e,t){return t?C(e):e}function w(e,t,r){let n;if(typeof t.baseURL=="string")try{n=new URL(t.baseURL),t.protocol===void 0&&(e.protocol=b(n.protocol.substring(0,n.protocol.length-1),r)),!r&&t.protocol===void 0&&t.hostname===void 0&&t.port===void 0&&t.username===void 0&&(e.username=b(n.username,r)),!r&&t.protocol===void 0&&t.hostname===void 0&&t.port===void 0&&t.username===void 0&&t.password===void 0&&(e.password=b(n.password,r)),t.protocol===void 0&&t.hostname===void 0&&(e.hostname=b(n.hostname,r)),t.protocol===void 0&&t.hostname===void 0&&t.port===void 0&&(e.port=b(n.port,r)),t.protocol===void 0&&t.hostname===void 0&&t.port===void 0&&t.pathname===void 0&&(e.pathname=b(n.pathname,r)),t.protocol===void 0&&t.hostname===void 0&&t.port===void 0&&t.pathname===void 0&&t.search===void 0&&(e.search=b(n.search.substring(1,n.search.length),r)),t.protocol===void 0&&t.hostname===void 0&&t.port===void 0&&t.pathname===void 0&&t.search===void 0&&t.hash===void 0&&(e.hash=b(n.hash.substring(1,n.hash.length),r));}catch{throw new TypeError(`invalid baseURL '${t.baseURL}'.`)}if(typeof t.protocol=="string"&&(e.protocol=fe(t.protocol,r)),typeof t.username=="string"&&(e.username=oe(t.username,r)),typeof t.password=="string"&&(e.password=ae(t.password,r)),typeof t.hostname=="string"&&(e.hostname=ie(t.hostname,r)),typeof t.port=="string"&&(e.port=le(t.port,e.protocol,r)),typeof t.pathname=="string"){if(e.pathname=t.pathname,n&&!ee(e.pathname,r)){let a=n.pathname.lastIndexOf("/");a>=0&&(e.pathname=b(n.pathname.substring(0,a+1),r)+e.pathname);}e.pathname=ce(e.pathname,e.protocol,r);}return typeof t.search=="string"&&(e.search=se(t.search,r)),typeof t.hash=="string"&&(e.hash=ne(t.hash,r)),e}function C(e){return e.replace(/([+*?:{}()\\])/g,"\\$1")}function Le(e){return e.replace(/([.+*?^${}()[\]|/\\])/g,"\\$1")}function Ie(e,t){t.delimiter??="/#?",t.prefixes??="./",t.sensitive??=!1,t.strict??=!1,t.end??=!0,t.start??=!0,t.endsWith="";let r=".*",n=`[^${Le(t.delimiter)}]+?`,a=/[$_\u200C\u200D\p{ID_Continue}]/u,c="";for(let l=0;l<e.length;++l){let s=e[l];if(s.type===3){if(s.modifier===3){c+=C(s.value);continue}c+=`{${C(s.value)}}${k(s.modifier)}`;continue}let i=s.hasCustomName(),o=!!s.suffix.length||!!s.prefix.length&&(s.prefix.length!==1||!t.prefixes.includes(s.prefix)),f=l>0?e[l-1]:null,d=l<e.length-1?e[l+1]:null;if(!o&&i&&s.type===1&&s.modifier===3&&d&&!d.prefix.length&&!d.suffix.length)if(d.type===3){let T=d.value.length>0?d.value[0]:"";o=a.test(T);}else o=!d.hasCustomName();if(!o&&!s.prefix.length&&f&&f.type===3){let T=f.value[f.value.length-1];o=t.prefixes.includes(T);}o&&(c+="{"),c+=C(s.prefix),i&&(c+=`:${s.name}`),s.type===2?c+=`(${s.value})`:s.type===1?i||(c+=`(${n})`):s.type===0&&(!i&&(!f||f.type===3||f.modifier!==3||o||s.prefix!=="")?c+="*":c+=`(${r})`),s.type===1&&i&&s.suffix.length&&a.test(s.suffix[0])&&(c+="\\"),c+=C(s.suffix),o&&(c+="}"),s.modifier!==3&&(c+=k(s.modifier));}return c}var Y=class{#i;#n={};#t={};#e={};#s={};#l=!1;constructor(t={},r,n){try{let a;if(typeof r=="string"?a=r:n=r,typeof t=="string"){let i=new H(t);if(i.parse(),t=i.result,a===void 0&&typeof t.protocol!="string")throw new TypeError("A base URL must be provided for a relative constructor string.");t.baseURL=a;}else {if(!t||typeof t!="object")throw new TypeError("parameter 1 is not of type 'string' and cannot convert to dictionary.");if(a)throw new TypeError("parameter 1 is not of type 'string'.")}typeof n>"u"&&(n={ignoreCase:!1});let c={ignoreCase:n.ignoreCase===!0},l={pathname:E,protocol:E,username:E,password:E,hostname:E,port:E,search:E,hash:E};this.#i=w(l,t,!0),z(this.#i.protocol)===this.#i.port&&(this.#i.port="");let s;for(s of V){if(!(s in this.#i))continue;let i={},o=this.#i[s];switch(this.#t[s]=[],s){case"protocol":Object.assign(i,x),i.encodePart=y;break;case"username":Object.assign(i,x),i.encodePart=he;break;case"password":Object.assign(i,x),i.encodePart=ue;break;case"hostname":Object.assign(i,J),_(o)?i.encodePart=K:i.encodePart=j;break;case"port":Object.assign(i,x),i.encodePart=G;break;case"pathname":N(this.#n.protocol)?(Object.assign(i,Q,c),i.encodePart=de):(Object.assign(i,x,c),i.encodePart=pe);break;case"search":Object.assign(i,x,c),i.encodePart=ge;break;case"hash":Object.assign(i,x,c),i.encodePart=me;break}try{this.#s[s]=F(o,i),this.#n[s]=W(this.#s[s],this.#t[s],i),this.#e[s]=Ie(this.#s[s],i),this.#l=this.#l||this.#s[s].some(f=>f.type===2);}catch{throw new TypeError(`invalid ${s} pattern '${this.#i[s]}'.`)}}}catch(a){throw new TypeError(`Failed to construct 'URLPattern': ${a.message}`)}}test(t={},r){let n={pathname:"",protocol:"",username:"",password:"",hostname:"",port:"",search:"",hash:""};if(typeof t!="string"&&r)throw new TypeError("parameter 1 is not of type 'string'.");if(typeof t>"u")return !1;try{typeof t=="object"?n=w(n,t,!1):n=w(n,Se(t,r),!1);}catch{return !1}let a;for(a of V)if(!this.#n[a].exec(n[a]))return !1;return !0}exec(t={},r){let n={pathname:"",protocol:"",username:"",password:"",hostname:"",port:"",search:"",hash:""};if(typeof t!="string"&&r)throw new TypeError("parameter 1 is not of type 'string'.");if(typeof t>"u")return;try{typeof t=="object"?n=w(n,t,!1):n=w(n,Se(t,r),!1);}catch{return null}let a={};r?a.inputs=[t,r]:a.inputs=[t];let c;for(c of V){let l=this.#n[c].exec(n[c]);if(!l)return null;let s={};for(let[i,o]of this.#t[c].entries())if(typeof o=="string"||typeof o=="number"){let f=l[i+1];s[o]=f;}a[c]={input:n[c]??"",groups:s};}return a}static compareComponent(t,r,n){let a=(i,o)=>{for(let f of ["type","modifier","prefix","value","suffix"]){if(i[f]<o[f])return -1;if(i[f]===o[f])continue;return 1}return 0},c=new R(3,"","","","",3),l=new R(0,"","","","",3),s=(i,o)=>{let f=0;for(;f<Math.min(i.length,o.length);++f){let d=a(i[f],o[f]);if(d)return d}return i.length===o.length?0:a(i[f]??c,o[f]??c)};return !r.#e[t]&&!n.#e[t]?0:r.#e[t]&&!n.#e[t]?s(r.#s[t],[l]):!r.#e[t]&&n.#e[t]?s([l],n.#s[t]):s(r.#s[t],n.#s[t])}get protocol(){return this.#e.protocol}get username(){return this.#e.username}get password(){return this.#e.password}get hostname(){return this.#e.hostname}get port(){return this.#e.port}get pathname(){return this.#e.pathname}get search(){return this.#e.search}get hash(){return this.#e.hash}get hasRegExpGroups(){return this.#l}};
	return urlpattern;
}

var urlpatternPolyfill;
var hasRequiredUrlpatternPolyfill;

function requireUrlpatternPolyfill () {
	if (hasRequiredUrlpatternPolyfill) return urlpatternPolyfill;
	hasRequiredUrlpatternPolyfill = 1;
	const { URLPattern } = requireUrlpattern();

	urlpatternPolyfill = { URLPattern };

	if (!globalThis.URLPattern) {
	  globalThis.URLPattern = URLPattern;
	}
	return urlpatternPolyfill;
}

var cjs = {};

var fetch$1 = {};

var fetchCurl = {};

var Response$2 = {};

var Body = {};

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  };
  return __assign.apply(this, arguments);
};

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new TypeError("Object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
}
function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
}
function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
}
function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
}
function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
  function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
}
var __setModuleDefault = Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
}

function __importDefault(mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose;
    if (async) {
        if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
        dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
        if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
        dispose = value[Symbol.dispose];
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    env.stack.push({ value: value, dispose: dispose, async: async });
  }
  else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  function next() {
    while (env.stack.length) {
      var rec = env.stack.pop();
      try {
        var result = rec.dispose && rec.dispose.call(rec.value);
        if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
      }
      catch (e) {
          fail(e);
      }
    }
    if (env.hasError) throw env.error;
  }
  return next();
}

const tslib_es6 = {
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __metadata,
  __awaiter,
  __generator,
  __createBinding,
  __exportStar,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
  __addDisposableResource,
  __disposeResources,
};

const tslib_es6$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    __addDisposableResource,
    get __assign () { return __assign; },
    __asyncDelegator,
    __asyncGenerator,
    __asyncValues,
    __await,
    __awaiter,
    __classPrivateFieldGet,
    __classPrivateFieldIn,
    __classPrivateFieldSet,
    __createBinding,
    __decorate,
    __disposeResources,
    __esDecorate,
    __exportStar,
    __extends,
    __generator,
    __importDefault,
    __importStar,
    __makeTemplateObject,
    __metadata,
    __param,
    __propKey,
    __read,
    __rest,
    __runInitializers,
    __setFunctionName,
    __spread,
    __spreadArray,
    __spreadArrays,
    __values,
    default: tslib_es6
}, Symbol.toStringTag, { value: 'Module' }));

const require$$0 = /*@__PURE__*/getAugmentedNamespace(tslib_es6$1);

var utils$1;
var hasRequiredUtils$1;

function requireUtils$1 () {
	if (hasRequiredUtils$1) return utils$1;
	hasRequiredUtils$1 = 1;

	function parseContentType(str) {
	  if (str.length === 0)
	    return;

	  const params = Object.create(null);
	  let i = 0;

	  // Parse type
	  for (; i < str.length; ++i) {
	    const code = str.charCodeAt(i);
	    if (TOKEN[code] !== 1) {
	      if (code !== 47/* '/' */ || i === 0)
	        return;
	      break;
	    }
	  }
	  // Check for type without subtype
	  if (i === str.length)
	    return;

	  const type = str.slice(0, i).toLowerCase();

	  // Parse subtype
	  const subtypeStart = ++i;
	  for (; i < str.length; ++i) {
	    const code = str.charCodeAt(i);
	    if (TOKEN[code] !== 1) {
	      // Make sure we have a subtype
	      if (i === subtypeStart)
	        return;

	      if (parseContentTypeParams(str, i, params) === undefined)
	        return;
	      break;
	    }
	  }
	  // Make sure we have a subtype
	  if (i === subtypeStart)
	    return;

	  const subtype = str.slice(subtypeStart, i).toLowerCase();

	  return { type, subtype, params };
	}

	function parseContentTypeParams(str, i, params) {
	  while (i < str.length) {
	    // Consume whitespace
	    for (; i < str.length; ++i) {
	      const code = str.charCodeAt(i);
	      if (code !== 32/* ' ' */ && code !== 9/* '\t' */)
	        break;
	    }

	    // Ended on whitespace
	    if (i === str.length)
	      break;

	    // Check for malformed parameter
	    if (str.charCodeAt(i++) !== 59/* ';' */)
	      return;

	    // Consume whitespace
	    for (; i < str.length; ++i) {
	      const code = str.charCodeAt(i);
	      if (code !== 32/* ' ' */ && code !== 9/* '\t' */)
	        break;
	    }

	    // Ended on whitespace (malformed)
	    if (i === str.length)
	      return;

	    let name;
	    const nameStart = i;
	    // Parse parameter name
	    for (; i < str.length; ++i) {
	      const code = str.charCodeAt(i);
	      if (TOKEN[code] !== 1) {
	        if (code !== 61/* '=' */)
	          return;
	        break;
	      }
	    }

	    // No value (malformed)
	    if (i === str.length)
	      return;

	    name = str.slice(nameStart, i);
	    ++i; // Skip over '='

	    // No value (malformed)
	    if (i === str.length)
	      return;

	    let value = '';
	    let valueStart;
	    if (str.charCodeAt(i) === 34/* '"' */) {
	      valueStart = ++i;
	      let escaping = false;
	      // Parse quoted value
	      for (; i < str.length; ++i) {
	        const code = str.charCodeAt(i);
	        if (code === 92/* '\\' */) {
	          if (escaping) {
	            valueStart = i;
	            escaping = false;
	          } else {
	            value += str.slice(valueStart, i);
	            escaping = true;
	          }
	          continue;
	        }
	        if (code === 34/* '"' */) {
	          if (escaping) {
	            valueStart = i;
	            escaping = false;
	            continue;
	          }
	          value += str.slice(valueStart, i);
	          break;
	        }
	        if (escaping) {
	          valueStart = i - 1;
	          escaping = false;
	        }
	        // Invalid unescaped quoted character (malformed)
	        if (QDTEXT[code] !== 1)
	          return;
	      }

	      // No end quote (malformed)
	      if (i === str.length)
	        return;

	      ++i; // Skip over double quote
	    } else {
	      valueStart = i;
	      // Parse unquoted value
	      for (; i < str.length; ++i) {
	        const code = str.charCodeAt(i);
	        if (TOKEN[code] !== 1) {
	          // No value (malformed)
	          if (i === valueStart)
	            return;
	          break;
	        }
	      }
	      value = str.slice(valueStart, i);
	    }

	    name = name.toLowerCase();
	    if (params[name] === undefined)
	      params[name] = value;
	  }

	  return params;
	}

	function parseDisposition(str, defDecoder) {
	  if (str.length === 0)
	    return;

	  const params = Object.create(null);
	  let i = 0;

	  for (; i < str.length; ++i) {
	    const code = str.charCodeAt(i);
	    if (TOKEN[code] !== 1) {
	      if (parseDispositionParams(str, i, params, defDecoder) === undefined)
	        return;
	      break;
	    }
	  }

	  const type = str.slice(0, i).toLowerCase();

	  return { type, params };
	}

	function parseDispositionParams(str, i, params, defDecoder) {
	  while (i < str.length) {
	    // Consume whitespace
	    for (; i < str.length; ++i) {
	      const code = str.charCodeAt(i);
	      if (code !== 32/* ' ' */ && code !== 9/* '\t' */)
	        break;
	    }

	    // Ended on whitespace
	    if (i === str.length)
	      break;

	    // Check for malformed parameter
	    if (str.charCodeAt(i++) !== 59/* ';' */)
	      return;

	    // Consume whitespace
	    for (; i < str.length; ++i) {
	      const code = str.charCodeAt(i);
	      if (code !== 32/* ' ' */ && code !== 9/* '\t' */)
	        break;
	    }

	    // Ended on whitespace (malformed)
	    if (i === str.length)
	      return;

	    let name;
	    const nameStart = i;
	    // Parse parameter name
	    for (; i < str.length; ++i) {
	      const code = str.charCodeAt(i);
	      if (TOKEN[code] !== 1) {
	        if (code === 61/* '=' */)
	          break;
	        return;
	      }
	    }

	    // No value (malformed)
	    if (i === str.length)
	      return;

	    let value = '';
	    let valueStart;
	    let charset;
	    //~ let lang;
	    name = str.slice(nameStart, i);
	    if (name.charCodeAt(name.length - 1) === 42/* '*' */) {
	      // Extended value

	      const charsetStart = ++i;
	      // Parse charset name
	      for (; i < str.length; ++i) {
	        const code = str.charCodeAt(i);
	        if (CHARSET[code] !== 1) {
	          if (code !== 39/* '\'' */)
	            return;
	          break;
	        }
	      }

	      // Incomplete charset (malformed)
	      if (i === str.length)
	        return;

	      charset = str.slice(charsetStart, i);
	      ++i; // Skip over the '\''

	      //~ const langStart = ++i;
	      // Parse language name
	      for (; i < str.length; ++i) {
	        const code = str.charCodeAt(i);
	        if (code === 39/* '\'' */)
	          break;
	      }

	      // Incomplete language (malformed)
	      if (i === str.length)
	        return;

	      //~ lang = str.slice(langStart, i);
	      ++i; // Skip over the '\''

	      // No value (malformed)
	      if (i === str.length)
	        return;

	      valueStart = i;

	      let encode = 0;
	      // Parse value
	      for (; i < str.length; ++i) {
	        const code = str.charCodeAt(i);
	        if (EXTENDED_VALUE[code] !== 1) {
	          if (code === 37/* '%' */) {
	            let hexUpper;
	            let hexLower;
	            if (i + 2 < str.length
	                && (hexUpper = HEX_VALUES[str.charCodeAt(i + 1)]) !== -1
	                && (hexLower = HEX_VALUES[str.charCodeAt(i + 2)]) !== -1) {
	              const byteVal = (hexUpper << 4) + hexLower;
	              value += str.slice(valueStart, i);
	              value += String.fromCharCode(byteVal);
	              i += 2;
	              valueStart = i + 1;
	              if (byteVal >= 128)
	                encode = 2;
	              else if (encode === 0)
	                encode = 1;
	              continue;
	            }
	            // '%' disallowed in non-percent encoded contexts (malformed)
	            return;
	          }
	          break;
	        }
	      }

	      value += str.slice(valueStart, i);
	      value = convertToUTF8(value, charset, encode);
	      if (value === undefined)
	        return;
	    } else {
	      // Non-extended value

	      ++i; // Skip over '='

	      // No value (malformed)
	      if (i === str.length)
	        return;

	      if (str.charCodeAt(i) === 34/* '"' */) {
	        valueStart = ++i;
	        let escaping = false;
	        // Parse quoted value
	        for (; i < str.length; ++i) {
	          const code = str.charCodeAt(i);
	          if (code === 92/* '\\' */) {
	            if (escaping) {
	              valueStart = i;
	              escaping = false;
	            } else {
	              value += str.slice(valueStart, i);
	              escaping = true;
	            }
	            continue;
	          }
	          if (code === 34/* '"' */) {
	            if (escaping) {
	              valueStart = i;
	              escaping = false;
	              continue;
	            }
	            value += str.slice(valueStart, i);
	            break;
	          }
	          if (escaping) {
	            valueStart = i - 1;
	            escaping = false;
	          }
	          // Invalid unescaped quoted character (malformed)
	          if (QDTEXT[code] !== 1)
	            return;
	        }

	        // No end quote (malformed)
	        if (i === str.length)
	          return;

	        ++i; // Skip over double quote
	      } else {
	        valueStart = i;
	        // Parse unquoted value
	        for (; i < str.length; ++i) {
	          const code = str.charCodeAt(i);
	          if (TOKEN[code] !== 1) {
	            // No value (malformed)
	            if (i === valueStart)
	              return;
	            break;
	          }
	        }
	        value = str.slice(valueStart, i);
	      }

	      value = defDecoder(value, 2);
	      if (value === undefined)
	        return;
	    }

	    name = name.toLowerCase();
	    if (params[name] === undefined)
	      params[name] = value;
	  }

	  return params;
	}

	function getDecoder(charset) {
	  let lc;
	  while (true) {
	    switch (charset) {
	      case 'utf-8':
	      case 'utf8':
	        return decoders.utf8;
	      case 'latin1':
	      case 'ascii': // TODO: Make these a separate, strict decoder?
	      case 'us-ascii':
	      case 'iso-8859-1':
	      case 'iso8859-1':
	      case 'iso88591':
	      case 'iso_8859-1':
	      case 'windows-1252':
	      case 'iso_8859-1:1987':
	      case 'cp1252':
	      case 'x-cp1252':
	        return decoders.latin1;
	      case 'utf16le':
	      case 'utf-16le':
	      case 'ucs2':
	      case 'ucs-2':
	        return decoders.utf16le;
	      case 'base64':
	        return decoders.base64;
	      default:
	        if (lc === undefined) {
	          lc = true;
	          charset = charset.toLowerCase();
	          continue;
	        }
	        return decoders.other.bind(charset);
	    }
	  }
	}

	const decoders = {
	  utf8: (data, hint) => {
	    if (data.length === 0)
	      return '';
	    if (typeof data === 'string') {
	      // If `data` never had any percent-encoded bytes or never had any that
	      // were outside of the ASCII range, then we can safely just return the
	      // input since UTF-8 is ASCII compatible
	      if (hint < 2)
	        return data;

	      data = Buffer.from(data, 'latin1');
	    }
	    return data.utf8Slice(0, data.length);
	  },

	  latin1: (data, hint) => {
	    if (data.length === 0)
	      return '';
	    if (typeof data === 'string')
	      return data;
	    return data.latin1Slice(0, data.length);
	  },

	  utf16le: (data, hint) => {
	    if (data.length === 0)
	      return '';
	    if (typeof data === 'string')
	      data = Buffer.from(data, 'latin1');
	    return data.ucs2Slice(0, data.length);
	  },

	  base64: (data, hint) => {
	    if (data.length === 0)
	      return '';
	    if (typeof data === 'string')
	      data = Buffer.from(data, 'latin1');
	    return data.base64Slice(0, data.length);
	  },

	  other: (data, hint) => {
	    if (data.length === 0)
	      return '';
	    if (typeof data === 'string')
	      data = Buffer.from(data, 'latin1');
	    try {
	      const decoder = new TextDecoder(this);
	      return decoder.decode(data);
	    } catch {}
	  },
	};

	function convertToUTF8(data, charset, hint) {
	  const decode = getDecoder(charset);
	  if (decode)
	    return decode(data, hint);
	}

	function basename(path) {
	  if (typeof path !== 'string')
	    return '';
	  for (let i = path.length - 1; i >= 0; --i) {
	    switch (path.charCodeAt(i)) {
	      case 0x2F: // '/'
	      case 0x5C: // '\'
	        path = path.slice(i + 1);
	        return (path === '..' || path === '.' ? '' : path);
	    }
	  }
	  return (path === '..' || path === '.' ? '' : path);
	}

	const TOKEN = [
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
	  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	];

	const QDTEXT = [
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	];

	const CHARSET = [
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
	  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	];

	const EXTENDED_VALUE = [
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
	  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	];

	/* eslint-disable no-multi-spaces */
	const HEX_VALUES = [
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	   0,  1,  2,  3,  4,  5,  6,  7,  8,  9, -1, -1, -1, -1, -1, -1,
	  -1, 10, 11, 12, 13, 14, 15, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, 10, 11, 12, 13, 14, 15, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	];
	/* eslint-enable no-multi-spaces */

	utils$1 = {
	  basename,
	  convertToUTF8,
	  getDecoder,
	  parseContentType,
	  parseDisposition,
	};
	return utils$1;
}

var sbmh;
var hasRequiredSbmh;

function requireSbmh () {
	if (hasRequiredSbmh) return sbmh;
	hasRequiredSbmh = 1;
	/*
	  Based heavily on the Streaming Boyer-Moore-Horspool C++ implementation
	  by Hongli Lai at: https://github.com/FooBarWidget/boyer-moore-horspool
	*/
	function memcmp(buf1, pos1, buf2, pos2, num) {
	  for (let i = 0; i < num; ++i) {
	    if (buf1[pos1 + i] !== buf2[pos2 + i])
	      return false;
	  }
	  return true;
	}

	class SBMH {
	  constructor(needle, cb) {
	    if (typeof cb !== 'function')
	      throw new Error('Missing match callback');

	    if (typeof needle === 'string')
	      needle = Buffer.from(needle);
	    else if (!Buffer.isBuffer(needle))
	      throw new Error(`Expected Buffer for needle, got ${typeof needle}`);

	    const needleLen = needle.length;

	    this.maxMatches = Infinity;
	    this.matches = 0;

	    this._cb = cb;
	    this._lookbehindSize = 0;
	    this._needle = needle;
	    this._bufPos = 0;

	    this._lookbehind = Buffer.allocUnsafe(needleLen);

	    // Initialize occurrence table.
	    this._occ = [
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen, needleLen, needleLen,
	      needleLen, needleLen, needleLen, needleLen
	    ];

	    // Populate occurrence table with analysis of the needle, ignoring the last
	    // letter.
	    if (needleLen > 1) {
	      for (let i = 0; i < needleLen - 1; ++i)
	        this._occ[needle[i]] = needleLen - 1 - i;
	    }
	  }

	  reset() {
	    this.matches = 0;
	    this._lookbehindSize = 0;
	    this._bufPos = 0;
	  }

	  push(chunk, pos) {
	    let result;
	    if (!Buffer.isBuffer(chunk))
	      chunk = Buffer.from(chunk, 'latin1');
	    const chunkLen = chunk.length;
	    this._bufPos = pos || 0;
	    while (result !== chunkLen && this.matches < this.maxMatches)
	      result = feed(this, chunk);
	    return result;
	  }

	  destroy() {
	    const lbSize = this._lookbehindSize;
	    if (lbSize)
	      this._cb(false, this._lookbehind, 0, lbSize, false);
	    this.reset();
	  }
	}

	function feed(self, data) {
	  const len = data.length;
	  const needle = self._needle;
	  const needleLen = needle.length;

	  // Positive: points to a position in `data`
	  //           pos == 3 points to data[3]
	  // Negative: points to a position in the lookbehind buffer
	  //           pos == -2 points to lookbehind[lookbehindSize - 2]
	  let pos = -self._lookbehindSize;
	  const lastNeedleCharPos = needleLen - 1;
	  const lastNeedleChar = needle[lastNeedleCharPos];
	  const end = len - needleLen;
	  const occ = self._occ;
	  const lookbehind = self._lookbehind;

	  if (pos < 0) {
	    // Lookbehind buffer is not empty. Perform Boyer-Moore-Horspool
	    // search with character lookup code that considers both the
	    // lookbehind buffer and the current round's haystack data.
	    //
	    // Loop until
	    //   there is a match.
	    // or until
	    //   we've moved past the position that requires the
	    //   lookbehind buffer. In this case we switch to the
	    //   optimized loop.
	    // or until
	    //   the character to look at lies outside the haystack.
	    while (pos < 0 && pos <= end) {
	      const nextPos = pos + lastNeedleCharPos;
	      const ch = (nextPos < 0
	                  ? lookbehind[self._lookbehindSize + nextPos]
	                  : data[nextPos]);

	      if (ch === lastNeedleChar
	          && matchNeedle(self, data, pos, lastNeedleCharPos)) {
	        self._lookbehindSize = 0;
	        ++self.matches;
	        if (pos > -self._lookbehindSize)
	          self._cb(true, lookbehind, 0, self._lookbehindSize + pos, false);
	        else
	          self._cb(true, undefined, 0, 0, true);

	        return (self._bufPos = pos + needleLen);
	      }

	      pos += occ[ch];
	    }

	    // No match.

	    // There's too few data for Boyer-Moore-Horspool to run,
	    // so let's use a different algorithm to skip as much as
	    // we can.
	    // Forward pos until
	    //   the trailing part of lookbehind + data
	    //   looks like the beginning of the needle
	    // or until
	    //   pos == 0
	    while (pos < 0 && !matchNeedle(self, data, pos, len - pos))
	      ++pos;

	    if (pos < 0) {
	      // Cut off part of the lookbehind buffer that has
	      // been processed and append the entire haystack
	      // into it.
	      const bytesToCutOff = self._lookbehindSize + pos;

	      if (bytesToCutOff > 0) {
	        // The cut off data is guaranteed not to contain the needle.
	        self._cb(false, lookbehind, 0, bytesToCutOff, false);
	      }

	      self._lookbehindSize -= bytesToCutOff;
	      lookbehind.copy(lookbehind, 0, bytesToCutOff, self._lookbehindSize);
	      lookbehind.set(data, self._lookbehindSize);
	      self._lookbehindSize += len;

	      self._bufPos = len;
	      return len;
	    }

	    // Discard lookbehind buffer.
	    self._cb(false, lookbehind, 0, self._lookbehindSize, false);
	    self._lookbehindSize = 0;
	  }

	  pos += self._bufPos;

	  const firstNeedleChar = needle[0];

	  // Lookbehind buffer is now empty. Perform Boyer-Moore-Horspool
	  // search with optimized character lookup code that only considers
	  // the current round's haystack data.
	  while (pos <= end) {
	    const ch = data[pos + lastNeedleCharPos];

	    if (ch === lastNeedleChar
	        && data[pos] === firstNeedleChar
	        && memcmp(needle, 0, data, pos, lastNeedleCharPos)) {
	      ++self.matches;
	      if (pos > 0)
	        self._cb(true, data, self._bufPos, pos, true);
	      else
	        self._cb(true, undefined, 0, 0, true);

	      return (self._bufPos = pos + needleLen);
	    }

	    pos += occ[ch];
	  }

	  // There was no match. If there's trailing haystack data that we cannot
	  // match yet using the Boyer-Moore-Horspool algorithm (because the trailing
	  // data is less than the needle size) then match using a modified
	  // algorithm that starts matching from the beginning instead of the end.
	  // Whatever trailing data is left after running this algorithm is added to
	  // the lookbehind buffer.
	  while (pos < len) {
	    if (data[pos] !== firstNeedleChar
	        || !memcmp(data, pos, needle, 0, len - pos)) {
	      ++pos;
	      continue;
	    }
	    data.copy(lookbehind, 0, pos, len);
	    self._lookbehindSize = len - pos;
	    break;
	  }

	  // Everything until `pos` is guaranteed not to contain needle data.
	  if (pos > 0)
	    self._cb(false, data, self._bufPos, pos < len ? pos : len, true);

	  self._bufPos = len;
	  return len;
	}

	function matchNeedle(self, data, pos, len) {
	  const lb = self._lookbehind;
	  const lbSize = self._lookbehindSize;
	  const needle = self._needle;

	  for (let i = 0; i < len; ++i, ++pos) {
	    const ch = (pos < 0 ? lb[lbSize + pos] : data[pos]);
	    if (ch !== needle[i])
	      return false;
	  }
	  return true;
	}

	sbmh = SBMH;
	return sbmh;
}

var multipart;
var hasRequiredMultipart;

function requireMultipart () {
	if (hasRequiredMultipart) return multipart;
	hasRequiredMultipart = 1;

	const { Readable, Writable } = require$$0$1;

	const StreamSearch = requireSbmh();

	const {
	  basename,
	  convertToUTF8,
	  getDecoder,
	  parseContentType,
	  parseDisposition,
	} = requireUtils$1();

	const BUF_CRLF = Buffer.from('\r\n');
	const BUF_CR = Buffer.from('\r');
	const BUF_DASH = Buffer.from('-');

	function noop() {}

	const MAX_HEADER_PAIRS = 2000; // From node
	const MAX_HEADER_SIZE = 16 * 1024; // From node (its default value)

	const HPARSER_NAME = 0;
	const HPARSER_PRE_OWS = 1;
	const HPARSER_VALUE = 2;
	class HeaderParser {
	  constructor(cb) {
	    this.header = Object.create(null);
	    this.pairCount = 0;
	    this.byteCount = 0;
	    this.state = HPARSER_NAME;
	    this.name = '';
	    this.value = '';
	    this.crlf = 0;
	    this.cb = cb;
	  }

	  reset() {
	    this.header = Object.create(null);
	    this.pairCount = 0;
	    this.byteCount = 0;
	    this.state = HPARSER_NAME;
	    this.name = '';
	    this.value = '';
	    this.crlf = 0;
	  }

	  push(chunk, pos, end) {
	    let start = pos;
	    while (pos < end) {
	      switch (this.state) {
	        case HPARSER_NAME: {
	          let done = false;
	          for (; pos < end; ++pos) {
	            if (this.byteCount === MAX_HEADER_SIZE)
	              return -1;
	            ++this.byteCount;
	            const code = chunk[pos];
	            if (TOKEN[code] !== 1) {
	              if (code !== 58/* ':' */)
	                return -1;
	              this.name += chunk.latin1Slice(start, pos);
	              if (this.name.length === 0)
	                return -1;
	              ++pos;
	              done = true;
	              this.state = HPARSER_PRE_OWS;
	              break;
	            }
	          }
	          if (!done) {
	            this.name += chunk.latin1Slice(start, pos);
	            break;
	          }
	          // FALLTHROUGH
	        }
	        case HPARSER_PRE_OWS: {
	          // Skip optional whitespace
	          let done = false;
	          for (; pos < end; ++pos) {
	            if (this.byteCount === MAX_HEADER_SIZE)
	              return -1;
	            ++this.byteCount;
	            const code = chunk[pos];
	            if (code !== 32/* ' ' */ && code !== 9/* '\t' */) {
	              start = pos;
	              done = true;
	              this.state = HPARSER_VALUE;
	              break;
	            }
	          }
	          if (!done)
	            break;
	          // FALLTHROUGH
	        }
	        case HPARSER_VALUE:
	          switch (this.crlf) {
	            case 0: // Nothing yet
	              for (; pos < end; ++pos) {
	                if (this.byteCount === MAX_HEADER_SIZE)
	                  return -1;
	                ++this.byteCount;
	                const code = chunk[pos];
	                if (FIELD_VCHAR[code] !== 1) {
	                  if (code !== 13/* '\r' */)
	                    return -1;
	                  ++this.crlf;
	                  break;
	                }
	              }
	              this.value += chunk.latin1Slice(start, pos++);
	              break;
	            case 1: // Received CR
	              if (this.byteCount === MAX_HEADER_SIZE)
	                return -1;
	              ++this.byteCount;
	              if (chunk[pos++] !== 10/* '\n' */)
	                return -1;
	              ++this.crlf;
	              break;
	            case 2: { // Received CR LF
	              if (this.byteCount === MAX_HEADER_SIZE)
	                return -1;
	              ++this.byteCount;
	              const code = chunk[pos];
	              if (code === 32/* ' ' */ || code === 9/* '\t' */) {
	                // Folded value
	                start = pos;
	                this.crlf = 0;
	              } else {
	                if (++this.pairCount < MAX_HEADER_PAIRS) {
	                  this.name = this.name.toLowerCase();
	                  if (this.header[this.name] === undefined)
	                    this.header[this.name] = [this.value];
	                  else
	                    this.header[this.name].push(this.value);
	                }
	                if (code === 13/* '\r' */) {
	                  ++this.crlf;
	                  ++pos;
	                } else {
	                  // Assume start of next header field name
	                  start = pos;
	                  this.crlf = 0;
	                  this.state = HPARSER_NAME;
	                  this.name = '';
	                  this.value = '';
	                }
	              }
	              break;
	            }
	            case 3: { // Received CR LF CR
	              if (this.byteCount === MAX_HEADER_SIZE)
	                return -1;
	              ++this.byteCount;
	              if (chunk[pos++] !== 10/* '\n' */)
	                return -1;
	              // End of header
	              const header = this.header;
	              this.reset();
	              this.cb(header);
	              return pos;
	            }
	          }
	          break;
	      }
	    }

	    return pos;
	  }
	}

	class FileStream extends Readable {
	  constructor(opts, owner) {
	    super(opts);
	    this.truncated = false;
	    this._readcb = null;
	    this.once('end', () => {
	      // We need to make sure that we call any outstanding _writecb() that is
	      // associated with this file so that processing of the rest of the form
	      // can continue. This may not happen if the file stream ends right after
	      // backpressure kicks in, so we force it here.
	      this._read();
	      if (--owner._fileEndsLeft === 0 && owner._finalcb) {
	        const cb = owner._finalcb;
	        owner._finalcb = null;
	        // Make sure other 'end' event handlers get a chance to be executed
	        // before busboy's 'finish' event is emitted
	        process.nextTick(cb);
	      }
	    });
	  }
	  _read(n) {
	    const cb = this._readcb;
	    if (cb) {
	      this._readcb = null;
	      cb();
	    }
	  }
	}

	const ignoreData = {
	  push: (chunk, pos) => {},
	  destroy: () => {},
	};

	function callAndUnsetCb(self, err) {
	  const cb = self._writecb;
	  self._writecb = null;
	  if (cb)
	    cb();
	}

	function nullDecoder(val, hint) {
	  return val;
	}

	class Multipart extends Writable {
	  constructor(cfg) {
	    const streamOpts = {
	      autoDestroy: true,
	      emitClose: true,
	      highWaterMark: (typeof cfg.highWaterMark === 'number'
	                      ? cfg.highWaterMark
	                      : undefined),
	    };
	    super(streamOpts);

	    if (!cfg.conType.params || typeof cfg.conType.params.boundary !== 'string')
	      throw new Error('Multipart: Boundary not found');

	    const boundary = cfg.conType.params.boundary;
	    const paramDecoder = (typeof cfg.defParamCharset === 'string'
	                            && cfg.defParamCharset
	                          ? getDecoder(cfg.defParamCharset)
	                          : nullDecoder);
	    const defCharset = (cfg.defCharset || 'utf8');
	    const preservePath = cfg.preservePath;
	    const fileOpts = {
	      autoDestroy: true,
	      emitClose: true,
	      highWaterMark: (typeof cfg.fileHwm === 'number'
	                      ? cfg.fileHwm
	                      : undefined),
	    };

	    const limits = cfg.limits;
	    const fieldSizeLimit = (limits && typeof limits.fieldSize === 'number'
	                            ? limits.fieldSize
	                            : 1 * 1024 * 1024);
	    const fileSizeLimit = (limits && typeof limits.fileSize === 'number'
	                           ? limits.fileSize
	                           : Infinity);
	    const filesLimit = (limits && typeof limits.files === 'number'
	                        ? limits.files
	                        : Infinity);
	    const fieldsLimit = (limits && typeof limits.fields === 'number'
	                         ? limits.fields
	                         : Infinity);
	    const partsLimit = (limits && typeof limits.parts === 'number'
	                        ? limits.parts
	                        : Infinity);

	    let parts = -1; // Account for initial boundary
	    let fields = 0;
	    let files = 0;
	    let skipPart = false;

	    this._fileEndsLeft = 0;
	    this._fileStream = undefined;
	    this._complete = false;
	    let fileSize = 0;

	    let field;
	    let fieldSize = 0;
	    let partCharset;
	    let partEncoding;
	    let partType;
	    let partName;
	    let partTruncated = false;

	    let hitFilesLimit = false;
	    let hitFieldsLimit = false;

	    this._hparser = null;
	    const hparser = new HeaderParser((header) => {
	      this._hparser = null;
	      skipPart = false;

	      partType = 'text/plain';
	      partCharset = defCharset;
	      partEncoding = '7bit';
	      partName = undefined;
	      partTruncated = false;

	      let filename;
	      if (!header['content-disposition']) {
	        skipPart = true;
	        return;
	      }

	      const disp = parseDisposition(header['content-disposition'][0],
	                                    paramDecoder);
	      if (!disp || disp.type !== 'form-data') {
	        skipPart = true;
	        return;
	      }

	      if (disp.params) {
	        if (disp.params.name)
	          partName = disp.params.name;

	        if (disp.params['filename*'])
	          filename = disp.params['filename*'];
	        else if (disp.params.filename)
	          filename = disp.params.filename;

	        if (filename !== undefined && !preservePath)
	          filename = basename(filename);
	      }

	      if (header['content-type']) {
	        const conType = parseContentType(header['content-type'][0]);
	        if (conType) {
	          partType = `${conType.type}/${conType.subtype}`;
	          if (conType.params && typeof conType.params.charset === 'string')
	            partCharset = conType.params.charset.toLowerCase();
	        }
	      }

	      if (header['content-transfer-encoding'])
	        partEncoding = header['content-transfer-encoding'][0].toLowerCase();

	      if (partType === 'application/octet-stream' || filename !== undefined) {
	        // File

	        if (files === filesLimit) {
	          if (!hitFilesLimit) {
	            hitFilesLimit = true;
	            this.emit('filesLimit');
	          }
	          skipPart = true;
	          return;
	        }
	        ++files;

	        if (this.listenerCount('file') === 0) {
	          skipPart = true;
	          return;
	        }

	        fileSize = 0;
	        this._fileStream = new FileStream(fileOpts, this);
	        ++this._fileEndsLeft;
	        this.emit(
	          'file',
	          partName,
	          this._fileStream,
	          { filename,
	            encoding: partEncoding,
	            mimeType: partType }
	        );
	      } else {
	        // Non-file

	        if (fields === fieldsLimit) {
	          if (!hitFieldsLimit) {
	            hitFieldsLimit = true;
	            this.emit('fieldsLimit');
	          }
	          skipPart = true;
	          return;
	        }
	        ++fields;

	        if (this.listenerCount('field') === 0) {
	          skipPart = true;
	          return;
	        }

	        field = [];
	        fieldSize = 0;
	      }
	    });

	    let matchPostBoundary = 0;
	    const ssCb = (isMatch, data, start, end, isDataSafe) => {
	retrydata:
	      while (data) {
	        if (this._hparser !== null) {
	          const ret = this._hparser.push(data, start, end);
	          if (ret === -1) {
	            this._hparser = null;
	            hparser.reset();
	            this.emit('error', new Error('Malformed part header'));
	            break;
	          }
	          start = ret;
	        }

	        if (start === end)
	          break;

	        if (matchPostBoundary !== 0) {
	          if (matchPostBoundary === 1) {
	            switch (data[start]) {
	              case 45: // '-'
	                // Try matching '--' after boundary
	                matchPostBoundary = 2;
	                ++start;
	                break;
	              case 13: // '\r'
	                // Try matching CR LF before header
	                matchPostBoundary = 3;
	                ++start;
	                break;
	              default:
	                matchPostBoundary = 0;
	            }
	            if (start === end)
	              return;
	          }

	          if (matchPostBoundary === 2) {
	            matchPostBoundary = 0;
	            if (data[start] === 45/* '-' */) {
	              // End of multipart data
	              this._complete = true;
	              this._bparser = ignoreData;
	              return;
	            }
	            // We saw something other than '-', so put the dash we consumed
	            // "back"
	            const writecb = this._writecb;
	            this._writecb = noop;
	            ssCb(false, BUF_DASH, 0, 1, false);
	            this._writecb = writecb;
	          } else if (matchPostBoundary === 3) {
	            matchPostBoundary = 0;
	            if (data[start] === 10/* '\n' */) {
	              ++start;
	              if (parts >= partsLimit)
	                break;
	              // Prepare the header parser
	              this._hparser = hparser;
	              if (start === end)
	                break;
	              // Process the remaining data as a header
	              continue retrydata;
	            } else {
	              // We saw something other than LF, so put the CR we consumed
	              // "back"
	              const writecb = this._writecb;
	              this._writecb = noop;
	              ssCb(false, BUF_CR, 0, 1, false);
	              this._writecb = writecb;
	            }
	          }
	        }

	        if (!skipPart) {
	          if (this._fileStream) {
	            let chunk;
	            const actualLen = Math.min(end - start, fileSizeLimit - fileSize);
	            if (!isDataSafe) {
	              chunk = Buffer.allocUnsafe(actualLen);
	              data.copy(chunk, 0, start, start + actualLen);
	            } else {
	              chunk = data.slice(start, start + actualLen);
	            }

	            fileSize += chunk.length;
	            if (fileSize === fileSizeLimit) {
	              if (chunk.length > 0)
	                this._fileStream.push(chunk);
	              this._fileStream.emit('limit');
	              this._fileStream.truncated = true;
	              skipPart = true;
	            } else if (!this._fileStream.push(chunk)) {
	              if (this._writecb)
	                this._fileStream._readcb = this._writecb;
	              this._writecb = null;
	            }
	          } else if (field !== undefined) {
	            let chunk;
	            const actualLen = Math.min(
	              end - start,
	              fieldSizeLimit - fieldSize
	            );
	            if (!isDataSafe) {
	              chunk = Buffer.allocUnsafe(actualLen);
	              data.copy(chunk, 0, start, start + actualLen);
	            } else {
	              chunk = data.slice(start, start + actualLen);
	            }

	            fieldSize += actualLen;
	            field.push(chunk);
	            if (fieldSize === fieldSizeLimit) {
	              skipPart = true;
	              partTruncated = true;
	            }
	          }
	        }

	        break;
	      }

	      if (isMatch) {
	        matchPostBoundary = 1;

	        if (this._fileStream) {
	          // End the active file stream if the previous part was a file
	          this._fileStream.push(null);
	          this._fileStream = null;
	        } else if (field !== undefined) {
	          let data;
	          switch (field.length) {
	            case 0:
	              data = '';
	              break;
	            case 1:
	              data = convertToUTF8(field[0], partCharset, 0);
	              break;
	            default:
	              data = convertToUTF8(
	                Buffer.concat(field, fieldSize),
	                partCharset,
	                0
	              );
	          }
	          field = undefined;
	          fieldSize = 0;
	          this.emit(
	            'field',
	            partName,
	            data,
	            { nameTruncated: false,
	              valueTruncated: partTruncated,
	              encoding: partEncoding,
	              mimeType: partType }
	          );
	        }

	        if (++parts === partsLimit)
	          this.emit('partsLimit');
	      }
	    };
	    this._bparser = new StreamSearch(`\r\n--${boundary}`, ssCb);

	    this._writecb = null;
	    this._finalcb = null;

	    // Just in case there is no preamble
	    this.write(BUF_CRLF);
	  }

	  static detect(conType) {
	    return (conType.type === 'multipart' && conType.subtype === 'form-data');
	  }

	  _write(chunk, enc, cb) {
	    this._writecb = cb;
	    this._bparser.push(chunk, 0);
	    if (this._writecb)
	      callAndUnsetCb(this);
	  }

	  _destroy(err, cb) {
	    this._hparser = null;
	    this._bparser = ignoreData;
	    if (!err)
	      err = checkEndState(this);
	    const fileStream = this._fileStream;
	    if (fileStream) {
	      this._fileStream = null;
	      fileStream.destroy(err);
	    }
	    cb(err);
	  }

	  _final(cb) {
	    this._bparser.destroy();
	    if (!this._complete)
	      return cb(new Error('Unexpected end of form'));
	    if (this._fileEndsLeft)
	      this._finalcb = finalcb.bind(null, this, cb);
	    else
	      finalcb(this, cb);
	  }
	}

	function finalcb(self, cb, err) {
	  if (err)
	    return cb(err);
	  err = checkEndState(self);
	  cb(err);
	}

	function checkEndState(self) {
	  if (self._hparser)
	    return new Error('Malformed part header');
	  const fileStream = self._fileStream;
	  if (fileStream) {
	    self._fileStream = null;
	    fileStream.destroy(new Error('Unexpected end of file'));
	  }
	  if (!self._complete)
	    return new Error('Unexpected end of form');
	}

	const TOKEN = [
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
	  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	];

	const FIELD_VCHAR = [
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	];

	multipart = Multipart;
	return multipart;
}

var urlencoded;
var hasRequiredUrlencoded;

function requireUrlencoded () {
	if (hasRequiredUrlencoded) return urlencoded;
	hasRequiredUrlencoded = 1;

	const { Writable } = require$$0$1;

	const { getDecoder } = requireUtils$1();

	class URLEncoded extends Writable {
	  constructor(cfg) {
	    const streamOpts = {
	      autoDestroy: true,
	      emitClose: true,
	      highWaterMark: (typeof cfg.highWaterMark === 'number'
	                      ? cfg.highWaterMark
	                      : undefined),
	    };
	    super(streamOpts);

	    let charset = (cfg.defCharset || 'utf8');
	    if (cfg.conType.params && typeof cfg.conType.params.charset === 'string')
	      charset = cfg.conType.params.charset;

	    this.charset = charset;

	    const limits = cfg.limits;
	    this.fieldSizeLimit = (limits && typeof limits.fieldSize === 'number'
	                           ? limits.fieldSize
	                           : 1 * 1024 * 1024);
	    this.fieldsLimit = (limits && typeof limits.fields === 'number'
	                        ? limits.fields
	                        : Infinity);
	    this.fieldNameSizeLimit = (
	      limits && typeof limits.fieldNameSize === 'number'
	      ? limits.fieldNameSize
	      : 100
	    );

	    this._inKey = true;
	    this._keyTrunc = false;
	    this._valTrunc = false;
	    this._bytesKey = 0;
	    this._bytesVal = 0;
	    this._fields = 0;
	    this._key = '';
	    this._val = '';
	    this._byte = -2;
	    this._lastPos = 0;
	    this._encode = 0;
	    this._decoder = getDecoder(charset);
	  }

	  static detect(conType) {
	    return (conType.type === 'application'
	            && conType.subtype === 'x-www-form-urlencoded');
	  }

	  _write(chunk, enc, cb) {
	    if (this._fields >= this.fieldsLimit)
	      return cb();

	    let i = 0;
	    const len = chunk.length;
	    this._lastPos = 0;

	    // Check if we last ended mid-percent-encoded byte
	    if (this._byte !== -2) {
	      i = readPctEnc(this, chunk, i, len);
	      if (i === -1)
	        return cb(new Error('Malformed urlencoded form'));
	      if (i >= len)
	        return cb();
	      if (this._inKey)
	        ++this._bytesKey;
	      else
	        ++this._bytesVal;
	    }

	main:
	    while (i < len) {
	      if (this._inKey) {
	        // Parsing key

	        i = skipKeyBytes(this, chunk, i, len);

	        while (i < len) {
	          switch (chunk[i]) {
	            case 61: // '='
	              if (this._lastPos < i)
	                this._key += chunk.latin1Slice(this._lastPos, i);
	              this._lastPos = ++i;
	              this._key = this._decoder(this._key, this._encode);
	              this._encode = 0;
	              this._inKey = false;
	              continue main;
	            case 38: // '&'
	              if (this._lastPos < i)
	                this._key += chunk.latin1Slice(this._lastPos, i);
	              this._lastPos = ++i;
	              this._key = this._decoder(this._key, this._encode);
	              this._encode = 0;
	              if (this._bytesKey > 0) {
	                this.emit(
	                  'field',
	                  this._key,
	                  '',
	                  { nameTruncated: this._keyTrunc,
	                    valueTruncated: false,
	                    encoding: this.charset,
	                    mimeType: 'text/plain' }
	                );
	              }
	              this._key = '';
	              this._val = '';
	              this._keyTrunc = false;
	              this._valTrunc = false;
	              this._bytesKey = 0;
	              this._bytesVal = 0;
	              if (++this._fields >= this.fieldsLimit) {
	                this.emit('fieldsLimit');
	                return cb();
	              }
	              continue;
	            case 43: // '+'
	              if (this._lastPos < i)
	                this._key += chunk.latin1Slice(this._lastPos, i);
	              this._key += ' ';
	              this._lastPos = i + 1;
	              break;
	            case 37: // '%'
	              if (this._encode === 0)
	                this._encode = 1;
	              if (this._lastPos < i)
	                this._key += chunk.latin1Slice(this._lastPos, i);
	              this._lastPos = i + 1;
	              this._byte = -1;
	              i = readPctEnc(this, chunk, i + 1, len);
	              if (i === -1)
	                return cb(new Error('Malformed urlencoded form'));
	              if (i >= len)
	                return cb();
	              ++this._bytesKey;
	              i = skipKeyBytes(this, chunk, i, len);
	              continue;
	          }
	          ++i;
	          ++this._bytesKey;
	          i = skipKeyBytes(this, chunk, i, len);
	        }
	        if (this._lastPos < i)
	          this._key += chunk.latin1Slice(this._lastPos, i);
	      } else {
	        // Parsing value

	        i = skipValBytes(this, chunk, i, len);

	        while (i < len) {
	          switch (chunk[i]) {
	            case 38: // '&'
	              if (this._lastPos < i)
	                this._val += chunk.latin1Slice(this._lastPos, i);
	              this._lastPos = ++i;
	              this._inKey = true;
	              this._val = this._decoder(this._val, this._encode);
	              this._encode = 0;
	              if (this._bytesKey > 0 || this._bytesVal > 0) {
	                this.emit(
	                  'field',
	                  this._key,
	                  this._val,
	                  { nameTruncated: this._keyTrunc,
	                    valueTruncated: this._valTrunc,
	                    encoding: this.charset,
	                    mimeType: 'text/plain' }
	                );
	              }
	              this._key = '';
	              this._val = '';
	              this._keyTrunc = false;
	              this._valTrunc = false;
	              this._bytesKey = 0;
	              this._bytesVal = 0;
	              if (++this._fields >= this.fieldsLimit) {
	                this.emit('fieldsLimit');
	                return cb();
	              }
	              continue main;
	            case 43: // '+'
	              if (this._lastPos < i)
	                this._val += chunk.latin1Slice(this._lastPos, i);
	              this._val += ' ';
	              this._lastPos = i + 1;
	              break;
	            case 37: // '%'
	              if (this._encode === 0)
	                this._encode = 1;
	              if (this._lastPos < i)
	                this._val += chunk.latin1Slice(this._lastPos, i);
	              this._lastPos = i + 1;
	              this._byte = -1;
	              i = readPctEnc(this, chunk, i + 1, len);
	              if (i === -1)
	                return cb(new Error('Malformed urlencoded form'));
	              if (i >= len)
	                return cb();
	              ++this._bytesVal;
	              i = skipValBytes(this, chunk, i, len);
	              continue;
	          }
	          ++i;
	          ++this._bytesVal;
	          i = skipValBytes(this, chunk, i, len);
	        }
	        if (this._lastPos < i)
	          this._val += chunk.latin1Slice(this._lastPos, i);
	      }
	    }

	    cb();
	  }

	  _final(cb) {
	    if (this._byte !== -2)
	      return cb(new Error('Malformed urlencoded form'));
	    if (!this._inKey || this._bytesKey > 0 || this._bytesVal > 0) {
	      if (this._inKey)
	        this._key = this._decoder(this._key, this._encode);
	      else
	        this._val = this._decoder(this._val, this._encode);
	      this.emit(
	        'field',
	        this._key,
	        this._val,
	        { nameTruncated: this._keyTrunc,
	          valueTruncated: this._valTrunc,
	          encoding: this.charset,
	          mimeType: 'text/plain' }
	      );
	    }
	    cb();
	  }
	}

	function readPctEnc(self, chunk, pos, len) {
	  if (pos >= len)
	    return len;

	  if (self._byte === -1) {
	    // We saw a '%' but no hex characters yet
	    const hexUpper = HEX_VALUES[chunk[pos++]];
	    if (hexUpper === -1)
	      return -1;

	    if (hexUpper >= 8)
	      self._encode = 2; // Indicate high bits detected

	    if (pos < len) {
	      // Both hex characters are in this chunk
	      const hexLower = HEX_VALUES[chunk[pos++]];
	      if (hexLower === -1)
	        return -1;

	      if (self._inKey)
	        self._key += String.fromCharCode((hexUpper << 4) + hexLower);
	      else
	        self._val += String.fromCharCode((hexUpper << 4) + hexLower);

	      self._byte = -2;
	      self._lastPos = pos;
	    } else {
	      // Only one hex character was available in this chunk
	      self._byte = hexUpper;
	    }
	  } else {
	    // We saw only one hex character so far
	    const hexLower = HEX_VALUES[chunk[pos++]];
	    if (hexLower === -1)
	      return -1;

	    if (self._inKey)
	      self._key += String.fromCharCode((self._byte << 4) + hexLower);
	    else
	      self._val += String.fromCharCode((self._byte << 4) + hexLower);

	    self._byte = -2;
	    self._lastPos = pos;
	  }

	  return pos;
	}

	function skipKeyBytes(self, chunk, pos, len) {
	  // Skip bytes if we've truncated
	  if (self._bytesKey > self.fieldNameSizeLimit) {
	    if (!self._keyTrunc) {
	      if (self._lastPos < pos)
	        self._key += chunk.latin1Slice(self._lastPos, pos - 1);
	    }
	    self._keyTrunc = true;
	    for (; pos < len; ++pos) {
	      const code = chunk[pos];
	      if (code === 61/* '=' */ || code === 38/* '&' */)
	        break;
	      ++self._bytesKey;
	    }
	    self._lastPos = pos;
	  }

	  return pos;
	}

	function skipValBytes(self, chunk, pos, len) {
	  // Skip bytes if we've truncated
	  if (self._bytesVal > self.fieldSizeLimit) {
	    if (!self._valTrunc) {
	      if (self._lastPos < pos)
	        self._val += chunk.latin1Slice(self._lastPos, pos - 1);
	    }
	    self._valTrunc = true;
	    for (; pos < len; ++pos) {
	      if (chunk[pos] === 38/* '&' */)
	        break;
	      ++self._bytesVal;
	    }
	    self._lastPos = pos;
	  }

	  return pos;
	}

	/* eslint-disable no-multi-spaces */
	const HEX_VALUES = [
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	   0,  1,  2,  3,  4,  5,  6,  7,  8,  9, -1, -1, -1, -1, -1, -1,
	  -1, 10, 11, 12, 13, 14, 15, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, 10, 11, 12, 13, 14, 15, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
	];
	/* eslint-enable no-multi-spaces */

	urlencoded = URLEncoded;
	return urlencoded;
}

var lib$1;
var hasRequiredLib$1;

function requireLib$1 () {
	if (hasRequiredLib$1) return lib$1;
	hasRequiredLib$1 = 1;

	const { parseContentType } = requireUtils$1();

	function getInstance(cfg) {
	  const headers = cfg.headers;
	  const conType = parseContentType(headers['content-type']);
	  if (!conType)
	    throw new Error('Malformed content type');

	  for (const type of TYPES) {
	    const matched = type.detect(conType);
	    if (!matched)
	      continue;

	    const instanceCfg = {
	      limits: cfg.limits,
	      headers,
	      conType,
	      highWaterMark: undefined,
	      fileHwm: undefined,
	      defCharset: undefined,
	      defParamCharset: undefined,
	      preservePath: false,
	    };
	    if (cfg.highWaterMark)
	      instanceCfg.highWaterMark = cfg.highWaterMark;
	    if (cfg.fileHwm)
	      instanceCfg.fileHwm = cfg.fileHwm;
	    instanceCfg.defCharset = cfg.defCharset;
	    instanceCfg.defParamCharset = cfg.defParamCharset;
	    instanceCfg.preservePath = cfg.preservePath;
	    return new type(instanceCfg);
	  }

	  throw new Error(`Unsupported content type: ${headers['content-type']}`);
	}

	// Note: types are explicitly listed here for easier bundling
	// See: https://github.com/mscdex/busboy/issues/121
	const TYPES = [
	  requireMultipart(),
	  requireUrlencoded(),
	].filter(function(typemod) { return typeof typemod.detect === 'function'; });

	lib$1 = (cfg) => {
	  if (typeof cfg !== 'object' || cfg === null)
	    cfg = {};

	  if (typeof cfg.headers !== 'object'
	      || cfg.headers === null
	      || typeof cfg.headers['content-type'] !== 'string') {
	    throw new Error('Missing Content-Type');
	  }

	  return getInstance(cfg);
	};
	return lib$1;
}

var Blob$1 = {};

var ReadableStream$2 = {};

var hasRequiredReadableStream;

function requireReadableStream () {
	if (hasRequiredReadableStream) return ReadableStream$2;
	hasRequiredReadableStream = 1;
	Object.defineProperty(ReadableStream$2, "__esModule", { value: true });
	ReadableStream$2.PonyfillReadableStream = void 0;
	const stream_1 = require$$0$1;
	function createController(desiredSize, readable) {
	    let chunks = [];
	    let _closed = false;
	    let flushed = false;
	    return {
	        desiredSize,
	        enqueue(chunk) {
	            const buf = typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
	            if (!flushed) {
	                chunks.push(buf);
	            }
	            else {
	                readable.push(buf);
	            }
	        },
	        close() {
	            if (chunks.length > 0) {
	                this._flush();
	            }
	            readable.push(null);
	            _closed = true;
	        },
	        error(error) {
	            if (chunks.length > 0) {
	                this._flush();
	            }
	            readable.destroy(error);
	        },
	        get _closed() {
	            return _closed;
	        },
	        _flush() {
	            flushed = true;
	            if (chunks.length > 0) {
	                const concatenated = chunks.length > 1 ? Buffer.concat(chunks) : chunks[0];
	                readable.push(concatenated);
	                chunks = [];
	            }
	        },
	    };
	}
	function isNodeReadable(obj) {
	    return obj?.read != null;
	}
	function isReadableStream(obj) {
	    return obj?.getReader != null;
	}
	class PonyfillReadableStream {
	    constructor(underlyingSource) {
	        this.locked = false;
	        if (underlyingSource instanceof PonyfillReadableStream && underlyingSource.readable != null) {
	            this.readable = underlyingSource.readable;
	        }
	        else if (isNodeReadable(underlyingSource)) {
	            this.readable = underlyingSource;
	        }
	        else if (isReadableStream(underlyingSource)) {
	            let reader;
	            let started = false;
	            this.readable = new stream_1.Readable({
	                read() {
	                    if (!started) {
	                        started = true;
	                        reader = underlyingSource.getReader();
	                    }
	                    reader
	                        .read()
	                        .then(({ value, done }) => {
	                        if (done) {
	                            this.push(null);
	                        }
	                        else {
	                            this.push(value);
	                        }
	                    })
	                        .catch(err => {
	                        this.destroy(err);
	                    });
	                },
	                destroy(err, callback) {
	                    reader.cancel(err).then(() => callback(err), callback);
	                },
	            });
	        }
	        else {
	            let started = false;
	            let ongoing = false;
	            this.readable = new stream_1.Readable({
	                read(desiredSize) {
	                    if (ongoing) {
	                        return;
	                    }
	                    ongoing = true;
	                    return Promise.resolve().then(async () => {
	                        if (!started) {
	                            const controller = createController(desiredSize, this);
	                            started = true;
	                            await underlyingSource?.start?.(controller);
	                            controller._flush();
	                            if (controller._closed) {
	                                return;
	                            }
	                        }
	                        const controller = createController(desiredSize, this);
	                        await underlyingSource?.pull?.(controller);
	                        controller._flush();
	                        ongoing = false;
	                    });
	                },
	                async destroy(err, callback) {
	                    try {
	                        await underlyingSource?.cancel?.(err);
	                        callback(null);
	                    }
	                    catch (err) {
	                        callback(err);
	                    }
	                },
	            });
	        }
	    }
	    cancel(reason) {
	        this.readable.destroy(reason);
	        return Promise.resolve();
	    }
	    getReader(_options) {
	        const iterator = this.readable[Symbol.asyncIterator]();
	        this.locked = true;
	        return {
	            read() {
	                return iterator.next();
	            },
	            releaseLock: () => {
	                iterator.return?.();
	                this.locked = false;
	            },
	            cancel: async (reason) => {
	                await iterator.return?.(reason);
	                this.locked = false;
	            },
	            closed: new Promise((resolve, reject) => {
	                this.readable.once('end', resolve);
	                this.readable.once('error', reject);
	            }),
	        };
	    }
	    [Symbol.asyncIterator]() {
	        return this.readable[Symbol.asyncIterator]();
	    }
	    tee() {
	        throw new Error('Not implemented');
	    }
	    async pipeTo(destination) {
	        const writer = destination.getWriter();
	        await writer.ready;
	        for await (const chunk of this.readable) {
	            await writer.write(chunk);
	        }
	        await writer.ready;
	        return writer.close();
	    }
	    pipeThrough({ writable, readable, }) {
	        this.pipeTo(writable);
	        return readable;
	    }
	    static [Symbol.hasInstance](instance) {
	        return isReadableStream(instance);
	    }
	}
	ReadableStream$2.PonyfillReadableStream = PonyfillReadableStream;
	return ReadableStream$2;
}

var utils = {};

var hasRequiredUtils;

function requireUtils () {
	if (hasRequiredUtils) return utils;
	hasRequiredUtils = 1;
	Object.defineProperty(utils, "__esModule", { value: true });
	utils.isNodeReadable = utils.isArrayBufferView = utils.fakePromise = utils.defaultHeadersSerializer = utils.getHeadersObj = void 0;
	function isHeadersInstance(obj) {
	    return obj?.forEach != null;
	}
	function getHeadersObj(headers) {
	    if (headers == null || !isHeadersInstance(headers)) {
	        return headers;
	    }
	    const obj = {};
	    headers.forEach((value, key) => {
	        obj[key] = value;
	    });
	    return obj;
	}
	utils.getHeadersObj = getHeadersObj;
	function defaultHeadersSerializer(headers, onContentLength) {
	    const headerArray = [];
	    headers.forEach((value, key) => {
	        if (onContentLength && key === 'content-length') {
	            onContentLength(value);
	        }
	        headerArray.push(`${key}: ${value}`);
	    });
	    return headerArray;
	}
	utils.defaultHeadersSerializer = defaultHeadersSerializer;
	function isPromise(val) {
	    return val?.then != null;
	}
	function fakePromise(value) {
	    if (isPromise(value)) {
	        return value;
	    }
	    // Write a fake promise to avoid the promise constructor
	    // being called with `new Promise` in the browser.
	    return {
	        then(resolve) {
	            if (resolve) {
	                const callbackResult = resolve(value);
	                if (isPromise(callbackResult)) {
	                    return callbackResult;
	                }
	                return fakePromise(callbackResult);
	            }
	            return this;
	        },
	        catch() {
	            return this;
	        },
	        finally(cb) {
	            if (cb) {
	                const callbackResult = cb();
	                if (isPromise(callbackResult)) {
	                    return callbackResult.then(() => value);
	                }
	                return fakePromise(value);
	            }
	            return this;
	        },
	        [Symbol.toStringTag]: 'Promise',
	    };
	}
	utils.fakePromise = fakePromise;
	function isArrayBufferView(obj) {
	    return obj != null && obj.buffer != null && obj.byteLength != null && obj.byteOffset != null;
	}
	utils.isArrayBufferView = isArrayBufferView;
	function isNodeReadable(obj) {
	    return obj != null && obj.pipe != null;
	}
	utils.isNodeReadable = isNodeReadable;
	return utils;
}

var hasRequiredBlob;

function requireBlob () {
	if (hasRequiredBlob) return Blob$1;
	hasRequiredBlob = 1;
	Object.defineProperty(Blob$1, "__esModule", { value: true });
	Blob$1.PonyfillBlob = void 0;
	/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
	const ReadableStream_js_1 = requireReadableStream();
	const utils_js_1 = requireUtils();
	function getBlobPartAsBuffer(blobPart) {
	    if (typeof blobPart === 'string') {
	        return Buffer.from(blobPart);
	    }
	    else if (Buffer.isBuffer(blobPart)) {
	        return blobPart;
	    }
	    else if ((0, utils_js_1.isArrayBufferView)(blobPart)) {
	        return Buffer.from(blobPart.buffer, blobPart.byteOffset, blobPart.byteLength);
	    }
	    else {
	        return Buffer.from(blobPart);
	    }
	}
	function isBlob(obj) {
	    return obj != null && obj.arrayBuffer != null;
	}
	// Will be removed after v14 reaches EOL
	// Needed because v14 doesn't have .stream() implemented
	class PonyfillBlob {
	    constructor(blobParts, options) {
	        this.blobParts = blobParts;
	        this._size = null;
	        this.type = options?.type || 'application/octet-stream';
	        this.encoding = options?.encoding || 'utf8';
	        this._size = options?.size || null;
	        if (blobParts.length === 1 && isBlob(blobParts[0])) {
	            return blobParts[0];
	        }
	    }
	    arrayBuffer() {
	        if (this.blobParts.length === 1) {
	            const blobPart = this.blobParts[0];
	            if (isBlob(blobPart)) {
	                return blobPart.arrayBuffer();
	            }
	            return (0, utils_js_1.fakePromise)(getBlobPartAsBuffer(blobPart));
	        }
	        const jobs = [];
	        const bufferChunks = this.blobParts.map((blobPart, i) => {
	            if (isBlob(blobPart)) {
	                jobs.push(blobPart.arrayBuffer().then(arrayBuf => {
	                    bufferChunks[i] = Buffer.from(arrayBuf, undefined, blobPart.size);
	                }));
	                return undefined;
	            }
	            else {
	                return getBlobPartAsBuffer(blobPart);
	            }
	        });
	        if (jobs.length > 0) {
	            return Promise.all(jobs).then(() => Buffer.concat(bufferChunks, this._size || undefined));
	        }
	        return (0, utils_js_1.fakePromise)(Buffer.concat(bufferChunks, this._size || undefined));
	    }
	    text() {
	        if (this.blobParts.length === 1) {
	            const blobPart = this.blobParts[0];
	            if (typeof blobPart === 'string') {
	                return (0, utils_js_1.fakePromise)(blobPart);
	            }
	            if (isBlob(blobPart)) {
	                return blobPart.text();
	            }
	            const buf = getBlobPartAsBuffer(blobPart);
	            return (0, utils_js_1.fakePromise)(buf.toString(this.encoding));
	        }
	        return this.arrayBuffer().then(buf => buf.toString(this.encoding));
	    }
	    get size() {
	        if (this._size == null) {
	            this._size = 0;
	            for (const blobPart of this.blobParts) {
	                if (typeof blobPart === 'string') {
	                    this._size += Buffer.byteLength(blobPart);
	                }
	                else if (isBlob(blobPart)) {
	                    this._size += blobPart.size;
	                }
	                else if ((0, utils_js_1.isArrayBufferView)(blobPart)) {
	                    this._size += blobPart.byteLength;
	                }
	            }
	        }
	        return this._size;
	    }
	    stream() {
	        if (this.blobParts.length === 1) {
	            const blobPart = this.blobParts[0];
	            if (isBlob(blobPart)) {
	                return blobPart.stream();
	            }
	            const buf = getBlobPartAsBuffer(blobPart);
	            return new ReadableStream_js_1.PonyfillReadableStream({
	                start: controller => {
	                    controller.enqueue(buf);
	                    controller.close();
	                },
	            });
	        }
	        let blobPartIterator;
	        return new ReadableStream_js_1.PonyfillReadableStream({
	            start: controller => {
	                if (this.blobParts.length === 0) {
	                    controller.close();
	                    return;
	                }
	                blobPartIterator = this.blobParts[Symbol.iterator]();
	            },
	            pull: controller => {
	                const { value: blobPart, done } = blobPartIterator.next();
	                if (done) {
	                    controller.close();
	                    return;
	                }
	                if (blobPart) {
	                    if (isBlob(blobPart)) {
	                        return blobPart.arrayBuffer().then(arrayBuffer => {
	                            const buf = Buffer.from(arrayBuffer, undefined, blobPart.size);
	                            controller.enqueue(buf);
	                        });
	                    }
	                    const buf = getBlobPartAsBuffer(blobPart);
	                    controller.enqueue(buf);
	                }
	            },
	        });
	    }
	    slice() {
	        throw new Error('Not implemented');
	    }
	}
	Blob$1.PonyfillBlob = PonyfillBlob;
	return Blob$1;
}

var File$1 = {};

var hasRequiredFile;

function requireFile () {
	if (hasRequiredFile) return File$1;
	hasRequiredFile = 1;
	Object.defineProperty(File$1, "__esModule", { value: true });
	File$1.PonyfillFile = void 0;
	const Blob_js_1 = requireBlob();
	class PonyfillFile extends Blob_js_1.PonyfillBlob {
	    constructor(fileBits, name, options) {
	        super(fileBits, options);
	        this.name = name;
	        this.webkitRelativePath = '';
	        this.lastModified = options?.lastModified || Date.now();
	    }
	}
	File$1.PonyfillFile = PonyfillFile;
	return File$1;
}

var FormData$1 = {};

var hasRequiredFormData;

function requireFormData () {
	if (hasRequiredFormData) return FormData$1;
	hasRequiredFormData = 1;
	Object.defineProperty(FormData$1, "__esModule", { value: true });
	FormData$1.getStreamFromFormData = FormData$1.PonyfillFormData = void 0;
	const ReadableStream_js_1 = requireReadableStream();
	class PonyfillFormData {
	    constructor() {
	        this.map = new Map();
	    }
	    append(name, value, fileName) {
	        let values = this.map.get(name);
	        if (!values) {
	            values = [];
	            this.map.set(name, values);
	        }
	        const entry = isBlob(value)
	            ? getNormalizedFile(name, value, fileName)
	            : value;
	        values.push(entry);
	    }
	    delete(name) {
	        this.map.delete(name);
	    }
	    get(name) {
	        const values = this.map.get(name);
	        return values ? values[0] : null;
	    }
	    getAll(name) {
	        return this.map.get(name) || [];
	    }
	    has(name) {
	        return this.map.has(name);
	    }
	    set(name, value, fileName) {
	        const entry = isBlob(value)
	            ? getNormalizedFile(name, value, fileName)
	            : value;
	        this.map.set(name, [entry]);
	    }
	    *[Symbol.iterator]() {
	        for (const [key, values] of this.map) {
	            for (const value of values) {
	                yield [key, value];
	            }
	        }
	    }
	    entries() {
	        return this[Symbol.iterator]();
	    }
	    keys() {
	        return this.map.keys();
	    }
	    *values() {
	        for (const values of this.map.values()) {
	            for (const value of values) {
	                yield value;
	            }
	        }
	    }
	    forEach(callback) {
	        for (const [key, value] of this) {
	            callback(value, key, this);
	        }
	    }
	}
	FormData$1.PonyfillFormData = PonyfillFormData;
	function getStreamFromFormData(formData, boundary = '---') {
	    const entries = [];
	    let sentInitialHeader = false;
	    return new ReadableStream_js_1.PonyfillReadableStream({
	        start: controller => {
	            formData.forEach((value, key) => {
	                if (!sentInitialHeader) {
	                    controller.enqueue(Buffer.from(`--${boundary}\r\n`));
	                    sentInitialHeader = true;
	                }
	                entries.push([key, value]);
	            });
	            if (!sentInitialHeader) {
	                controller.enqueue(Buffer.from(`--${boundary}--\r\n`));
	                controller.close();
	            }
	        },
	        pull: async (controller) => {
	            const entry = entries.shift();
	            if (entry) {
	                const [key, value] = entry;
	                if (typeof value === 'string') {
	                    controller.enqueue(Buffer.from(`Content-Disposition: form-data; name="${key}"\r\n\r\n`));
	                    controller.enqueue(Buffer.from(value));
	                }
	                else {
	                    let filenamePart = '';
	                    if (value.name) {
	                        filenamePart = `; filename="${value.name}"`;
	                    }
	                    controller.enqueue(Buffer.from(`Content-Disposition: form-data; name="${key}"${filenamePart}\r\n`));
	                    controller.enqueue(Buffer.from(`Content-Type: ${value.type || 'application/octet-stream'}\r\n\r\n`));
	                    const entryStream = value.stream();
	                    for await (const chunk of entryStream) {
	                        controller.enqueue(chunk);
	                    }
	                }
	                if (entries.length === 0) {
	                    controller.enqueue(Buffer.from(`\r\n--${boundary}--\r\n`));
	                    controller.close();
	                }
	                else {
	                    controller.enqueue(Buffer.from(`\r\n--${boundary}\r\n`));
	                }
	            }
	            else {
	                controller.enqueue(Buffer.from(`\r\n--${boundary}--\r\n`));
	                controller.close();
	            }
	        },
	    });
	}
	FormData$1.getStreamFromFormData = getStreamFromFormData;
	function getNormalizedFile(name, blob, fileName) {
	    Object.defineProperty(blob, 'name', {
	        configurable: true,
	        enumerable: true,
	        value: fileName || blob.name || name,
	    });
	    return blob;
	}
	function isBlob(value) {
	    return value?.arrayBuffer != null;
	}
	return FormData$1;
}

var hasRequiredBody;

function requireBody () {
	if (hasRequiredBody) return Body;
	hasRequiredBody = 1;
	Object.defineProperty(Body, "__esModule", { value: true });
	Body.PonyfillBody = void 0;
	const tslib_1 = require$$0;
	const stream_1 = require$$0$1;
	const busboy_1 = tslib_1.__importDefault(requireLib$1());
	const Blob_js_1 = requireBlob();
	const File_js_1 = requireFile();
	const FormData_js_1 = requireFormData();
	const ReadableStream_js_1 = requireReadableStream();
	const utils_js_1 = requireUtils();
	var BodyInitType;
	(function (BodyInitType) {
	    BodyInitType["ReadableStream"] = "ReadableStream";
	    BodyInitType["Blob"] = "Blob";
	    BodyInitType["FormData"] = "FormData";
	    BodyInitType["String"] = "String";
	    BodyInitType["Readable"] = "Readable";
	    BodyInitType["Buffer"] = "Buffer";
	})(BodyInitType || (BodyInitType = {}));
	class PonyfillBody {
	    constructor(bodyInit, options = {}) {
	        this.bodyInit = bodyInit;
	        this.options = options;
	        this.bodyUsed = false;
	        this.contentType = null;
	        this.contentLength = null;
	        this._bodyFactory = () => null;
	        this._generatedBody = null;
	        const { bodyFactory, contentType, contentLength, bodyType, buffer } = processBodyInit(bodyInit);
	        this._bodyFactory = bodyFactory;
	        this.contentType = contentType;
	        this.contentLength = contentLength;
	        this.bodyType = bodyType;
	        this._buffer = buffer;
	    }
	    generateBody() {
	        if (this._generatedBody) {
	            return this._generatedBody;
	        }
	        const body = this._bodyFactory();
	        this._generatedBody = body;
	        return body;
	    }
	    get body() {
	        const _body = this.generateBody();
	        if (_body != null) {
	            const ponyfillReadableStream = _body;
	            const readable = _body.readable;
	            return new Proxy(_body.readable, {
	                get(_, prop) {
	                    if (prop in ponyfillReadableStream) {
	                        const ponyfillReadableStreamProp = ponyfillReadableStream[prop];
	                        if (typeof ponyfillReadableStreamProp === 'function') {
	                            return ponyfillReadableStreamProp.bind(ponyfillReadableStream);
	                        }
	                        return ponyfillReadableStreamProp;
	                    }
	                    if (prop in readable) {
	                        const readableProp = readable[prop];
	                        if (typeof readableProp === 'function') {
	                            return readableProp.bind(readable);
	                        }
	                        return readableProp;
	                    }
	                },
	            });
	        }
	        return null;
	    }
	    _collectChunksFromReadable() {
	        const _body = this.generateBody();
	        if (!_body) {
	            return (0, utils_js_1.fakePromise)([]);
	        }
	        const chunks = [];
	        _body.readable.on('data', chunk => {
	            chunks.push(chunk);
	        });
	        return new Promise((resolve, reject) => {
	            _body.readable.once('end', () => {
	                resolve(chunks);
	            });
	            _body.readable.once('error', e => {
	                reject(e);
	            });
	        });
	    }
	    blob() {
	        if (this.bodyType === BodyInitType.Blob) {
	            return (0, utils_js_1.fakePromise)(this.bodyInit);
	        }
	        if (this._buffer) {
	            const blob = new Blob_js_1.PonyfillBlob([this._buffer], {
	                type: this.contentType || '',
	                size: this.contentLength,
	            });
	            return (0, utils_js_1.fakePromise)(blob);
	        }
	        return this._collectChunksFromReadable().then(chunks => {
	            return new Blob_js_1.PonyfillBlob(chunks, {
	                type: this.contentType || '',
	                size: this.contentLength,
	            });
	        });
	    }
	    formData(opts) {
	        if (this.bodyType === BodyInitType.FormData) {
	            return (0, utils_js_1.fakePromise)(this.bodyInit);
	        }
	        const formData = new FormData_js_1.PonyfillFormData();
	        const _body = this.generateBody();
	        if (_body == null) {
	            return (0, utils_js_1.fakePromise)(formData);
	        }
	        const formDataLimits = {
	            ...this.options.formDataLimits,
	            ...opts?.formDataLimits,
	        };
	        return new Promise((resolve, reject) => {
	            const bb = (0, busboy_1.default)({
	                headers: {
	                    'content-type': this.contentType || '',
	                },
	                limits: formDataLimits,
	                defParamCharset: 'utf-8',
	            });
	            bb.on('field', (name, value, { nameTruncated, valueTruncated }) => {
	                if (nameTruncated) {
	                    reject(new Error(`Field name size exceeded: ${formDataLimits?.fieldNameSize} bytes`));
	                }
	                if (valueTruncated) {
	                    reject(new Error(`Field value size exceeded: ${formDataLimits?.fieldSize} bytes`));
	                }
	                formData.set(name, value);
	            });
	            bb.on('fieldsLimit', () => {
	                reject(new Error(`Fields limit exceeded: ${formDataLimits?.fields}`));
	            });
	            bb.on('file', (name, fileStream, { filename, mimeType }) => {
	                const chunks = [];
	                fileStream.on('limit', () => {
	                    reject(new Error(`File size limit exceeded: ${formDataLimits?.fileSize} bytes`));
	                });
	                fileStream.on('data', chunk => {
	                    chunks.push(chunk);
	                });
	                fileStream.on('close', () => {
	                    if (fileStream.truncated) {
	                        reject(new Error(`File size limit exceeded: ${formDataLimits?.fileSize} bytes`));
	                    }
	                    const file = new File_js_1.PonyfillFile(chunks, filename, { type: mimeType });
	                    formData.set(name, file);
	                });
	            });
	            bb.on('filesLimit', () => {
	                reject(new Error(`Files limit exceeded: ${formDataLimits?.files}`));
	            });
	            bb.on('partsLimit', () => {
	                reject(new Error(`Parts limit exceeded: ${formDataLimits?.parts}`));
	            });
	            bb.on('close', () => {
	                resolve(formData);
	            });
	            bb.on('error', (err = 'An error occurred while parsing the form data') => {
	                const errMessage = err.message || err.toString();
	                reject(new TypeError(errMessage, err.cause));
	            });
	            _body?.readable.pipe(bb);
	        });
	    }
	    arrayBuffer() {
	        if (this._buffer) {
	            return (0, utils_js_1.fakePromise)(this._buffer);
	        }
	        if (this.bodyType === BodyInitType.Blob) {
	            if (this.bodyInit instanceof Blob_js_1.PonyfillBlob) {
	                return this.bodyInit.arrayBuffer();
	            }
	            const bodyInitTyped = this.bodyInit;
	            return bodyInitTyped
	                .arrayBuffer()
	                .then(arrayBuffer => Buffer.from(arrayBuffer, undefined, bodyInitTyped.size));
	        }
	        return this._collectChunksFromReadable().then(function concatCollectedChunksFromReadable(chunks) {
	            if (chunks.length === 1) {
	                return chunks[0];
	            }
	            return Buffer.concat(chunks);
	        });
	    }
	    json() {
	        return this.text().then(function parseTextAsJson(text) {
	            return JSON.parse(text);
	        });
	    }
	    text() {
	        if (this.bodyType === BodyInitType.String) {
	            return (0, utils_js_1.fakePromise)(this.bodyInit);
	        }
	        return this.arrayBuffer().then(buffer => buffer.toString('utf-8'));
	    }
	}
	Body.PonyfillBody = PonyfillBody;
	function processBodyInit(bodyInit) {
	    if (bodyInit == null) {
	        return {
	            bodyFactory: () => null,
	            contentType: null,
	            contentLength: null,
	        };
	    }
	    if (typeof bodyInit === 'string') {
	        const buffer = Buffer.from(bodyInit);
	        const contentLength = buffer.byteLength;
	        return {
	            bodyType: BodyInitType.String,
	            contentType: 'text/plain;charset=UTF-8',
	            contentLength,
	            buffer,
	            bodyFactory() {
	                const readable = stream_1.Readable.from(buffer);
	                return new ReadableStream_js_1.PonyfillReadableStream(readable);
	            },
	        };
	    }
	    if (Buffer.isBuffer(bodyInit)) {
	        return {
	            bodyType: BodyInitType.Buffer,
	            contentType: null,
	            contentLength: bodyInit.length,
	            buffer: bodyInit,
	            bodyFactory() {
	                const readable = stream_1.Readable.from(bodyInit);
	                const body = new ReadableStream_js_1.PonyfillReadableStream(readable);
	                return body;
	            },
	        };
	    }
	    if ((0, utils_js_1.isArrayBufferView)(bodyInit)) {
	        const buffer = Buffer.from(bodyInit.buffer, bodyInit.byteOffset, bodyInit.byteLength);
	        return {
	            bodyType: BodyInitType.Buffer,
	            contentLength: bodyInit.byteLength,
	            contentType: null,
	            buffer,
	            bodyFactory() {
	                const readable = stream_1.Readable.from(buffer);
	                const body = new ReadableStream_js_1.PonyfillReadableStream(readable);
	                return body;
	            },
	        };
	    }
	    if (bodyInit instanceof ReadableStream_js_1.PonyfillReadableStream && bodyInit.readable != null) {
	        return {
	            bodyType: BodyInitType.ReadableStream,
	            bodyFactory: () => bodyInit,
	            contentType: null,
	            contentLength: null,
	        };
	    }
	    if (isBlob(bodyInit)) {
	        return {
	            bodyType: BodyInitType.Blob,
	            contentType: bodyInit.type,
	            contentLength: bodyInit.size,
	            bodyFactory() {
	                return bodyInit.stream();
	            },
	        };
	    }
	    if (bodyInit instanceof ArrayBuffer) {
	        const contentLength = bodyInit.byteLength;
	        const buffer = Buffer.from(bodyInit, undefined, bodyInit.byteLength);
	        return {
	            bodyType: BodyInitType.Buffer,
	            contentType: null,
	            contentLength,
	            buffer,
	            bodyFactory() {
	                const readable = stream_1.Readable.from(buffer);
	                const body = new ReadableStream_js_1.PonyfillReadableStream(readable);
	                return body;
	            },
	        };
	    }
	    if (bodyInit instanceof stream_1.Readable) {
	        return {
	            bodyType: BodyInitType.Readable,
	            contentType: null,
	            contentLength: null,
	            bodyFactory() {
	                const body = new ReadableStream_js_1.PonyfillReadableStream(bodyInit);
	                return body;
	            },
	        };
	    }
	    if (isURLSearchParams(bodyInit)) {
	        const contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
	        return {
	            bodyType: BodyInitType.String,
	            contentType,
	            contentLength: null,
	            bodyFactory() {
	                const body = new ReadableStream_js_1.PonyfillReadableStream(stream_1.Readable.from(bodyInit.toString()));
	                return body;
	            },
	        };
	    }
	    if (isFormData(bodyInit)) {
	        const boundary = Math.random().toString(36).substr(2);
	        const contentType = `multipart/form-data; boundary=${boundary}`;
	        return {
	            bodyType: BodyInitType.FormData,
	            contentType,
	            contentLength: null,
	            bodyFactory() {
	                return (0, FormData_js_1.getStreamFromFormData)(bodyInit, boundary);
	            },
	        };
	    }
	    if (isReadableStream(bodyInit)) {
	        return {
	            contentType: null,
	            contentLength: null,
	            bodyFactory() {
	                return new ReadableStream_js_1.PonyfillReadableStream(bodyInit);
	            },
	        };
	    }
	    if (bodyInit[Symbol.iterator] || bodyInit[Symbol.asyncIterator]) {
	        return {
	            contentType: null,
	            contentLength: null,
	            bodyFactory() {
	                const readable = stream_1.Readable.from(bodyInit);
	                return new ReadableStream_js_1.PonyfillReadableStream(readable);
	            },
	        };
	    }
	    throw new Error('Unknown body type');
	}
	function isFormData(value) {
	    return value?.forEach != null;
	}
	function isBlob(value) {
	    return value?.stream != null;
	}
	function isURLSearchParams(value) {
	    return value?.sort != null;
	}
	function isReadableStream(value) {
	    return value?.getReader != null;
	}
	return Body;
}

var Headers$2 = {};

var hasRequiredHeaders;

function requireHeaders () {
	if (hasRequiredHeaders) return Headers$2;
	hasRequiredHeaders = 1;
	Object.defineProperty(Headers$2, "__esModule", { value: true });
	Headers$2.PonyfillHeaders = Headers$2.isHeadersLike = void 0;
	const util_1 = require$$0$2;
	function isHeadersLike(headers) {
	    return headers?.get && headers?.forEach;
	}
	Headers$2.isHeadersLike = isHeadersLike;
	class PonyfillHeaders {
	    constructor(headersInit) {
	        this.headersInit = headersInit;
	        this.objectNormalizedKeysOfHeadersInit = [];
	        this.objectOriginalKeysOfHeadersInit = [];
	        this._setCookies = [];
	    }
	    // perf: we don't need to build `this.map` for Requests, as we can access the headers directly
	    _get(key) {
	        const normalized = key.toLowerCase();
	        if (normalized === 'set-cookie') {
	            return this._setCookies.join(', ');
	        }
	        // If the map is built, reuse it
	        if (this._map) {
	            return this._map.get(normalized) || null;
	        }
	        // If the map is not built, try to get the value from the this.headersInit
	        if (this.headersInit == null) {
	            return null;
	        }
	        if (Array.isArray(this.headersInit)) {
	            return this.headersInit.find(header => header[0].toLowerCase() === normalized)?.[1] || null;
	        }
	        else if (isHeadersLike(this.headersInit)) {
	            return this.headersInit.get(normalized);
	        }
	        else {
	            const initValue = this.headersInit[key] || this.headersInit[normalized];
	            if (initValue != null) {
	                return initValue;
	            }
	            if (!this.objectNormalizedKeysOfHeadersInit.length) {
	                Object.keys(this.headersInit).forEach(k => {
	                    this.objectOriginalKeysOfHeadersInit.push(k);
	                    this.objectNormalizedKeysOfHeadersInit.push(k.toLowerCase());
	                });
	            }
	            const index = this.objectNormalizedKeysOfHeadersInit.indexOf(normalized);
	            if (index === -1) {
	                return null;
	            }
	            const originalKey = this.objectOriginalKeysOfHeadersInit[index];
	            return this.headersInit[originalKey];
	        }
	    }
	    // perf: Build the map of headers lazily, only when we need to access all headers or write to it.
	    // I could do a getter here, but I'm too lazy to type `getter`.
	    getMap() {
	        if (!this._map) {
	            if (this.headersInit != null) {
	                if (Array.isArray(this.headersInit)) {
	                    this._map = new Map();
	                    this.headersInit.forEach(([key, value]) => {
	                        const normalizedKey = key.toLowerCase();
	                        if (normalizedKey === 'set-cookie') {
	                            this._setCookies.push(value);
	                            return;
	                        }
	                        this._map.set(normalizedKey, value);
	                    });
	                }
	                else if (isHeadersLike(this.headersInit)) {
	                    this._map = new Map();
	                    this.headersInit.forEach((value, key) => {
	                        if (key === 'set-cookie') {
	                            this._setCookies.push(value);
	                            return;
	                        }
	                        this._map.set(key, value);
	                    });
	                }
	                else {
	                    this._map = new Map();
	                    for (const initKey in this.headersInit) {
	                        const initValue = this.headersInit[initKey];
	                        if (initValue != null) {
	                            const normalizedKey = initKey.toLowerCase();
	                            if (normalizedKey === 'set-cookie') {
	                                this._setCookies.push(initValue);
	                                continue;
	                            }
	                            this._map.set(normalizedKey, initValue);
	                        }
	                    }
	                }
	            }
	            else {
	                this._map = new Map();
	            }
	        }
	        return this._map;
	    }
	    append(name, value) {
	        const key = name.toLowerCase();
	        if (key === 'set-cookie') {
	            this._setCookies.push(value);
	            return;
	        }
	        const existingValue = this.getMap().get(key);
	        const finalValue = existingValue ? `${existingValue}, ${value}` : value;
	        this.getMap().set(key, finalValue);
	    }
	    get(name) {
	        const value = this._get(name);
	        if (value == null) {
	            return null;
	        }
	        return value;
	    }
	    has(name) {
	        if (name === 'set-cookie') {
	            return this._setCookies.length > 0;
	        }
	        return !!this._get(name); // we might need to check if header exists and not just check if it's not nullable
	    }
	    set(name, value) {
	        const key = name.toLowerCase();
	        if (key === 'set-cookie') {
	            this._setCookies = [value];
	            return;
	        }
	        this.getMap().set(key, value);
	    }
	    delete(name) {
	        const key = name.toLowerCase();
	        if (key === 'set-cookie') {
	            this._setCookies = [];
	            return;
	        }
	        this.getMap().delete(key);
	    }
	    forEach(callback) {
	        this._setCookies.forEach(setCookie => {
	            callback(setCookie, 'set-cookie', this);
	        });
	        if (!this._map) {
	            if (this.headersInit) {
	                if (Array.isArray(this.headersInit)) {
	                    this.headersInit.forEach(([key, value]) => {
	                        callback(value, key, this);
	                    });
	                    return;
	                }
	                if (isHeadersLike(this.headersInit)) {
	                    this.headersInit.forEach(callback);
	                    return;
	                }
	                Object.entries(this.headersInit).forEach(([key, value]) => {
	                    if (value != null) {
	                        callback(value, key, this);
	                    }
	                });
	            }
	            return;
	        }
	        this.getMap().forEach((value, key) => {
	            callback(value, key, this);
	        });
	    }
	    *keys() {
	        if (this._setCookies.length) {
	            yield 'set-cookie';
	        }
	        if (!this._map) {
	            if (this.headersInit) {
	                if (Array.isArray(this.headersInit)) {
	                    yield* this.headersInit.map(([key]) => key)[Symbol.iterator]();
	                    return;
	                }
	                if (isHeadersLike(this.headersInit)) {
	                    yield* this.headersInit.keys();
	                    return;
	                }
	                yield* Object.keys(this.headersInit)[Symbol.iterator]();
	                return;
	            }
	        }
	        yield* this.getMap().keys();
	    }
	    *values() {
	        yield* this._setCookies;
	        if (!this._map) {
	            if (this.headersInit) {
	                if (Array.isArray(this.headersInit)) {
	                    yield* this.headersInit.map(([, value]) => value)[Symbol.iterator]();
	                    return;
	                }
	                if (isHeadersLike(this.headersInit)) {
	                    yield* this.headersInit.values();
	                    return;
	                }
	                yield* Object.values(this.headersInit)[Symbol.iterator]();
	                return;
	            }
	        }
	        yield* this.getMap().values();
	    }
	    *entries() {
	        yield* this._setCookies.map(cookie => ['set-cookie', cookie]);
	        if (!this._map) {
	            if (this.headersInit) {
	                if (Array.isArray(this.headersInit)) {
	                    yield* this.headersInit;
	                    return;
	                }
	                if (isHeadersLike(this.headersInit)) {
	                    yield* this.headersInit.entries();
	                    return;
	                }
	                yield* Object.entries(this.headersInit);
	                return;
	            }
	        }
	        yield* this.getMap().entries();
	    }
	    getSetCookie() {
	        return this._setCookies;
	    }
	    [Symbol.iterator]() {
	        return this.entries();
	    }
	    [Symbol.for('nodejs.util.inspect.custom')]() {
	        const record = {};
	        this.forEach((value, key) => {
	            if (key === 'set-cookie') {
	                record['set-cookie'] = this._setCookies;
	            }
	            else {
	                record[key] = value.includes(',') ? value.split(',').map(el => el.trim()) : value;
	            }
	        });
	        return `Headers ${(0, util_1.inspect)(record)}`;
	    }
	}
	Headers$2.PonyfillHeaders = PonyfillHeaders;
	return Headers$2;
}

var hasRequiredResponse;

function requireResponse () {
	if (hasRequiredResponse) return Response$2;
	hasRequiredResponse = 1;
	Object.defineProperty(Response$2, "__esModule", { value: true });
	Response$2.PonyfillResponse = void 0;
	const http_1 = require$$0$3;
	const Body_js_1 = requireBody();
	const Headers_js_1 = requireHeaders();
	const JSON_CONTENT_TYPE = 'application/json; charset=utf-8';
	class PonyfillResponse extends Body_js_1.PonyfillBody {
	    constructor(body, init) {
	        super(body || null, init);
	        this.headers =
	            init?.headers && (0, Headers_js_1.isHeadersLike)(init.headers)
	                ? init.headers
	                : new Headers_js_1.PonyfillHeaders(init?.headers);
	        this.status = init?.status || 200;
	        this.statusText = init?.statusText || http_1.STATUS_CODES[this.status] || 'OK';
	        this.url = init?.url || '';
	        this.redirected = init?.redirected || false;
	        this.type = init?.type || 'default';
	        const contentTypeInHeaders = this.headers.get('content-type');
	        if (!contentTypeInHeaders) {
	            if (this.contentType) {
	                this.headers.set('content-type', this.contentType);
	            }
	        }
	        else {
	            this.contentType = contentTypeInHeaders;
	        }
	        const contentLengthInHeaders = this.headers.get('content-length');
	        if (!contentLengthInHeaders) {
	            if (this.contentLength) {
	                this.headers.set('content-length', this.contentLength.toString());
	            }
	        }
	        else {
	            this.contentLength = parseInt(contentLengthInHeaders, 10);
	        }
	    }
	    get ok() {
	        return this.status >= 200 && this.status < 300;
	    }
	    clone() {
	        return new PonyfillResponse(this.body, this);
	    }
	    static error() {
	        return new PonyfillResponse(null, {
	            status: 500,
	            statusText: 'Internal Server Error',
	        });
	    }
	    static redirect(url, status = 301) {
	        if (status < 300 || status > 399) {
	            throw new RangeError('Invalid status code');
	        }
	        return new PonyfillResponse(null, {
	            headers: {
	                location: url,
	            },
	            status,
	        });
	    }
	    static json(data, init = {}) {
	        init.headers =
	            init?.headers && (0, Headers_js_1.isHeadersLike)(init.headers)
	                ? init.headers
	                : new Headers_js_1.PonyfillHeaders(init?.headers);
	        if (!init.headers.has('content-type')) {
	            init.headers.set('content-type', JSON_CONTENT_TYPE);
	        }
	        return new PonyfillResponse(JSON.stringify(data), init);
	    }
	}
	Response$2.PonyfillResponse = PonyfillResponse;
	return Response$2;
}

var hasRequiredFetchCurl;

function requireFetchCurl () {
	if (hasRequiredFetchCurl) return fetchCurl;
	hasRequiredFetchCurl = 1;
	Object.defineProperty(fetchCurl, "__esModule", { value: true });
	fetchCurl.fetchCurl = void 0;
	const stream_1 = require$$0$1;
	const Response_js_1 = requireResponse();
	const utils_js_1 = requireUtils();
	function fetchCurl$1(fetchRequest) {
	    const { Curl, CurlFeature, CurlPause, CurlProgressFunc } = globalThis['libcurl'];
	    const curlHandle = new Curl();
	    curlHandle.enable(CurlFeature.NoDataParsing);
	    curlHandle.setOpt('URL', fetchRequest.url);
	    curlHandle.setOpt('SSL_VERIFYPEER', false);
	    curlHandle.enable(CurlFeature.StreamResponse);
	    curlHandle.setStreamProgressCallback(function () {
	        return fetchRequest['_signal']?.aborted
	            ? process.env.DEBUG
	                ? CurlProgressFunc.Continue
	                : 1
	            : 0;
	    });
	    if (fetchRequest['bodyType'] === 'String') {
	        curlHandle.setOpt('POSTFIELDS', fetchRequest['bodyInit']);
	    }
	    else {
	        const nodeReadable = (fetchRequest.body != null
	            ? (0, utils_js_1.isNodeReadable)(fetchRequest.body)
	                ? fetchRequest.body
	                : stream_1.Readable.from(fetchRequest.body)
	            : null);
	        if (nodeReadable) {
	            curlHandle.setOpt('UPLOAD', true);
	            curlHandle.setUploadStream(nodeReadable);
	        }
	    }
	    if (process.env.DEBUG) {
	        curlHandle.setOpt('VERBOSE', true);
	    }
	    curlHandle.setOpt('TRANSFER_ENCODING', false);
	    curlHandle.setOpt('HTTP_TRANSFER_DECODING', true);
	    curlHandle.setOpt('FOLLOWLOCATION', fetchRequest.redirect === 'follow');
	    curlHandle.setOpt('MAXREDIRS', 20);
	    curlHandle.setOpt('ACCEPT_ENCODING', '');
	    curlHandle.setOpt('CUSTOMREQUEST', fetchRequest.method);
	    const headersSerializer = fetchRequest.headersSerializer || utils_js_1.defaultHeadersSerializer;
	    let size;
	    const curlHeaders = headersSerializer(fetchRequest.headers, value => {
	        size = Number(value);
	    });
	    if (size != null) {
	        curlHandle.setOpt('INFILESIZE', size);
	    }
	    curlHandle.setOpt('HTTPHEADER', curlHeaders);
	    curlHandle.enable(CurlFeature.NoHeaderParsing);
	    return new Promise(function promiseResolver(resolve, reject) {
	        let streamResolved;
	        if (fetchRequest['_signal']) {
	            fetchRequest['_signal'].onabort = () => {
	                if (curlHandle.isOpen) {
	                    try {
	                        curlHandle.pause(CurlPause.Recv);
	                    }
	                    catch (e) {
	                        reject(e);
	                    }
	                }
	            };
	        }
	        curlHandle.once('end', function endListener() {
	            curlHandle.close();
	        });
	        curlHandle.once('error', function errorListener(error) {
	            if (streamResolved && !streamResolved.closed && !streamResolved.destroyed) {
	                streamResolved.destroy(error);
	            }
	            else {
	                if (error.message === 'Operation was aborted by an application callback') {
	                    error.message = 'The operation was aborted.';
	                }
	                reject(error);
	            }
	            curlHandle.close();
	        });
	        curlHandle.once('stream', function streamListener(stream, status, headersBuf) {
	            const pipedStream = stream.pipe(new stream_1.PassThrough());
	            const headersFlat = headersBuf
	                .toString('utf8')
	                .split(/\r?\n|\r/g)
	                .filter(headerFilter => {
	                if (headerFilter && !headerFilter.startsWith('HTTP/')) {
	                    if (fetchRequest.redirect === 'error' &&
	                        (headerFilter.includes('location') || headerFilter.includes('Location'))) {
	                        pipedStream.destroy();
	                        reject(new Error('redirect is not allowed'));
	                    }
	                    return true;
	                }
	                return false;
	            });
	            const headersInit = headersFlat.map(headerFlat => headerFlat.split(/:\s(.+)/).slice(0, 2));
	            pipedStream.on('pause', () => {
	                stream.pause();
	            });
	            pipedStream.on('resume', () => {
	                stream.resume();
	            });
	            pipedStream.on('close', () => {
	                stream.destroy();
	            });
	            const ponyfillResponse = new Response_js_1.PonyfillResponse(pipedStream, {
	                status,
	                headers: headersInit,
	                url: fetchRequest.url,
	            });
	            resolve(ponyfillResponse);
	            streamResolved = pipedStream;
	        });
	        curlHandle.perform();
	    });
	}
	fetchCurl.fetchCurl = fetchCurl$1;
	return fetchCurl;
}

var fetchNodeHttp = {};

var AbortError = {};

var hasRequiredAbortError;

function requireAbortError () {
	if (hasRequiredAbortError) return AbortError;
	hasRequiredAbortError = 1;
	Object.defineProperty(AbortError, "__esModule", { value: true });
	AbortError.PonyfillAbortError = void 0;
	class PonyfillAbortError extends Error {
	    constructor(reason) {
	        let message = 'The operation was aborted';
	        if (reason) {
	            message += ` reason: ${reason}`;
	        }
	        super(message, {
	            cause: reason,
	        });
	        this.name = 'AbortError';
	    }
	    get reason() {
	        return this.cause;
	    }
	}
	AbortError.PonyfillAbortError = PonyfillAbortError;
	return AbortError;
}

var Request$1 = {};

var hasRequiredRequest;

function requireRequest () {
	if (hasRequiredRequest) return Request$1;
	hasRequiredRequest = 1;
	var _a;
	Object.defineProperty(Request$1, "__esModule", { value: true });
	Request$1.PonyfillRequest = void 0;
	const Body_js_1 = requireBody();
	const Headers_js_1 = requireHeaders();
	function isRequest(input) {
	    return input[Symbol.toStringTag] === 'Request';
	}
	function isURL(obj) {
	    return obj?.href != null;
	}
	class PonyfillRequest extends Body_js_1.PonyfillBody {
	    constructor(input, options) {
	        let url;
	        let bodyInit = null;
	        let requestInit;
	        if (typeof input === 'string') {
	            url = input;
	        }
	        else if (isURL(input)) {
	            url = input.toString();
	        }
	        else if (isRequest(input)) {
	            url = input.url;
	            bodyInit = input.body;
	            requestInit = input;
	        }
	        if (options != null) {
	            bodyInit = options.body || null;
	            requestInit = options;
	        }
	        super(bodyInit, options);
	        this[_a] = 'Request';
	        this.cache = requestInit?.cache || 'default';
	        this.credentials = requestInit?.credentials || 'same-origin';
	        this.headers =
	            requestInit?.headers && (0, Headers_js_1.isHeadersLike)(requestInit.headers)
	                ? requestInit.headers
	                : new Headers_js_1.PonyfillHeaders(requestInit?.headers);
	        this.integrity = requestInit?.integrity || '';
	        this.keepalive = requestInit?.keepalive != null ? requestInit?.keepalive : false;
	        this.method = requestInit?.method?.toUpperCase() || 'GET';
	        this.mode = requestInit?.mode || 'cors';
	        this.redirect = requestInit?.redirect || 'follow';
	        this.referrer = requestInit?.referrer || 'about:client';
	        this.referrerPolicy = requestInit?.referrerPolicy || 'no-referrer';
	        this._signal = requestInit?.signal;
	        this.headersSerializer = requestInit?.headersSerializer;
	        this.duplex = requestInit?.duplex || 'half';
	        this.url = url || '';
	        this.destination = 'document';
	        this.priority = 'auto';
	        if (this.method !== 'GET' && this.method !== 'HEAD') {
	            const contentTypeInHeaders = this.headers.get('content-type');
	            if (!contentTypeInHeaders) {
	                if (this.contentType) {
	                    this.headers.set('content-type', this.contentType);
	                }
	            }
	            else {
	                this.contentType = contentTypeInHeaders;
	            }
	            const contentLengthInHeaders = this.headers.get('content-length');
	            if (bodyInit == null && !contentLengthInHeaders) {
	                this.contentLength = 0;
	                this.headers.set('content-length', '0');
	            }
	            if (!contentLengthInHeaders) {
	                if (this.contentLength) {
	                    this.headers.set('content-length', this.contentLength.toString());
	                }
	            }
	            else {
	                this.contentLength = parseInt(contentLengthInHeaders, 10);
	            }
	        }
	    }
	    get signal() {
	        // Create a new signal only if needed
	        // Because the creation of signal is expensive
	        if (!this._signal) {
	            this._signal = new AbortController().signal;
	        }
	        return this._signal;
	    }
	    clone() {
	        return new PonyfillRequest(this);
	    }
	}
	Request$1.PonyfillRequest = PonyfillRequest;
	_a = Symbol.toStringTag;
	return Request$1;
}

var URL$2 = {};

var lib = {exports: {}};

var fastDecodeUriComponent;
var hasRequiredFastDecodeUriComponent;

function requireFastDecodeUriComponent () {
	if (hasRequiredFastDecodeUriComponent) return fastDecodeUriComponent;
	hasRequiredFastDecodeUriComponent = 1;

	var UTF8_ACCEPT = 12;
	var UTF8_REJECT = 0;
	var UTF8_DATA = [
	  // The first part of the table maps bytes to character to a transition.
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
	  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
	  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
	  4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
	  5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
	  6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 7, 7,
	  10, 9, 9, 9, 11, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4,

	  // The second part of the table maps a state to a new state when adding a
	  // transition.
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  12, 0, 0, 0, 0, 24, 36, 48, 60, 72, 84, 96,
	  0, 12, 12, 12, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 24, 24, 24, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 24, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 48, 48, 48, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 0, 48, 48, 0, 0, 0, 0, 0, 0, 0, 0,
	  0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

	  // The third part maps the current transition to a mask that needs to apply
	  // to the byte.
	  0x7F, 0x3F, 0x3F, 0x3F, 0x00, 0x1F, 0x0F, 0x0F, 0x0F, 0x07, 0x07, 0x07
	];

	function decodeURIComponent (uri) {
	  var percentPosition = uri.indexOf('%');
	  if (percentPosition === -1) return uri

	  var length = uri.length;
	  var decoded = '';
	  var last = 0;
	  var codepoint = 0;
	  var startOfOctets = percentPosition;
	  var state = UTF8_ACCEPT;

	  while (percentPosition > -1 && percentPosition < length) {
	    var high = hexCodeToInt(uri[percentPosition + 1], 4);
	    var low = hexCodeToInt(uri[percentPosition + 2], 0);
	    var byte = high | low;
	    var type = UTF8_DATA[byte];
	    state = UTF8_DATA[256 + state + type];
	    codepoint = (codepoint << 6) | (byte & UTF8_DATA[364 + type]);

	    if (state === UTF8_ACCEPT) {
	      decoded += uri.slice(last, startOfOctets);

	      decoded += (codepoint <= 0xFFFF)
	        ? String.fromCharCode(codepoint)
	        : String.fromCharCode(
	          (0xD7C0 + (codepoint >> 10)),
	          (0xDC00 + (codepoint & 0x3FF))
	        );

	      codepoint = 0;
	      last = percentPosition + 3;
	      percentPosition = startOfOctets = uri.indexOf('%', last);
	    } else if (state === UTF8_REJECT) {
	      return null
	    } else {
	      percentPosition += 3;
	      if (percentPosition < length && uri.charCodeAt(percentPosition) === 37) continue
	      return null
	    }
	  }

	  return decoded + uri.slice(last)
	}

	var HEX = {
	  '0': 0,
	  '1': 1,
	  '2': 2,
	  '3': 3,
	  '4': 4,
	  '5': 5,
	  '6': 6,
	  '7': 7,
	  '8': 8,
	  '9': 9,
	  'a': 10,
	  'A': 10,
	  'b': 11,
	  'B': 11,
	  'c': 12,
	  'C': 12,
	  'd': 13,
	  'D': 13,
	  'e': 14,
	  'E': 14,
	  'f': 15,
	  'F': 15
	};

	function hexCodeToInt (c, shift) {
	  var i = HEX[c];
	  return i === undefined ? 255 : i << shift
	}

	fastDecodeUriComponent = decodeURIComponent;
	return fastDecodeUriComponent;
}

var parse_1;
var hasRequiredParse;

function requireParse () {
	if (hasRequiredParse) return parse_1;
	hasRequiredParse = 1;

	const fastDecode = requireFastDecodeUriComponent();

	const plusRegex = /\+/g;
	const Empty = function () {};
	Empty.prototype = Object.create(null);

	/**
	 * @callback parse
	 * @param {string} input
	 */
	function parse(input) {
	  // Optimization: Use new Empty() instead of Object.create(null) for performance
	  // v8 has a better optimization for initializing functions compared to Object
	  const result = new Empty();

	  if (typeof input !== "string") {
	    return result;
	  }

	  let inputLength = input.length;
	  let key = "";
	  let value = "";
	  let startingIndex = -1;
	  let equalityIndex = -1;
	  let shouldDecodeKey = false;
	  let shouldDecodeValue = false;
	  let keyHasPlus = false;
	  let valueHasPlus = false;
	  let hasBothKeyValuePair = false;
	  let c = 0;

	  // Have a boundary of input.length + 1 to access last pair inside the loop.
	  for (let i = 0; i < inputLength + 1; i++) {
	    c = i !== inputLength ? input.charCodeAt(i) : 38;

	    // Handle '&' and end of line to pass the current values to result
	    if (c === 38) {
	      hasBothKeyValuePair = equalityIndex > startingIndex;

	      // Optimization: Reuse equality index to store the end of key
	      if (!hasBothKeyValuePair) {
	        equalityIndex = i;
	      }

	      key = input.slice(startingIndex + 1, equalityIndex);

	      // Add key/value pair only if the range size is greater than 1; a.k.a. contains at least "="
	      if (hasBothKeyValuePair || key.length > 0) {
	        // Optimization: Replace '+' with space
	        if (keyHasPlus) {
	          key = key.replace(plusRegex, " ");
	        }

	        // Optimization: Do not decode if it's not necessary.
	        if (shouldDecodeKey) {
	          key = fastDecode(key) || key;
	        }

	        if (hasBothKeyValuePair) {
	          value = input.slice(equalityIndex + 1, i);

	          if (valueHasPlus) {
	            value = value.replace(plusRegex, " ");
	          }

	          if (shouldDecodeValue) {
	            value = fastDecode(value) || value;
	          }
	        }
	        const currentValue = result[key];

	        if (currentValue === undefined) {
	          result[key] = value;
	        } else {
	          // Optimization: value.pop is faster than Array.isArray(value)
	          if (currentValue.pop) {
	            currentValue.push(value);
	          } else {
	            result[key] = [currentValue, value];
	          }
	        }
	      }

	      // Reset reading key value pairs
	      value = "";
	      startingIndex = i;
	      equalityIndex = i;
	      shouldDecodeKey = false;
	      shouldDecodeValue = false;
	      keyHasPlus = false;
	      valueHasPlus = false;
	    }
	    // Check '='
	    else if (c === 61) {
	      if (equalityIndex <= startingIndex) {
	        equalityIndex = i;
	      }
	      // If '=' character occurs again, we should decode the input.
	      else {
	        shouldDecodeValue = true;
	      }
	    }
	    // Check '+', and remember to replace it with empty space.
	    else if (c === 43) {
	      if (equalityIndex > startingIndex) {
	        valueHasPlus = true;
	      } else {
	        keyHasPlus = true;
	      }
	    }
	    // Check '%' character for encoding
	    else if (c === 37) {
	      if (equalityIndex > startingIndex) {
	        shouldDecodeValue = true;
	      } else {
	        shouldDecodeKey = true;
	      }
	    }
	  }

	  return result;
	}

	parse_1 = parse;
	return parse_1;
}

var querystring;
var hasRequiredQuerystring;

function requireQuerystring () {
	if (hasRequiredQuerystring) return querystring;
	hasRequiredQuerystring = 1;
	// This file is taken from Node.js project.
	// Full implementation can be found from https://github.com/nodejs/node/blob/main/lib/internal/querystring.js

	const hexTable = Array.from(
	  { length: 256 },
	  (_, i) => "%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase(),
	);

	// These characters do not need escaping when generating query strings:
	// ! - . _ ~
	// ' ( ) *
	// digits
	// alpha (uppercase)
	// alpha (lowercase)
	// rome-ignore format: the array should not be formatted
	const noEscape = new Int8Array([
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
	  0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, // 32 - 47
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
	  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, // 80 - 95
	  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, // 112 - 127
	]);

	/**
	 * @param {string} str
	 * @returns {string}
	 */
	function encodeString(str) {
	  const len = str.length;
	  if (len === 0) return "";

	  let out = "";
	  let lastPos = 0;
	  let i = 0;

	  outer: for (; i < len; i++) {
	    let c = str.charCodeAt(i);

	    // ASCII
	    while (c < 0x80) {
	      if (noEscape[c] !== 1) {
	        if (lastPos < i) out += str.slice(lastPos, i);
	        lastPos = i + 1;
	        out += hexTable[c];
	      }

	      if (++i === len) break outer;

	      c = str.charCodeAt(i);
	    }

	    if (lastPos < i) out += str.slice(lastPos, i);

	    // Multi-byte characters ...
	    if (c < 0x800) {
	      lastPos = i + 1;
	      out += hexTable[0xc0 | (c >> 6)] + hexTable[0x80 | (c & 0x3f)];
	      continue;
	    }
	    if (c < 0xd800 || c >= 0xe000) {
	      lastPos = i + 1;
	      out +=
	        hexTable[0xe0 | (c >> 12)] +
	        hexTable[0x80 | ((c >> 6) & 0x3f)] +
	        hexTable[0x80 | (c & 0x3f)];
	      continue;
	    }
	    // Surrogate pair
	    ++i;

	    // This branch should never happen because all URLSearchParams entries
	    // should already be converted to USVString. But, included for
	    // completion's sake anyway.
	    if (i >= len) {
	      throw new Error("URI malformed");
	    }

	    const c2 = str.charCodeAt(i) & 0x3ff;

	    lastPos = i + 1;
	    c = 0x10000 + (((c & 0x3ff) << 10) | c2);
	    out +=
	      hexTable[0xf0 | (c >> 18)] +
	      hexTable[0x80 | ((c >> 12) & 0x3f)] +
	      hexTable[0x80 | ((c >> 6) & 0x3f)] +
	      hexTable[0x80 | (c & 0x3f)];
	  }
	  if (lastPos === 0) return str;
	  if (lastPos < len) return out + str.slice(lastPos);
	  return out;
	}

	querystring = { encodeString };
	return querystring;
}

var stringify_1;
var hasRequiredStringify;

function requireStringify () {
	if (hasRequiredStringify) return stringify_1;
	hasRequiredStringify = 1;

	const { encodeString } = requireQuerystring();

	function getAsPrimitive(value) {
	  const type = typeof value;

	  if (type === "string") {
	    // Length check is handled inside encodeString function
	    return encodeString(value);
	  } else if (type === "bigint") {
	    return value.toString();
	  } else if (type === "boolean") {
	    return value ? "true" : "false";
	  } else if (type === "number" && Number.isFinite(value)) {
	    return value < 1e21 ? "" + value : encodeString("" + value);
	  }

	  return "";
	}

	/**
	 * @param {Record<string, string | number | boolean
	 * | ReadonlyArray<string | number | boolean> | null>} input
	 * @returns {string}
	 */
	function stringify(input) {
	  let result = "";

	  if (input === null || typeof input !== "object") {
	    return result;
	  }

	  const separator = "&";
	  const keys = Object.keys(input);
	  const keyLength = keys.length;
	  let valueLength = 0;

	  for (let i = 0; i < keyLength; i++) {
	    const key = keys[i];
	    const value = input[key];
	    const encodedKey = encodeString(key) + "=";

	    if (i) {
	      result += separator;
	    }

	    if (Array.isArray(value)) {
	      valueLength = value.length;
	      for (let j = 0; j < valueLength; j++) {
	        if (j) {
	          result += separator;
	        }

	        // Optimization: Dividing into multiple lines improves the performance.
	        // Since v8 does not need to care about the '+' character if it was one-liner.
	        result += encodedKey;
	        result += getAsPrimitive(value[j]);
	      }
	    } else {
	      result += encodedKey;
	      result += getAsPrimitive(value);
	    }
	  }

	  return result;
	}

	stringify_1 = stringify;
	return stringify_1;
}

var hasRequiredLib;

function requireLib () {
	if (hasRequiredLib) return lib.exports;
	hasRequiredLib = 1;

	const parse = requireParse();
	const stringify = requireStringify();

	const fastQuerystring = {
	  parse,
	  stringify,
	};

	/**
	 * Enable TS and JS support
	 *
	 * - `const qs = require('fast-querystring')`
	 * - `import qs from 'fast-querystring'`
	 */
	lib.exports = fastQuerystring;
	lib.exports.default = fastQuerystring;
	lib.exports.parse = parse;
	lib.exports.stringify = stringify;
	return lib.exports;
}

var punycode;
var hasRequiredPunycode;

function requirePunycode () {
	if (hasRequiredPunycode) return punycode;
	hasRequiredPunycode = 1;

	/** Highest positive signed 32-bit float value */
	var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	var base = 36;
	var tMin = 1;
	var tMax = 26;
	var skew = 38;
	var damp = 700;
	var initialBias = 72;
	var initialN = 128; // 0x80
	var delimiter = "-"; // '\x2D'

	/** Regular expressions */
	var regexNonASCII = /[^\0-\x7F]/; // Note: U+007F DEL is excluded too.
	var regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

	/** Error messages */
	var errors = {
	  "overflow": "Overflow: input needs wider integers to process",
	  "not-basic": "Illegal input >= 0x80 (not a basic code point)",
	  "invalid-input": "Invalid input",
	};

	/** Convenience shortcuts */
	var baseMinusTMin = base - tMin;
	var floor = Math.floor;
	var stringFromCharCode = String.fromCharCode;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
	  throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, callback) {
	  var result = [];
	  var length = array.length;
	  while (length--) {
	    result[length] = callback(array[length]);
	  }
	  return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {String} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(domain, callback) {
	  var parts = domain.split("@");
	  var result = "";
	  if (parts.length > 1) {
	    // In email addresses, only the domain name should be punycoded. Leave
	    // the local part (i.e. everything up to `@`) intact.
	    result = parts[0] + "@";
	    domain = parts[1];
	  }
	  // Avoid `split(regex)` for IE8 compatibility. See #17.
	  domain = domain.replace(regexSeparators, "\x2E");
	  var labels = domain.split(".");
	  var encoded = map(labels, callback).join(".");
	  return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
	  var output = [];
	  var counter = 0;
	  var length = string.length;
	  while (counter < length) {
	    var value = string.charCodeAt(counter++);
	    if (value >= 0xd800 && value <= 0xdbff && counter < length) {
	      // It's a high surrogate, and there is a next character.
	      var extra = string.charCodeAt(counter++);
	      if ((extra & 0xfc00) === 0xdc00) {
	        // Low surrogate.
	        output.push(((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000);
	      } else {
	        // It's an unmatched surrogate; only append this code unit, in case the
	        // next code unit is the high surrogate of a surrogate pair.
	        output.push(value);
	        counter--;
	      }
	    } else {
	      output.push(value);
	    }
	  }
	  return output;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	var digitToBasic = function (digit, flag) {
	  //  0..25 map to ASCII a..z or A..Z
	  // 26..35 map to ASCII 0..9
	  return digit + 22 + 75 * (digit < 26) - ((flag !== 0) << 5);
	};

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	var adapt = function (delta, numPoints, firstTime) {
	  var k = 0;
	  delta = firstTime ? floor(delta / damp) : delta >> 1;
	  delta += floor(delta / numPoints);
	  for (; /* no initialization */ delta > (baseMinusTMin * tMax) >> 1; k += base) {
	    delta = floor(delta / baseMinusTMin);
	  }
	  return floor(k + ((baseMinusTMin + 1) * delta) / (delta + skew));
	};

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	var encode = function (input) {
	  var output = [];

	  // Convert the input in UCS-2 to an array of Unicode code points.
	  input = ucs2decode(input);

	  // Cache the length.
	  var inputLength = input.length;

	  // Initialize the state.
	  var n = initialN;
	  var delta = 0;
	  var bias = initialBias;

	  // Handle the basic code points.
	  for (var currentValue of input) {
	    if (currentValue < 0x80) {
	      output.push(stringFromCharCode(currentValue));
	    }
	  }

	  var basicLength = output.length;
	  var handledCPCount = basicLength;

	  // `handledCPCount` is the number of code points that have been handled;
	  // `basicLength` is the number of basic code points.

	  // Finish the basic string with a delimiter unless it's empty.
	  if (basicLength) {
	    output.push(delimiter);
	  }

	  // Main encoding loop:
	  while (handledCPCount < inputLength) {
	    // All non-basic code points < n have been handled already. Find the next
	    // larger one:
	    var m = maxInt;
	    for (var currentValue of input) {
	      if (currentValue >= n && currentValue < m) {
	        m = currentValue;
	      }
	    }

	    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
	    // but guard against overflow.
	    var handledCPCountPlusOne = handledCPCount + 1;
	    if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
	      error("overflow");
	    }

	    delta += (m - n) * handledCPCountPlusOne;
	    n = m;

	    for (var currentValue of input) {
	      if (currentValue < n && ++delta > maxInt) {
	        error("overflow");
	      }
	      if (currentValue === n) {
	        // Represent delta as a generalized variable-length integer.
	        var q = delta;
	        for (var k = base /* no condition */; ; k += base) {
	          var t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
	          if (q < t) {
	            break;
	          }
	          var qMinusT = q - t;
	          var baseMinusT = base - t;
	          output.push(stringFromCharCode(digitToBasic(t + (qMinusT % baseMinusT), 0)));
	          q = floor(qMinusT / baseMinusT);
	        }

	        output.push(stringFromCharCode(digitToBasic(q, 0)));
	        bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
	        delta = 0;
	        ++handledCPCount;
	      }
	    }

	    ++delta;
	    ++n;
	  }
	  return output.join("");
	};

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	var toASCII = function (input) {
	  return mapDomain(input, function (string) {
	    return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
	  });
	};

	/*--------------------------------------------------------------------------*/

	punycode = {
	    toASCII: toASCII
	};
	return punycode;
}

var urlparser;
var hasRequiredUrlparser;

function requireUrlparser () {
	if (hasRequiredUrlparser) return urlparser;
	hasRequiredUrlparser = 1;
	/*
	Copyright (c) 2014 Petka Antonov

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
	*/
	function Url() {
	    //For more efficient internal representation and laziness.
	    //The non-underscore versions of these properties are accessor functions
	    //defined on the prototype.
	    this._protocol = null;
	    this._href = "";
	    this._port = -1;
	    this._query = null;

	    this.auth = null;
	    this.slashes = null;
	    this.host = null;
	    this.hostname = null;
	    this.hash = null;
	    this.search = null;
	    this.pathname = null;

	    this._prependSlash = false;
	}

	var querystring = require$$0$4;

	Url.queryString = querystring;

	Url.prototype.parse =
	function Url$parse(str, parseQueryString, hostDenotesSlash, disableAutoEscapeChars) {
	    if (typeof str !== "string") {
	        throw new TypeError("Parameter 'url' must be a string, not " +
	            typeof str);
	    }
	    var start = 0;
	    var end = str.length - 1;

	    //Trim leading and trailing ws
	    while (str.charCodeAt(start) <= 0x20 /*' '*/) start++;
	    while (str.charCodeAt(end) <= 0x20 /*' '*/) end--;

	    start = this._parseProtocol(str, start, end);

	    //Javascript doesn't have host
	    if (this._protocol !== "javascript") {
	        start = this._parseHost(str, start, end, hostDenotesSlash);
	        var proto = this._protocol;
	        if (!this.hostname &&
	            (this.slashes || (proto && !slashProtocols[proto]))) {
	            this.hostname = this.host = "";
	        }
	    }

	    if (start <= end) {
	        var ch = str.charCodeAt(start);

	        if (ch === 0x2F /*'/'*/ || ch === 0x5C /*'\'*/) {
	            this._parsePath(str, start, end, disableAutoEscapeChars);
	        }
	        else if (ch === 0x3F /*'?'*/) {
	            this._parseQuery(str, start, end, disableAutoEscapeChars);
	        }
	        else if (ch === 0x23 /*'#'*/) {
	          this._parseHash(str, start, end, disableAutoEscapeChars);
	        }
	        else if (this._protocol !== "javascript") {
	            this._parsePath(str, start, end, disableAutoEscapeChars);
	        }
	        else { //For javascript the pathname is just the rest of it
	            this.pathname = str.slice(start, end + 1 );
	        }

	    }

	    if (!this.pathname && this.hostname &&
	        this._slashProtocols[this._protocol]) {
	        this.pathname = "/";
	    }

	    if (parseQueryString) {
	        var search = this.search;
	        if (search == null) {
	            search = this.search = "";
	        }
	        if (search.charCodeAt(0) === 0x3F /*'?'*/) {
	            search = search.slice(1);
	        }
	        //This calls a setter function, there is no .query data property
	        this.query = Url.queryString.parse(search);
	    }
	};

	Url.prototype.resolve = function Url$resolve(relative) {
	    return this.resolveObject(Url.parse(relative, false, true)).format();
	};

	Url.prototype.format = function Url$format() {
	    var auth = this.auth || "";

	    if (auth) {
	        auth = encodeURIComponent(auth);
	        auth = auth.replace(/%3A/i, ":");
	        auth += "@";
	    }

	    var protocol = this.protocol || "";
	    var pathname = this.pathname || "";
	    var hash = this.hash || "";
	    var search = this.search || "";
	    var query = "";
	    var hostname = this.hostname || "";
	    var port = this.port || "";
	    var host = false;
	    var scheme = "";

	    //Cache the result of the getter function
	    var q = this.query;
	    if (q && typeof q === "object") {
	        query = Url.queryString.stringify(q);
	    }

	    if (!search) {
	        search = query ? "?" + query : "";
	    }

	    if (protocol && protocol.charCodeAt(protocol.length - 1) !== 0x3A /*':'*/)
	        protocol += ":";

	    if (this.host) {
	        host = auth + this.host;
	    }
	    else if (hostname) {
	        var ip6 = hostname.indexOf(":") > -1;
	        if (ip6) hostname = "[" + hostname + "]";
	        host = auth + hostname + (port ? ":" + port : "");
	    }

	    var slashes = this.slashes ||
	        ((!protocol ||
	        slashProtocols[protocol]) && host !== false);


	    if (protocol) scheme = protocol + (slashes ? "//" : "");
	    else if (slashes) scheme = "//";

	    if (slashes && pathname && pathname.charCodeAt(0) !== 0x2F /*'/'*/) {
	        pathname = "/" + pathname;
	    }
	    if (search && search.charCodeAt(0) !== 0x3F /*'?'*/)
	        search = "?" + search;
	    if (hash && hash.charCodeAt(0) !== 0x23 /*'#'*/)
	        hash = "#" + hash;

	    pathname = escapePathName(pathname);
	    search = escapeSearch(search);

	    return scheme + (host === false ? "" : host) + pathname + search + hash;
	};

	Url.prototype.resolveObject = function Url$resolveObject(relative) {
	    if (typeof relative === "string")
	        relative = Url.parse(relative, false, true);

	    var result = this._clone();

	    // hash is always overridden, no matter what.
	    // even href="" will remove it.
	    result.hash = relative.hash;

	    // if the relative url is empty, then there"s nothing left to do here.
	    if (!relative.href) {
	        result._href = "";
	        return result;
	    }

	    // hrefs like //foo/bar always cut to the protocol.
	    if (relative.slashes && !relative._protocol) {
	        relative._copyPropsTo(result, true);

	        if (slashProtocols[result._protocol] &&
	            result.hostname && !result.pathname) {
	            result.pathname = "/";
	        }
	        result._href = "";
	        return result;
	    }

	    if (relative._protocol && relative._protocol !== result._protocol) {
	        // if it"s a known url protocol, then changing
	        // the protocol does weird things
	        // first, if it"s not file:, then we MUST have a host,
	        // and if there was a path
	        // to begin with, then we MUST have a path.
	        // if it is file:, then the host is dropped,
	        // because that"s known to be hostless.
	        // anything else is assumed to be absolute.
	        if (!slashProtocols[relative._protocol]) {
	            relative._copyPropsTo(result, false);
	            result._href = "";
	            return result;
	        }

	        result._protocol = relative._protocol;
	        if (!relative.host && relative._protocol !== "javascript") {
	            var relPath = (relative.pathname || "").split("/");
	            while (relPath.length && !(relative.host = relPath.shift()));
	            if (!relative.host) relative.host = "";
	            if (!relative.hostname) relative.hostname = "";
	            if (relPath[0] !== "") relPath.unshift("");
	            if (relPath.length < 2) relPath.unshift("");
	            result.pathname = relPath.join("/");
	        } else {
	            result.pathname = relative.pathname;
	        }

	        result.search = relative.search;
	        result.host = relative.host || "";
	        result.auth = relative.auth;
	        result.hostname = relative.hostname || relative.host;
	        result._port = relative._port;
	        result.slashes = result.slashes || relative.slashes;
	        result._href = "";
	        return result;
	    }

	    var isSourceAbs =
	        (result.pathname && result.pathname.charCodeAt(0) === 0x2F /*'/'*/);
	    var isRelAbs = (
	            relative.host ||
	            (relative.pathname &&
	            relative.pathname.charCodeAt(0) === 0x2F /*'/'*/)
	        );
	    var mustEndAbs = (isRelAbs || isSourceAbs ||
	                        (result.host && relative.pathname));

	    var removeAllDots = mustEndAbs;

	    var srcPath = result.pathname && result.pathname.split("/") || [];
	    var relPath = relative.pathname && relative.pathname.split("/") || [];
	    var psychotic = result._protocol && !slashProtocols[result._protocol];

	    // if the url is a non-slashed url, then relative
	    // links like ../.. should be able
	    // to crawl up to the hostname, as well.  This is strange.
	    // result.protocol has already been set by now.
	    // Later on, put the first path part into the host field.
	    if (psychotic) {
	        result.hostname = "";
	        result._port = -1;
	        if (result.host) {
	            if (srcPath[0] === "") srcPath[0] = result.host;
	            else srcPath.unshift(result.host);
	        }
	        result.host = "";
	        if (relative._protocol) {
	            relative.hostname = "";
	            relative._port = -1;
	            if (relative.host) {
	                if (relPath[0] === "") relPath[0] = relative.host;
	                else relPath.unshift(relative.host);
	            }
	            relative.host = "";
	        }
	        mustEndAbs = mustEndAbs && (relPath[0] === "" || srcPath[0] === "");
	    }

	    if (isRelAbs) {
	        // it"s absolute.
	        result.host = relative.host ?
	            relative.host : result.host;
	        result.hostname = relative.hostname ?
	            relative.hostname : result.hostname;
	        result.search = relative.search;
	        srcPath = relPath;
	        // fall through to the dot-handling below.
	    } else if (relPath.length) {
	        // it"s relative
	        // throw away the existing file, and take the new path instead.
	        if (!srcPath) srcPath = [];
	        srcPath.pop();
	        srcPath = srcPath.concat(relPath);
	        result.search = relative.search;
	    } else if (relative.search) {
	        // just pull out the search.
	        // like href="?foo".
	        // Put this after the other two cases because it simplifies the booleans
	        if (psychotic) {
	            result.hostname = result.host = srcPath.shift();
	            //occationaly the auth can get stuck only in host
	            //this especialy happens in cases like
	            //url.resolveObject("mailto:local1@domain1", "local2@domain2")
	            var authInHost = result.host && result.host.indexOf("@") > 0 ?
	                result.host.split("@") : false;
	            if (authInHost) {
	                result.auth = authInHost.shift();
	                result.host = result.hostname = authInHost.shift();
	            }
	        }
	        result.search = relative.search;
	        result._href = "";
	        return result;
	    }

	    if (!srcPath.length) {
	        // no path at all.  easy.
	        // we"ve already handled the other stuff above.
	        result.pathname = null;
	        result._href = "";
	        return result;
	    }

	    // if a url ENDs in . or .., then it must get a trailing slash.
	    // however, if it ends in anything else non-slashy,
	    // then it must NOT get a trailing slash.
	    var last = srcPath.slice(-1)[0];
	    var hasTrailingSlash = (
	        (result.host || relative.host) && (last === "." || last === "..") ||
	        last === "");

	    // strip single dots, resolve double dots to parent dir
	    // if the path tries to go above the root, `up` ends up > 0
	    var up = 0;
	    for (var i = srcPath.length; i >= 0; i--) {
	        last = srcPath[i];
	        if (last === ".") {
	            srcPath.splice(i, 1);
	        } else if (last === "..") {
	            srcPath.splice(i, 1);
	            up++;
	        } else if (up) {
	            srcPath.splice(i, 1);
	            up--;
	        }
	    }

	    // if the path is allowed to go above the root, restore leading ..s
	    if (!mustEndAbs && !removeAllDots) {
	        for (; up--; up) {
	            srcPath.unshift("..");
	        }
	    }

	    if (mustEndAbs && srcPath[0] !== "" &&
	        (!srcPath[0] || srcPath[0].charCodeAt(0) !== 0x2F /*'/'*/)) {
	        srcPath.unshift("");
	    }

	    if (hasTrailingSlash && (srcPath.join("/").substr(-1) !== "/")) {
	        srcPath.push("");
	    }

	    var isAbsolute = srcPath[0] === "" ||
	        (srcPath[0] && srcPath[0].charCodeAt(0) === 0x2F /*'/'*/);

	    // put the host back
	    if (psychotic) {
	        result.hostname = result.host = isAbsolute ? "" :
	            srcPath.length ? srcPath.shift() : "";
	        //occationaly the auth can get stuck only in host
	        //this especialy happens in cases like
	        //url.resolveObject("mailto:local1@domain1", "local2@domain2")
	        var authInHost = result.host && result.host.indexOf("@") > 0 ?
	            result.host.split("@") : false;
	        if (authInHost) {
	            result.auth = authInHost.shift();
	            result.host = result.hostname = authInHost.shift();
	        }
	    }

	    mustEndAbs = mustEndAbs || (result.host && srcPath.length);

	    if (mustEndAbs && !isAbsolute) {
	        srcPath.unshift("");
	    }

	    result.pathname = srcPath.length === 0 ? null : srcPath.join("/");
	    result.auth = relative.auth || result.auth;
	    result.slashes = result.slashes || relative.slashes;
	    result._href = "";
	    return result;
	};

	var punycode = requirePunycode();
	Url.prototype._hostIdna = function Url$_hostIdna(hostname) {
	    // IDNA Support: Returns a punycoded representation of "domain".
	    // It only converts parts of the domain name that
	    // have non-ASCII characters, i.e. it doesn't matter if
	    // you call it with a domain that already is ASCII-only.
	    return punycode.toASCII(hostname);
	};

	var escapePathName = Url.prototype._escapePathName =
	function Url$_escapePathName(pathname) {
	    if (!containsCharacter2(pathname, 0x23 /*'#'*/, 0x3F /*'?'*/)) {
	        return pathname;
	    }
	    //Avoid closure creation to keep this inlinable
	    return _escapePath(pathname);
	};

	var escapeSearch = Url.prototype._escapeSearch =
	function Url$_escapeSearch(search) {
	    if (!containsCharacter2(search, 0x23 /*'#'*/, -1)) return search;
	    //Avoid closure creation to keep this inlinable
	    return _escapeSearch(search);
	};

	Url.prototype._parseProtocol = function Url$_parseProtocol(str, start, end) {
	    var doLowerCase = false;
	    var protocolCharacters = this._protocolCharacters;

	    for (var i = start; i <= end; ++i) {
	        var ch = str.charCodeAt(i);

	        if (ch === 0x3A /*':'*/) {
	            var protocol = str.slice(start, i);
	            if (doLowerCase) protocol = protocol.toLowerCase();
	            this._protocol = protocol;
	            return i + 1;
	        }
	        else if (protocolCharacters[ch] === 1) {
	            if (ch < 0x61 /*'a'*/)
	                doLowerCase = true;
	        }
	        else {
	            return start;
	        }

	    }
	    return start;
	};

	Url.prototype._parseAuth = function Url$_parseAuth(str, start, end, decode) {
	    var auth = str.slice(start, end + 1);
	    if (decode) {
	        auth = decodeURIComponent(auth);
	    }
	    this.auth = auth;
	};

	Url.prototype._parsePort = function Url$_parsePort(str, start, end) {
	    //Internal format is integer for more efficient parsing
	    //and for efficient trimming of leading zeros
	    var port = 0;
	    //Distinguish between :0 and : (no port number at all)
	    var hadChars = false;
	    var validPort = true;

	    for (var i = start; i <= end; ++i) {
	        var ch = str.charCodeAt(i);

	        if (0x30 /*'0'*/ <= ch && ch <= 0x39 /*'9'*/) {
	            port = (10 * port) + (ch - 0x30 /*'0'*/);
	            hadChars = true;
	        }
	        else {
	            validPort = false;
	            if (ch === 0x5C/*'\'*/ || ch === 0x2F/*'/'*/) {
	                validPort = true;
	            }
	            break;
	        }

	    }
	    if ((port === 0 && !hadChars) || !validPort) {
	        if (!validPort) {
	            this._port = -2;
	        }
	        return 0;
	    }

	    this._port = port;
	    return i - start;
	};

	Url.prototype._parseHost =
	function Url$_parseHost(str, start, end, slashesDenoteHost) {
	    var hostEndingCharacters = this._hostEndingCharacters;
	    var first = str.charCodeAt(start);
	    var second = str.charCodeAt(start + 1);
	    if ((first === 0x2F /*'/'*/ || first === 0x5C /*'\'*/) &&
	        (second === 0x2F /*'/'*/ || second === 0x5C /*'\'*/)) {
	        this.slashes = true;

	        //The string starts with //
	        if (start === 0) {
	            //The string is just "//"
	            if (end < 2) return start;
	            //If slashes do not denote host and there is no auth,
	            //there is no host when the string starts with //
	            var hasAuth =
	                containsCharacter(str, 0x40 /*'@'*/, 2, hostEndingCharacters);
	            if (!hasAuth && !slashesDenoteHost) {
	                this.slashes = null;
	                return start;
	            }
	        }
	        //There is a host that starts after the //
	        start += 2;
	    }
	    //If there is no slashes, there is no hostname if
	    //1. there was no protocol at all
	    else if (!this._protocol ||
	        //2. there was a protocol that requires slashes
	        //e.g. in 'http:asd' 'asd' is not a hostname
	        slashProtocols[this._protocol]
	    ) {
	        return start;
	    }

	    var doLowerCase = false;
	    var idna = false;
	    var hostNameStart = start;
	    var hostNameEnd = end;
	    var portLength = 0;
	    var charsAfterDot = 0;
	    var authNeedsDecoding = false;

	    var j = -1;

	    //Find the last occurrence of an @-sign until hostending character is met
	    //also mark if decoding is needed for the auth portion
	    for (var i = start; i <= end; ++i) {
	        var ch = str.charCodeAt(i);

	        if (ch === 0x40 /*'@'*/) {
	            j = i;
	        }
	        //This check is very, very cheap. Unneeded decodeURIComponent is very
	        //very expensive
	        else if (ch === 0x25 /*'%'*/) {
	            authNeedsDecoding = true;
	        }
	        else if (hostEndingCharacters[ch] === 1) {
	            break;
	        }
	    }

	    //@-sign was found at index j, everything to the left from it
	    //is auth part
	    if (j > -1) {
	        this._parseAuth(str, start, j - 1, authNeedsDecoding);
	        //hostname starts after the last @-sign
	        start = hostNameStart = j + 1;
	    }

	    //Host name is starting with a [
	    if (str.charCodeAt(start) === 0x5B /*'['*/) {
	        for (var i = start + 1; i <= end; ++i) {
	            var ch = str.charCodeAt(i);

	            //Assume valid IP6 is between the brackets
	            if (ch === 0x5D /*']'*/) {
	                if (str.charCodeAt(i + 1) === 0x3A /*':'*/) {
	                    portLength = this._parsePort(str, i + 2, end) + 1;
	                }
	                var hostname = str.slice(start + 1, i).toLowerCase();
	                this.hostname = hostname;
	                this.host = this._port > 0 ?
	                    "[" + hostname + "]:" + this._port :
	                    "[" + hostname + "]";
	                this.pathname = "/";
	                return i + portLength + 1;
	            }
	        }
	        //Empty hostname, [ starts a path
	        return start;
	    }

	    for (var i = start; i <= end; ++i) {
	        if (charsAfterDot > 62) {
	            this.hostname = this.host = str.slice(start, i);
	            return i;
	        }
	        var ch = str.charCodeAt(i);

	        if (ch === 0x3A /*':'*/) {
	            portLength = this._parsePort(str, i + 1, end) + 1;
	            hostNameEnd = i - 1;
	            break;
	        }
	        else if (ch < 0x61 /*'a'*/) {
	            if (ch === 0x2E /*'.'*/) {
	                //Node.js ignores this error
	                /*
	                if (lastCh === DOT || lastCh === -1) {
	                    this.hostname = this.host = "";
	                    return start;
	                }
	                */
	                charsAfterDot = -1;
	            }
	            else if (0x41 /*'A'*/ <= ch && ch <= 0x5A /*'Z'*/) {
	                doLowerCase = true;
	            }
	            //Valid characters other than ASCII letters -, _, +, 0-9
	            else if (!(ch === 0x2D /*'-'*/ ||
	                       ch === 0x5F /*'_'*/ ||
	                       ch === 0x2B /*'+'*/ ||
	                       (0x30 /*'0'*/ <= ch && ch <= 0x39 /*'9'*/))
	                ) {
	                if (hostEndingCharacters[ch] === 0 &&
	                    this._noPrependSlashHostEnders[ch] === 0) {
	                    this._prependSlash = true;
	                }
	                hostNameEnd = i - 1;
	                break;
	            }
	        }
	        else if (ch >= 0x7B /*'{'*/) {
	            if (ch <= 0x7E /*'~'*/) {
	                if (this._noPrependSlashHostEnders[ch] === 0) {
	                    this._prependSlash = true;
	                }
	                hostNameEnd = i - 1;
	                break;
	            }
	            idna = true;
	        }
	        charsAfterDot++;
	    }

	    //Node.js ignores this error
	    /*
	    if (lastCh === DOT) {
	        hostNameEnd--;
	    }
	    */

	    if (hostNameEnd + 1 !== start &&
	        hostNameEnd - hostNameStart <= 256) {
	        var hostname = str.slice(hostNameStart, hostNameEnd + 1);
	        if (doLowerCase) hostname = hostname.toLowerCase();
	        if (idna) hostname = this._hostIdna(hostname);
	        this.hostname = hostname;
	        this.host = this._port > 0 ? hostname + ":" + this._port : hostname;
	    }

	    return hostNameEnd + 1 + portLength;

	};

	Url.prototype._copyPropsTo = function Url$_copyPropsTo(input, noProtocol) {
	    if (!noProtocol) {
	        input._protocol = this._protocol;
	    }
	    input._href = this._href;
	    input._port = this._port;
	    input._prependSlash = this._prependSlash;
	    input.auth = this.auth;
	    input.slashes = this.slashes;
	    input.host = this.host;
	    input.hostname = this.hostname;
	    input.hash = this.hash;
	    input.search = this.search;
	    input.pathname = this.pathname;
	};

	Url.prototype._clone = function Url$_clone() {
	    var ret = new Url();
	    ret._protocol = this._protocol;
	    ret._href = this._href;
	    ret._port = this._port;
	    ret._prependSlash = this._prependSlash;
	    ret.auth = this.auth;
	    ret.slashes = this.slashes;
	    ret.host = this.host;
	    ret.hostname = this.hostname;
	    ret.hash = this.hash;
	    ret.search = this.search;
	    ret.pathname = this.pathname;
	    return ret;
	};

	Url.prototype._getComponentEscaped =
	function Url$_getComponentEscaped(str, start, end, isAfterQuery) {
	    var cur = start;
	    var i = start;
	    var ret = "";
	    var autoEscapeMap = isAfterQuery ?
	        this._afterQueryAutoEscapeMap : this._autoEscapeMap;
	    for (; i <= end; ++i) {
	        var ch = str.charCodeAt(i);
	        var escaped = autoEscapeMap[ch];

	        if (escaped !== "" && escaped !== undefined) {
	            if (cur < i) ret += str.slice(cur, i);
	            ret += escaped;
	            cur = i + 1;
	        }
	    }
	    if (cur < i + 1) ret += str.slice(cur, i);
	    return ret;
	};

	Url.prototype._parsePath =
	function Url$_parsePath(str, start, end, disableAutoEscapeChars) {
	    var pathStart = start;
	    var pathEnd = end;
	    var escape = false;
	    var autoEscapeCharacters = this._autoEscapeCharacters;
	    var prePath = this._port === -2 ? "/:" : "";

	    for (var i = start; i <= end; ++i) {
	        var ch = str.charCodeAt(i);
	        if (ch === 0x23 /*'#'*/) {
	          this._parseHash(str, i, end, disableAutoEscapeChars);
	            pathEnd = i - 1;
	            break;
	        }
	        else if (ch === 0x3F /*'?'*/) {
	            this._parseQuery(str, i, end, disableAutoEscapeChars);
	            pathEnd = i - 1;
	            break;
	        }
	        else if (!disableAutoEscapeChars && !escape && autoEscapeCharacters[ch] === 1) {
	            escape = true;
	        }
	    }

	    if (pathStart > pathEnd) {
	        this.pathname = prePath === "" ? "/" : prePath;
	        return;
	    }

	    var path;
	    if (escape) {
	        path = this._getComponentEscaped(str, pathStart, pathEnd, false);
	    }
	    else {
	        path = str.slice(pathStart, pathEnd + 1);
	    }
	    this.pathname = prePath === ""
	        ? (this._prependSlash ? "/" + path : path)
	        : prePath + path;
	};

	Url.prototype._parseQuery = function Url$_parseQuery(str, start, end, disableAutoEscapeChars) {
	    var queryStart = start;
	    var queryEnd = end;
	    var escape = false;
	    var autoEscapeCharacters = this._autoEscapeCharacters;

	    for (var i = start; i <= end; ++i) {
	        var ch = str.charCodeAt(i);

	        if (ch === 0x23 /*'#'*/) {
	            this._parseHash(str, i, end, disableAutoEscapeChars);
	            queryEnd = i - 1;
	            break;
	        }
	        else if (!disableAutoEscapeChars && !escape && autoEscapeCharacters[ch] === 1) {
	            escape = true;
	        }
	    }

	    if (queryStart > queryEnd) {
	        this.search = "";
	        return;
	    }

	    var query;
	    if (escape) {
	        query = this._getComponentEscaped(str, queryStart, queryEnd, true);
	    }
	    else {
	        query = str.slice(queryStart, queryEnd + 1);
	    }
	    this.search = query;
	};

	Url.prototype._parseHash = function Url$_parseHash(str, start, end, disableAutoEscapeChars) {
	    if (start > end) {
	        this.hash = "";
	        return;
	    }

	    this.hash = disableAutoEscapeChars ?
	        str.slice(start, end + 1) : this._getComponentEscaped(str, start, end, true);
	};

	Object.defineProperty(Url.prototype, "port", {
	    get: function() {
	        if (this._port >= 0) {
	            return ("" + this._port);
	        }
	        return null;
	    },
	    set: function(v) {
	        if (v == null) {
	            this._port = -1;
	        }
	        else {
	            this._port = parseInt(v, 10);
	        }
	    }
	});

	Object.defineProperty(Url.prototype, "query", {
	    get: function() {
	        var query = this._query;
	        if (query != null) {
	            return query;
	        }
	        var search = this.search;

	        if (search) {
	            if (search.charCodeAt(0) === 0x3F /*'?'*/) {
	                search = search.slice(1);
	            }
	            if (search !== "") {
	                this._query = search;
	                return search;
	            }
	        }
	        return search;
	    },
	    set: function(v) {
	        this._query = v;
	    }
	});

	Object.defineProperty(Url.prototype, "path", {
	    get: function() {
	        var p = this.pathname || "";
	        var s = this.search || "";
	        if (p || s) {
	            return p + s;
	        }
	        return (p == null && s) ? ("/" + s) : null;
	    },
	    set: function() {}
	});

	Object.defineProperty(Url.prototype, "protocol", {
	    get: function() {
	        var proto = this._protocol;
	        return proto ? proto + ":" : proto;
	    },
	    set: function(v) {
	        if (typeof v === "string") {
	            var end = v.length - 1;
	            if (v.charCodeAt(end) === 0x3A /*':'*/) {
	                this._protocol = v.slice(0, end);
	            }
	            else {
	                this._protocol = v;
	            }
	        }
	        else if (v == null) {
	            this._protocol = null;
	        }
	    }
	});

	Object.defineProperty(Url.prototype, "href", {
	    get: function() {
	        var href = this._href;
	        if (!href) {
	            href = this._href = this.format();
	        }
	        return href;
	    },
	    set: function(v) {
	        this._href = v;
	    }
	});

	Url.parse = function Url$Parse(str, parseQueryString, hostDenotesSlash, disableAutoEscapeChars) {
	    if (str instanceof Url) return str;
	    var ret = new Url();
	    ret.parse(str, !!parseQueryString, !!hostDenotesSlash, !!disableAutoEscapeChars);
	    return ret;
	};

	Url.format = function Url$Format(obj) {
	    if (typeof obj === "string") {
	        obj = Url.parse(obj);
	    }
	    if (!(obj instanceof Url)) {
	        return Url.prototype.format.call(obj);
	    }
	    return obj.format();
	};

	Url.resolve = function Url$Resolve(source, relative) {
	    return Url.parse(source, false, true).resolve(relative);
	};

	Url.resolveObject = function Url$ResolveObject(source, relative) {
	    if (!source) return relative;
	    return Url.parse(source, false, true).resolveObject(relative);
	};

	function _escapePath(pathname) {
	    return pathname.replace(/[?#]/g, function(match) {
	        return encodeURIComponent(match);
	    });
	}

	function _escapeSearch(search) {
	    return search.replace(/#/g, function(match) {
	        return encodeURIComponent(match);
	    });
	}

	//Search `char1` (integer code for a character) in `string`
	//starting from `fromIndex` and ending at `string.length - 1`
	//or when a stop character is found
	function containsCharacter(string, char1, fromIndex, stopCharacterTable) {
	    var len = string.length;
	    for (var i = fromIndex; i < len; ++i) {
	        var ch = string.charCodeAt(i);

	        if (ch === char1) {
	            return true;
	        }
	        else if (stopCharacterTable[ch] === 1) {
	            return false;
	        }
	    }
	    return false;
	}

	//See if `char1` or `char2` (integer codes for characters)
	//is contained in `string`
	function containsCharacter2(string, char1, char2) {
	    for (var i = 0, len = string.length; i < len; ++i) {
	        var ch = string.charCodeAt(i);
	        if (ch === char1 || ch === char2) return true;
	    }
	    return false;
	}

	//Makes an array of 128 uint8's which represent boolean values.
	//Spec is an array of ascii code points or ascii code point ranges
	//ranges are expressed as [start, end]

	//Create a table with the characters 0x30-0x39 (decimals '0' - '9') and
	//0x7A (lowercaseletter 'z') as `true`:
	//
	//var a = makeAsciiTable([[0x30, 0x39], 0x7A]);
	//a[0x30]; //1
	//a[0x15]; //0
	//a[0x35]; //1
	function makeAsciiTable(spec) {
	    var ret = new Uint8Array(128);
	    spec.forEach(function(item){
	        if (typeof item === "number") {
	            ret[item] = 1;
	        }
	        else {
	            var start = item[0];
	            var end = item[1];
	            for (var j = start; j <= end; ++j) {
	                ret[j] = 1;
	            }
	        }
	    });

	    return ret;
	}


	var autoEscape = ["<", ">", "\"", "`", " ", "\r", "\n",
	    "\t", "{", "}", "|", "\\", "^", "`", "'"];

	var autoEscapeMap = new Array(128);



	for (var i = 0, len = autoEscapeMap.length; i < len; ++i) {
	    autoEscapeMap[i] = "";
	}

	for (var i = 0, len = autoEscape.length; i < len; ++i) {
	    var c = autoEscape[i];
	    var esc = encodeURIComponent(c);
	    if (esc === c) {
	        esc = escape(c);
	    }
	    autoEscapeMap[c.charCodeAt(0)] = esc;
	}
	var afterQueryAutoEscapeMap = autoEscapeMap.slice();
	autoEscapeMap[0x5C /*'\'*/] = "/";

	var slashProtocols = Url.prototype._slashProtocols = {
	    http: true,
	    https: true,
	    gopher: true,
	    file: true,
	    ftp: true,

	    "http:": true,
	    "https:": true,
	    "gopher:": true,
	    "file:": true,
	    "ftp:": true
	};

	Url.prototype._protocolCharacters = makeAsciiTable([
	    [0x61 /*'a'*/, 0x7A /*'z'*/],
	    [0x41 /*'A'*/, 0x5A /*'Z'*/],
	    0x2E /*'.'*/, 0x2B /*'+'*/, 0x2D /*'-'*/
	]);

	Url.prototype._hostEndingCharacters = makeAsciiTable([
	    0x23 /*'#'*/, 0x3F /*'?'*/, 0x2F /*'/'*/, 0x5C /*'\'*/
	]);

	Url.prototype._autoEscapeCharacters = makeAsciiTable(
	    autoEscape.map(function(v) {
	        return v.charCodeAt(0);
	    })
	);

	//If these characters end a host name, the path will not be prepended a /
	Url.prototype._noPrependSlashHostEnders = makeAsciiTable(
	    [
	        "<", ">", "'", "`", " ", "\r",
	        "\n", "\t", "{", "}", "|",
	        "^", "`", "\"", "%", ";"
	    ].map(function(v) {
	        return v.charCodeAt(0);
	    })
	);

	Url.prototype._autoEscapeMap = autoEscapeMap;
	Url.prototype._afterQueryAutoEscapeMap = afterQueryAutoEscapeMap;

	urlparser = Url;

	Url.replace = function Url$Replace() {
	    require.cache.url = {
	        exports: Url
	    };
	};
	return urlparser;
}

var URLSearchParams$1 = {};

var hasRequiredURLSearchParams;

function requireURLSearchParams () {
	if (hasRequiredURLSearchParams) return URLSearchParams$1;
	hasRequiredURLSearchParams = 1;
	Object.defineProperty(URLSearchParams$1, "__esModule", { value: true });
	URLSearchParams$1.PonyfillURLSearchParams = void 0;
	const tslib_1 = require$$0;
	const fast_querystring_1 = tslib_1.__importDefault(requireLib());
	function isURLSearchParams(value) {
	    return value?.entries != null;
	}
	class PonyfillURLSearchParams {
	    constructor(init) {
	        if (init) {
	            if (typeof init === 'string') {
	                this.params = fast_querystring_1.default.parse(init);
	            }
	            else if (Array.isArray(init)) {
	                this.params = {};
	                for (const [key, value] of init) {
	                    this.params[key] = value;
	                }
	            }
	            else if (isURLSearchParams(init)) {
	                this.params = {};
	                for (const [key, value] of init.entries()) {
	                    this.params[key] = value;
	                }
	            }
	            else {
	                this.params = init;
	            }
	        }
	        else {
	            this.params = {};
	        }
	    }
	    append(name, value) {
	        const existingValue = this.params[name];
	        const finalValue = existingValue ? `${existingValue},${value}` : value;
	        this.params[name] = finalValue;
	    }
	    delete(name) {
	        delete this.params[name];
	    }
	    get(name) {
	        const value = this.params[name];
	        if (Array.isArray(value)) {
	            return value[0] || null;
	        }
	        return value || null;
	    }
	    getAll(name) {
	        const value = this.params[name];
	        if (!Array.isArray(value)) {
	            return value ? [value] : [];
	        }
	        return value;
	    }
	    has(name) {
	        return name in this.params;
	    }
	    set(name, value) {
	        this.params[name] = value;
	    }
	    sort() {
	        const sortedKeys = Object.keys(this.params).sort();
	        const sortedParams = {};
	        for (const key of sortedKeys) {
	            sortedParams[key] = this.params[key];
	        }
	        this.params = sortedParams;
	    }
	    toString() {
	        return fast_querystring_1.default.stringify(this.params);
	    }
	    *keys() {
	        for (const key in this.params) {
	            yield key;
	        }
	    }
	    *entries() {
	        for (const key of this.keys()) {
	            const value = this.params[key];
	            if (Array.isArray(value)) {
	                for (const item of value) {
	                    yield [key, item];
	                }
	            }
	            else {
	                yield [key, value];
	            }
	        }
	    }
	    *values() {
	        for (const [, value] of this) {
	            yield value;
	        }
	    }
	    [Symbol.iterator]() {
	        return this.entries();
	    }
	    forEach(callback) {
	        for (const [key, value] of this) {
	            callback(value, key, this);
	        }
	    }
	    get size() {
	        return Object.keys(this.params).length;
	    }
	}
	URLSearchParams$1.PonyfillURLSearchParams = PonyfillURLSearchParams;
	return URLSearchParams$1;
}

var hasRequiredURL;

function requireURL () {
	if (hasRequiredURL) return URL$2;
	hasRequiredURL = 1;
	Object.defineProperty(URL$2, "__esModule", { value: true });
	URL$2.PonyfillURL = void 0;
	const tslib_1 = require$$0;
	const buffer_1 = require$$1;
	const crypto_1 = require$$2;
	const fast_querystring_1 = tslib_1.__importDefault(requireLib());
	const fast_url_parser_1 = tslib_1.__importDefault(requireUrlparser());
	const URLSearchParams_js_1 = requireURLSearchParams();
	fast_url_parser_1.default.queryString = fast_querystring_1.default;
	class PonyfillURL extends fast_url_parser_1.default {
	    constructor(url, base) {
	        super();
	        if (url.startsWith('data:')) {
	            this.protocol = 'data:';
	            this.pathname = url.slice('data:'.length);
	            return;
	        }
	        this.parse(url, false);
	        if (base) {
	            const baseParsed = typeof base === 'string' ? new PonyfillURL(base) : base;
	            this.protocol = this.protocol || baseParsed.protocol;
	            this.host = this.host || baseParsed.host;
	            this.pathname = this.pathname || baseParsed.pathname;
	        }
	    }
	    get origin() {
	        return `${this.protocol}//${this.host}`;
	    }
	    get searchParams() {
	        if (!this._searchParams) {
	            this._searchParams = new URLSearchParams_js_1.PonyfillURLSearchParams(this.query);
	        }
	        return this._searchParams;
	    }
	    get username() {
	        return this.auth?.split(':')[0] || '';
	    }
	    set username(value) {
	        this.auth = `${value}:${this.password}`;
	    }
	    get password() {
	        return this.auth?.split(':')[1] || '';
	    }
	    set password(value) {
	        this.auth = `${this.username}:${value}`;
	    }
	    toString() {
	        return this.format();
	    }
	    toJSON() {
	        return this.toString();
	    }
	    static createObjectURL(blob) {
	        const blobUrl = `blob:whatwgnode:${(0, crypto_1.randomUUID)()}`;
	        this.blobRegistry.set(blobUrl, blob);
	        return blobUrl;
	    }
	    static resolveObjectURL(url) {
	        if (!this.blobRegistry.has(url)) {
	            URL.revokeObjectURL(url);
	        }
	        else {
	            this.blobRegistry.delete(url);
	        }
	    }
	    static getBlobFromURL(url) {
	        return (this.blobRegistry.get(url) || (0, buffer_1.resolveObjectURL)(url));
	    }
	}
	URL$2.PonyfillURL = PonyfillURL;
	PonyfillURL.blobRegistry = new Map();
	return URL$2;
}

var hasRequiredFetchNodeHttp;

function requireFetchNodeHttp () {
	if (hasRequiredFetchNodeHttp) return fetchNodeHttp;
	hasRequiredFetchNodeHttp = 1;
	Object.defineProperty(fetchNodeHttp, "__esModule", { value: true });
	fetchNodeHttp.fetchNodeHttp = void 0;
	const http_1 = require$$0$3;
	const https_1 = require$$1$1;
	const stream_1 = require$$0$1;
	const zlib_1 = require$$3;
	const AbortError_js_1 = requireAbortError();
	const Request_js_1 = requireRequest();
	const Response_js_1 = requireResponse();
	const URL_js_1 = requireURL();
	const utils_js_1 = requireUtils();
	function getRequestFnForProtocol(url) {
	    if (url.startsWith('http:')) {
	        return http_1.request;
	    }
	    else if (url.startsWith('https:')) {
	        return https_1.request;
	    }
	    throw new Error(`Unsupported protocol: ${url.split(':')[0] || url}`);
	}
	function fetchNodeHttp$1(fetchRequest) {
	    return new Promise((resolve, reject) => {
	        try {
	            const requestFn = getRequestFnForProtocol(fetchRequest.url);
	            const nodeReadable = (fetchRequest.body != null
	                ? (0, utils_js_1.isNodeReadable)(fetchRequest.body)
	                    ? fetchRequest.body
	                    : stream_1.Readable.from(fetchRequest.body)
	                : null);
	            const headersSerializer = fetchRequest.headersSerializer || utils_js_1.getHeadersObj;
	            const nodeHeaders = headersSerializer(fetchRequest.headers);
	            const nodeRequest = requestFn(fetchRequest.url, {
	                method: fetchRequest.method,
	                headers: nodeHeaders,
	                signal: fetchRequest['_signal'] ?? undefined,
	                agent: fetchRequest.agent,
	            });
	            nodeRequest.once('response', nodeResponse => {
	                let responseBody = nodeResponse;
	                const contentEncoding = nodeResponse.headers['content-encoding'];
	                switch (contentEncoding) {
	                    case 'x-gzip':
	                    case 'gzip':
	                        responseBody = nodeResponse.pipe((0, zlib_1.createGunzip)());
	                        break;
	                    case 'x-deflate':
	                    case 'deflate':
	                        responseBody = nodeResponse.pipe((0, zlib_1.createInflate)());
	                        break;
	                    case 'br':
	                        responseBody = nodeResponse.pipe((0, zlib_1.createBrotliDecompress)());
	                        break;
	                }
	                if (nodeResponse.headers.location) {
	                    if (fetchRequest.redirect === 'error') {
	                        const redirectError = new Error('Redirects are not allowed');
	                        reject(redirectError);
	                        nodeResponse.resume();
	                        return;
	                    }
	                    if (fetchRequest.redirect === 'follow') {
	                        const redirectedUrl = new URL_js_1.PonyfillURL(nodeResponse.headers.location, fetchRequest.url);
	                        const redirectResponse$ = fetchNodeHttp$1(new Request_js_1.PonyfillRequest(redirectedUrl, fetchRequest));
	                        resolve(redirectResponse$.then(redirectResponse => {
	                            redirectResponse.redirected = true;
	                            return redirectResponse;
	                        }));
	                        nodeResponse.resume();
	                        return;
	                    }
	                }
	                if (responseBody === nodeResponse) {
	                    responseBody = nodeResponse.pipe(new stream_1.PassThrough());
	                    responseBody.on('pause', () => {
	                        nodeResponse.pause();
	                    });
	                    responseBody.on('resume', () => {
	                        nodeResponse.resume();
	                    });
	                    responseBody.on('close', () => {
	                        nodeResponse.destroy();
	                    });
	                    fetchRequest['_signal']?.addEventListener('abort', () => {
	                        if (!nodeResponse.destroyed) {
	                            responseBody.emit('error', new AbortError_js_1.PonyfillAbortError());
	                        }
	                    });
	                }
	                nodeResponse.once('error', reject);
	                const ponyfillResponse = new Response_js_1.PonyfillResponse(responseBody, {
	                    status: nodeResponse.statusCode,
	                    statusText: nodeResponse.statusMessage,
	                    headers: nodeResponse.headers,
	                    url: fetchRequest.url,
	                });
	                resolve(ponyfillResponse);
	            });
	            nodeRequest.once('error', reject);
	            if (nodeReadable) {
	                nodeReadable.pipe(nodeRequest);
	            }
	            else {
	                nodeRequest.end();
	            }
	        }
	        catch (e) {
	            reject(e);
	        }
	    });
	}
	fetchNodeHttp.fetchNodeHttp = fetchNodeHttp$1;
	return fetchNodeHttp;
}

var hasRequiredFetch;

function requireFetch () {
	if (hasRequiredFetch) return fetch$1;
	hasRequiredFetch = 1;
	Object.defineProperty(fetch$1, "__esModule", { value: true });
	fetch$1.fetchPonyfill = void 0;
	const fs_1 = require$$0$5;
	const url_1 = require$$1$2;
	const fetchCurl_js_1 = requireFetchCurl();
	const fetchNodeHttp_js_1 = requireFetchNodeHttp();
	const Request_js_1 = requireRequest();
	const Response_js_1 = requireResponse();
	const URL_js_1 = requireURL();
	const utils_js_1 = requireUtils();
	const BASE64_SUFFIX = ';base64';
	function getResponseForFile(url) {
	    const path = (0, url_1.fileURLToPath)(url);
	    const readable = (0, fs_1.createReadStream)(path);
	    return new Response_js_1.PonyfillResponse(readable);
	}
	function getResponseForDataUri(url) {
	    const [mimeType = 'text/plain', ...datas] = url.substring(5).split(',');
	    const data = decodeURIComponent(datas.join(','));
	    if (mimeType.endsWith(BASE64_SUFFIX)) {
	        const buffer = Buffer.from(data, 'base64url');
	        const realMimeType = mimeType.slice(0, -BASE64_SUFFIX.length);
	        return new Response_js_1.PonyfillResponse(buffer, {
	            status: 200,
	            statusText: 'OK',
	            headers: {
	                'content-type': realMimeType,
	            },
	        });
	    }
	    return new Response_js_1.PonyfillResponse(data, {
	        status: 200,
	        statusText: 'OK',
	        headers: {
	            'content-type': mimeType,
	        },
	    });
	}
	function getResponseForBlob(url) {
	    const blob = URL_js_1.PonyfillURL.getBlobFromURL(url);
	    if (!blob) {
	        throw new TypeError('Invalid Blob URL');
	    }
	    return new Response_js_1.PonyfillResponse(blob, {
	        status: 200,
	        headers: {
	            'content-type': blob.type,
	            'content-length': blob.size.toString(),
	        },
	    });
	}
	function isURL(obj) {
	    return obj != null && obj.href != null;
	}
	function fetchPonyfill(info, init) {
	    if (typeof info === 'string' || isURL(info)) {
	        const ponyfillRequest = new Request_js_1.PonyfillRequest(info, init);
	        return fetchPonyfill(ponyfillRequest);
	    }
	    const fetchRequest = info;
	    if (fetchRequest.url.startsWith('data:')) {
	        const response = getResponseForDataUri(fetchRequest.url);
	        return (0, utils_js_1.fakePromise)(response);
	    }
	    if (fetchRequest.url.startsWith('file:')) {
	        const response = getResponseForFile(fetchRequest.url);
	        return (0, utils_js_1.fakePromise)(response);
	    }
	    if (fetchRequest.url.startsWith('blob:')) {
	        const response = getResponseForBlob(fetchRequest.url);
	        return (0, utils_js_1.fakePromise)(response);
	    }
	    if (globalThis.libcurl) {
	        return (0, fetchCurl_js_1.fetchCurl)(fetchRequest);
	    }
	    return (0, fetchNodeHttp_js_1.fetchNodeHttp)(fetchRequest);
	}
	fetch$1.fetchPonyfill = fetchPonyfill;
	return fetch$1;
}

var TextEncoderDecoder = {};

var hasRequiredTextEncoderDecoder;

function requireTextEncoderDecoder () {
	if (hasRequiredTextEncoderDecoder) return TextEncoderDecoder;
	hasRequiredTextEncoderDecoder = 1;
	Object.defineProperty(TextEncoderDecoder, "__esModule", { value: true });
	TextEncoderDecoder.PonyfillBtoa = TextEncoderDecoder.PonyfillTextDecoder = TextEncoderDecoder.PonyfillTextEncoder = void 0;
	const utils_js_1 = requireUtils();
	class PonyfillTextEncoder {
	    constructor(encoding = 'utf-8') {
	        this.encoding = encoding;
	    }
	    encode(input) {
	        return Buffer.from(input, this.encoding);
	    }
	    encodeInto(source, destination) {
	        const buffer = this.encode(source);
	        const copied = buffer.copy(destination);
	        return {
	            read: copied,
	            written: copied,
	        };
	    }
	}
	TextEncoderDecoder.PonyfillTextEncoder = PonyfillTextEncoder;
	class PonyfillTextDecoder {
	    constructor(encoding = 'utf-8', options) {
	        this.encoding = encoding;
	        this.fatal = false;
	        this.ignoreBOM = false;
	        if (options) {
	            this.fatal = options.fatal || false;
	            this.ignoreBOM = options.ignoreBOM || false;
	        }
	    }
	    decode(input) {
	        if (Buffer.isBuffer(input)) {
	            return input.toString(this.encoding);
	        }
	        if ((0, utils_js_1.isArrayBufferView)(input)) {
	            return Buffer.from(input.buffer, input.byteOffset, input.byteLength).toString(this.encoding);
	        }
	        return Buffer.from(input).toString(this.encoding);
	    }
	}
	TextEncoderDecoder.PonyfillTextDecoder = PonyfillTextDecoder;
	function PonyfillBtoa(input) {
	    return Buffer.from(input, 'binary').toString('base64');
	}
	TextEncoderDecoder.PonyfillBtoa = PonyfillBtoa;
	return TextEncoderDecoder;
}

var hasRequiredCjs;

function requireCjs () {
	if (hasRequiredCjs) return cjs;
	hasRequiredCjs = 1;
	(function (exports) {
		Object.defineProperty(exports, "__esModule", { value: true });
		exports.URLSearchParams = exports.URL = exports.btoa = exports.TextDecoder = exports.TextEncoder = exports.Blob = exports.FormData = exports.File = exports.ReadableStream = exports.Response = exports.Request = exports.Body = exports.Headers = exports.fetch = void 0;
		var fetch_js_1 = requireFetch();
		Object.defineProperty(exports, "fetch", { enumerable: true, get: function () { return fetch_js_1.fetchPonyfill; } });
		var Headers_js_1 = requireHeaders();
		Object.defineProperty(exports, "Headers", { enumerable: true, get: function () { return Headers_js_1.PonyfillHeaders; } });
		var Body_js_1 = requireBody();
		Object.defineProperty(exports, "Body", { enumerable: true, get: function () { return Body_js_1.PonyfillBody; } });
		var Request_js_1 = requireRequest();
		Object.defineProperty(exports, "Request", { enumerable: true, get: function () { return Request_js_1.PonyfillRequest; } });
		var Response_js_1 = requireResponse();
		Object.defineProperty(exports, "Response", { enumerable: true, get: function () { return Response_js_1.PonyfillResponse; } });
		var ReadableStream_js_1 = requireReadableStream();
		Object.defineProperty(exports, "ReadableStream", { enumerable: true, get: function () { return ReadableStream_js_1.PonyfillReadableStream; } });
		var File_js_1 = requireFile();
		Object.defineProperty(exports, "File", { enumerable: true, get: function () { return File_js_1.PonyfillFile; } });
		var FormData_js_1 = requireFormData();
		Object.defineProperty(exports, "FormData", { enumerable: true, get: function () { return FormData_js_1.PonyfillFormData; } });
		var Blob_js_1 = requireBlob();
		Object.defineProperty(exports, "Blob", { enumerable: true, get: function () { return Blob_js_1.PonyfillBlob; } });
		var TextEncoderDecoder_js_1 = requireTextEncoderDecoder();
		Object.defineProperty(exports, "TextEncoder", { enumerable: true, get: function () { return TextEncoderDecoder_js_1.PonyfillTextEncoder; } });
		Object.defineProperty(exports, "TextDecoder", { enumerable: true, get: function () { return TextEncoderDecoder_js_1.PonyfillTextDecoder; } });
		Object.defineProperty(exports, "btoa", { enumerable: true, get: function () { return TextEncoderDecoder_js_1.PonyfillBtoa; } });
		var URL_js_1 = requireURL();
		Object.defineProperty(exports, "URL", { enumerable: true, get: function () { return URL_js_1.PonyfillURL; } });
		var URLSearchParams_js_1 = requireURLSearchParams();
		Object.defineProperty(exports, "URLSearchParams", { enumerable: true, get: function () { return URLSearchParams_js_1.PonyfillURLSearchParams; } }); 
	} (cjs));
	return cjs;
}

const shouldSkipPonyfill$1 = shouldSkipPonyfill$2;

var createNodePonyfill$1 = function createNodePonyfill(opts = {}) {
  const ponyfills = {};
  
  // We call this previously to patch `Bun`
  if (!ponyfills.URLPattern) {
    const urlPatternModule = requireUrlpatternPolyfill();
    ponyfills.URLPattern = urlPatternModule.URLPattern;
  }

  if (shouldSkipPonyfill$1()) {
    return globalThis;
  }

  const newNodeFetch = requireCjs();

  ponyfills.fetch = newNodeFetch.fetch;
  ponyfills.Request = newNodeFetch.Request;
  ponyfills.Response = newNodeFetch.Response;
  ponyfills.Headers = newNodeFetch.Headers;
  ponyfills.FormData = newNodeFetch.FormData;
  ponyfills.ReadableStream = newNodeFetch.ReadableStream;

  ponyfills.URL = newNodeFetch.URL;
  ponyfills.URLSearchParams = newNodeFetch.URLSearchParams;

  ponyfills.WritableStream = globalThis.WritableStream;
  ponyfills.TransformStream = globalThis.TransformStream;

  if (!ponyfills.WritableStream) {
    const streamsWeb = require$$3$1;
    ponyfills.WritableStream = streamsWeb.WritableStream;
    ponyfills.TransformStream = streamsWeb.TransformStream;
  }

  ponyfills.Blob = newNodeFetch.Blob;
  ponyfills.File = newNodeFetch.File;
  ponyfills.crypto = globalThis.crypto;
  ponyfills.btoa = newNodeFetch.btoa;
  ponyfills.TextEncoder = newNodeFetch.TextEncoder;
  ponyfills.TextDecoder = newNodeFetch.TextDecoder;

  if (opts.formDataLimits) {
    ponyfills.Body = class Body extends newNodeFetch.Body {
      constructor(body, userOpts) {
        super(body, {
          formDataLimits: opts.formDataLimits,
          ...userOpts,
        });
      }
    };
    ponyfills.Request = class Request extends newNodeFetch.Request {
      constructor(input, userOpts) {
        super(input, {
          formDataLimits: opts.formDataLimits,
          ...userOpts,
        });
      }
    };
    ponyfills.Response = class Response extends newNodeFetch.Response {
      constructor(body, userOpts) {
        super(body, {
          formDataLimits: opts.formDataLimits,
          ...userOpts,
        });
      }
    };
  }

  if (!ponyfills.crypto) {
    const cryptoModule = require$$2;
    ponyfills.crypto = cryptoModule.webcrypto;
  }

  return ponyfills;
};

const createNodePonyfill = createNodePonyfill$1;
const shouldSkipPonyfill = shouldSkipPonyfill$2;
const ponyfills = createNodePonyfill();

if (!shouldSkipPonyfill()) {
  try {
    const nodelibcurlName = 'node-libcurl';
    globalThis.libcurl = globalThis.libcurl || commonjsRequire(nodelibcurlName);
  } catch (e) { }
}

var fetch = nodePonyfill.fetch = ponyfills.fetch;
var Headers$1 = nodePonyfill.Headers = ponyfills.Headers;
var Request = nodePonyfill.Request = ponyfills.Request;
var Response$1 = nodePonyfill.Response = ponyfills.Response;
var FormData = nodePonyfill.FormData = ponyfills.FormData;
var ReadableStream$1 = nodePonyfill.ReadableStream = ponyfills.ReadableStream;
var WritableStream = nodePonyfill.WritableStream = ponyfills.WritableStream;
var TransformStream = nodePonyfill.TransformStream = ponyfills.TransformStream;
var Blob = nodePonyfill.Blob = ponyfills.Blob;
var File = nodePonyfill.File = ponyfills.File;
var crypto = nodePonyfill.crypto = ponyfills.crypto;
var btoa = nodePonyfill.btoa = ponyfills.btoa;
var TextEncoder = nodePonyfill.TextEncoder = ponyfills.TextEncoder;
var TextDecoder$1 = nodePonyfill.TextDecoder = ponyfills.TextDecoder;
var URLPattern$1 = nodePonyfill.URLPattern = ponyfills.URLPattern;
var URL$1 = nodePonyfill.URL = ponyfills.URL;
var URLSearchParams = nodePonyfill.URLSearchParams = ponyfills.URLSearchParams;

var createFetch = nodePonyfill.createFetch = createNodePonyfill;

const DefaultFetchAPI = /*#__PURE__*/_mergeNamespaces({
    __proto__: null,
    Blob,
    File,
    FormData,
    Headers: Headers$1,
    ReadableStream: ReadableStream$1,
    Request,
    Response: Response$1,
    TextDecoder: TextDecoder$1,
    TextEncoder,
    TransformStream,
    URL: URL$1,
    URLPattern: URLPattern$1,
    URLSearchParams,
    WritableStream,
    btoa,
    createFetch,
    crypto,
    default: nodePonyfill,
    fetch
}, [nodePonyfill]);

function isAsyncIterable(body) {
    return (body != null && typeof body === 'object' && typeof body[Symbol.asyncIterator] === 'function');
}
function getPort(nodeRequest) {
    if (nodeRequest.socket?.localPort) {
        return nodeRequest.socket?.localPort;
    }
    const hostInHeader = nodeRequest.headers?.[':authority'] || nodeRequest.headers?.host;
    const portInHeader = hostInHeader?.split(':')?.[1];
    if (portInHeader) {
        return portInHeader;
    }
    return 80;
}
function getHostnameWithPort(nodeRequest) {
    if (nodeRequest.headers?.[':authority']) {
        return nodeRequest.headers?.[':authority'];
    }
    if (nodeRequest.headers?.host) {
        return nodeRequest.headers?.host;
    }
    const port = getPort(nodeRequest);
    if (nodeRequest.hostname) {
        return nodeRequest.hostname + ':' + port;
    }
    const localIp = nodeRequest.socket?.localAddress;
    if (localIp && !localIp?.includes('::') && !localIp?.includes('ffff')) {
        return `${localIp}:${port}`;
    }
    return 'localhost';
}
function buildFullUrl(nodeRequest) {
    const hostnameWithPort = getHostnameWithPort(nodeRequest);
    const protocol = nodeRequest.protocol || (nodeRequest.socket?.encrypted ? 'https' : 'http');
    const endpoint = nodeRequest.originalUrl || nodeRequest.url || '/graphql';
    return `${protocol}://${hostnameWithPort}${endpoint}`;
}
function isRequestBody(body) {
    const stringTag = body[Symbol.toStringTag];
    if (typeof body === 'string' ||
        stringTag === 'Uint8Array' ||
        stringTag === 'Blob' ||
        stringTag === 'FormData' ||
        stringTag === 'URLSearchParams' ||
        isAsyncIterable(body)) {
        return true;
    }
    return false;
}
class ServerAdapterRequestAbortSignal extends EventTarget {
    constructor() {
        super(...arguments);
        this.aborted = false;
        this._onabort = null;
    }
    throwIfAborted() {
        if (this.aborted) {
            throw this.reason;
        }
    }
    sendAbort() {
        this.reason = new DOMException('This operation was aborted', 'AbortError');
        this.aborted = true;
        this.dispatchEvent(new Event('abort'));
    }
    get onabort() {
        return this._onabort;
    }
    set onabort(value) {
        this._onabort = value;
        if (value) {
            this.addEventListener('abort', value);
        }
        else {
            this.removeEventListener('abort', value);
        }
    }
}
let bunNodeCompatModeWarned = false;
const nodeRequestResponseMap = new WeakMap();
function normalizeNodeRequest(nodeRequest, RequestCtor) {
    const rawRequest = nodeRequest.raw || nodeRequest.req || nodeRequest;
    let fullUrl = buildFullUrl(rawRequest);
    if (nodeRequest.query) {
        const url = new URL$1(fullUrl);
        for (const key in nodeRequest.query) {
            url.searchParams.set(key, nodeRequest.query[key]);
        }
        fullUrl = url.toString();
    }
    let signal;
    const nodeResponse = nodeRequestResponseMap.get(nodeRequest);
    nodeRequestResponseMap.delete(nodeRequest);
    if (nodeResponse?.once) {
        let sendAbortSignal;
        // If ponyfilled
        if (RequestCtor !== globalThis.Request) {
            signal = new ServerAdapterRequestAbortSignal();
            sendAbortSignal = () => signal.sendAbort();
        }
        else {
            const controller = new AbortController();
            signal = controller.signal;
            sendAbortSignal = () => controller.abort();
        }
        const closeEventListener = () => {
            if (signal && !signal.aborted) {
                rawRequest.aborted = true;
                sendAbortSignal();
            }
        };
        nodeResponse.once('error', closeEventListener);
        nodeResponse.once('close', closeEventListener);
        nodeResponse.once('finish', () => {
            nodeResponse.removeListener('close', closeEventListener);
        });
    }
    if (nodeRequest.method === 'GET' || nodeRequest.method === 'HEAD') {
        return new RequestCtor(fullUrl, {
            method: nodeRequest.method,
            headers: nodeRequest.headers,
            signal,
        });
    }
    /**
     * Some Node server frameworks like Serverless Express sends a dummy object with body but as a Buffer not string
     * so we do those checks to see is there something we can use directly as BodyInit
     * because the presence of body means the request stream is already consumed and,
     * rawRequest cannot be used as BodyInit/ReadableStream by Fetch API in this case.
     */
    const maybeParsedBody = nodeRequest.body;
    if (maybeParsedBody != null && Object.keys(maybeParsedBody).length > 0) {
        if (isRequestBody(maybeParsedBody)) {
            return new RequestCtor(fullUrl, {
                method: nodeRequest.method,
                headers: nodeRequest.headers,
                body: maybeParsedBody,
                signal,
            });
        }
        const request = new RequestCtor(fullUrl, {
            method: nodeRequest.method,
            headers: nodeRequest.headers,
            signal,
        });
        if (!request.headers.get('content-type')?.includes('json')) {
            request.headers.set('content-type', 'application/json; charset=utf-8');
        }
        return new Proxy(request, {
            get: (target, prop, receiver) => {
                switch (prop) {
                    case 'json':
                        return async () => maybeParsedBody;
                    case 'text':
                        return async () => JSON.stringify(maybeParsedBody);
                    default:
                        return Reflect.get(target, prop, receiver);
                }
            },
        });
    }
    // Temporary workaround for a bug in Bun Node compat mode
    if (globalThis.process?.versions?.bun && isReadable(rawRequest)) {
        if (!bunNodeCompatModeWarned) {
            bunNodeCompatModeWarned = true;
            console.warn(`You use Bun Node compatibility mode, which is not recommended!
It will affect your performance. Please check our Bun integration recipe, and avoid using 'http' for your server implementation.`);
        }
        return new RequestCtor(fullUrl, {
            method: nodeRequest.method,
            headers: nodeRequest.headers,
            duplex: 'half',
            body: new ReadableStream({
                start(controller) {
                    rawRequest.on('data', chunk => {
                        controller.enqueue(chunk);
                    });
                    rawRequest.on('error', e => {
                        controller.error(e);
                    });
                    rawRequest.on('end', () => {
                        controller.close();
                    });
                },
                cancel(e) {
                    rawRequest.destroy(e);
                },
            }),
            signal,
        });
    }
    // perf: instead of spreading the object, we can just pass it as is and it performs better
    return new RequestCtor(fullUrl, {
        method: nodeRequest.method,
        headers: nodeRequest.headers,
        body: rawRequest,
        duplex: 'half',
        signal,
    });
}
function isReadable(stream) {
    return stream.read != null;
}
function isNodeRequest(request) {
    return isReadable(request);
}
function isServerResponse(stream) {
    // Check all used functions are defined
    return (stream != null &&
        stream.setHeader != null &&
        stream.end != null &&
        stream.once != null &&
        stream.write != null);
}
function isFetchEvent(event) {
    return event != null && event.request != null && event.respondWith != null;
}
function configureSocket(rawRequest) {
    rawRequest?.socket?.setTimeout?.(0);
    rawRequest?.socket?.setNoDelay?.(true);
    rawRequest?.socket?.setKeepAlive?.(true);
}
function endResponse(serverResponse) {
    // @ts-expect-error Avoid arguments adaptor trampoline https://v8.dev/blog/adaptor-frame
    serverResponse.end(null, null, null);
}
async function sendAsyncIterable(serverResponse, asyncIterable) {
    for await (const chunk of asyncIterable) {
        if (!serverResponse
            // @ts-expect-error http and http2 writes are actually compatible
            .write(chunk)) {
            break;
        }
    }
    endResponse(serverResponse);
}
function sendNodeResponse(fetchResponse, serverResponse, nodeRequest) {
    if (serverResponse.closed || serverResponse.destroyed || serverResponse.writableEnded) {
        return;
    }
    if (!fetchResponse) {
        serverResponse.statusCode = 404;
        serverResponse.end();
        return;
    }
    serverResponse.statusCode = fetchResponse.status;
    serverResponse.statusMessage = fetchResponse.statusText;
    let setCookiesSet = false;
    fetchResponse.headers.forEach((value, key) => {
        if (key === 'set-cookie') {
            if (setCookiesSet) {
                return;
            }
            setCookiesSet = true;
            const setCookies = fetchResponse.headers.getSetCookie?.();
            if (setCookies) {
                serverResponse.setHeader('set-cookie', setCookies);
                return;
            }
        }
        serverResponse.setHeader(key, value);
    });
    // Optimizations for node-fetch
    const bufOfRes = fetchResponse._buffer;
    if (bufOfRes) {
        // @ts-expect-error http and http2 writes are actually compatible
        serverResponse.write(bufOfRes);
        endResponse(serverResponse);
        return;
    }
    // Other fetch implementations
    const fetchBody = fetchResponse.body;
    if (fetchBody == null) {
        endResponse(serverResponse);
        return;
    }
    if (fetchBody[Symbol.toStringTag] === 'Uint8Array') {
        serverResponse
            // @ts-expect-error http and http2 writes are actually compatible
            .write(fetchBody);
        endResponse(serverResponse);
        return;
    }
    configureSocket(nodeRequest);
    if (isReadable(fetchBody)) {
        serverResponse.once('close', () => {
            fetchBody.destroy();
        });
        fetchBody.pipe(serverResponse);
        return;
    }
    if (isAsyncIterable(fetchBody)) {
        return sendAsyncIterable(serverResponse, fetchBody);
    }
}
function isRequestInit(val) {
    return (val != null &&
        typeof val === 'object' &&
        ('body' in val ||
            'cache' in val ||
            'credentials' in val ||
            'headers' in val ||
            'integrity' in val ||
            'keepalive' in val ||
            'method' in val ||
            'mode' in val ||
            'redirect' in val ||
            'referrer' in val ||
            'referrerPolicy' in val ||
            'signal' in val ||
            'window' in val));
}
// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#copying_accessors
function completeAssign(...args) {
    const [target, ...sources] = args.filter(arg => arg != null && typeof arg === 'object');
    sources.forEach(source => {
        // modified Object.keys to Object.getOwnPropertyNames
        // because Object.keys only returns enumerable properties
        const descriptors = Object.getOwnPropertyNames(source).reduce((descriptors, key) => {
            descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
            return descriptors;
        }, {});
        // By default, Object.assign copies enumerable Symbols, too
        Object.getOwnPropertySymbols(source).forEach(sym => {
            const descriptor = Object.getOwnPropertyDescriptor(source, sym);
            if (descriptor.enumerable) {
                descriptors[sym] = descriptor;
            }
        });
        Object.defineProperties(target, descriptors);
    });
    return target;
}
function isPromise(val) {
    return val?.then != null;
}
function iterateAsyncVoid(iterable, callback) {
    const iterator = iterable[Symbol.iterator]();
    let stopEarlyFlag = false;
    function stopEarlyFn() {
        stopEarlyFlag = true;
    }
    function iterate() {
        const { done: endOfIterator, value } = iterator.next();
        if (endOfIterator) {
            return;
        }
        const result$ = callback(value, stopEarlyFn);
        if (isPromise(result$)) {
            return result$.then(() => {
                if (stopEarlyFlag) {
                    return;
                }
                return iterate();
            });
        }
        if (stopEarlyFlag) {
            return;
        }
        return iterate();
    }
    return iterate();
}
function handleErrorFromRequestHandler(error, ResponseCtor) {
    return new ResponseCtor(error.stack || error.message || error.toString(), {
        status: error.status || 500,
    });
}
function isolateObject(originalCtx, waitUntilPromises) {
    if (originalCtx == null) {
        return {};
    }
    const extraProps = {};
    const deletedProps = new Set();
    return new Proxy(originalCtx, {
        get(originalCtx, prop) {
            if (waitUntilPromises != null && prop === 'waitUntil') {
                return function waitUntil(promise) {
                    waitUntilPromises.push(promise.catch(err => console.error(err)));
                };
            }
            const extraPropVal = extraProps[prop];
            if (extraPropVal != null) {
                if (typeof extraPropVal === 'function') {
                    return extraPropVal.bind(extraProps);
                }
                return extraPropVal;
            }
            if (deletedProps.has(prop)) {
                return undefined;
            }
            return originalCtx[prop];
        },
        set(_originalCtx, prop, value) {
            extraProps[prop] = value;
            return true;
        },
        has(originalCtx, prop) {
            if (waitUntilPromises != null && prop === 'waitUntil') {
                return true;
            }
            if (deletedProps.has(prop)) {
                return false;
            }
            if (prop in extraProps) {
                return true;
            }
            return prop in originalCtx;
        },
        defineProperty(_originalCtx, prop, descriptor) {
            return Reflect.defineProperty(extraProps, prop, descriptor);
        },
        deleteProperty(_originalCtx, prop) {
            if (prop in extraProps) {
                return Reflect.deleteProperty(extraProps, prop);
            }
            deletedProps.add(prop);
            return true;
        },
        ownKeys(originalCtx) {
            const extraKeys = Reflect.ownKeys(extraProps);
            const originalKeys = Reflect.ownKeys(originalCtx);
            const deletedKeys = Array.from(deletedProps);
            const allKeys = new Set(extraKeys.concat(originalKeys.filter(keys => !deletedKeys.includes(keys))));
            if (waitUntilPromises != null) {
                allKeys.add('waitUntil');
            }
            return Array.from(allKeys);
        },
        getOwnPropertyDescriptor(originalCtx, prop) {
            if (prop in extraProps) {
                return Reflect.getOwnPropertyDescriptor(extraProps, prop);
            }
            if (deletedProps.has(prop)) {
                return undefined;
            }
            return Reflect.getOwnPropertyDescriptor(originalCtx, prop);
        },
    });
}
function createDeferredPromise() {
    let resolveFn;
    let rejectFn;
    const promise = new Promise(function deferredPromiseExecutor(resolve, reject) {
        resolveFn = resolve;
        rejectFn = reject;
    });
    return {
        promise,
        get resolve() {
            return resolveFn;
        },
        get reject() {
            return rejectFn;
        },
    };
}
function handleAbortSignalAndPromiseResponse(response$, abortSignal) {
    if (isPromise(response$) && abortSignal) {
        const deferred$ = createDeferredPromise();
        abortSignal.addEventListener('abort', function abortSignalFetchErrorHandler() {
            deferred$.reject(abortSignal.reason);
        });
        response$
            .then(function fetchSuccessHandler(res) {
            deferred$.resolve(res);
        })
            .catch(function fetchErrorHandler(err) {
            deferred$.reject(err);
        });
        return deferred$.promise;
    }
    return response$;
}

function isUWSResponse(res) {
    return !!res.onData;
}
function getRequestFromUWSRequest({ req, res, fetchAPI, signal }) {
    let body;
    const method = req.getMethod();
    if (method !== 'get' && method !== 'head') {
        body = new fetchAPI.ReadableStream({});
        const readable = body.readable;
        signal.addEventListener('abort', () => {
            readable.push(null);
        });
        res.onData(function (ab, isLast) {
            const chunk = Buffer.from(ab, 0, ab.byteLength);
            readable.push(Buffer.from(chunk));
            if (isLast) {
                readable.push(null);
            }
        });
    }
    const headers = new fetchAPI.Headers();
    req.forEach((key, value) => {
        headers.append(key, value);
    });
    let url = `http://localhost${req.getUrl()}`;
    const query = req.getQuery();
    if (query) {
        url += `?${query}`;
    }
    return new fetchAPI.Request(url, {
        method,
        headers,
        body: body,
        signal,
    });
}
async function forwardResponseBodyToUWSResponse(uwsResponse, fetchResponse, signal) {
    for await (const chunk of fetchResponse.body) {
        if (signal.aborted) {
            return;
        }
        uwsResponse.cork(() => {
            uwsResponse.write(chunk);
        });
    }
    uwsResponse.cork(() => {
        uwsResponse.end();
    });
}
function sendResponseToUwsOpts(uwsResponse, fetchResponse, signal) {
    if (!fetchResponse) {
        uwsResponse.writeStatus('404 Not Found');
        uwsResponse.end();
        return;
    }
    const bufferOfRes = fetchResponse._buffer;
    if (signal.aborted) {
        return;
    }
    uwsResponse.cork(() => {
        uwsResponse.writeStatus(`${fetchResponse.status} ${fetchResponse.statusText}`);
        for (const [key, value] of fetchResponse.headers) {
            // content-length causes an error with Node.js's fetch
            if (key !== 'content-length') {
                if (key === 'set-cookie') {
                    const setCookies = fetchResponse.headers.getSetCookie?.();
                    if (setCookies) {
                        for (const setCookie of setCookies) {
                            uwsResponse.writeHeader(key, setCookie);
                        }
                        continue;
                    }
                }
                uwsResponse.writeHeader(key, value);
            }
        }
        if (bufferOfRes) {
            uwsResponse.end(bufferOfRes);
        }
    });
    if (bufferOfRes) {
        return;
    }
    if (!fetchResponse.body) {
        uwsResponse.end();
        return;
    }
    return forwardResponseBodyToUWSResponse(uwsResponse, fetchResponse, signal);
}

/* eslint-disable @typescript-eslint/ban-types */
async function handleWaitUntils(waitUntilPromises) {
    await Promise.allSettled(waitUntilPromises);
}
// Required for envs like nextjs edge runtime
function isRequestAccessible(serverContext) {
    try {
        return !!serverContext?.request;
    }
    catch {
        return false;
    }
}
const EMPTY_OBJECT = {};
function createServerAdapter(serverAdapterBaseObject, options) {
    const fetchAPI = {
        ...DefaultFetchAPI,
        ...options?.fetchAPI,
    };
    const givenHandleRequest = typeof serverAdapterBaseObject === 'function'
        ? serverAdapterBaseObject
        : serverAdapterBaseObject.handle;
    const onRequestHooks = [];
    const onResponseHooks = [];
    const handleRequest = onRequestHooks.length > 0 || onResponseHooks.length > 0
        ? function handleRequest(request, serverContext) {
            let requestHandler = givenHandleRequest;
            let response;
            if (onRequestHooks.length === 0) {
                return handleEarlyResponse();
            }
            let url = new Proxy(EMPTY_OBJECT, {
                get(_target, prop, _receiver) {
                    url = new fetchAPI.URL(request.url, 'http://localhost');
                    return Reflect.get(url, prop, url);
                },
            });
            const onRequestHooksIteration$ = iterateAsyncVoid(onRequestHooks, (onRequestHook, stopEarly) => onRequestHook({
                request,
                serverContext,
                fetchAPI,
                url,
                requestHandler,
                setRequestHandler(newRequestHandler) {
                    requestHandler = newRequestHandler;
                },
                endResponse(newResponse) {
                    response = newResponse;
                    if (newResponse) {
                        stopEarly();
                    }
                },
            }));
            function handleResponse(response) {
                if (onRequestHooks.length === 0) {
                    return response;
                }
                const onResponseHookPayload = {
                    request,
                    response,
                    serverContext,
                };
                const onResponseHooksIteration$ = iterateAsyncVoid(onResponseHooks, onResponseHook => onResponseHook(onResponseHookPayload));
                if (isPromise(onResponseHooksIteration$)) {
                    return onResponseHooksIteration$.then(() => response);
                }
                return response;
            }
            function handleEarlyResponse() {
                if (!response) {
                    const response$ = requestHandler(request, serverContext);
                    if (isPromise(response$)) {
                        return response$.then(handleResponse);
                    }
                    return handleResponse(response$);
                }
                return handleResponse(response);
            }
            if (isPromise(onRequestHooksIteration$)) {
                return onRequestHooksIteration$.then(handleEarlyResponse);
            }
            return handleEarlyResponse();
        }
        : givenHandleRequest;
    // TODO: Remove this on the next major version
    function handleNodeRequest(nodeRequest, ...ctx) {
        const serverContext = ctx.length > 1 ? completeAssign(...ctx) : ctx[0] || {};
        const request = normalizeNodeRequest(nodeRequest, fetchAPI.Request);
        return handleRequest(request, serverContext);
    }
    function handleNodeRequestAndResponse(nodeRequest, nodeResponseOrContainer, ...ctx) {
        const nodeResponse = nodeResponseOrContainer.raw || nodeResponseOrContainer;
        nodeRequestResponseMap.set(nodeRequest, nodeResponse);
        return handleNodeRequest(nodeRequest, ...ctx);
    }
    function requestListener(nodeRequest, serverResponse, ...ctx) {
        const waitUntilPromises = [];
        const defaultServerContext = {
            req: nodeRequest,
            res: serverResponse,
            waitUntil(cb) {
                waitUntilPromises.push(cb.catch(err => console.error(err)));
            },
        };
        nodeRequestResponseMap.set(nodeRequest, serverResponse);
        let response$;
        try {
            response$ = handleNodeRequest(nodeRequest, defaultServerContext, ...ctx);
        }
        catch (err) {
            response$ = handleErrorFromRequestHandler(err, fetchAPI.Response);
        }
        if (isPromise(response$)) {
            return response$
                .catch((e) => handleErrorFromRequestHandler(e, fetchAPI.Response))
                .then(response => sendNodeResponse(response, serverResponse, nodeRequest))
                .catch(err => {
                console.error(`Unexpected error while handling request: ${err.message || err}`);
            });
        }
        try {
            return sendNodeResponse(response$, serverResponse, nodeRequest);
        }
        catch (err) {
            console.error(`Unexpected error while handling request: ${err.message || err}`);
        }
    }
    function handleUWS(res, req, ...ctx) {
        const waitUntilPromises = [];
        const defaultServerContext = {
            res,
            req,
            waitUntil(cb) {
                waitUntilPromises.push(cb.catch(err => console.error(err)));
            },
        };
        const filteredCtxParts = ctx.filter(partCtx => partCtx != null);
        const serverContext = filteredCtxParts.length > 0
            ? completeAssign(defaultServerContext, ...ctx)
            : defaultServerContext;
        const signal = new ServerAdapterRequestAbortSignal();
        const originalResEnd = res.end.bind(res);
        let resEnded = false;
        res.end = function (data) {
            resEnded = true;
            return originalResEnd(data);
        };
        const originalOnAborted = res.onAborted.bind(res);
        originalOnAborted(function () {
            signal.sendAbort();
        });
        res.onAborted = function (cb) {
            signal.addEventListener('abort', cb);
        };
        const request = getRequestFromUWSRequest({
            req,
            res,
            fetchAPI,
            signal,
        });
        let response$;
        try {
            response$ = handleRequest(request, serverContext);
        }
        catch (err) {
            response$ = handleErrorFromRequestHandler(err, fetchAPI.Response);
        }
        if (isPromise(response$)) {
            return response$
                .catch((e) => handleErrorFromRequestHandler(e, fetchAPI.Response))
                .then(response => {
                if (!signal.aborted && !resEnded) {
                    return sendResponseToUwsOpts(res, response, signal);
                }
            })
                .catch(err => {
                console.error(`Unexpected error while handling request: \n${err.stack || err.message || err}`);
            });
        }
        try {
            if (!signal.aborted && !resEnded) {
                return sendResponseToUwsOpts(res, response$, signal);
            }
        }
        catch (err) {
            console.error(`Unexpected error while handling request: \n${err.stack || err.message || err}`);
        }
    }
    function handleEvent(event, ...ctx) {
        if (!event.respondWith || !event.request) {
            throw new TypeError(`Expected FetchEvent, got ${event}`);
        }
        const filteredCtxParts = ctx.filter(partCtx => partCtx != null);
        const serverContext = filteredCtxParts.length > 0
            ? completeAssign({}, event, ...filteredCtxParts)
            : isolateObject(event);
        const response$ = handleRequest(event.request, serverContext);
        event.respondWith(response$);
    }
    function handleRequestWithWaitUntil(request, ...ctx) {
        const filteredCtxParts = ctx.filter(partCtx => partCtx != null);
        let waitUntilPromises;
        const serverContext = filteredCtxParts.length > 1
            ? completeAssign({}, ...filteredCtxParts)
            : isolateObject(filteredCtxParts[0], filteredCtxParts[0] == null || filteredCtxParts[0].waitUntil == null
                ? (waitUntilPromises = [])
                : undefined);
        const response$ = handleRequest(request, serverContext);
        if (waitUntilPromises?.length) {
            return handleWaitUntils(waitUntilPromises).then(() => response$);
        }
        return response$;
    }
    const fetchFn = (input, ...maybeCtx) => {
        if (typeof input === 'string' || 'href' in input) {
            const [initOrCtx, ...restOfCtx] = maybeCtx;
            if (isRequestInit(initOrCtx)) {
                const request = new fetchAPI.Request(input, initOrCtx);
                const res$ = handleRequestWithWaitUntil(request, ...restOfCtx);
                return handleAbortSignalAndPromiseResponse(res$, initOrCtx?.signal);
            }
            const request = new fetchAPI.Request(input);
            return handleRequestWithWaitUntil(request, ...maybeCtx);
        }
        const res$ = handleRequestWithWaitUntil(input, ...maybeCtx);
        return handleAbortSignalAndPromiseResponse(res$, input._signal);
    };
    const genericRequestHandler = (input, ...maybeCtx) => {
        // If it is a Node request
        const [initOrCtxOrRes, ...restOfCtx] = maybeCtx;
        if (isNodeRequest(input)) {
            if (!isServerResponse(initOrCtxOrRes)) {
                throw new TypeError(`Expected ServerResponse, got ${initOrCtxOrRes}`);
            }
            return requestListener(input, initOrCtxOrRes, ...restOfCtx);
        }
        if (isUWSResponse(input)) {
            return handleUWS(input, initOrCtxOrRes, ...restOfCtx);
        }
        if (isServerResponse(initOrCtxOrRes)) {
            throw new TypeError('Got Node response without Node request');
        }
        // Is input a container object over Request?
        if (isRequestAccessible(input)) {
            // Is it FetchEvent?
            if (isFetchEvent(input)) {
                return handleEvent(input, ...maybeCtx);
            }
            // In this input is also the context
            return handleRequestWithWaitUntil(input.request, input, ...maybeCtx);
        }
        // Or is it Request itself?
        // Then ctx is present and it is the context
        return fetchFn(input, ...maybeCtx);
    };
    const adapterObj = {
        handleRequest,
        fetch: fetchFn,
        handleNodeRequest,
        handleNodeRequestAndResponse,
        requestListener,
        handleEvent,
        handleUWS,
        handle: genericRequestHandler,
    };
    const serverAdapter = new Proxy(genericRequestHandler, {
        // It should have all the attributes of the handler function and the server instance
        has: (_, prop) => {
            return (prop in adapterObj ||
                prop in genericRequestHandler ||
                (serverAdapterBaseObject && prop in serverAdapterBaseObject));
        },
        get: (_, prop) => {
            const adapterProp = adapterObj[prop];
            if (adapterProp) {
                if (adapterProp.bind) {
                    return adapterProp.bind(adapterObj);
                }
                return adapterProp;
            }
            const handleProp = genericRequestHandler[prop];
            if (handleProp) {
                if (handleProp.bind) {
                    return handleProp.bind(genericRequestHandler);
                }
                return handleProp;
            }
            if (serverAdapterBaseObject) {
                const serverAdapterBaseObjectProp = serverAdapterBaseObject[prop];
                if (serverAdapterBaseObjectProp) {
                    if (serverAdapterBaseObjectProp.bind) {
                        return function (...args) {
                            const returnedVal = serverAdapterBaseObject[prop](...args);
                            if (returnedVal === serverAdapterBaseObject) {
                                return serverAdapter;
                            }
                            return returnedVal;
                        };
                    }
                    return serverAdapterBaseObjectProp;
                }
            }
        },
        apply(_, __, args) {
            return genericRequestHandler(...args);
        },
    });
    return serverAdapter;
}

var picocolors = {exports: {}};

let tty = require$$0$6;

let isColorSupported =
	!("NO_COLOR" in process.env || process.argv.includes("--no-color")) &&
	("FORCE_COLOR" in process.env ||
		process.argv.includes("--color") ||
		process.platform === "win32" ||
		(tty.isatty(1) && process.env.TERM !== "dumb") ||
		"CI" in process.env);

let formatter =
	(open, close, replace = open) =>
	input => {
		let string = "" + input;
		let index = string.indexOf(close, open.length);
		return ~index
			? open + replaceClose(string, close, replace, index) + close
			: open + string + close
	};

let replaceClose = (string, close, replace, index) => {
	let start = string.substring(0, index) + replace;
	let end = string.substring(index + close.length);
	let nextIndex = end.indexOf(close);
	return ~nextIndex ? start + replaceClose(end, close, replace, nextIndex) : start + end
};

let createColors = (enabled = isColorSupported) => ({
	isColorSupported: enabled,
	reset: enabled ? s => `\x1b[0m${s}\x1b[0m` : String,
	bold: enabled ? formatter("\x1b[1m", "\x1b[22m", "\x1b[22m\x1b[1m") : String,
	dim: enabled ? formatter("\x1b[2m", "\x1b[22m", "\x1b[22m\x1b[2m") : String,
	italic: enabled ? formatter("\x1b[3m", "\x1b[23m") : String,
	underline: enabled ? formatter("\x1b[4m", "\x1b[24m") : String,
	inverse: enabled ? formatter("\x1b[7m", "\x1b[27m") : String,
	hidden: enabled ? formatter("\x1b[8m", "\x1b[28m") : String,
	strikethrough: enabled ? formatter("\x1b[9m", "\x1b[29m") : String,
	black: enabled ? formatter("\x1b[30m", "\x1b[39m") : String,
	red: enabled ? formatter("\x1b[31m", "\x1b[39m") : String,
	green: enabled ? formatter("\x1b[32m", "\x1b[39m") : String,
	yellow: enabled ? formatter("\x1b[33m", "\x1b[39m") : String,
	blue: enabled ? formatter("\x1b[34m", "\x1b[39m") : String,
	magenta: enabled ? formatter("\x1b[35m", "\x1b[39m") : String,
	cyan: enabled ? formatter("\x1b[36m", "\x1b[39m") : String,
	white: enabled ? formatter("\x1b[37m", "\x1b[39m") : String,
	gray: enabled ? formatter("\x1b[90m", "\x1b[39m") : String,
	bgBlack: enabled ? formatter("\x1b[40m", "\x1b[49m") : String,
	bgRed: enabled ? formatter("\x1b[41m", "\x1b[49m") : String,
	bgGreen: enabled ? formatter("\x1b[42m", "\x1b[49m") : String,
	bgYellow: enabled ? formatter("\x1b[43m", "\x1b[49m") : String,
	bgBlue: enabled ? formatter("\x1b[44m", "\x1b[49m") : String,
	bgMagenta: enabled ? formatter("\x1b[45m", "\x1b[49m") : String,
	bgCyan: enabled ? formatter("\x1b[46m", "\x1b[49m") : String,
	bgWhite: enabled ? formatter("\x1b[47m", "\x1b[49m") : String,
});

picocolors.exports = createColors();
picocolors.exports.createColors = createColors;

var picocolorsExports = picocolors.exports;
const c = /*@__PURE__*/getDefaultExportFromCjs(picocolorsExports);

function errorPage(error) {
    return html$1 `
		<!--  -->

		<!doctype html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />

				<title>Error</title>
			</head>
			<body>
				<style>
					html {
						color-scheme: dark;
						font-size: 16px;
						line-height: 1.23rem;
						font-family: system-ui;
					}
					body {
						padding: 1rem;
					}

					pre {
						padding: 1rem;

						overflow-y: auto;
					}
					button {
						font-size: 2rem;
					}

					h1 {
						color: tomato;
					}
				</style>

				<main>
					<h1>😵 An error has occurred!</h1>
					<button id="reload">Reload</button>
					<!--  -->
					<hr />

					<pre>${error.stack}</pre>
					<!-- <pre>$ {e.name}</pre> -->
					<!-- <pre>$ {e.message}</pre> -->
					<!-- <pre>$ {e.cause}</pre> -->
					<hr />
				</main>

				<script>
					reload.addEventListener('click', () => document.location.reload());
				</script>
			</body>
		</html>
	`;
}

/**
 * Useful for tricking various languages IDE extensions.
 *
 * For syntax highlighting, formatting with Prettier, static analysis…
 *
 * This will just do string concatenation, plus auto-joining if a string array
 * is provided inside a template interpolation.
 */
function dummyLiteral(templateStrings, ...args) {
    return templateStrings
        .map((templateString, index) => templateString +
        // TODO: Fix types
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        (Array.isArray(args[index]) ? args[index].join('') : args[index] || ''))
        .join('');
}
/**
 * ```ts
 * const myHtml = html`
 * <span>Hello</span>
 * `;
 * ```
 *
 * VSCode extension: `bierner.lit-html`
 *
 * \> [!TIP]
 * \> You might want also to checkout [Lit server-side only `html` template rendering](https://github.com/lit/lit/tree/350147d608cc34fe926dd2bced0e25748c726c59/packages/labs/ssr#server-only-templates).
 */
const html = dummyLiteral;

function isLitTemplate(input) {
    return ((typeof input === 'object' &&
        input &&
        '_$litType$' in input &&
        // eslint-disable-next-line no-underscore-dangle
        input._$litType$ === 1 &&
        'strings' in input &&
        Array.isArray(input.strings)) ||
        false);
}
function isLitServerTemplate(input) {
    return (isLitTemplate(input) &&
        '_$litServerRenderMode' in input &&
        // eslint-disable-next-line no-underscore-dangle
        input._$litServerRenderMode === 1);
}

async function* concatStreams(...readables) {
    // eslint-disable-next-line no-restricted-syntax
    for (const readable of readables) {
        // eslint-disable-next-line no-restricted-syntax, no-await-in-loop
        for await (const chunk of readable) {
            yield chunk;
        }
    }
}
// export const SSR_OUTLET_MARKER = '________SSR_OUTLET________';
const SSR_OUTLET_MARKER = '<route-template-outlet></route-template-outlet>';
// const SSR_OUTLET = unsafeHTML(SSR_OUTLET_MARKER);
const PAGE_ASSETS_MARKER = '<!--__GRACILE_PAGE_ASSETS__-->';
// FIXME: cannot be used with `unsafeHTML`, so must be duplicated…
const pageAssets = html$1 `<!--__GRACILE_PAGE_ASSETS__-->`;
const REGEX_TAG_SCRIPT = /\s?<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script\s*>\s?/gi;
const REGEX_TAG_LINK = /\s?<link\b[^>]*?>\s?/gi;
async function renderRouteTemplate({ request, vite, mode, routeInfos, handlerInfos, routeAssets, 
// root,
serverMode, }) {
    // MARK: Context
    const context = {
        url: new URL(request.url),
        params: routeInfos.params,
        props: handlerInfos?.data
            ? {
                [handlerInfos.method]: handlerInfos.data,
            }
            : routeInfos.props,
    };
    // MARK: Fragment
    if (!routeInfos.routeModule.document) {
        const fragmentOutput = await Promise.resolve(routeInfos.routeModule.template?.(context));
        if (isLitTemplate(fragmentOutput) === false)
            throw Error(`Wrong template result for fragment template ${routeInfos.foundRoute.filePath}.`);
        const fragmentRender = render(fragmentOutput);
        const output = Readable.from(fragmentRender);
        return { output };
    }
    // MARK: Document
    if (!routeInfos.routeModule.document ||
        typeof routeInfos.routeModule.document !== 'function')
        throw new Error(`Route document must be a function ${routeInfos.foundRoute.filePath}.`);
    const baseDocTemplateResult = await Promise.resolve(routeInfos.routeModule.document?.(context));
    if (isLitServerTemplate(baseDocTemplateResult) === false)
        throw new Error(`Incorrect document template result for ${routeInfos.foundRoute.filePath}.`);
    const baseDocRendered = await collectResult(render(baseDocTemplateResult));
    // MARK: Sibling assets
    let baseDocRenderedWithAssets = baseDocRendered.replace(PAGE_ASSETS_MARKER, html `
			<!-- PAGE ASSETS -->
			${routeInfos.foundRoute.pageAssets.map((path) => {
        //
        if (/\.(js|ts)$/.test(path)) {
            return html `
						<script type="module" src="/${path}"></script>
						<!--  -->
					`;
        }
        if (/\.(scss|css)$/.test(path)) {
            return html `
						<link rel="stylesheet" href="/${path}" />
						<!--  -->
					`;
        }
        throw new Error('Unknown asset.');
    })}
			<!-- /PAGE ASSETS -->
		`);
    const routeAssetsString = routeAssets?.get?.(routeInfos.foundRoute.pattern.pathname);
    if (routeAssetsString)
        baseDocRenderedWithAssets = baseDocRenderedWithAssets
            .replace(REGEX_TAG_SCRIPT, (s) => {
            if (s.includes(`type="module"`))
                return '';
            return s;
        })
            .replace(REGEX_TAG_LINK, (s) => {
            if (s.includes(`rel="stylesheet"`))
                return '';
            return s;
        })
            .replace('</head>', `${routeAssetsString}\n</head>`);
    // MARK: Base document
    const baseDocHtml = vite && mode === 'dev'
        ? await vite.transformIndexHtml(routeInfos.pathname, baseDocRenderedWithAssets)
        : baseDocRenderedWithAssets;
    const index = baseDocHtml.indexOf(SSR_OUTLET_MARKER);
    const baseDocRenderStreamPre = Readable.from(baseDocHtml.substring(0, index));
    const baseDocRenderStreamPost = Readable.from(baseDocHtml.substring(index + SSR_OUTLET_MARKER.length + 1));
    // MARK: Page
    // Skipped with server mode in production build
    if (routeInfos.routeModule.template && serverMode
        ? serverMode && mode !== 'build'
        : true) {
        const routeOutput = await Promise.resolve(routeInfos.routeModule.template?.(context));
        if (isLitTemplate(routeOutput) === false)
            throw Error(`Wrong template result for page template ${routeInfos.foundRoute.filePath}.`);
        const renderStream = Readable.from(render(routeOutput));
        const output = Readable.from(concatStreams(baseDocRenderStreamPre, renderStream, baseDocRenderStreamPost));
        return { output };
    }
    // MARK: Just the document
    const output = Readable.from(baseDocHtml);
    return { output };
}

async function renderSsrTemplate(template) {
    return collectResult(render(template));
}

// TODO: put in engine
class RouteModule {
    #staticPaths;
    get staticPaths() {
        return this.#staticPaths;
    }
    #handler;
    get handler() {
        return this.#handler;
    }
    #document;
    get document() {
        return this.#document;
    }
    #prerender;
    get prerender() {
        return this.#prerender;
    }
    #template;
    get template() {
        return this.#template;
    }
    constructor(options) {
        if (typeof options.staticPaths === 'function')
            this.#staticPaths = options.staticPaths;
        if ((typeof options.handler === 'object' ||
            typeof options.handler === 'function') &&
            options.handler)
            this.#handler = options.handler;
        if (typeof options.template === 'function')
            this.#template = options.template;
        if (typeof options.document === 'function')
            this.#document = options.document;
        if (typeof options.prerender === 'boolean')
            this.#prerender = options.prerender;
    }
}

async function loadForeignRouteObject({ vite, route, routeImports, }) {
    // NOTE: Check and assert unknown userland module to correct RouteModule instance (in the engine's realm)
    let unknownRouteModule = null;
    if (vite)
        unknownRouteModule = await vite.ssrLoadModule(route.filePath);
    else if (routeImports) {
        const ri = routeImports.get(route.pattern.pathname);
        if (ri)
            unknownRouteModule = await Promise.resolve(ri());
    }
    if (unknownRouteModule === null)
        throw new Error('Cannot find route module.');
    const routeModuleFactory = unknownRouteModule['default'];
    const errorBase = `Incorrect route module ${route.filePath}!`;
    if (typeof routeModuleFactory !== 'function')
        throw new Error(`${errorBase} Not a function.`);
    const routeModule = routeModuleFactory(RouteModule);
    if (routeModule instanceof RouteModule === false)
        throw new Error(`${errorBase} Not a RouteModule.`);
    return routeModule;
}

const routes = new Map();

// FIXME: proper DI for routes
function matchRouteFromUrl(url, routess = routes) {
    let match;
    let foundRoute;
    const pathname = new URL(url).pathname;
    // eslint-disable-next-line no-restricted-syntax
    for (const [, route] of routess) {
        if (match)
            break;
        const matchResult = route.pattern.exec(`http://gracile${pathname}`) || undefined;
        if (matchResult) {
            match = matchResult;
            foundRoute = route;
        }
    }
    if (!match || !foundRoute)
        throw new Error(`No route matching for ${url}`, { cause: 404 });
    const params = match.pathname?.groups;
    return { match, foundRoute, params, pathname };
}
function extractStaticPaths(options) {
    if (!options.foundRoute.hasParams)
        return null;
    if (!options.routeModule.staticPaths)
        return null;
    const routeStaticPaths = options.routeModule.staticPaths;
    let props;
    const staticPaths = routeStaticPaths();
    let hasCorrectParams = false;
    staticPaths.forEach((providedRouteOptions) => {
        const routeOptions = providedRouteOptions;
        const matchingKeys = Object.entries(routeOptions.params).filter(([key, val]) => options.params[key] === val);
        if (matchingKeys.length === Object.keys(options.params).length) {
            hasCorrectParams = true;
            if (routeOptions.props)
                props = routeOptions.props;
        }
    });
    if (hasCorrectParams === false)
        throw new Error(`Incorrect route parameters for \`${options.pathname}\`.\n` +
            `Check \`staticPaths\` for \`${options.foundRoute.filePath}\`.`);
    return { staticPaths, props };
}
async function getRoute(options) {
    const { foundRoute, pathname, params } = matchRouteFromUrl(options.url, options.routes);
    // TODO: Simplify all the routes things
    const routeModule = await loadForeignRouteObject({
        vite: options.vite,
        route: foundRoute,
        routeImports: options.routeImports,
    });
    const staticPaths = extractStaticPaths({
        routeModule,
        foundRoute,
        pathname,
        params,
    });
    return {
        params,
        props: staticPaths?.props,
        routeModule,
        foundRoute,
        pathname,
    };
}

// NOTE: Find a more canonical way to ponyfill the Node HTTP request to standard Request
// @ts-expect-error Abusing this feature!
const adapter = createServerAdapter((request) => request);
function createRequestHandler({ vite, routes, routeImports, routeAssets, root, serverMode, }) {
    return async (req, res, next) => {
        const url = req.originalUrl;
        logger.info(`[${c.yellow(req.method)}] ${c.yellow(url)}`, {
            timestamp: true,
        });
        // MARK: Skip unwanted requests
        if (
        //
        url.endsWith('favicon.ico') ||
            url.endsWith('favicon.svg'))
            return next();
        const requestPonyfilled = (await Promise.resolve(adapter.handleNodeRequest(req)));
        async function renderPageFn(handlerInfos, routeInfos) {
            const { output } = await renderRouteTemplate({
                request: requestPonyfilled,
                vite,
                mode: 'dev',
                routeInfos,
                handlerInfos,
                routeAssets,
                root,
                serverMode,
            });
            return output;
        }
        try {
            // MARK: Get route infos
            const moduleInfos = await getRoute({
                url: requestPonyfilled.url,
                vite,
                routes,
                routeImports,
            });
            let output;
            // TODO: should move this to `special-file` so we don't recalculate on each request
            // + we would be able to do some route codegen.
            const response = {};
            // MARK: Server handler
            const handler = moduleInfos.routeModule.handler;
            if ('handler' in moduleInfos.routeModule &&
                typeof handler !== 'undefined') {
                const options = {
                    request: requestPonyfilled,
                    url: new URL(requestPonyfilled.url),
                    response,
                    params: moduleInfos.params,
                };
                // MARK: Top level handler
                if (typeof handler === 'function') {
                    const handlerOutput = (await Promise.resolve(handler(options)));
                    if (handlerOutput instanceof Response)
                        output = handlerOutput;
                    else
                        throw new Error('Catch-all handler must return a Response object.');
                    // MARK: Handler with method
                }
                else if (requestPonyfilled.method in handler) {
                    const handlerWithMethod = handler[requestPonyfilled.method];
                    if (typeof handlerWithMethod !== 'function')
                        throw Error('Handler must be a function.');
                    const handlerOutput = await Promise.resolve(handlerWithMethod(options));
                    if (handlerOutput instanceof Response)
                        output = handlerOutput;
                    else {
                        output = await renderPageFn({
                            data: handlerOutput,
                            method: requestPonyfilled.method,
                        }, moduleInfos);
                    }
                    // MARK: No GET, render page
                }
                else if (handler &&
                    'GET' in handler === false &&
                    requestPonyfilled.method === 'GET') {
                    output = await renderPageFn({ data: null, method: 'GET' }, moduleInfos);
                }
                // MARK: No handler, render page
            }
            else {
                output = await renderPageFn({ data: null, method: 'GET' }, moduleInfos);
            }
            // MARK: Return response
            // NOTE: try directly with the requestPonyfill. This might not be necessary
            if (output instanceof Response) {
                if (output.status >= 300 && output.status <= 303) {
                    const location = output.headers.get('location');
                    if (location)
                        return res.redirect(location);
                }
                output.headers?.forEach((content, header) => res.set(header, content));
                if (output.status)
                    res.statusCode = output.status;
                if (output.statusText)
                    res.statusMessage = output.statusText;
                // TODO: use this with page only?
                // if (output.bodyUsed === false)
                //   throw new Error('Missing body.');
                if (output.body)
                    output.body
                        .pipeTo(Writable.toWeb(res))
                        .catch((e) => logger.error(String(e)));
                else
                    throw new Error('Missing body.');
                // MARK: Stream page render
            }
            else {
                new Headers(response.headers)?.forEach((content, header) => res.set(header, content));
                if (response.status)
                    res.statusCode = response.status;
                if (response.statusText)
                    res.statusMessage = response.statusText;
                res.set({ 'Content-Type': 'text/html' });
                // MARK: Page stream error
                output
                    ?.on('error', (error) => {
                    const errorMessage = `There was an error while rendering a template chunk on server-side.\n` +
                        `It was omitted from the resulting HTML.`;
                    logger.error(errorMessage);
                    logger.error(error.message);
                    res.statusCode = 500;
                    res.statusMessage = errorMessage;
                    /* NOTE: Safety closing tags, maybe add more */
                    // Maybe just returning nothing is better to not break the page?
                    // Should send a overlay message anyway via WebSocket
                    // vite.ws.send()
                    if (vite)
                        setTimeout(() => {
                            vite.hot.send('gracile:ssr-error', {
                                message: errorMessage,
                            });
                        }, 500);
                    res.end('' /* errorInline(error) */);
                })
                    .pipe(res);
            }
            // MARK: Errors
        }
        catch (e) {
            const error = e;
            if (vite)
                vite.ssrFixStacktrace(error);
            else
                logger.error(error.message);
            if (error.cause === 404) {
                // TODO: Handle 404 with dedicated page
                if (!vite)
                    return next(e);
                return res.status(404).end('404');
                // TODO: use a nice framework service page
                // .redirect(new URL('/__404/', requestPonyfilled.url).href)
            }
            let errorTemplate = await renderSsrTemplate(errorPage(error));
            if (vite)
                errorTemplate = await vite.transformIndexHtml(url, errorTemplate);
            res.status(500).end(errorTemplate);
        }
        return next();
    };
}

routes$1.forEach((route, pattern) => {
    routes$1.set(pattern, {
        ...route,
        pattern: new URLPattern(pattern, 'http://gracile'),
    });
});
const withExpress = async ({ root = process.cwd(), 
// hmrPort,
app: expressApp,
// NOTE: We need type parity with the dev. version of this function
// eslint-disable-next-line @typescript-eslint/require-await
 }) => {
    if (!expressApp)
        throw new Error();
    setCurrentWorkingDirectory(root);
    const handler = createRequestHandler({
        root,
        routes: routes$1,
        routeImports,
        routeAssets,
        serverMode: true,
    });
    expressApp.use('*', handler);
    return { app: expressApp, vite: null };
};

const IP_LOCALHOST = "127.0.0.1";
const PUBLIC_DIR = "./dist/client";

var define_import_meta_env_default = { BASE_URL: "/", MODE: "production", DEV: false, PROD: true, SSR: true };
const importMetaEnv = define_import_meta_env_default;
function safeEnvLoader(vars) {
  const fullEnv = {};
  if (typeof process.env === "object" && process.env)
    Object.assign(fullEnv, process.env);
  if (typeof importMetaEnv === "object" && importMetaEnv)
    Object.assign(fullEnv, importMetaEnv);
  const resultingEnv = Object.fromEntries(Object.entries(vars).map(([variable, value]) => {
    let coercedValue = null;
    if (variable in fullEnv)
      switch (value.type) {
        case Boolean: {
          const v = String(fullEnv[variable]);
          if (v === "true")
            coercedValue = true;
          else if (v === "false")
            coercedValue = false;
          else
            throw new Error("Should be a boolean.");
          break;
        }
        case Number:
          if (Number.isNaN(fullEnv[variable]) === false)
            coercedValue = Number(fullEnv[variable]);
          else
            throw new Error("Should be a number.");
          break;
        case String:
          {
            const v = String(fullEnv[variable]);
            if (v.length > 0)
              coercedValue = v;
            else
              throw new Error("String should not be empty.");
          }
          break;
      }
    if (Boolean(value.optional) === false && coercedValue === null && Boolean(value.fallback) === false)
      throw new Error(`Environment variable \`${variable}\` must be defined!`);
    if (coercedValue === null && value.fallback)
      coercedValue = value.fallback;
    return [variable, coercedValue];
  }));
  return Object.freeze(resultingEnv);
}

const authentication = (req, res, next) => {
  const b64 = req.headers.authorization?.split(" ")?.[1];
  if (b64) {
    const [user, pass] = Buffer.from(b64, "base64").toString().split(":");
    if (user === "admin" && pass === "password")
      return next();
  }
  res.setHeader("WWW-Authenticate", "Basic");
  res.statusCode = 401;
  res.statusMessage = "You are not authenticated!";
  return res.end(res.statusMessage);
};

const ROOT = "__fixtures__/server-express/";
const env = safeEnvLoader({
  GRACILE_SITE_URL: { type: String, optional: true }
});
console.log(env.GRACILE_SITE_URL);
const app = express();
app.get("*", (req, res, next) => {
  console.log("request: " + req.url);
  return next();
});
app.use(
  "/api",
  (_req, res, _next) => res.json({
    hello: "world"
  })
);
app.use("/private/", authentication);
app.get("/__close", (req, res) => {
  console.log("closing…");
  setTimeout(() => server.close(() => process.exit()));
  return res.end("Closing…");
});
app.use(express.static(ROOT + PUBLIC_DIR));
await withExpress({
  app,
  root: join(process.cwd(), ROOT)
});
const server = app.listen(3033, IP_LOCALHOST, () => {
  console.log(server.address());
});

export { pageAssets as p };
//# sourceMappingURL=server.js.map
