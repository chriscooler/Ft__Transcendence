import{s as c,f,l as i,g as _,h as u,m as o,d as m,i as h,u as l,n as p,w as d}from"./scheduler.7c1da786.js";import{S as g,i as v}from"./index.7a22757c.js";function y(n){let t,r,a;return{c(){t=f("div"),r=i("Sorry, "),a=i(n[0])},l(e){t=_(e,"DIV",{});var s=u(t);r=o(s,"Sorry, "),a=o(s,n[0]),s.forEach(m)},m(e,s){h(e,t,s),l(t,r),l(t,a)},p(e,[s]){s&1&&p(a,e[0])},i:d,o:d,d(e){e&&m(t)}}}function S(n,t,r){let{msg:a}=t;return n.$$set=e=>{"msg"in e&&r(0,a=e.msg)},[a]}class q extends g{constructor(t){super(),v(this,t,S,y,c,{msg:0})}}export{q as E};