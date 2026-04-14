import { genElem } from "./genElem";

interface HTMLSectionElement extends HTMLElement{};


export const makeBox = (titleText:string, parentElement:HTMLSectionElement, innerElementType:string, hide:boolean=false):HTMLElement=>{
  const container = genElem("div"           , {id        :titleText                                  }); parentElement.appendChild(container);
  const titleElem = genElem("h2"            , {innerText :titleText                                  });     container.appendChild(titleElem);
  const innerElem = genElem(innerElementType, {spellcheck:false    ,classList:hide?"hidden":"visible"});     container.appendChild(innerElem);
  const toggler   = genElem("button"        , {innerText :"▼"      ,classList:"closer"               });     container.appendChild(toggler  ); 

  toggler.addEventListener("click", ()=>{ innerElem.classList.toggle("hidden"); innerElem.classList.toggle("visible") });
  container.classList.add("box");
  return innerElem;
}
