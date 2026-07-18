export class Input {
  constructor() {
    this.move = {x:0,y:0};
    this.actions = {shot:false,kick:false,dash:false,guard:false};
    this.pressed = {shot:false,kick:false,dash:false,guard:false};
    this.keys = new Set();
    addEventListener('keydown',e=>{this.keys.add(e.key.toLowerCase());});
    addEventListener('keyup',e=>{this.keys.delete(e.key.toLowerCase());});
    this.setupStick();
    this.setupButtons();
  }

  setupButtons() {
    document.querySelectorAll('button[data-action]').forEach(btn=>{
      const a=btn.dataset.action;
      const down=e=>{e.preventDefault(); if(!this.actions[a]) this.pressed[a]=true; this.actions[a]=true;};
      const up=e=>{e.preventDefault(); this.actions[a]=false;};
      btn.addEventListener('pointerdown',down);
      btn.addEventListener('pointerup',up);
      btn.addEventListener('pointercancel',up);
      btn.addEventListener('pointerleave',up);
    });
  }

  setupStick() {
    const base=document.getElementById('stick-base');
    const knob=document.getElementById('stick-knob');
    let active=false;
    const update=e=>{
      const r=base.getBoundingClientRect();
      const cx=r.left+r.width/2, cy=r.top+r.height/2;
      let dx=e.clientX-cx, dy=e.clientY-cy;
      const max=r.width*.34;
      const len=Math.hypot(dx,dy)||1;
      if(len>max){dx=dx/len*max;dy=dy/len*max;}
      this.move.x=dx/max; this.move.y=dy/max;
      knob.style.transform=`translate(${dx}px,${dy}px)`;
    };
    base.addEventListener('pointerdown',e=>{active=true;base.setPointerCapture(e.pointerId);update(e);});
    base.addEventListener('pointermove',e=>{if(active)update(e);});
    const end=()=>{active=false;this.move.x=this.move.y=0;knob.style.transform='translate(0,0)';};
    base.addEventListener('pointerup',end);base.addEventListener('pointercancel',end);
  }

  poll() {
    let x=this.move.x,y=this.move.y;
    if(this.keys.has('arrowleft')||this.keys.has('a'))x=-1;
    if(this.keys.has('arrowright')||this.keys.has('d'))x=1;
    if(this.keys.has('arrowup')||this.keys.has('w'))y=-1;
    if(this.keys.has('arrowdown')||this.keys.has('s'))y=1;
    const map={j:'shot',k:'kick',l:'dash',i:'guard'};
    for(const [key,a] of Object.entries(map)){
      const held=this.keys.has(key);
      if(held&&!this.actions[a])this.pressed[a]=true;
      this.actions[a]=held||this.actions[a];
    }
    const len=Math.hypot(x,y); if(len>1){x/=len;y/=len;}
    return {move:{x,y}, actions:{...this.actions}, pressed:{...this.pressed}};
  }

  endFrame() {
    for(const a in this.pressed)this.pressed[a]=false;
    for(const [key,a] of Object.entries({j:'shot',k:'kick',l:'dash',i:'guard'})){
      if(!this.keys.has(key) && !document.querySelector(`button[data-action="${a}"]:active`)) this.actions[a]=false;
    }
  }
}
