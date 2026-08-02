export function addmessage(data,type){
    const newmessage=document.createElement('li');
    newmessage.innerText=data;
    newmessage.classList.add('message');
    if(type==="received"){
        newmessage.classList.add('incoming');
    }
    else if(type==="sent"){
        newmessage.classList.add('outgoing');
    }

    return newmessage;
}