(function(){
  var q=document.getElementById('q'),count=document.getElementById('count');
  if(!q)return;
  var items=[].slice.call(document.querySelectorAll('li.item'));
  var total=items.reduce(function(n,li){return n+1+li.querySelectorAll('li.version').length;},0);
  function apply(t){
    t=(t||'').trim().toLowerCase();var n=0;
    items.forEach(function(li){
      var show=!t||li.textContent.toLowerCase().indexOf(t)>-1;
      li.hidden=!show;
      if(show) n+=1+li.querySelectorAll('li.version').length;
    });
    if(count)count.textContent=t?(n+' of '+total+' decodes'):(total+' decodes on this site');
    var nm=document.getElementById('nomatch'),ax=document.getElementById('ask-x');
    if(nm){nm.hidden=!(t&&n===0);if(ax&&t)ax.href='https://x.com/intent/post?text='+encodeURIComponent('@IAO_AntiChrist Please decode '+q.value.trim());}
  }
  q.addEventListener('input',function(){apply(q.value)});
  var m=location.search.match(/[?&]q=([^&]*)/);
  if(m){try{q.value=decodeURIComponent(m[1].replace(/\+/g,' '))}catch(e){q.value=m[1]}apply(q.value)}
})();
