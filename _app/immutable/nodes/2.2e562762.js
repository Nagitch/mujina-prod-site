import{S as It,i as Dt,s as Et,y as Be,a as N,k as m,z as Re,c as $,l as h,m as v,h as c,n as a,A as qe,b as M,D as r,d as B,f as pe,g as S,B as ze,T as Vt,o as Nt,q as P,r as x,N as ne,G as dt,v as ge,I as be,L as Ee,M as ke,F as kt,E as $t,H as Pt,u as wt}from"../chunks/index.f27f6233.js";import{t as xt,p as Mt,e as At,d as C}from"../chunks/icon.22d829fe.js";import{p as St}from"../chunks/stores.7e0b9335.js";import{g as Gt}from"../chunks/navigation.34fe7a72.js";import{H as jt,F as Tt}from"../chunks/footer.599bcfee.js";import{P as Ft}from"../chunks/post_card.2c8972c2.js";function ft(i,s,e){const l=i.slice();l[8]=s[e],l[11]=e;const f=new Date(l[8].published??l[8].created).getFullYear();return l[9]=f,l}function mt(i,s,e){const l=i.slice();return l[12]=s[e],l[14]=e,l}function ht(i){let s,e,l,f,g,u,t,o,n,d,b,D,X,J,G=i[1],w=[];for(let E=0;E<G.length;E+=1)w[E]=vt(mt(i,G,E));return{c(){s=m("div"),e=m("div"),l=m("h2"),f=P("Not found: [");for(let E=0;E<w.length;E+=1)w[E].c();g=P("]"),u=N(),t=m("button"),o=m("span"),n=P(`
              tags = []`),this.h()},l(E){s=h(E,"DIV",{class:!0});var R=v(s);e=h(R,"DIV",{class:!0});var k=v(e);l=h(k,"H2",{});var A=v(l);f=x(A,"Not found: [");for(let q=0;q<w.length;q+=1)w[q].l(A);g=x(A,"]"),A.forEach(c),u=$(k),t=h(k,"BUTTON",{class:!0});var F=v(t);o=h(F,"SPAN",{class:!0}),v(o).forEach(c),n=x(F,`
              tags = []`),F.forEach(c),k.forEach(c),R.forEach(c),this.h()},h(){a(o,"class","i-heroicons-outline-trash mr-2"),a(t,"class","btn btn-secondary"),a(e,"class","prose items-center"),a(s,"class","bg-base-300 text-base-content shadow-inner text-center md:rounded-box p-10 -mb-2 md:mb-0 relative z-10")},m(E,R){M(E,s,R),r(s,e),r(e,l),r(l,f);for(let k=0;k<w.length;k+=1)w[k]&&w[k].m(l,null);r(l,g),r(e,u),r(e,t),r(t,o),r(t,n),D=!0,X||(J=Pt(t,"click",i[5]),X=!0)},p(E,R){if(R&2){G=E[1];let k;for(k=0;k<G.length;k+=1){const A=mt(E,G,k);w[k]?w[k].p(A,R):(w[k]=vt(A),w[k].c(),w[k].m(l,g))}for(;k<w.length;k+=1)w[k].d(1);w.length=G.length}},i(E){D||(be(()=>{D&&(b&&b.end(1),d=Ee(s,C,{x:100,duration:300,delay:500}),d.start())}),D=!0)},o(E){d&&d.invalidate(),b=ke(s,C,{x:-100,duration:300}),D=!1},d(E){E&&c(s),kt(w,E),E&&b&&b.end(),X=!1,J()}}}function _t(i){let s;return{c(){s=P(",")},l(e){s=x(e,",")},m(e,l){M(e,s,l)},d(e){e&&c(s)}}}function vt(i){let s,e=i[12]+"",l,f,g,u=i[14]+1<i[1].length&&_t();return{c(){s=P("'"),l=P(e),f=P("'"),u&&u.c(),g=N()},l(t){s=x(t,"'"),l=x(t,e),f=x(t,"'"),u&&u.l(t),g=$(t)},m(t,o){M(t,s,o),M(t,l,o),M(t,f,o),u&&u.m(t,o),M(t,g,o)},p(t,o){o&2&&e!==(e=t[12]+"")&&wt(l,e),t[14]+1<t[1].length?u||(u=_t(),u.c(),u.m(g.parentNode,g)):u&&(u.d(1),u=null)},d(t){t&&c(s),t&&c(l),t&&c(f),u&&u.d(t),t&&c(g)}}}function pt(i){let s,e=(i[3].push(i[9])&&i[9])+"",l,f,g,u;return{c(){s=m("div"),l=P(e),this.h()},l(t){s=h(t,"DIV",{class:!0});var o=v(s);l=x(o,e),o.forEach(c),this.h()},h(){a(s,"class","divider my-4 md:my-0")},m(t,o){M(t,s,o),r(s,l),u=!0},p(t,o){(!u||o&9)&&e!==(e=(t[3].push(t[9])&&t[9])+"")&&wt(l,e)},i(t){u||(be(()=>{u&&(g&&g.end(1),f=Ee(s,C,{x:i[11]%2?100:-100,duration:300,delay:500}),f.start())}),u=!0)},o(t){f&&f.invalidate(),g=ke(s,C,{x:i[11]%2?-100:100,duration:300}),u=!1},d(t){t&&c(s),t&&g&&g.end()}}}function gt(i){let s=!i[3].includes(i[9]),e,l,f,g,u,t,o,n=s&&pt(i);return f=new Ft({props:{post:i[8],preview:!0,loading:i[11]<5?"eager":"lazy",decoding:i[11]<5?"auto":"async"}}),{c(){n&&n.c(),e=N(),l=m("div"),Be(f.$$.fragment),g=N(),this.h()},l(d){n&&n.l(d),e=$(d),l=h(d,"DIV",{class:!0});var b=v(l);Re(f.$$.fragment,b),g=$(b),b.forEach(c),this.h()},h(){a(l,"class","max-w-screen-lg mx-20 transition-all duration-500 ease-in-out hover:z-30 hover:shadow-xl md:shadow-sm md:hover:shadow-xl md:hover:-translate-y-0.5")},m(d,b){n&&n.m(d,b),M(d,e,b),M(d,l,b),qe(f,l,null),r(l,g),o=!0},p(d,b){b&9&&(s=!d[3].includes(d[9])),s?n?(n.p(d,b),b&9&&S(n,1)):(n=pt(d),n.c(),S(n,1),n.m(e.parentNode,e)):n&&(ge(),B(n,1,1,()=>{n=null}),pe());const D={};b&1&&(D.post=d[8]),f.$set(D)},i(d){o||(S(n),S(f.$$.fragment,d),be(()=>{o&&(t&&t.end(1),u=Ee(l,C,{x:i[11]%2?100:-100,duration:300,delay:500}),u.start())}),o=!0)},o(d){B(n),B(f.$$.fragment,d),u&&u.invalidate(),t=ke(l,C,{x:i[11]%2?-100:100,duration:300}),o=!1},d(d){n&&n.d(d),d&&c(e),d&&c(l),ze(f),d&&t&&t.end()}}}function bt(i){let s,e,l,f,g,u,t,o,n,d,b,D,X,J,G,w,E,R,k,A,F,q,Ye,we,K,O,Q,Ce,ye,Z,L,ee,Oe,Ie,te,T,Le,De,le,H,ce,Ve,Ne,ue,$e,Pe,xe,Me,re,se,Ae,Se,de,Ge,ae,je,Te,he,j,fe,Fe,U,_e,me,oe,V=i[2]&&i[0].length===0&&ht(i),W=i[0].slice(0,3),y=[];for(let _=0;_<W.length;_+=1)y[_]=gt(ft(i,W,_));const yt=_=>B(y[_],1,1,()=>{y[_]=null});return U=new Tt({}),{c(){V&&V.c(),s=N(),e=m("main"),l=m("div"),f=m("h1"),g=P(`Mujina Production
            `),u=m("span"),t=P("by Nagitch"),o=N(),n=m("div"),d=m("div"),b=m("a"),D=m("img"),J=N(),G=m("div"),w=m("a"),E=m("img"),k=N(),A=m("div"),F=m("a"),q=m("img"),we=N(),K=m("div"),O=m("a"),Q=m("img"),ye=N(),Z=m("div"),L=m("a"),ee=m("img"),Ie=N(),te=m("div"),T=m("iframe"),De=N(),le=m("div"),H=m("p"),ce=m("strong"),Ve=P("「狢制作」"),Ne=P(`
            (Mujina Production) は
            `),ue=m("strong"),$e=P("Nagitch"),Pe=P(`
            の個人事業・制作活動のブランド名です。
            `),xe=m("br"),Me=N(),re=m("a"),se=m("span"),Ae=P("ポートフォリオはこちら"),Se=N(),de=m("div"),Ge=N(),ae=m("h1"),je=P("最新のブログ"),Te=N();for(let _=0;_<y.length;_+=1)y[_].c();he=N(),j=m("div"),fe=m("div"),Fe=N(),Be(U.$$.fragment),this.h()},l(_){V&&V.l(_),s=$(_),e=h(_,"MAIN",{class:!0,itemprop:!0,itemscope:!0,itemtype:!0});var p=v(e);l=h(p,"DIV",{class:!0});var I=v(l);f=h(I,"H1",{class:!0});var ie=v(f);g=x(ie,`Mujina Production
            `),u=h(ie,"SPAN",{class:!0});var Ue=v(u);t=x(Ue,"by Nagitch"),Ue.forEach(c),ie.forEach(c),I.forEach(c),o=$(p),n=h(p,"DIV",{class:!0});var z=v(n);d=h(z,"DIV",{class:!0});var We=v(d);b=h(We,"A",{href:!0,target:!0});var Xe=v(b);D=h(Xe,"IMG",{src:!0,alt:!0}),Xe.forEach(c),We.forEach(c),J=$(z),G=h(z,"DIV",{class:!0});var Je=v(G);w=h(Je,"A",{href:!0,target:!0});var Ke=v(w);E=h(Ke,"IMG",{src:!0,alt:!0}),Ke.forEach(c),Je.forEach(c),k=$(z),A=h(z,"DIV",{class:!0});var Qe=v(A);F=h(Qe,"A",{href:!0,target:!0});var Ze=v(F);q=h(Ze,"IMG",{src:!0,alt:!0}),Ze.forEach(c),Qe.forEach(c),we=$(z),K=h(z,"DIV",{class:!0});var et=v(K);O=h(et,"A",{href:!0,target:!0});var tt=v(O);Q=h(tt,"IMG",{src:!0,alt:!0}),tt.forEach(c),et.forEach(c),ye=$(z),Z=h(z,"DIV",{class:!0});var lt=v(Z);L=h(lt,"A",{href:!0,target:!0});var rt=v(L);ee=h(rt,"IMG",{src:!0,alt:!0}),rt.forEach(c),lt.forEach(c),z.forEach(c),Ie=$(p),te=h(p,"DIV",{class:!0});var st=v(te);T=h(st,"IFRAME",{width:!0,height:!0,src:!0,title:!0,frameborder:!0,allow:!0}),v(T).forEach(c),st.forEach(c),De=$(p),le=h(p,"DIV",{class:!0});var at=v(le);H=h(at,"P",{});var Y=v(H);ce=h(Y,"STRONG",{});var ot=v(ce);Ve=x(ot,"「狢制作」"),ot.forEach(c),Ne=x(Y,`
            (Mujina Production) は
            `),ue=h(Y,"STRONG",{});var it=v(ue);$e=x(it,"Nagitch"),it.forEach(c),Pe=x(Y,`
            の個人事業・制作活動のブランド名です。
            `),xe=h(Y,"BR",{}),Me=$(Y),re=h(Y,"A",{href:!0});var nt=v(re);se=h(nt,"SPAN",{class:!0});var ct=v(se);Ae=x(ct,"ポートフォリオはこちら"),ct.forEach(c),nt.forEach(c),Y.forEach(c),at.forEach(c),Se=$(p),de=h(p,"DIV",{class:!0}),v(de).forEach(c),Ge=$(p),ae=h(p,"H1",{class:!0});var ut=v(ae);je=x(ut,"最新のブログ"),ut.forEach(c),Te=$(p);for(let He=0;He<y.length;He+=1)y[He].l(p);p.forEach(c),he=$(_),j=h(_,"DIV",{class:!0});var ve=v(j);fe=h(ve,"DIV",{class:!0}),v(fe).forEach(c),Fe=$(ve),Re(U.$$.fragment,ve),ve.forEach(c),this.h()},h(){a(u,"class","text-base font-normal"),a(f,"class","mx-auto font-normal md:font-medium text-2xl"),a(l,"class","mx-auto p-3 bg-slate-900/[.65] rounded-md backdrop-blur"),ne(D.src,X="/assets/social-logos/github-icon-1.svg")||a(D,"src",X),a(D,"alt","GitHub"),a(b,"href","https://github.com/Nagitch"),a(b,"target","_blank"),a(d,"class","basis-10 md:basis-20 m-3 md:m-6 rounded-full backdrop-blur bg-slate-100/[.7]"),ne(E.src,R="/assets/social-logos/twitter-logo-blue.svg")||a(E,"src",R),a(E,"alt","Twitter / X"),a(w,"href","https://twitter.com/NagitchDevelop"),a(w,"target","_blank"),a(G,"class","basis-10 md:basis-20 m-3 md:m-6 rounded-2xl backdrop-blur"),ne(q.src,Ye="/assets/social-logos/VRC_Logo_TrademarkWhite.png")||a(q,"src",Ye),a(q,"alt","VRChat"),a(F,"href","https://vrchat.com/home/user/usr_8292a43a-914e-4dc0-8c40-51809e1af76b"),a(F,"target","_blank"),a(A,"class","basis-16 md:basis-32 m-3 md:m-6 rounded-2xl backdrop-blur"),ne(Q.src,Ce="/assets/social-logos/booth-logo_icon_r.svg")||a(Q,"src",Ce),a(Q,"alt","Booth"),a(O,"href","https://mujina-prod.booth.pm/"),a(O,"target","_blank"),a(K,"class","basis-10 md:basis-20 m-3 md:m-6 rounded-2xl backdrop-blur"),ne(ee.src,Oe="/assets/social-logos/soundcloud.svg")||a(ee,"src",Oe),a(ee,"alt","SoundCloud"),a(L,"href","https://soundcloud.com/nagitch"),a(L,"target","_blank"),a(Z,"class","basis-10 md:basis-24 m-3 md:m-6 rounded-2xl backdrop-blur"),a(n,"class","flex flex-row justify-center justify-items-center items-center"),a(T,"width","100%"),a(T,"height","100%"),ne(T.src,Le="https://www.youtube.com/embed/sdbYqEbr4-E?autoplay=1&mute=1&loop=1&playlist=sdbYqEbr4-E&disablekb=1")||a(T,"src",Le),a(T,"title","YouTube video player"),a(T,"frameborder","0"),a(T,"allow","accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"),T.allowFullscreen=!0,a(te,"class","conatiner aspect-video my-5 pd-15"),a(se,"class","underline decoration-solid"),a(re,"href","/portfolio"),a(le,"class","ml-6 my-4"),a(de,"class","divider mt-0 mb-8 hidden lg:flex"),a(ae,"class","text-xl font-bold ml-6"),a(e,"class","flex flex-col relative bg-base-100 md:bg-transparent md:gap-8 z-10"),a(e,"itemprop","mainEntityOfPage"),a(e,"itemscope",""),a(e,"itemtype","https://schema.org/Blog"),a(fe,"class","divider mt-0 mb-8 hidden lg:flex"),a(j,"class","sticky bottom-0 md:static md:mt-8"),dt(j,"hidden",!i[2])},m(_,p){V&&V.m(_,p),M(_,s,p),M(_,e,p),r(e,l),r(l,f),r(f,g),r(f,u),r(u,t),r(e,o),r(e,n),r(n,d),r(d,b),r(b,D),r(n,J),r(n,G),r(G,w),r(w,E),r(n,k),r(n,A),r(A,F),r(F,q),r(n,we),r(n,K),r(K,O),r(O,Q),r(n,ye),r(n,Z),r(Z,L),r(L,ee),r(e,Ie),r(e,te),r(te,T),r(e,De),r(e,le),r(le,H),r(H,ce),r(ce,Ve),r(H,Ne),r(H,ue),r(ue,$e),r(H,Pe),r(H,xe),r(H,Me),r(H,re),r(re,se),r(se,Ae),r(e,Se),r(e,de),r(e,Ge),r(e,ae),r(ae,je),r(e,Te);for(let I=0;I<y.length;I+=1)y[I]&&y[I].m(e,null);M(_,he,p),M(_,j,p),r(j,fe),r(j,Fe),qe(U,j,null),oe=!0},p(_,p){if(i=_,i[2]&&i[0].length===0?V?(V.p(i,p),p&5&&S(V,1)):(V=ht(i),V.c(),S(V,1),V.m(s.parentNode,s)):V&&(ge(),B(V,1,1,()=>{V=null}),pe()),p&9){W=i[0].slice(0,3);let I;for(I=0;I<W.length;I+=1){const ie=ft(i,W,I);y[I]?(y[I].p(ie,p),S(y[I],1)):(y[I]=gt(ie),y[I].c(),S(y[I],1),y[I].m(e,null))}for(ge(),I=W.length;I<y.length;I+=1)yt(I);pe()}(!oe||p&4)&&dt(j,"hidden",!i[2])},i(_){if(!oe){S(V);for(let p=0;p<W.length;p+=1)S(y[p]);S(U.$$.fragment,_),be(()=>{oe&&(me&&me.end(1),_e=Ee(j,C,{x:i[0].length+1%2?100:-100,duration:300,delay:500}),_e.start())}),oe=!0}},o(_){B(V),y=y.filter(Boolean);for(let p=0;p<y.length;p+=1)B(y[p]);B(U.$$.fragment,_),_e&&_e.invalidate(),me=ke(j,C,{x:i[0].length+1%2?-100:100,duration:300}),oe=!1},d(_){V&&V.d(_),_&&c(s),_&&c(e),kt(y,_),_&&c(he),_&&c(j),ze(U),_&&me&&me.end()}}}function Ht(i){let s,e,l,f,g=i[0],u;s=new jt({});let t=bt(i);return{c(){Be(s.$$.fragment),e=N(),l=m("div"),f=m("div"),t.c(),this.h()},l(o){Re(s.$$.fragment,o),e=$(o),l=h(o,"DIV",{class:!0});var n=v(l);f=h(n,"DIV",{class:!0});var d=v(f);t.l(d),d.forEach(c),n.forEach(c),this.h()},h(){a(f,"class","flex-none w-full max-w-screen-xl mx-auto xl:mx-0"),a(l,"class","flex flex-col flex-nowrap justify-center xl:flex-row xl:flex-wrap h-feed bg-[url('/assets/bg-header.png')] bg-contain bg-scroll bg-no-repeat bg-top")},m(o,n){qe(s,o,n),M(o,e,n),M(o,l,n),r(l,f),t.m(f,null),u=!0},p(o,[n]){n&1&&Et(g,g=o[0])?(ge(),B(t,1,1,$t),pe(),t=bt(o),t.c(),S(t,1),t.m(f,null)):t.p(o,n)},i(o){u||(S(s.$$.fragment,o),S(t),u=!0)},o(o){B(s.$$.fragment,o),B(t),u=!1},d(o){ze(s,o),o&&c(e),o&&c(l),t.d(o)}}}function Bt(i,s,e){let l;Vt(i,St,d=>e(7,l=d));let f,g,[u,t,o]=[[],[],[]];xt.set(""),Nt(()=>{var d;l.url.searchParams.get("tags")&&e(1,t=((d=l.url.searchParams.get("tags"))==null?void 0:d.split(","))??[]),e(2,g=!0)});const n=()=>e(1,t=[]);return i.$$.update=()=>{i.$$.dirty&18&&t&&(e(0,u=t?f.filter(d=>t.every(b=>{var D;return(D=d.tags)==null?void 0:D.includes(b)})):f),window.location.pathname==="/"&&Gt(t.length>0?`?tags=${t.toString()}`:"/",{replaceState:!0})),i.$$.dirty&1&&u.length>1&&e(3,o=[new Date(u[0].published??u[0].created).getFullYear()])},Mt.subscribe(d=>e(4,f=d.filter(b=>{var D;return!((D=b.flags)!=null&&D.includes("unlisted"))}))),At.subscribe(d=>d),[u,t,g,o,f,n]}class Lt extends It{constructor(s){super(),Dt(this,s,Bt,Ht,Et,{})}}export{Lt as component};
