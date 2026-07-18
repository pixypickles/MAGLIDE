import {CFG} from './config.js';
import {makeFighter,makeShot} from './entities.js';

export class Game {
  constructor(){
    this.p1=makeFighter(260,270,'#2988ff');
    this.p2=makeFighter(700,270,'#e74757',true);
    this.shots=[]; this.effects=[]; this.time=0;
  }

  update(dt,input){
    this.time+=dt;
    this.updateFighter(this.p1,dt,input,this.p2);
    this.updateAI(this.p2,dt,this.p1);
    this.updateShots(dt);
    this.effects=this.effects.filter(e=>(e.life-=dt)>0);
    document.getElementById('p1hp').style.width=`${this.p1.hp}%`;
    document.getElementById('p2hp').style.width=`${this.p2.hp}%`;
  }

  updateFighter(f,dt,input,target){
    for(const k in f.cool)f.cool[k]=Math.max(0,f.cool[k]-dt);
    f.invincible=Math.max(0,f.invincible-dt);
    f.guardTime=input.actions.guard?f.guardTime+dt:99;
    if(input.pressed.guard)f.guardTime=0;
    f.facing=target.x>=f.x?1:-1;

    if(f.state==='fall'){
      f.y+=CFG.fighter.recoverRiseSpeed*dt;
      f.fallTimer-=dt;
      if(f.fallTimer<=0){f.y=CFG.world.height+35;f.state='rise';}
      return;
    }
    if(f.state==='rise'){
      f.y-=CFG.fighter.recoverRiseSpeed*dt;
      if(f.y<=270){f.y=270;f.state='idle';f.invincible=CFG.hit.invincibleTime;}
      return;
    }
    if(f.state==='dash'){this.updateDash(f,dt,target);return;}
    if(f.state==='kick'){f.time-=dt;if(f.time<=0){f.state='idle';f.kickActive=false;}return;}

    const m=input.move;
    f.x+=m.x*CFG.fighter.moveSpeed*dt;
    f.y+=m.y*CFG.fighter.moveSpeed*dt;
    f.x=Math.max(CFG.world.margin,Math.min(CFG.world.width-CFG.world.margin,f.x));
    f.y=Math.max(80,Math.min(CFG.world.height-65,f.y));

    if(input.pressed.shot&&f.cool.shot<=0)this.fire(f,target,m);
    if(input.pressed.kick&&f.cool.kick<=0)this.kick(f,target);
    if(input.pressed.dash&&f.cool.dash<=0)this.startDash(f,m);
  }

  updateAI(f,dt,target){
    const dx=target.x-f.x,dy=target.y-f.y;
    const dist=Math.hypot(dx,dy);
    const move={x:0,y:0};
    if(dist>300){move.x=Math.sign(dx)*.65;move.y=Math.sign(dy)*.25;}
    if(dist<150){move.x=-Math.sign(dx)*.5;}
    const input={move,actions:{guard:false},pressed:{shot:false,kick:false,dash:false,guard:false}};
    const r=Math.random();
    if(r<dt*.65)input.pressed.shot=true;
    if(dist<105&&r<dt*1.6)input.pressed.kick=true;
    if(r<dt*.22)input.pressed.dash=true;
    if(this.shots.some(s=>s.owner!==f&&Math.hypot(s.x-f.x,s.y-f.y)<120)&&r<dt*4){
      input.pressed.guard=true;input.actions.guard=true;
    }
    this.updateFighter(f,dt,input,target);
  }

  fire(f,target,m){
    f.cool.shot=CFG.shot.cool;
    let mode='normal';
    if(Math.abs(m.x)>Math.abs(m.y)&&m.x*f.facing>0.35)mode='forward';
    else if(Math.abs(m.x)>Math.abs(m.y)&&m.x*f.facing<-0.35)mode='backward';
    const sx=f.x+(Math.abs(m.y)>.55?0:f.facing*26);
    const sy=f.y+(m.y<-.55?-30:m.y>.55?30:0);
    const dx=target.x-sx,dy=target.y-sy,l=Math.hypot(dx,dy)||1;
    this.shots.push(makeShot(f,sx,sy,{x:dx/l,y:dy/l},mode));
  }

