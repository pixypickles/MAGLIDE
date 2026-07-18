import {CFG} from './config.js';

export class Renderer{
  constructor(canvas){this.c=canvas;this.x=canvas.getContext('2d');}
  draw(game){
    const c=this.x;c.clearRect(0,0,this.c.width,this.c.height);
    this.bg(c);
    for(const e of game.effects)this.effect(c,e);
    for(const s of game.shots)this.shot(c,s);
    this.fighter(c,game.p1,game.time);
    this.fighter(c,game.p2,game.time);
  }
  bg(c){
    c.save();c.strokeStyle='#6eb7ff18';c.lineWidth=1;
    for(let x=0;x<960;x+=48){c.beginPath();c.moveTo(x,0);c.lineTo(x,540);c.stroke();}
    for(let y=0;y<540;y+=48){c.beginPath();c.moveTo(0,y);c.lineTo(960,y);c.stroke();}
    c.restore();
  }
  fighter(c,f,t){
    if(f.state==='fall')return;
    const hover=f.state==='idle'?Math.sin(t*CFG.fighter.hoverSpeed+f.hoverSeed)*CFG.fighter.hoverAmplitude:0;
    c.save();c.translate(f.x,f.y+hover);c.scale(f.facing,1);
    if(f.state==='dash')c.rotate(-f.dashDir.y*.65);
    if(f.state==='kick')c.rotate(-.08);
    c.lineCap='round';c.lineJoin='round';c.lineWidth=6;c.strokeStyle='#07101d';
    c.fillStyle=f.color;
    c.beginPath();c.arc(0,-24,17,0,Math.PI*2);c.fill();c.stroke();
    c.fillStyle='#f3bf91';c.beginPath();c.arc(0,-20,13,0,Math.PI*2);c.fill();
    c.fillStyle='#10151f';c.beginPath();c.arc(-3,-28,14,Math.PI,Math.PI*2);c.fill();
    c.strokeStyle=f.color;c.lineWidth=5;c.beginPath();c.moveTo(-14,-28);c.lineTo(14,-28);c.stroke();
    c.strokeStyle='#07101d';c.fillStyle='#eef5ff';c.lineWidth=6;
    c.beginPath();c.roundRect(-17,-8,34,38,8);c.fill();c.stroke();
    c.strokeStyle=f.color;c.lineWidth=5;c.beginPath();c.moveTo(0,-5);c.lineTo(0,27);c.stroke();
    c.strokeStyle='#07101d';c.lineWidth=7;
    if(f.state==='kick'){
      c.beginPath();c.moveTo(-8,25);c.lineTo(-13,43);c.stroke();
      c.beginPath();c.moveTo(8,25);c.lineTo(28,-30);c.stroke();
      c.fillStyle='#dff8ff';c.shadowColor='#52cfff';c.shadowBlur=18;c.beginPath();c.arc(30,-34,9,0,Math.PI*2);c.fill();
      c.shadowBlur=0;c.strokeStyle='#65cfff';c.lineWidth=7;c.beginPath();c.arc(4,5,52,-1.3,.55);c.stroke();
    }else{
      c.beginPath();c.moveTo(-8,25);c.lineTo(-13,38);c.stroke();
      c.beginPath();c.moveTo(8,25);c.lineTo(15,34);c.stroke();
    }
    c.beginPath();c.moveTo(-15,1);c.lineTo(-25,14);c.stroke();
    c.beginPath();c.moveTo(15,1);c.lineTo(24,10);c.stroke();
    c.fillStyle='#111';c.beginPath();c.arc(-5,-20,2,0,7);c.arc(5,-20,2,0,7);c.fill();
    if(f.guardTime<99){c.strokeStyle='#8dffac';c.lineWidth=5;c.beginPath();c.arc(0,0,34,0,Math.PI*2);c.stroke();}
    c.restore();
  }
  shot(c,s){
    c.save();c.translate(s.x,s.y);c.fillStyle=s.owner.color;c.shadowColor=s.owner.color;c.shadowBlur=16;c.beginPath();c.arc(0,0,s.r,0,7);c.fill();c.shadowBlur=0;c.strokeStyle='#e8fbff';c.lineWidth=3;c.stroke();c.restore();
  }
  effect(c,e){
    const a=e.life/e.max;c.save();c.globalAlpha=a;c.translate(e.x,e.y);
    if(e.type==='trail'){c.fillStyle=e.color;c.beginPath();c.arc(0,0,32*(1-a)+10,0,7);c.fill();}
    if(e.type==='hit'){c.strokeStyle='#fff';c.lineWidth=5;for(let i=0;i<8;i++){c.rotate(Math.PI/4);c.beginPath();c.moveTo(8,0);c.lineTo(30,0);c.stroke();}}
    if(e.type==='guard'){c.strokeStyle='#8dffac';c.lineWidth=8;c.beginPath();c.arc(0,0,42*(1.2-a*.2),0,7);c.stroke();}
    if(e.type==='kick'){c.scale(e.dir,1);c.strokeStyle='#75d8ff';c.lineWidth=10;c.beginPath();c.arc(0,0,55,-1.25,.55);c.stroke();}
    c.restore();
  }
}
