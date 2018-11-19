var cache;
export function bodyNoScroll(val){
  if(val){
    cache=document.body.scrollTop||document.documentElement.scrollTop;
    document.body.style.top = -cache+'px'
    document.body.style.position = 'fixed'
  }else{
    document.body.style.position = ''
    document.body.scrollTop=cache
    document.documentElement.scrollTop=cache
  }

}