  kick(f,target){
    f.cool.kick=CFG.kick.cooldown;f.state='kick';f.time=CFG.kick.duration;f.kickActive=true;
    const dx=target.x-f.x,dy=target.y-f.y;
    if(Math.abs(dx)<CFG.kick.range&&Math.abs(dy)<75){
      this.damage(target,CFG.kick.damage,CFG.hit.heavyDrop,f);
      this.effects.push({type:'kick',x:f.x+f.facing*35,y:f.y-8,dir:f.facing,life:.24,max:.24});
    }
  }

  startDash(f,m){
    let x=m.x,y=m.y;
    if(Math.hypot(x,y)<.25){x=f.facing;y=0;}
    if(Math.abs(x)>Math.abs(y)){x=Math.sign(x);y=0;}else{x=0;y=Math.sign(y);}
    f.cool.dash=CFG.dash.cooldown;f.state='dash';f.time=CFG.dash.duration;
    f.dashDir={x,y};f.dashStart={x:f.x,y:f.y};f.dashHit=false;
  }

  updateDash(f,dt,target){
    f.time-=dt;
    const p=1-f.time/CFG.dash.duration;
    const d=f.dashDir;
    let ox=0,oy=0;
    if(d.x!==0){ox=d.x*CFG.dash.speed*CFG.dash.duration*p;oy=Math.sin(p*Math.PI*2)*38;}
    else{oy=d.y*CFG.dash.speed*CFG.dash.duration*p;ox=Math.sin(p*Math.PI)*90*(d.y<0?1:-1);}
    f.x=f.dashStart.x+ox;f.y=f.dashStart.y+oy;
    this.effects.push({type:'trail',x:f.x,y:f.y,color:f.color,life:.15,max:.15});
    if(!f.dashHit&&Math.hypot(f.x-target.x,f.y-target.y)<CFG.dash.radius+25){
      f.dashHit=true;this.damage(target,CFG.dash.damage,CFG.hit.lightDrop,f);
    }
    if(f.time<=0){f.state='idle';f.x=Math.max(40,Math.min(920,f.x));f.y=Math.max(70,Math.min(475,f.y));}
  }

  updateShots(dt){
    for(const s of this.shots){
      const target=s.owner===this.p1?this.p2:this.p1;
      const dx=target.x-s.x,dy=target.y-s.y,l=Math.hypot(dx,dy)||1;
      const desiredX=dx/l,desiredY=dy/l;
      s.vx+=desiredX*80*dt;s.vy+=desiredY*80*dt;
      if(s.mode==='forward')s.speed=Math.max(CFG.shot.speed,s.speed-CFG.shot.acceleration*dt);
      if(s.mode==='backward')s.speed=Math.min(CFG.shot.speed,s.speed+CFG.shot.acceleration*dt);
      const vl=Math.hypot(s.vx,s.vy)||1;s.vx=s.vx/vl*s.speed;s.vy=s.vy/vl*s.speed;
      s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;
      if(Math.hypot(s.x-target.x,s.y-target.y)<s.r+CFG.fighter.radius){
        if(target.guardTime<=CFG.guard.justWindow){
          s.owner=target;s.reflected=true;s.speed=CFG.guard.reflectSpeed;s.vx*=-1;s.vy*=-1;s.life=1.5;
          this.effects.push({type:'guard',x:target.x,y:target.y,life:.25,max:.25});
        }else{
          const dmg=target.guardTime<99?CFG.shot.damage*CFG.guard.damageScale:CFG.shot.damage;
          this.damage(target,dmg,CFG.hit.lightDrop,s.owner);s.life=0;
        }
      }
    }
    this.shots=this.shots.filter(s=>s.life>0&&s.x>-40&&s.x<1000&&s.y>-40&&s.y<580);
  }

  damage(target,amount,drop,source){
    if(target.invincible>0)return;
    target.hp=Math.max(0,target.hp-amount);target.y+=drop;
    this.effects.push({type:'hit',x:target.x,y:target.y,life:.2,max:.2});
    if(amount>=20||target.y>CFG.world.height-CFG.hit.fallOutThreshold){
      target.state='fall';target.fallTimer=CFG.hit.respawnDelay;target.y=CFG.world.height+10;
    }
    if(target.hp<=0){target.hp=CFG.fighter.maxHp;target.x=target.isEnemy?700:260;target.y=270;target.state='idle';}
  }
}
