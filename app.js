(() => {
  'use strict';
  const places = {
    library: { name: 'Knowledge Centre', description: 'A quiet corner for big ideas.', category: 'THINK / CREATE', symbol: '⌑' },
    tech: { name: 'Technology Tower', description: 'Where your next big project begins.', category: 'BUILD / INNOVATE', symbol: '⌘' },
    food: { name: 'Campus Commons', description: 'Good conversations start with a break.', category: 'MEET / RECHARGE', symbol: '◈' },
    gate: { name: 'Main Gate', description: 'Every amazing story starts somewhere.', category: 'ARRIVE / BEGIN', symbol: '↗' },
    innovation: { name: 'Innovation Hub', description: 'A playground for what comes next.', category: 'DREAM / EXPERIMENT', symbol: '✳' }
  };
  let selected = 'library';
  let toastTimer;
  const $ = id => document.getElementById(id);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollOptions = { behavior: reduceMotion ? 'instant' : 'smooth', block: 'start' };
  function toast(message) {
    const el = $('toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3100);
  }
  function selectPlace(id, shouldScroll = false) {
    if (!places[id]) return;
    selected = id;
    $('spotlightTitle').textContent = places[id].name;
    $('spotlightDescription').textContent = places[id].description;
    document.querySelectorAll('[data-place]').forEach(el => {
      el.classList.toggle('is-selected', el.dataset.place === id && el.classList.contains('space-card'));
      el.classList.toggle('is-active', el.dataset.place === id && el.classList.contains('map-marker'));
    });
    $('sceneState').textContent = 'FOCUS / ' + String(Object.keys(places).indexOf(id) + 1).padStart(2,'0');
    document.dispatchEvent(new CustomEvent('vitverse:select', { detail: { id } }));
    if (shouldScroll) $('explore').scrollIntoView(scrollOptions);
  }
  window.VITVERSE = { places, getSelected: () => selected, selectPlace, toast };
  document.querySelectorAll('[data-place]').forEach(el => {
    el.addEventListener('click', () => selectPlace(el.dataset.place, el.classList.contains('space-card')));
  });
  $('startExploring').addEventListener('click', () => {
    selectPlace('innovation');
    toast('Explore the model: drag to orbit, scroll to zoom, and select markers.');
  });
  $('spotlightRoute').addEventListener('click', () => {
    $('routeTo').value = selected;
    if ($('routeFrom').value === selected) $('routeFrom').value = selected === 'gate' ? 'library' : 'gate';
    $('routes').scrollIntoView(scrollOptions);
    toast(`${places[selected].name} added as your destination.`);
  });
  $('routeForm').addEventListener('submit', event => {
    event.preventDefault();
    const from = $('routeFrom').value, to = $('routeTo').value;
    if (from === to) {
      $('routeResult').textContent = 'Choose two different locations for your journey.';
      toast('Choose two different locations.');
      return;
    }
    $('routeResult').textContent = `${places[from].name} → ${places[to].name} · Illustrative 3D route generated.`;
    document.dispatchEvent(new CustomEvent('vitverse:route', { detail: { from, to } }));
    $('sceneState').textContent = 'ROUTE VISUALIZATION';
    selectPlace(to);
    $('sceneState').textContent = 'ROUTE VISUALIZATION';
    $('explore').scrollIntoView(scrollOptions);
    toast('Your concept journey is glowing on the map.');
  });
  $('swapRoute').addEventListener('click', () => {
    const a = $('routeFrom').value;
    $('routeFrom').value = $('routeTo').value;
    $('routeTo').value = a;
  });
  function tickClock() {
    $('liveTime').textContent = new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour:'2-digit',minute:'2-digit',hour12:false }).format(new Date());
  }
  tickClock();
  setInterval(tickClock, 30000);
  const menu = $('mobileNav');
  $('menuToggle').addEventListener('click', () => {
    const nowOpen = menu.hasAttribute('hidden');
    if(nowOpen) menu.removeAttribute('hidden'); else menu.setAttribute('hidden','');
    $('menuToggle').setAttribute('aria-expanded', String(nowOpen));
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.setAttribute('hidden',''); $('menuToggle').setAttribute('aria-expanded','false');
  }));
  const dialog = $('searchDialog'), input = $('searchInput'), searchResults = $('searchResults');
  function search(query = '') {
    const q = query.trim().toLowerCase();
    searchResults.replaceChildren();
    let n = 0;
    Object.entries(places).forEach(([id, place]) => {
      if(!(place.name.toLowerCase().includes(q) || place.category.toLowerCase().includes(q))) return;
      n++;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'search-item';
      btn.innerHTML = `<span class="search-item-icon">${place.symbol}</span><span><strong>${place.name}</strong><small>${place.category}</small></span><span>↗</span>`;
      btn.addEventListener('click', () => { dialog.close();selectPlace(id,true); });
      searchResults.appendChild(btn);
    });
    if (!n) {const empty = document.createElement('div');empty.className='search-empty';empty.textContent='No matches. Try “library”, “technology”, or “food”.';searchResults.appendChild(empty);}
  }
  function openSearch(){search(''); input.value='';dialog.showModal();input.focus();}
  $('openSearch').addEventListener('click',openSearch);
  $('closeSearch').addEventListener('click',()=>dialog.close());
  input.addEventListener('input',()=>search(input.value));
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  input.addEventListener('keydown', e => {if(e.key==='Enter'){const first=searchResults.querySelector('.search-item');if(first) first.click();}});
  window.addEventListener('keydown', e=>{
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {e.preventDefault();dialog.open ? dialog.close() : openSearch();}
    if (e.key === '/' && !(document.activeElement instanceof HTMLInputElement) && !(document.activeElement instanceof HTMLTextAreaElement)) {e.preventDefault();openSearch();}
  });
  document.querySelectorAll('.event-tab').forEach(tab=>tab.addEventListener('click',()=>{
    const filter=tab.dataset.filter;
    document.querySelectorAll('.event-tab').forEach(t=>{t.classList.toggle('active',t===tab);t.setAttribute('aria-pressed',String(t===tab));});
    document.querySelectorAll('.event-card').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.category!==filter;});
  }));
  document.querySelectorAll('.save-btn').forEach((btn,index)=>{
    let isSaved=false;
    try { isSaved=localStorage.getItem(`vitverse-save-${index}`)==='yes'; }catch(e){}
    const update=()=>{btn.setAttribute('aria-pressed',String(isSaved));btn.textContent=isSaved?'✓ Idea saved':'+ Save idea';};
    update();
    btn.addEventListener('click',()=>{isSaved=!isSaved;update();try{localStorage.setItem(`vitverse-save-${index}`,isSaved?'yes':'no');}catch(e){}toast(isSaved?'Idea saved in this browser.':'Idea removed from saved items.');});
  });
  const sections = ['explore','spaces','routes','happenings'].map($);
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      const e=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!e)return;
      document.querySelectorAll('.desktop-nav .nav-link').forEach(link=>{
        const active=link.getAttribute('href')==='#'+e.target.id;
        link.classList.toggle('active',active);
        let pip=link.querySelector('.nav-pip');
        if(active&&!pip){pip=document.createElement('span');pip.className='nav-pip';link.appendChild(pip);}
        if(!active&&pip)pip.remove();
      });
    },{rootMargin:'-20% 0px -55% 0px',threshold:[0,.15,.4]});
    sections.forEach(el=>observer.observe(el));
  }
})();
