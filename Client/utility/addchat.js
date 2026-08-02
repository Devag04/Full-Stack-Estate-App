export function addchat(seller,property,message){
    const card=document.createElement('div');
    card.classList.add('chat-card');
    const info=document.createElement('chat-info');
    info.classList.add('chat-info');
    const h3=document.createElement('h3');
    h3.id=property;
    h3.innerText=property;
    const p=document.createElement('p');
    p.className=seller;
    p.innerText=seller;
    const span=document.createElement('span');
    span.classList.add('last-message');
    span.innerText='Last-message:'+message;
    info.appendChild(h3);
    info.appendChild(p);
    info.appendChild(span);
    card.appendChild(info);
    const button=document.createElement('button');
    button.classList.add('continue-btn');
    button.innerText='Continue Chat';
    info.appendChild(button);
    return card;
}