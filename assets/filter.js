(function(){
  var q=document.getElementById('q'),count=document.getElementById('count');
  if(!q)return;
  var items=[].slice.call(document.querySelectorAll('li.item')),total=items.length;
  function apply(t){
    t=(t||'').trim().toLowerCase();var n=0;
    items.forEach(function(li){var show=!t||li.textContent.toLowerCase().indexOf(t)>-1;li.hidden=!show;if(show)n++;});
    if(count)count.textContent=t?(n+' of '+total+' decodes'):(total+' decodes on this site');
  }
  q.addEventListener('input',function(){apply(q.value)});
  var m=location.search.match(/[?&]q=([^&]*)/);
  if(m){try{q.value=decodeURIComponent(m[1].replace(/\+/g,' '))}catch(e){q.value=m[1]}apply(q.value)}
})();
