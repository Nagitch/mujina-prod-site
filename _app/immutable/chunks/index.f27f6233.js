function x(){}const X=t=>t;function mt(t,e){for(const n in e)t[n]=e[n];return t}function Y(t){return t()}function J(){return Object.create(null)}function T(t){t.forEach(Y)}function O(t){return typeof t=="function"}function Kt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let M;function Qt(t,e){return M||(M=document.createElement("a")),M.href=e,t===M.href}function pt(t){return Object.keys(t).length===0}function yt(t,...e){if(t==null)return x;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function Ut(t,e,n){t.$$.on_destroy.push(yt(e,n))}function Vt(t,e,n,i){if(t){const s=Z(t,e,n,i);return t[0](s)}}function Z(t,e,n,i){return t[1]&&i?mt(n.ctx.slice(),t[1](i(e))):n.ctx}function Xt(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const o=[],r=Math.max(e.dirty.length,s.length);for(let l=0;l<r;l+=1)o[l]=e.dirty[l]|s[l];return o}return e.dirty|s}return e.dirty}function Yt(t,e,n,i,s,o){if(s){const r=Z(e,n,i,o);t.p(r,s)}}function Zt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function te(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function ee(t){const e=typeof t=="string"&&t.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);return e?[parseFloat(e[1]),e[2]||"px"]:[t,"px"]}const tt=typeof window<"u";let et=tt?()=>window.performance.now():()=>Date.now(),z=tt?t=>requestAnimationFrame(t):x;const w=new Set;function nt(t){w.forEach(e=>{e.c(t)||(w.delete(e),e.f())}),w.size!==0&&z(nt)}function it(t){let e;return w.size===0&&z(nt),{promise:new Promise(n=>{w.add(e={c:t,f:n})}),abort(){w.delete(e)}}}const ne=typeof window<"u"?window:typeof globalThis<"u"?globalThis:global;let H=!1;function gt(){H=!0}function xt(){H=!1}function $t(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function bt(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let u=0;u<e.length;u++){const a=e[u];a.claim_order!==void 0&&c.push(a)}e=c}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let c=0;c<e.length;c++){const u=e[c].claim_order,a=(s>0&&e[n[s]].claim_order<=u?s+1:$t(1,s,_=>e[n[_]].claim_order,u))-1;i[c]=n[a]+1;const f=a+1;n[f]=c,s=Math.max(f,s)}const o=[],r=[];let l=e.length-1;for(let c=n[s]+1;c!=0;c=i[c-1]){for(o.push(e[c-1]);l>=c;l--)r.push(e[l]);l--}for(;l>=0;l--)r.push(e[l]);o.reverse(),r.sort((c,u)=>c.claim_order-u.claim_order);for(let c=0,u=0;c<r.length;c++){for(;u<o.length&&r[c].claim_order>=o[u].claim_order;)u++;const a=u<o.length?o[u]:null;t.insertBefore(r[c],a)}}function wt(t,e){t.appendChild(e)}function st(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function Et(t){const e=F("style");return Tt(st(t),e),e.sheet}function Tt(t,e){return wt(t.head||t,e),e.sheet}function vt(t,e){if(H){for(bt(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function Nt(t,e,n){t.insertBefore(e,n||null)}function At(t,e,n){H&&!n?vt(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function A(t){t.parentNode&&t.parentNode.removeChild(t)}function ie(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function F(t){return document.createElement(t)}function kt(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function G(t){return document.createTextNode(t)}function se(){return G(" ")}function re(){return G("")}function oe(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function rt(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}const jt=["width","height"];function Mt(t,e){const n=Object.getOwnPropertyDescriptors(t.__proto__);for(const i in e)e[i]==null?t.removeAttribute(i):i==="style"?t.style.cssText=e[i]:i==="__value"?t.value=t[i]=e[i]:n[i]&&n[i].set&&jt.indexOf(i)===-1?t[i]=e[i]:rt(t,i,e[i])}function St(t,e){Object.keys(e).forEach(n=>{Ct(t,n,e[n])})}function Ct(t,e,n){e in t?t[e]=typeof t[e]=="boolean"&&n===""?!0:n:rt(t,e,n)}function ce(t){return/-/.test(t)?St:Mt}function Dt(t){return Array.from(t.childNodes)}function ot(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function ct(t,e,n,i,s=!1){ot(t);const o=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const l=t[r];if(e(l)){const c=n(l);return c===void 0?t.splice(r,1):t[r]=c,s||(t.claim_info.last_index=r),l}}for(let r=t.claim_info.last_index-1;r>=0;r--){const l=t[r];if(e(l)){const c=n(l);return c===void 0?t.splice(r,1):t[r]=c,s?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,l}}return i()})();return o.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,o}function Lt(t,e,n,i){return ct(t,s=>s.nodeName===e,s=>{const o=[];for(let r=0;r<s.attributes.length;r++){const l=s.attributes[r];n[l.name]||o.push(l.name)}o.forEach(r=>s.removeAttribute(r))},()=>i(e))}function le(t,e,n){return Lt(t,e,n,F)}function Ot(t,e){return ct(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>G(e),!0)}function ue(t){return Ot(t," ")}function K(t,e,n){for(let i=n;i<t.length;i+=1){const s=t[i];if(s.nodeType===8&&s.textContent.trim()===e)return i}return t.length}function fe(t,e){const n=K(t,"HTML_TAG_START",0),i=K(t,"HTML_TAG_END",n);if(n===i)return new Q(void 0,e);ot(t);const s=t.splice(n,i-n+1);A(s[0]),A(s[s.length-1]);const o=s.slice(1,s.length-1);for(const r of o)r.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1;return new Q(o,e)}function ae(t,e){e=""+e,t.data!==e&&(t.data=e)}function _e(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function de(t,e,n){t.classList[n?"add":"remove"](e)}function Ht(t,e,{bubbles:n=!1,cancelable:i=!1}={}){const s=document.createEvent("CustomEvent");return s.initCustomEvent(t,n,i,e),s}function he(t,e){const n=[];let i=0;for(const s of e.childNodes)if(s.nodeType===8){const o=s.textContent.trim();o===`HEAD_${t}_END`?(i-=1,n.push(s)):o===`HEAD_${t}_START`&&(i+=1,n.push(s))}else i>0&&n.push(s);return n}class Pt{constructor(e=!1){this.is_svg=!1,this.is_svg=e,this.e=this.n=null}c(e){this.h(e)}m(e,n,i=null){this.e||(this.is_svg?this.e=kt(n.nodeName):this.e=F(n.nodeType===11?"TEMPLATE":n.nodeName),this.t=n.tagName!=="TEMPLATE"?n:n.content,this.c(e)),this.i(i)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.nodeName==="TEMPLATE"?this.e.content.childNodes:this.e.childNodes)}i(e){for(let n=0;n<this.n.length;n+=1)Nt(this.t,this.n[n],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(A)}}class Q extends Pt{constructor(e,n=!1){super(n),this.e=this.n=null,this.l=e}c(e){this.l?this.n=this.l:super.c(e)}i(e){for(let n=0;n<this.n.length;n+=1)At(this.t,this.n[n],e)}}function me(t,e){return new t(e)}const C=new Map;let D=0;function Rt(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function qt(t,e){const n={stylesheet:Et(e),rules:{}};return C.set(t,n),n}function lt(t,e,n,i,s,o,r,l=0){const c=16.666/i;let u=`{
`;for(let m=0;m<=1;m+=c){const p=e+(n-e)*o(m);u+=m*100+`%{${r(p,1-p)}}
`}const a=u+`100% {${r(n,1-n)}}
}`,f=`__svelte_${Rt(a)}_${l}`,_=st(t),{stylesheet:d,rules:h}=C.get(_)||qt(_,t);h[f]||(h[f]=!0,d.insertRule(`@keyframes ${f} ${a}`,d.cssRules.length));const y=t.style.animation||"";return t.style.animation=`${y?`${y}, `:""}${f} ${i}ms linear ${s}ms 1 both`,D+=1,f}function q(t,e){const n=(t.style.animation||"").split(", "),i=n.filter(e?o=>o.indexOf(e)<0:o=>o.indexOf("__svelte")===-1),s=n.length-i.length;s&&(t.style.animation=i.join(", "),D-=s,D||Bt())}function Bt(){z(()=>{D||(C.forEach(t=>{const{ownerNode:e}=t.stylesheet;e&&A(e)}),C.clear())})}let k;function N(t){k=t}function W(){if(!k)throw new Error("Function called outside component initialization");return k}function pe(t){W().$$.on_mount.push(t)}function ye(t){W().$$.after_update.push(t)}function ge(t){W().$$.on_destroy.push(t)}const b=[],U=[];let E=[];const V=[],ut=Promise.resolve();let B=!1;function ft(){B||(B=!0,ut.then(at))}function xe(){return ft(),ut}function j(t){E.push(t)}const R=new Set;let $=0;function at(){if($!==0)return;const t=k;do{try{for(;$<b.length;){const e=b[$];$++,N(e),zt(e.$$)}}catch(e){throw b.length=0,$=0,e}for(N(null),b.length=0,$=0;U.length;)U.pop()();for(let e=0;e<E.length;e+=1){const n=E[e];R.has(n)||(R.add(n),n())}E.length=0}while(b.length);for(;V.length;)V.pop()();B=!1,R.clear(),N(t)}function zt(t){if(t.fragment!==null){t.update(),T(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(j)}}function Ft(t){const e=[],n=[];E.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),E=e}let v;function _t(){return v||(v=Promise.resolve(),v.then(()=>{v=null})),v}function L(t,e,n){t.dispatchEvent(Ht(`${e?"intro":"outro"}${n}`))}const S=new Set;let g;function $e(){g={r:0,c:[],p:g}}function be(){g.r||T(g.c),g=g.p}function Gt(t,e){t&&t.i&&(S.delete(t),t.i(e))}function we(t,e,n,i){if(t&&t.o){if(S.has(t))return;S.add(t),g.c.push(()=>{S.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}const dt={duration:0};function Ee(t,e,n){const i={direction:"in"};let s=e(t,n,i),o=!1,r,l,c=0;function u(){r&&q(t,r)}function a(){const{delay:_=0,duration:d=300,easing:h=X,tick:y=x,css:m}=s||dt;m&&(r=lt(t,0,1,d,_,h,m,c++)),y(0,1);const p=et()+_,ht=p+d;l&&l.abort(),o=!0,j(()=>L(t,!0,"start")),l=it(P=>{if(o){if(P>=ht)return y(1,0),L(t,!0,"end"),u(),o=!1;if(P>=p){const I=h((P-p)/d);y(I,1-I)}}return o})}let f=!1;return{start(){f||(f=!0,q(t),O(s)?(s=s(i),_t().then(a)):a())},invalidate(){f=!1},end(){o&&(u(),o=!1)}}}function Te(t,e,n){const i={direction:"out"};let s=e(t,n,i),o=!0,r;const l=g;l.r+=1;function c(){const{delay:u=0,duration:a=300,easing:f=X,tick:_=x,css:d}=s||dt;d&&(r=lt(t,1,0,a,u,f,d));const h=et()+u,y=h+a;j(()=>L(t,!1,"start")),it(m=>{if(o){if(m>=y)return _(0,1),L(t,!1,"end"),--l.r||T(l.c),!1;if(m>=h){const p=f((m-h)/a);_(1-p,p)}}return o})}return O(s)?_t().then(()=>{s=s(i),c()}):c(),{end(u){u&&s.tick&&s.tick(1,0),o&&(r&&q(t,r),o=!1)}}}function ve(t,e){const n={},i={},s={$$scope:1};let o=t.length;for(;o--;){const r=t[o],l=e[o];if(l){for(const c in r)c in l||(i[c]=1);for(const c in l)s[c]||(n[c]=l[c],s[c]=1);t[o]=l}else for(const c in r)s[c]=1}for(const r in i)r in n||(n[r]=void 0);return n}function Ne(t){return typeof t=="object"&&t!==null?t:{}}function Ae(t){t&&t.c()}function ke(t,e){t&&t.l(e)}function Wt(t,e,n,i){const{fragment:s,after_update:o}=t.$$;s&&s.m(e,n),i||j(()=>{const r=t.$$.on_mount.map(Y).filter(O);t.$$.on_destroy?t.$$.on_destroy.push(...r):T(r),t.$$.on_mount=[]}),o.forEach(j)}function It(t,e){const n=t.$$;n.fragment!==null&&(Ft(n.after_update),T(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Jt(t,e){t.$$.dirty[0]===-1&&(b.push(t),ft(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function je(t,e,n,i,s,o,r,l=[-1]){const c=k;N(t);const u=t.$$={fragment:null,ctx:[],props:o,update:x,not_equal:s,bound:J(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(c?c.$$.context:[])),callbacks:J(),dirty:l,skip_bound:!1,root:e.target||c.$$.root};r&&r(u.root);let a=!1;if(u.ctx=n?n(t,e.props||{},(f,_,...d)=>{const h=d.length?d[0]:_;return u.ctx&&s(u.ctx[f],u.ctx[f]=h)&&(!u.skip_bound&&u.bound[f]&&u.bound[f](h),a&&Jt(t,f)),_}):[],u.update(),a=!0,T(u.before_update),u.fragment=i?i(u.ctx):!1,e.target){if(e.hydrate){gt();const f=Dt(e.target);u.fragment&&u.fragment.l(f),f.forEach(A)}else u.fragment&&u.fragment.c();e.intro&&Gt(t.$$.fragment),Wt(t,e.target,e.anchor,e.customElement),xt(),at()}N(c)}class Me{$destroy(){It(this,1),this.$destroy=x}$on(e,n){if(!O(n))return x;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const s=i.indexOf(n);s!==-1&&i.splice(s,1)}}$set(e){this.$$set&&!pt(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{fe as $,Wt as A,It as B,he as C,vt as D,x as E,ie as F,de as G,oe as H,j as I,T as J,ne as K,Ee as L,Te as M,Qt as N,Vt as O,Yt as P,Zt as Q,Xt as R,Me as S,Ut as T,ge as U,mt as V,ve as W,Ne as X,te as Y,ce as Z,Q as _,se as a,ee as a0,At as b,ue as c,we as d,re as e,be as f,Gt as g,A as h,je as i,ye as j,F as k,le as l,Dt as m,rt as n,pe as o,_e as p,G as q,Ot as r,Kt as s,xe as t,ae as u,$e as v,U as w,me as x,Ae as y,ke as z};
