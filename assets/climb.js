/* The climb: the light blooms into the chosen door, then the next screen opens. Works without this file: every door is a plain link. */
(function(){
  var vest=document.getElementById('vest'),bloom=document.getElementById('vbloom');
  if(!vest||!bloom)return;
  var calm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function go(a,e){
    if(calm||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    var id=a.getAttribute('data-door'),d=id&&document.getElementById(id);
    if(!d)return;
    e.preventDefault();
    var v=vest.getBoundingClientRect(),r=d.getBoundingClientRect();
    bloom.style.left=((r.left+r.width/2-v.left)/v.width*100)+'%';
    bloom.style.top=((r.top+r.height*.55-v.top)/v.height*100)+'%';
    vest.classList.add('opening');
    setTimeout(function(){location.assign(a.href)},950);
  }
  [].forEach.call(document.querySelectorAll('a.dl, a.vdoor'),function(a){
    if(a.classList.contains('vdoor'))a.setAttribute('data-door',a.id);
    a.addEventListener('click',function(e){go(a,e)});
  });
  window.addEventListener('pageshow',function(e){if(e.persisted)vest.classList.remove('opening')});
})();
