(this.webpackJsonpcalligro=this.webpackJsonpcalligro||[]).push([[0],{13:function(e,t,a){e.exports={container:"step1CharacterList_container__2suRc",character:"step1CharacterList_character__3-MFM",input:"step1CharacterList_input__1t3rR",inputInvalid:"step1CharacterList_inputInvalid__3-Gel",times:"step1CharacterList_times__37cyf",undoButton:"step1CharacterList_undoButton__2AK0J",characterContainer:"step1CharacterList_characterContainer__2Rpww",button:"step1CharacterList_button__1WKc4",buttonContainer:"step1CharacterList_buttonContainer__1qLZa"}},14:function(e,t,a){e.exports={container:"navbar_container__2mYrz",linkBig:"navbar_linkBig__1CiWe",linkSmall:"navbar_linkSmall__3U_dr",navLink:"navbar_navLink__lYMlZ",navLinkLeft:"navbar_navLinkLeft__2tD8-",navLinkRight:"navbar_navLinkRight__1FQnp",navLinkActive:"navbar_navLinkActive__1z4La"}},15:function(e,t,a){e.exports={container:"cookieNotice_container__2ekSC",heading:"cookieNotice_heading__vUvKO",image:"cookieNotice_image__2wJ3y",content:"cookieNotice_content__3HqBN",list:"cookieNotice_list__1hg4D",listItem:"cookieNotice_listItem__3GkmT",link:"cookieNotice_link__38Uhh",details:"cookieNotice_details__1BKmu",linkContainer:"cookieNotice_linkContainer__18P_C"}},16:function(e,t,a){"use strict";function n(e){return""===e?0:e}a.d(t,"a",(function(){return n}))},19:function(e,t,a){e.exports={container:"footer_container__2qBcC",policy:"footer_policy__w7rxg",link:"footer_link__gQPPx",authors:"footer_authors__1Pupk",linkContainer:"footer_linkContainer__3kxeW"}},2:function(e,t,a){e.exports={container:"step1_container__2R46B",parameters:"step1_parameters__2fhbG",commonParameters:"step1_commonParameters__12krB",perCharacterParameters:"step1_perCharacterParameters__187q6",charactersLabelContainer:"step1_charactersLabelContainer__2_zeq",charactersResetButton:"step1_charactersResetButton__1rVxQ",charactersTextArea:"step1_charactersTextArea__1129O",instructionList:"step1_instructionList__1yq3Z",instructionListItem:"step1_instructionListItem__3ndrZ",label:"step1_label__dvXqU",commonLabel:"step1_commonLabel__1XEMl",commonInput:"step1_commonInput__2xGXE",commonInputIvalid:"step1_commonInputIvalid__1M86R",heading:"step1_heading__3AIsF",paragraph:"step1_paragraph__26hYp",downloadButton:"step1_downloadButton__2Udaj",times:"step1_times__2BpAi",questionMark:"step1_questionMark__1F_q0",commonContainer:"step1_commonContainer__3oXIY",link:"step1_link__1D4An"}},21:function(e,t,a){e.exports={container:"header_container__3iV9Y",sourceNoticeContainer:"header_sourceNoticeContainer__3debw",sourceNoticeLine1:"header_sourceNoticeLine1__2dpGN",sourceNoticeLine2:"header_sourceNoticeLine2__1SD3C",logo:"header_logo__1NKnM",githubCorner:"header_githubCorner__i9m_i"}},25:function(e,t,a){e.exports={container:"author_container__Qvl5M",socialLink:"author_socialLink__1xWOs",name:"author_name__uFPT4",socialContainer:"author_socialContainer__3Ftd3",icon:"author_icon__1sPpI"}},26:function(e,t,a){"use strict";function n(e,t,a){return t.split("\n").map((function(e){return e.split(" ")})).flatMap((function(t){var n=[[]];return t.forEach((function(t){var i=n[n.length-1];e.measureText("".concat(i.join(" ")," ").concat(t)).width<a?i.push(t):n.push([t])})),n.map((function(e){return e.join(" ")}))}))}function i(e,t,a){var n=document.createElement("canvas");n.width=e,n.height=t;var i=n.getContext("2d");if(!i)throw new Error("Your browser doesn't support 2d canvas context. Use a modern browser, please.");return a&&(i.fillStyle=a,i.fillRect(0,0,n.width,n.height)),[n,i]}function r(e,t,a){var i=a.x,r=a.y,c=a.size,s=a.maxWidth,o=a.maxHeight,l=c;e.font="".concat(l,"px serif");var h=n(e,t,s);if(o)for(;h.length*l>=o;)l--,e.font="".concat(l,"px serif"),h=n(e,t,s);h.forEach((function(t,a){return e.fillText(t,i,r+a*l,s)}))}function c(e){return new Promise((function(t,a){e.toBlob((function(e){return e?t(e):a()}))}))}a.d(t,"b",(function(){return i})),a.d(t,"c",(function(){return r})),a.d(t,"a",(function(){return c}))},37:function(e,t,a){e.exports={policyContainer:"policy_policyContainer__2V2gt",menuLink:"policy_menuLink__2gWKV"}},39:function(e,t,a){e.exports={container:"loader_container__uCYfU",icon:"loader_icon__1ZW5k"}},41:function(e,t,a){"use strict";a.d(t,"a",(function(){return o}));var n=a(6),i=a.n(n),r=a(22),c=a(47);function s(e,t){var a=document.createElement("a");a.href=URL.createObjectURL(t),a.download=e,a.click(),URL.revokeObjectURL(a.href),a.remove()}function o(e,t){return l.apply(this,arguments)}function l(){return(l=Object(r.a)(i.a.mark((function e(t,a){var n,r;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=Object(c.a)(a),e.next=3,n.blob();case 3:r=e.sent,s("".concat(t,".zip"),r);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}},43:function(e,t,a){"use strict";a.d(t,"a",(function(){return h}));var n,i=a(40),r=a(17),c=a(18),s=a(4),o=a(26);function l(e,t,a){var n,i=null!==(n=a.value)&&void 0!==n?n:a.get;if(!i||!(i instanceof Function))throw Error("Memoize only supports non-setter functions.");var r=a.value?"value":"get",c=new Map;a[r]=function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];var n=JSON.stringify(t),r=c.get(n),s=r||i.apply(this,t);return c.set(n,s),s}}var h=(n=function(){function e(t,a){Object(r.a)(this,e),this.slots=t,this.base=a,this.canvas=void 0,this.ctx=void 0;var n=Object(o.b)(this.w*this.slotDim.w,this.h*this.slotDim.h,"white"),c=Object(i.a)(n,2);this.canvas=c[0],this.ctx=c[1]}return Object(c.a)(e,[{key:"getSlotPosition",value:function(e){return{x:e%this.w*this.slotDim.w,y:Math.floor(e/this.w)*this.slotDim.h}}},{key:"generateImageBlob",value:function(){var e,t,a,n,i,r=this;return e=this.ctx,t=0,a=0,n=this.slotDim.w,i=this.slotDim.h,e.fillStyle="black",e.textAlign="left",Object(o.c)(e,"1) Draw characters inside the red boundaries*.\n\n2) Upload this file back to Calligro\n\n3) Paste the template code and you got yourself a font\n\n*Green lines signify the letter base.",{x:t+.05*n,y:a+.1*i,maxWidth:.9*n,maxHeight:.8*i,size:i/5}),this.slots.forEach((function(e,t){var a=r.getSlotPosition(t+1),n=a.x,i=a.y;!function(e,t,a){var n=a.x,i=a.y,r=a.w,c=a.h,s=a.base,o=a.vertMargin;e.strokeStyle="black",e.strokeRect(n,i,r,c);var l=n+r/2-t.width/2,h=i+c/2-t.height/2;e.strokeStyle="green",e.beginPath(),e.moveTo(n,h+s),e.lineTo(n+r,h+s),e.stroke(),e.strokeStyle="red",e.clearRect(l,h,t.width,t.height),e.strokeRect(l,h,t.width,t.height),e.fillStyle="black",e.font="".concat(.8*o,"px serif"),e.textAlign="center",e.fillText(t.character,n+r/2,i+c-o/4,r)}(r.ctx,e,{x:n,y:i,w:r.slotDim.w,h:r.slotDim.h,base:r.base,vertMargin:r.slotDim.hMargin})})),Object(o.a)(this.canvas)}},{key:"generateTemplateCode",value:function(){var e={version:0,slots:this.slots.map((function(e){return[e.character.charCodeAt(0),e.width,e.height]})),base:this.base};return btoa(JSON.stringify(e))}},{key:"w",get:function(){return Math.ceil(Math.sqrt(this.slots.length+1))}},{key:"h",get:function(){return Math.ceil(Math.sqrt(this.slots.length+1))}},{key:"slotDim",get:function(){var e=Math.max.apply(null,this.slots.map((function(e){return e.width}))),t=Math.max.apply(null,this.slots.map((function(e){return e.height}))),a=1.3*t;return{w:1.3*e,h:a,hMargin:(a-t)/2}}}]),e}(),Object(s.a)(n.prototype,"w",[l],Object.getOwnPropertyDescriptor(n.prototype,"w"),n.prototype),Object(s.a)(n.prototype,"h",[l],Object.getOwnPropertyDescriptor(n.prototype,"h"),n.prototype),Object(s.a)(n.prototype,"slotDim",[l],Object.getOwnPropertyDescriptor(n.prototype,"slotDim"),n.prototype),Object(s.a)(n.prototype,"generateImageBlob",[l],Object.getOwnPropertyDescriptor(n.prototype,"generateImageBlob"),n.prototype),Object(s.a)(n.prototype,"generateTemplateCode",[l],Object.getOwnPropertyDescriptor(n.prototype,"generateTemplateCode"),n.prototype),n)},53:function(e,t,a){},64:function(e,t,a){"use strict";a.r(t);var n=a(0),i=a(1),r=a.n(i),c=a(44),s=a.n(c),o=(a(53),a(27)),l=a(29),h=a(17),u=a(18),p=a(24),d=a(23),b=a(4),j=a(9),m=a(7),f=a(13),g=a.n(f),O=a(16);var v=function(e){var t=e.charSet.map((function(t){var a,i,r=null!==(a=t.width)&&void 0!==a?a:e.defaultWidth,c=null!==(i=t.height)&&void 0!==i?i:e.defaultHeight;return Object(n.jsxs)("div",{className:g.a.characterContainer,children:[Object(n.jsx)("p",{className:g.a.character,children:t.character}),Object(n.jsx)("input",{"aria-label":"".concat(t.character," width input"),className:"".concat(g.a.input," ").concat(Object(O.a)(r)<=0?g.a.inputInvalid:""),type:"number",value:r,onChange:function(a){return e.handleDimensionChange(a,"width",t)}}),Object(n.jsx)(m.a,{icon:"fas fa-times",className:g.a.times}),Object(n.jsx)("input",{"aria-label":"".concat(t.character," height input"),className:"".concat(g.a.input," ").concat(Object(O.a)(c)<=0?g.a.inputInvalid:""),type:"number",value:c,onChange:function(a){return e.handleDimensionChange(a,"height",t)}}),t.height||t.width||Object(O.a)(r)<=0||Object(O.a)(c)<=0?Object(n.jsx)("span",{className:g.a.buttonContainer,children:Object(n.jsx)("button",{onClick:function(){return e.resetCharacterDimensions(t)},className:g.a.button,children:Object(n.jsx)(m.a,{icon:"fas fa-undo",className:g.a.undoButton})})}):null]},t.character)}));return Object(n.jsx)("div",{className:g.a.container,children:t})},_=a(43),y=a(6),x=a.n(y),k=a(22),w=a(41);function C(){return(C=Object(k.a)(x.a.mark((function e(t){var a;return x.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.generateImageBlob();case 2:return e.t0=e.sent,e.t1={name:"template.png",input:e.t0},e.t2={name:"template code.txt",input:t.generateTemplateCode()},a=[e.t1,e.t2],e.abrupt("return",Object(w.a)("calligro-template",a));case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var N,L=a(2),D=a.n(L),S=a(8),I="AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz.?!,:",A=(N=function(e){Object(p.a)(a,e);var t=Object(d.a)(a);function a(e){var n;return Object(h.a)(this,a),(n=t.call(this,e)).state=n.setInitialState(),n}return Object(u.a)(a,[{key:"setInitialState",value:function(){var e,t,a,n,i=window.localStorage.getItem("settings"),r=i?JSON.parse(i):null;return{charSet:null!==(e=null===r||void 0===r?void 0:r.charSet)&&void 0!==e?e:this.createCharArray(),defaultWidth:null!==(t=null===r||void 0===r?void 0:r.defaultWidth)&&void 0!==t?t:200,defaultHeight:null!==(a=null===r||void 0===r?void 0:r.defaultHeight)&&void 0!==a?a:200,base:null!==(n=null===r||void 0===r?void 0:r.base)&&void 0!==n?n:100}}},{key:"componentDidUpdate",value:function(e,t){t!==this.state&&window.localStorage.setItem("settings",JSON.stringify(this.state))}},{key:"createCharArray",value:function(){return Array.from(I,(function(e){return{character:e}}))}},{key:"handleCharSetInput",value:function(e){var t=this,a=e.target.value.split("").filter((function(e){return" "!==e})),n=new Set(a).size===a.length;if(e.preventDefault(),n){var i=a.map((function(e){var a;return null!==(a=t.state.charSet.find((function(t){return t.character===e})))&&void 0!==a?a:{character:e}}));this.setState({charSet:i})}}},{key:"isSlotArrayValid",value:function(){return this.slotArray.every((function(e){return e.height>0&&e.width>0}))}},{key:"isBaseValid",value:function(){var e=Object(O.a)(this.state.base);return e<=Object(O.a)(this.state.defaultHeight)&&e>=0}},{key:"isCharsetDefault",value:function(){return this.charString===I}},{key:"handleDefaultValueChange",value:function(e,t){var a=""===e.target.value?"":parseInt(e.target.value,10);this.setState((function(e){return Object(l.a)(Object(l.a)({},e),{},Object(o.a)({},t,a))}))}},{key:"handleDimensionChange",value:function(e,t,a){var n=""===e.target.value?"":parseInt(e.target.value,10),i=this.state.charSet.map((function(e){return e===a?Object(l.a)(Object(l.a)({},e),{},Object(o.a)({},t,n)):e}));this.setState({charSet:i})}},{key:"resetCharacterDimensions",value:function(e){var t=this.state.charSet.map((function(t){return e===t?{character:t.character}:t}));this.setState({charSet:t})}},{key:"resetCharacters",value:function(){this.setState({charSet:this.createCharArray()})}},{key:"downloadTemplate",value:function(){!function(e){C.apply(this,arguments)}(new _.a(this.slotArray,Object(O.a)(this.state.base)))}},{key:"render",value:function(){var e=this;return Object(n.jsxs)("div",{className:D.a.container,children:[Object(n.jsxs)("div",{children:[Object(n.jsxs)("div",{children:[Object(n.jsxs)("h2",{className:D.a.heading,children:["Generate bitmap fonts in the ",Object(n.jsx)("a",{href:"https://www.angelcode.com/products/bmfont/doc/file_format.html",className:D.a.link,children:"BMFont"})," format."]}),Object(n.jsx)("p",{className:D.a.paragraph,children:"Calligro lets you generate custom fonts from images created in graphics software like Gimp, Photoshop, Aseprite and others."}),Object(n.jsxs)("p",{className:D.a.paragraph,children:["If you\u2019re looking to convert a truetype font into a BMFont, try tools like the original ",Object(n.jsx)("a",{href:"https://www.angelcode.com/products/bmfont/",className:D.a.link,children:"BMFont"})," or ",Object(n.jsx)("a",{href:"https://github.com/libgdx/libgdx/wiki/Hiero",className:D.a.link,children:"Hiero"})," instead."]})]}),Object(n.jsxs)("div",{children:[Object(n.jsxs)("div",{className:D.a.charactersLabelContainer,children:[Object(n.jsxs)("label",{className:D.a.label,children:["Characters",Object(n.jsx)(m.a,{icon:"fas fa-question",className:D.a.questionMark,title:"Characters you want to be included in the final font (all unicode characters should work)"})]}),Object(n.jsx)("button",{title:"Reset characters to default values",onClick:this.resetCharacters,className:D.a.charactersResetButton,disabled:this.isCharsetDefault(),children:Object(n.jsx)(m.a,{icon:"fas fa-undo"})})]}),Object(n.jsx)("textarea",{"aria-label":"characters input",className:D.a.charactersTextArea,onChange:this.handleCharSetInput,value:this.charString})]}),Object(n.jsxs)("div",{className:D.a.parameters,children:[Object(n.jsxs)("div",{className:D.a.commonParameters,children:[Object(n.jsxs)("div",{children:[Object(n.jsx)("label",{className:D.a.label,children:"Common"}),Object(n.jsx)("label",{className:D.a.commonLabel,children:"Size"}),Object(n.jsx)("input",{"aria-label":"default width input",className:D.a.commonInput,type:"number",onChange:function(t){return e.handleDefaultValueChange(t,"defaultWidth")},value:this.state.defaultWidth}),Object(n.jsx)(m.a,{icon:"fas fa-times",className:D.a.times}),Object(n.jsx)("input",{"aria-label":"default height input",className:D.a.commonInput,type:"number",onChange:function(t){return e.handleDefaultValueChange(t,"defaultHeight")},value:this.state.defaultHeight}),Object(n.jsx)(m.a,{icon:"fas fa-question",className:D.a.questionMark,title:"Default size of one character in pixels"})]}),Object(n.jsxs)("div",{children:[Object(n.jsx)("label",{className:D.a.commonLabel,children:"Base"}),Object(n.jsx)("input",{"aria-label":"characters base input",className:"".concat(D.a.commonInput," ").concat(this.isBaseValid()?"":D.a.commonInputIvalid),type:"number",onChange:function(t){return e.handleDefaultValueChange(t,"base")},value:this.state.base}),Object(n.jsx)(m.a,{icon:"fas fa-question",className:D.a.questionMark,title:'Distance from the top of the letter to the line base in pixels (character parts below this will stick out like in "g" or "j")'})]}),Object(n.jsx)("button",{onClick:this.downloadTemplate,className:D.a.downloadButton,disabled:!this.isSlotArrayValid()||!this.isBaseValid(),children:"download template"})]}),Object(n.jsxs)("div",{className:D.a.perCharacterParameters,children:[Object(n.jsxs)("label",{className:D.a.label,children:["Per character",Object(n.jsx)(m.a,{icon:"fas fa-question",className:D.a.questionMark,title:"Override default size per character"})]}),Object(n.jsx)(v,{charSet:this.state.charSet,defaultHeight:this.state.defaultHeight,defaultWidth:this.state.defaultWidth,handleDimensionChange:this.handleDimensionChange,resetCharacterDimensions:this.resetCharacterDimensions})]})]})]}),Object(n.jsxs)("div",{children:[Object(n.jsx)("h2",{className:D.a.heading,children:"Step 1 - Create a template"}),Object(n.jsxs)("ol",{className:D.a.instructionList,children:[Object(n.jsx)("li",{className:D.a.instructionListItem,children:" Specify what characters you want included in the final font. "}),Object(n.jsx)("li",{className:D.a.instructionListItem,children:"Choose the character size and base."}),Object(n.jsx)("li",{className:D.a.instructionListItem,children:"Optionally override the size per character if you want some to be smaller or bigger than the rest."}),Object(n.jsx)("li",{className:D.a.instructionListItem,children:"Download the generated template. It\u2019s a zip archive containing two files: png and txt. Open the png in your graphics editor of choice and draw characters inside the red boundaries."}),Object(n.jsxs)("li",{className:D.a.instructionListItem,children:["Go to ",Object(n.jsx)(S.b,{to:"/step2",className:D.a.link,children:"Step 2"})," to upload the template and generate your font."]})]})]})]})}},{key:"slotArray",get:function(){var e=this;return this.state.charSet.map((function(t){var a,n;return{character:t.character,width:Object(O.a)(null!==(a=t.width)&&void 0!==a?a:e.state.defaultWidth),height:Object(O.a)(null!==(n=t.height)&&void 0!==n?n:e.state.defaultHeight)}}))}},{key:"charString",get:function(){return this.state.charSet.map((function(e){return e.character})).join("")}}]),a}(i.Component),Object(b.a)(N.prototype,"handleCharSetInput",[j.a],Object.getOwnPropertyDescriptor(N.prototype,"handleCharSetInput"),N.prototype),Object(b.a)(N.prototype,"isSlotArrayValid",[j.a],Object.getOwnPropertyDescriptor(N.prototype,"isSlotArrayValid"),N.prototype),Object(b.a)(N.prototype,"isBaseValid",[j.a],Object.getOwnPropertyDescriptor(N.prototype,"isBaseValid"),N.prototype),Object(b.a)(N.prototype,"isCharsetDefault",[j.a],Object.getOwnPropertyDescriptor(N.prototype,"isCharsetDefault"),N.prototype),Object(b.a)(N.prototype,"handleDefaultValueChange",[j.a],Object.getOwnPropertyDescriptor(N.prototype,"handleDefaultValueChange"),N.prototype),Object(b.a)(N.prototype,"handleDimensionChange",[j.a],Object.getOwnPropertyDescriptor(N.prototype,"handleDimensionChange"),N.prototype),Object(b.a)(N.prototype,"resetCharacterDimensions",[j.a],Object.getOwnPropertyDescriptor(N.prototype,"resetCharacterDimensions"),N.prototype),Object(b.a)(N.prototype,"resetCharacters",[j.a],Object.getOwnPropertyDescriptor(N.prototype,"resetCharacters"),N.prototype),Object(b.a)(N.prototype,"downloadTemplate",[j.a],Object.getOwnPropertyDescriptor(N.prototype,"downloadTemplate"),N.prototype),N),P=a(3),B=a(14),M=a.n(B);var T=function(){return Object(n.jsxs)("nav",{className:M.a.container,children:[Object(n.jsxs)(S.c,{exact:!0,to:"/",className:"".concat(M.a.navLink," ").concat(M.a.navLinkLeft),activeClassName:M.a.navLinkActive,children:[Object(n.jsx)("p",{className:M.a.linkBig,children:"Step 1"}),Object(n.jsx)("p",{className:M.a.linkSmall,children:"create a template"})]}),Object(n.jsxs)(S.c,{to:"/step2",className:"".concat(M.a.navLink," ").concat(M.a.navLinkRight),activeClassName:M.a.navLinkActive,children:[Object(n.jsx)("p",{className:M.a.linkBig,children:"Step 2"}),Object(n.jsx)("p",{className:M.a.linkSmall,children:"generate your font"})]})]})},V=a(21),W=a.n(V),q=a(46),R=a.n(q);var z=function(){return Object(n.jsxs)("div",{className:W.a.container,children:[Object(n.jsx)("img",{src:"logo.svg",alt:"logo",className:W.a.logo}),Object(n.jsx)(T,{}),Object(n.jsxs)("div",{className:W.a.sourceNoticeContainer,children:[Object(n.jsx)("p",{className:W.a.sourceNoticeLine1,children:"We're open source!"}),Object(n.jsx)("p",{className:W.a.sourceNoticeLine2,children:"Feel free to contribute :D"})]}),Object(n.jsx)(R.a,{className:W.a.githubCorner,href:"https://github.com/Voycawojka/calligro",size:"110",bannerColor:"#707070",octoColor:"#202020"})]})},F=a(25),H=a.n(F);var E=function(e){var t=e.socialLinks.map((function(e){return Object(n.jsx)("a",{className:H.a.socialLink,href:e.url,"aria-label":e.label,children:Object(n.jsx)(m.a,{icon:e.icon,className:H.a.icon})},e.url)}));return Object(n.jsxs)("div",{className:H.a.container,children:[Object(n.jsx)("h3",{className:H.a.name,children:e.name}),Object(n.jsx)("div",{className:H.a.socialContainer,children:t})]})},U=a(19),G=a.n(U);var J=function(){return Object(n.jsxs)("footer",{className:G.a.container,children:[Object(n.jsx)(S.b,{to:"/policy",className:"".concat(G.a.policy," ").concat(G.a.link),children:"Privacy policy"}),Object(n.jsxs)("div",{className:G.a.authors,children:[Object(n.jsx)(E,{name:"Filip A. Kowalski",socialLinks:[{url:"http://ideasalmanac.com",icon:"fa fa-globe-africa",label:"ideasalmanac"},{url:"https://twitter.com/IdeasAlmanac",icon:"fab fa-twitter",label:"twitter"},{url:"https://github.com/Voycawojka",icon:"fab fa-github",label:"github"}]}),Object(n.jsx)(E,{name:"Dominik J\xf3zefiak",socialLinks:[{url:"https://github.com/domlj",icon:"fab fa-github",label:"github"}]})]}),Object(n.jsxs)("div",{className:G.a.linkContainer,children:[Object(n.jsx)("a",{href:"https://github.com/Voycawojka/calligro/issues",className:G.a.link,children:"Found a bug?"}),Object(n.jsx)("a",{href:"https://github.com/Voycawojka/calligro/issues",className:G.a.link,children:"Have a feature request?"})]})]})},K=a(37),Y=a.n(K);var Z,Q=function(){return Object(n.jsxs)("div",{className:Y.a.policyContainer,children:[Object(n.jsx)("h1",{children:"Calligro Privacy Policy"}),Object(n.jsx)("p",{children:"Calligro is an open source tool served on a static web server (Github Pages). We don't ask for nor collect any personal data. All information provided (and all files uploaded) by the user stay inside the user's browser."}),Object(n.jsx)("h2",{children:"Cookies and local storage"}),Object(n.jsx)("p",{children:"We use cookies and local storage (small files and pieces of data stored on the user's device) for two pursposes:"}),Object(n.jsxs)("ul",{children:[Object(n.jsx)("li",{children:"user's convenience (e.g. to rememeber last chosen settings),"}),Object(n.jsx)("li",{children:"analytics (more in the Analytics section below)"})]}),Object(n.jsx)("p",{children:"Browsers allow users to view, remove or even entirely block cookies. Check your browser's manual to access those options."}),Object(n.jsx)("h2",{children:"Analytics"}),Object(n.jsx)("p",{children:"We use Google Analytics for analytics purposes. Therefore, all analytics data is stored on Google's servers."}),Object(n.jsx)("p",{children:"By default, we don't allow Google Analytics to use analytics or ad related tracking cookies. If you consent by clicking Accept on our cookie popup, we use analytics related cookies for better insight. We don't use ad related cookies regardless of consent."}),Object(n.jsx)("h2",{children:"About this policy"}),Object(n.jsx)("p",{children:"Please note we can change this privacy policy without notice."}),Object(n.jsx)(S.b,{to:"/",className:Y.a.menuLink,children:"Back to Calligro"})]})},X=a(38),$=a.n(X),ee=a(15),te=a.n(ee),ae=(Z=function(e){Object(p.a)(a,e);var t=Object(d.a)(a);function a(e){var n;return Object(h.a)(this,a),(n=t.call(this,e)).state={acknowledged:!1},n}return Object(u.a)(a,[{key:"componentDidMount",value:function(){this.setState({acknowledged:"true"===$.a.get("cookies-acknowledged")},this.updateAnalytics)}},{key:"handleExit",value:function(){$.a.set("cookies-acknowledged","true",{expires:1e3}),this.setState({acknowledged:!0},this.updateAnalytics)}},{key:"updateAnalytics",value:function(){var e=this.state.acknowledged?"granted":"denied";window.gtag("consent","update",{analytics_storage:e})}},{key:"render",value:function(){return this.state.acknowledged?null:Object(n.jsxs)("div",{className:te.a.container,children:[Object(n.jsx)("h2",{className:te.a.heading,children:"We use cookies"}),Object(n.jsxs)("div",{className:te.a.content,children:[Object(n.jsx)("img",{className:te.a.image,src:"cookie.svg",alt:"cookie"}),Object(n.jsxs)("div",{className:te.a.details,children:[Object(n.jsxs)("ul",{className:te.a.list,children:[Object(n.jsx)("li",{className:te.a.listItem,children:"for your convienience"}),Object(n.jsx)("li",{className:te.a.listItem,children:"for analytics"})]}),Object(n.jsxs)("div",{className:te.a.linkContainer,children:[Object(n.jsx)(S.b,{to:"/policy",className:te.a.link,children:"Learn more"}),Object(n.jsx)("button",{onClick:this.handleExit,className:te.a.link,children:"Accept"})]})]})]})]})}}]),a}(i.Component),Object(b.a)(Z.prototype,"handleExit",[j.a],Object.getOwnPropertyDescriptor(Z.prototype,"handleExit"),Z.prototype),Object(b.a)(Z.prototype,"updateAnalytics",[j.a],Object.getOwnPropertyDescriptor(Z.prototype,"updateAnalytics"),Z.prototype),Z),ne=a(39),ie=a.n(ne),re=function(e){Object(p.a)(a,e);var t=Object(d.a)(a);function a(e){var n;return Object(h.a)(this,a),(n=t.call(this,e)).timer=void 0,n.state={isLoaderOn:!1},n}return Object(u.a)(a,[{key:"componentDidMount",value:function(){var e=this;this.timer=setTimeout((function(){e.setState({isLoaderOn:!0})}),300)}},{key:"componentWillUnmount",value:function(){this.timer&&clearTimeout(this.timer)}},{key:"render",value:function(){return this.state.isLoaderOn?Object(n.jsx)("div",{className:ie.a.container,children:Object(n.jsx)(m.a,{icon:"fas fa-cog fa-spin",className:ie.a.icon})}):null}}]),a}(i.Component),ce=r.a.lazy((function(){return a.e(3).then(a.bind(null,68))}));var se=function(){return Object(n.jsx)(S.a,{children:Object(n.jsxs)(P.c,{children:[Object(n.jsx)(P.a,{path:"/policy",children:Object(n.jsx)(Q,{})}),Object(n.jsxs)(P.a,{children:[Object(n.jsx)(z,{}),Object(n.jsx)(P.a,{exact:!0,path:"/",children:Object(n.jsx)(A,{})}),Object(n.jsx)(P.a,{exact:!0,path:"/step2",children:Object(n.jsx)(i.Suspense,{fallback:Object(n.jsx)(re,{}),children:Object(n.jsx)(ce,{})})}),Object(n.jsx)(J,{}),Object(n.jsx)(ae,{})]})]})})},oe=function(e){e&&e instanceof Function&&a.e(4).then(a.bind(null,67)).then((function(t){var a=t.getCLS,n=t.getFID,i=t.getFCP,r=t.getLCP,c=t.getTTFB;a(e),n(e),i(e),r(e),c(e)}))};s.a.render(Object(n.jsx)(r.a.StrictMode,{children:Object(n.jsx)(se,{})}),document.getElementById("root")),oe()},7:function(e,t,a){"use strict";var n=a(0);a(1);t.a=function(e){var t,a=null!==(t=e.className)&&void 0!==t?t:"";return Object(n.jsx)("i",{className:"".concat(e.icon," ").concat(a),title:e.title})}}},[[64,1,2]]]);
//# sourceMappingURL=main.2240fa58.chunk.js.map