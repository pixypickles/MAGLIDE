import {Input} from './input.js';
import {Game} from './game.js';
import {Renderer} from './render.js';

const canvas=document.getElementById('game');
const input=new Input(), game=new Game(), renderer=new Renderer(canvas);
let last=performance.now();

function frame(now){
  const dt=Math.min(.033,(now-last)/1000);last=now;
  const state=input.poll();
  game.update(dt,state);
  renderer.draw(game);
  input.endFrame();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
