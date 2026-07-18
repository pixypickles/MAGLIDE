import {Input} from './input.js';
import {Game} from './game.js';
import {Renderer} from './render.js';

const canvas=document.getElementById('game');

function showError(error){
  console.error(error);
  const box=document.createElement('div');
  box.style.cssText='position:fixed;left:12px;right:12px;top:90px;padding:14px;background:#8b1020;color:#fff;border:2px solid #fff;border-radius:10px;z-index:9999;font:14px system-ui';
  box.textContent='ゲームの読み込みに失敗しました: '+(error?.message||error);
  document.body.appendChild(box);
}

try{
  const input=new Input();
  const game=new Game();
  const renderer=new Renderer(canvas);
  let last=performance.now();

  function frame(now){
    try{
      const dt=Math.min(.033,(now-last)/1000);last=now;
      const state=input.poll();
      game.update(dt,state);
      renderer.draw(game);
      input.endFrame();
      requestAnimationFrame(frame);
    }catch(error){showError(error);}
  }
  requestAnimationFrame(frame);
}catch(error){showError(error);}
