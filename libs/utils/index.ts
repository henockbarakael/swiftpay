export const isObjectsEqual =(obj1: unknown, obj2:unknown):boolean=>{
    let  isEqual = false;
    const obj1Keys = Object.keys(obj1).sort();
    const obj2Keys = Object.keys(obj2).sort();
    if (obj1Keys.length !== obj2Keys.length) {
     return isEqual
    } else {
    const areEqual = obj1Keys.every((key, index) => {
        const objValue1 = obj1[key];
        const objValue2 = obj2[obj2Keys[index]];
        return objValue1 === objValue2;
    });
    if (areEqual) {
         isEqual = true;
       return isEqual
    } else {
        return isEqual
    }
}
}