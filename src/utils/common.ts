const toZero: (n:number)=>string = (n) => {
  return n.toString().padStart(2, '0')
}


export {
  toZero
}