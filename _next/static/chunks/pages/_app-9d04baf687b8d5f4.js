(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[888],{6840:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return r(5545)}])},837:function(e,t,r){"use strict";r.d(t,{H:function(){return n},a:function(){return l}});var a=r(5893),o=r(7294),s=r(1163);let i=(0,o.createContext)(void 0);function n(e){let{children:t}=e,[r,n]=(0,o.useState)(null),[l,c]=(0,o.useState)(!0),d=(0,s.useRouter)();return(0,o.useEffect)(()=>{let e=localStorage.getItem("auth_token"),t=localStorage.getItem("user");if(e&&t)try{let e=JSON.parse(t);n(e)}catch(e){console.error("Error parsing user data:",e),localStorage.removeItem("auth_token"),localStorage.removeItem("user")}c(!1)},[]),(0,a.jsx)(i.Provider,{value:{user:r,loading:l,login:(e,t)=>{localStorage.setItem("auth_token",e),localStorage.setItem("user",JSON.stringify(t)),n(t)},logout:()=>{localStorage.removeItem("auth_token"),localStorage.removeItem("user"),n(null),d.push("/login")},isAuthenticated:!!r},children:t})}function l(){let e=(0,o.useContext)(i);if(void 0===e)throw Error("useAuth must be used within an AuthProvider");return e}},5545:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return c}});var a=r(5893),o=r(1571),s=r(6501),i=r(837),n=r(7294),l=r(1163);function c(e){let{Component:t,pageProps:r}=e;return(0,l.useRouter)(),(0,n.useEffect)(()=>{{let t=window.location;if("/"===t.search[1]){var e=t.search.slice(1).split("&").map(function(e){return e.replace(/~and~/g,"&")}).join("?");window.history.replaceState(null,"",t.pathname.slice(0,-1)+e+t.hash)}}},[]),(0,a.jsx)(o.f,{attribute:"class",defaultTheme:"dark",enableSystem:!0,children:(0,a.jsxs)(i.H,{children:[(0,a.jsx)(t,{...r}),(0,a.jsx)(s.x7,{position:"top-right",toastOptions:{duration:4e3,style:{background:"hsl(var(--background))",color:"hsl(var(--foreground))",border:"1px solid hsl(var(--border))"}}})]})})}r(876)},876:function(){},1163:function(e,t,r){e.exports=r(3079)},1571:function(e,t,r){"use strict";r.d(t,{F:function(){return d},f:function(){return u}});var a=r(7294),o=(e,t,r,a,o,s,i,n)=>{let l=document.documentElement,c=["light","dark"];function d(t){(Array.isArray(e)?e:[e]).forEach(e=>{let r="class"===e,a=r&&s?o.map(e=>s[e]||e):o;r?(l.classList.remove(...a),l.classList.add(s&&s[t]?s[t]:t)):l.setAttribute(e,t)}),n&&c.includes(t)&&(l.style.colorScheme=t)}if(a)d(a);else try{let e=localStorage.getItem(t)||r,a=i&&"system"===e?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":e;d(a)}catch(e){}},s=["light","dark"],i="(prefers-color-scheme: dark)",n="undefined"==typeof window,l=a.createContext(void 0),c={setTheme:e=>{},themes:[]},d=()=>{var e;return null!=(e=a.useContext(l))?e:c},u=e=>a.useContext(l)?a.createElement(a.Fragment,null,e.children):a.createElement(p,{...e}),m=["light","dark"],p=({forcedTheme:e,disableTransitionOnChange:t=!1,enableSystem:r=!0,enableColorScheme:o=!0,storageKey:n="theme",themes:c=m,defaultTheme:d=r?"system":"light",attribute:u="data-theme",value:p,children:b,nonce:v,scriptProps:x})=>{let[w,E]=a.useState(()=>h(n,d)),[k,S]=a.useState(()=>"system"===w?y():w),C=p?Object.values(p):c,T=a.useCallback(e=>{let a=e;if(!a)return;"system"===e&&r&&(a=y());let i=p?p[a]:a,n=t?g(v):null,l=document.documentElement,c=e=>{"class"===e?(l.classList.remove(...C),i&&l.classList.add(i)):e.startsWith("data-")&&(i?l.setAttribute(e,i):l.removeAttribute(e))};if(Array.isArray(u)?u.forEach(c):c(u),o){let e=s.includes(d)?d:null,t=s.includes(a)?a:e;l.style.colorScheme=t}null==n||n()},[v]),A=a.useCallback(e=>{let t="function"==typeof e?e(w):e;E(t);try{localStorage.setItem(n,t)}catch(e){}},[w]),I=a.useCallback(t=>{S(y(t)),"system"===w&&r&&!e&&T("system")},[w,e]);a.useEffect(()=>{let e=window.matchMedia(i);return e.addListener(I),I(e),()=>e.removeListener(I)},[I]),a.useEffect(()=>{let e=e=>{e.key===n&&(e.newValue?E(e.newValue):A(d))};return window.addEventListener("storage",e),()=>window.removeEventListener("storage",e)},[A]),a.useEffect(()=>{T(null!=e?e:w)},[e,w]);let O=a.useMemo(()=>({theme:w,setTheme:A,forcedTheme:e,resolvedTheme:"system"===w?k:w,themes:r?[...c,"system"]:c,systemTheme:r?k:void 0}),[w,A,e,k,r,c]);return a.createElement(l.Provider,{value:O},a.createElement(f,{forcedTheme:e,storageKey:n,attribute:u,enableSystem:r,enableColorScheme:o,defaultTheme:d,value:p,themes:c,nonce:v,scriptProps:x}),b)},f=a.memo(({forcedTheme:e,storageKey:t,attribute:r,enableSystem:s,enableColorScheme:i,defaultTheme:n,value:l,themes:c,nonce:d,scriptProps:u})=>{let m=JSON.stringify([r,t,n,e,c,l,s,i]).slice(1,-1);return a.createElement("script",{...u,suppressHydrationWarning:!0,nonce:"undefined"==typeof window?d:"",dangerouslySetInnerHTML:{__html:`(${o.toString()})(${m})`}})}),h=(e,t)=>{let r;if(!n){try{r=localStorage.getItem(e)||void 0}catch(e){}return r||t}},g=e=>{let t=document.createElement("style");return e&&t.setAttribute("nonce",e),t.appendChild(document.createTextNode("*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")),document.head.appendChild(t),()=>{window.getComputedStyle(document.body),setTimeout(()=>{document.head.removeChild(t)},1)}},y=e=>(e||(e=window.matchMedia(i)),e.matches?"dark":"light")},6501:function(e,t,r){"use strict";let a,o;r.d(t,{x7:function(){return em},Am:function(){return F}});var s,i=r(7294);let n={data:""},l=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||n,c=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,d=/\/\*[^]*?\*\/|  +/g,u=/\n+/g,m=(e,t)=>{let r="",a="",o="";for(let s in e){let i=e[s];"@"==s[0]?"i"==s[1]?r=s+" "+i+";":a+="f"==s[1]?m(i,s):s+"{"+m(i,"k"==s[1]?"":t)+"}":"object"==typeof i?a+=m(i,t?t.replace(/([^,])+/g,e=>s.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):s):null!=i&&(s=/^--/.test(s)?s:s.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=m.p?m.p(s,i):s+":"+i+";")}return r+(t&&o?t+"{"+o+"}":o)+a},p={},f=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+f(e[r]);return t}return e},h=(e,t,r,a,o)=>{var s;let i=f(e),n=p[i]||(p[i]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(i));if(!p[n]){let t=i!==e?e:(e=>{let t,r,a=[{}];for(;t=c.exec(e.replace(d,""));)t[4]?a.shift():t[3]?(r=t[3].replace(u," ").trim(),a.unshift(a[0][r]=a[0][r]||{})):a[0][t[1]]=t[2].replace(u," ").trim();return a[0]})(e);p[n]=m(o?{["@keyframes "+n]:t}:t,r?"":"."+n)}let l=r&&p.g?p.g:null;return r&&(p.g=p[n]),s=p[n],l?t.data=t.data.replace(l,s):-1===t.data.indexOf(s)&&(t.data=a?s+t.data:t.data+s),n},g=(e,t,r)=>e.reduce((e,a,o)=>{let s=t[o];if(s&&s.call){let e=s(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;s=t?"."+t:e&&"object"==typeof e?e.props?"":m(e,""):!1===e?"":e}return e+a+(null==s?"":s)},"");function y(e){let t=this||{},r=e.call?e(t.p):e;return h(r.unshift?r.raw?g(r,[].slice.call(arguments,1),t.p):r.reduce((e,r)=>Object.assign(e,r&&r.call?r(t.p):r),{}):r,l(t.target),t.g,t.o,t.k)}y.bind({g:1});let b,v,x,w=y.bind({k:1});function E(e,t){let r=this||{};return function(){let a=arguments;function o(s,i){let n=Object.assign({},s),l=n.className||o.className;r.p=Object.assign({theme:v&&v()},n),r.o=/ *go\d+/.test(l),n.className=y.apply(r,a)+(l?" "+l:""),t&&(n.ref=i);let c=e;return e[0]&&(c=n.as||e,delete n.as),x&&c[0]&&x(n),b(c,n)}return t?t(o):o}}var k=e=>"function"==typeof e,S=(e,t)=>k(e)?e(t):e,C=(a=0,()=>(++a).toString()),T=()=>{if(void 0===o&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");o=!e||e.matches}return o},A="default",I=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:a}=t;return I(e,{type:e.toasts.find(e=>e.id===a.id)?1:0,toast:a});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(e=>e.id===o||void 0===o?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let s=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+s}))}}},O=[],_={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},j={},$=(e,t=A)=>{j[t]=I(j[t]||_,e),O.forEach(([e,r])=>{e===t&&r(j[t])})},N=e=>Object.keys(j).forEach(t=>$(e,t)),P=e=>Object.keys(j).find(t=>j[t].toasts.some(t=>t.id===e)),L=(e=A)=>t=>{$(t,e)},D={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},z=(e={},t=A)=>{let[r,a]=(0,i.useState)(j[t]||_),o=(0,i.useRef)(j[t]);(0,i.useEffect)(()=>(o.current!==j[t]&&a(j[t]),O.push([t,a]),()=>{let e=O.findIndex(([e])=>e===t);e>-1&&O.splice(e,1)}),[t]);let s=r.toasts.map(t=>{var r,a,o;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(a=e[t.type])?void 0:a.duration)||(null==e?void 0:e.duration)||D[t.type],style:{...e.style,...null==(o=e[t.type])?void 0:o.style,...t.style}}});return{...r,toasts:s}},M=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||C()}),H=e=>(t,r)=>{let a=M(t,e,r);return L(a.toasterId||P(a.id))({type:2,toast:a}),a.id},F=(e,t)=>H("blank")(e,t);F.error=H("error"),F.success=H("success"),F.loading=H("loading"),F.custom=H("custom"),F.dismiss=(e,t)=>{let r={type:3,toastId:e};t?L(t)(r):N(r)},F.dismissAll=e=>F.dismiss(void 0,e),F.remove=(e,t)=>{let r={type:4,toastId:e};t?L(t)(r):N(r)},F.removeAll=e=>F.remove(void 0,e),F.promise=(e,t,r)=>{let a=F.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let o=t.success?S(t.success,e):void 0;return o?F.success(o,{id:a,...r,...null==r?void 0:r.success}):F.dismiss(a),e}).catch(e=>{let o=t.error?S(t.error,e):void 0;o?F.error(o,{id:a,...r,...null==r?void 0:r.error}):F.dismiss(a)}),e};var R=1e3,J=(e,t="default")=>{let{toasts:r,pausedAt:a}=z(e,t),o=(0,i.useRef)(new Map).current,s=(0,i.useCallback)((e,t=R)=>{if(o.has(e))return;let r=setTimeout(()=>{o.delete(e),n({type:4,toastId:e})},t);o.set(e,r)},[]);(0,i.useEffect)(()=>{if(a)return;let e=Date.now(),o=r.map(r=>{if(r.duration===1/0)return;let a=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(a<0){r.visible&&F.dismiss(r.id);return}return setTimeout(()=>F.dismiss(r.id,t),a)});return()=>{o.forEach(e=>e&&clearTimeout(e))}},[r,a,t]);let n=(0,i.useCallback)(L(t),[t]),l=(0,i.useCallback)(()=>{n({type:5,time:Date.now()})},[n]),c=(0,i.useCallback)((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),d=(0,i.useCallback)(()=>{a&&n({type:6,time:Date.now()})},[a,n]),u=(0,i.useCallback)((e,t)=>{let{reverseOrder:a=!1,gutter:o=8,defaultPosition:s}=t||{},i=r.filter(t=>(t.position||s)===(e.position||s)&&t.height),n=i.findIndex(t=>t.id===e.id),l=i.filter((e,t)=>t<n&&e.visible).length;return i.filter(e=>e.visible).slice(...a?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+o,0)},[r]);return(0,i.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)s(e.id,e.removeDelay);else{let t=o.get(e.id);t&&(clearTimeout(t),o.delete(e.id))}})},[r,s]),{toasts:r,handlers:{updateHeight:c,startPause:l,endPause:d,calculateOffset:u}}},K=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,U=w`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,V=w`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,W=E("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${K} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${U} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${V} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,X=w`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,q=E("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${X} 1s linear infinite;
`,B=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Y=w`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Z=E("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${B} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Y} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,G=E("div")`
  position: absolute;
`,Q=E("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,ee=w`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,et=E("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${ee} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,er=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return void 0!==t?"string"==typeof t?i.createElement(et,null,t):t:"blank"===r?null:i.createElement(Q,null,i.createElement(q,{...a}),"loading"!==r&&i.createElement(G,null,"error"===r?i.createElement(W,{...a}):i.createElement(Z,{...a})))},ea=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,eo=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,es=E("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,ei=E("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,en=(e,t)=>{let r=e.includes("top")?1:-1,[a,o]=T()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[ea(r),eo(r)];return{animation:t?`${w(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${w(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},el=i.memo(({toast:e,position:t,style:r,children:a})=>{let o=e.height?en(e.position||t||"top-center",e.visible):{opacity:0},s=i.createElement(er,{toast:e}),n=i.createElement(ei,{...e.ariaProps},S(e.message,e));return i.createElement(es,{className:e.className,style:{...o,...r,...e.style}},"function"==typeof a?a({icon:s,message:n}):i.createElement(i.Fragment,null,s,n))});s=i.createElement,m.p=void 0,b=s,v=void 0,x=void 0;var ec=({id:e,className:t,style:r,onHeightUpdate:a,children:o})=>{let s=i.useCallback(t=>{if(t){let r=()=>{a(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return i.createElement("div",{ref:s,className:t,style:r},o)},ed=(e,t)=>{let r=e.includes("top"),a=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:T()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...r?{top:0}:{bottom:0},...a}},eu=y`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,em=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:a,children:o,toasterId:s,containerStyle:n,containerClassName:l})=>{let{toasts:c,handlers:d}=J(r,s);return i.createElement("div",{"data-rht-toaster":s||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(r=>{let s=r.position||t,n=ed(s,d.calculateOffset(r,{reverseOrder:e,gutter:a,defaultPosition:t}));return i.createElement(ec,{id:r.id,key:r.id,onHeightUpdate:d.updateHeight,className:r.visible?eu:"",style:n},"custom"===r.type?S(r.message,r):o?o(r):i.createElement(el,{toast:r,position:s}))}))}}},function(e){var t=function(t){return e(e.s=t)};e.O(0,[774,179],function(){return t(6840),t(3079)}),_N_E=e.O()}]);