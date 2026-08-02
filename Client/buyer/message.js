import { addmessage } from "../utility/addmessage.js"
import { addchat } from '../utility/addchat.js';
const chatmapping = new Map();
const chatgrid = document.querySelector('.chat-grid');
const chatmodal = document.querySelector('.overlay');
// `io` is provided globally by the Socket.IO CDN script in message.html.
// (A bare `import ... from "socket.io-client"` fails in the browser with no
//  bundler/import map, which previously broke this whole module.)

let counter = 1;
let buyerid = null;

let socket = null;

function initSocket() {
    if (socket) return;

    // Assign to the outer `socket` (no `const`) so the click handler below can
    // reuse the same connection; otherwise it stayed null and "continue chat"
    // threw when calling socket.emit('join-room', ...).
    socket = io(window.SOCKET_URL, {
        withCredentials: true
    });

    socket.emit("register", buyerid);

    socket.on("initial-messages", (data) => {
        const list = document.querySelector('#messages');
        list.replaceChildren();
        if (!list) return;
        for (let message of data) {
            let type = "received";
            if (message.sender == buyerid) {
                type = "sent";
            }
            const newmessage = addmessage(message.message, type);
            list.appendChild(newmessage);
        }
    })

    socket.on("message-received", (sender, data) => {
        const list = document.querySelector('#messages');
        if (!list) return;

        let type = "received";
        console.log(buyerid);
        if (sender == buyerid) {
            type = "sent";
        }
        const newmessage = addmessage(data, type);
        list.appendChild(newmessage);
    });
}

document.addEventListener('DOMContentLoaded', (ev) => {
    axios.get('/buyer/dashboard/message/get').then(({ data }) => {
        console.log(data);
        console.log("hello0");
        if (data.auth === false) {
            window.location.href = 'login.html';
            return;
        }
        buyerid = data.buyerid;
        for (let message of data.rows) {
            const sender = message.sender;
            const receiver = message.receiver;
            const property = message.property;
            const messages = message.message;
            let seller = null;
            if (sender != buyerid) {
                seller = sender;
            }
            else if (receiver != buyerid) {
                seller = receiver;
            }
            const chatkey = [sender, receiver, property].sort().join('_');
            if (!chatmapping.get(chatkey)) {
                chatmapping.set(chatkey, counter++);
                document.querySelector('.chat-grid').appendChild(addchat(seller, property, messages));
            }
            else {
                const chatgrid = document.querySelector('.chat-grid');
                console.log(chatkey);
                const arr = chatgrid.getElementsByClassName(seller);
                console.log(arr);
                for (let item of arr) {
                    console.log(item);
                    const par = item.parentElement;
                    const prop = par.querySelector('h3');
                    if (prop.id == property) {
                        par.querySelector('span').innerText = 'Last Message:' + messages;
                        break;
                    }
                }
            }
        }
        initSocket();
    }).catch((err) => {
        console.log(err.message)
    })
})


chatgrid.addEventListener('click', (ev) => {
    const btn = ev.target.closest('button');
    if (!btn) return;
    console.log("hu");
    if (btn.classList.contains('continue-btn')) {
        chatmodal.classList.add('active');
        const property = btn.parentElement.querySelector('h3').id;
        const seller = btn.parentElement.querySelector('p').classList[0];
        socket.emit('join-room', buyerid, seller, property);
    }
})




