import {CFG} from './config.js';

export function makeFighter(x,y,color,isEnemy=false){
  return {
    x,y,vx:0,vy:0,color,isEnemy,hp:CFG.fighter.maxHp,
    facing:isEnemy?-1:1,state:'idle',time:0,cool:{shot:0,kick:0,dash:0},
    guardTime:99,invincible:0,fallTimer:0,hoverSeed:Math.random()*10,
    kickActive:false,dashHit:false,dashDir:{x:0,y:0},dashStart:{x,y}
  };
}

export function makeShot(owner,x,y,dir,mode){
  let speed=CFG.shot.speed;
  if(mode==='forward')speed=CFG.shot.forwardStartSpeed;
  if(mode==='backward')speed=CFG.shot.backwardStartSpeed;
  return {owner,x,y,vx:dir.x*speed,vy:dir.y*speed,mode,speed,life:CFG.shot.life,r:CFG.shot.radius,reflected:false};
}
