async(shared)=>{
const c=await shared.context().browser().newContext({viewport:{width:360,height:800},isMobile:true,hasTouch:true}),p=await c.newPage(),errors=[];
try{
 await p.route('https://vlibras.gov.br/**',r=>r.fulfill({contentType:'application/javascript',body:''}));
 p.on('pageerror',e=>errors.push(String(e)));
 await p.goto('http://127.0.0.1:8080/index.html',{waitUntil:'domcontentloaded'});
 await p.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
 await p.locator('#instagram').scrollIntoViewIfNeeded();await p.waitForTimeout(6000);
 const details=await p.evaluate(()=>{const t=document.querySelector('#instagram [data-carrossel-trilha]'),f=t.querySelector('iframe');return {scroll:t.scrollLeft,ancho:t.clientWidth,contenido:t.scrollWidth,frame:f?{src:f.src,rect:{x:f.getBoundingClientRect().x,y:f.getBoundingClientRect().y,width:f.getBoundingClientRect().width,height:f.getBoundingClientRect().height}}:null,arrows:[...document.querySelectorAll('#instagram .carrossel-seta')].map(e=>({hidden:e.hidden,display:getComputedStyle(e).display}))};});
 const iframe=p.locator('#instagram iframe').first();
 if(!await iframe.count())return {details,errors,swipe:false,reason:'Iframe ainda não foi montado'};
 await iframe.scrollIntoViewIfNeeded();await p.waitForTimeout(200);
 const box=await iframe.boundingBox(),y=Math.max(110,Math.min(650,box.y+120)),start=Math.min(310,box.x+box.width-35),end=Math.max(30,box.x+35);
 const before=await p.locator('#instagram [data-carrossel-trilha]').evaluate(e=>e.scrollLeft);
 const cdp=await c.newCDPSession(p);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:start,y,radiusX:3,radiusY:3}]});
 for(let i=1;i<=12;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start+(end-start)*i/12,y,radiusX:3,radiusY:3}]});await p.waitForTimeout(20);}
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(500);
 const after=await p.locator('#instagram [data-carrossel-trilha]').evaluate(e=>e.scrollLeft);
 const frameStatus=await iframe.evaluate(e=>({loaded:e.parentElement.className,documentTitle:e.title}));
 return {details,gesture:{start,end,y,before,after,delta:after-before,startsInsideIframe:start>=box.x&&start<=box.x+box.width&&y>=box.y&&y<=box.y+box.height},frameStatus,frames:p.frames().map(f=>f.url()),errors,swipe:after-before>40};
}finally{await c.close();}
}
