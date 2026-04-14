export const getElem = (id:string):HTMLElement => {
  const  elem  = document.getElementById(id);
  if    (elem === null) throw new Error(`cannot find elem "${id}"`);
  return elem;
}

