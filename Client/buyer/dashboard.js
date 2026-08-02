import { addProperty } from "../utility/addprop.js"
import { addmessage } from "../utility/addmessage.js"

let socket = null;

function initSocket() {
    if (socket) return;

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

const grid = document.querySelector('.properties-grid');
const proplocation = document.querySelector('#proplocation');
const proptype = document.querySelector('#proptype');
const minprice = document.querySelector('#minprice');
const maxprice = document.querySelector('#maxprice');
const bedroom = document.querySelector('#beds');
const bathroom = document.querySelector('#baths');
const searchbtn = document.querySelector('.search-btn');
const modal = document.querySelector('.overlay');
const logout = document.querySelector('.logout-btn');
const messageform = document.querySelector('#message-form');

let buyerid = null;
document.addEventListener('DOMContentLoaded', (ev) => {

    axios.get('/buyer/dashboard/property/all')
        .then(({ data }) => {
            if (data.auth === false) {
                window.location.href = 'login.html';
                return;
            }
            initSocket();
            buyerid = data.buyerid;
            const property = data.prop;
            if (property.length) {
                let count = 0;
                grid.innerHTML = '';
                for (let item of property) {
                    item.isfav = false;
                    if (Array.isArray(item.buyerfav)) {
                        for (let id of item.buyerfav) {
                            if (id === data.buyerid) {
                                count++;
                                item.isfav = true;

                                console.log("this one");
                                break;
                            }
                        }
                    }
                }
                for (let item of property) {
                    grid.appendChild(addProperty(item));
                }
            }
        })
        .catch(err => {
            console.log(err.message);
        });

})

searchbtn.addEventListener('click', (ev) => {
    axios.post('/buyer/dashboard/property/search', {
        location: proplocation.value.trim(),
        type: proptype.value.trim(),
        minprice: minprice.value.trim(),
        maxprice: maxprice.value.trim(),
        beds: bedroom.value.trim(),
        baths: bathroom.value.trim()
    }).then(({ data }) => {
        console.log("hello");
        if (data.auth === false) {
            window.location.href = 'login.html';
            return;
        }
        if (data.count === 0) {
            return alert("Atleast One search conditon needs to be specified");
        }
        else {
            if (data.prop.length == 0) {
                return grid.innerHTML = `
            <div class="empty-state">
            <div class="empty-icon">🏠</div>
            <h2>No Properties Available</h2>
            <p>
                There are currently no property listings available corresponding to the search criteria.<br>
                Please check back later.
            </p>
        </div>
            `;
            }
            const property = data.prop;

            if (property.length) {
                grid.innerHTML = '';

                for (let item of property) {
                    item.isfav = false;

                    if (Array.isArray(item.buyerfav)) {
                        for (let id of item.buyerfav) {
                            if (id === data.buyerid) {
                                item.isfav = true;
                                break;
                            }
                        }
                    }
                }
                for (const item of property) {
                    grid.appendChild(addProperty(item));
                }
            }
        }
    }).catch((err) => {
        console.log(err.message)
    })

})


grid.addEventListener('click', (ev) => {
    console.log(typeof ev.target.type);
    if (ev.target.type === "button") {
        if (ev.target.innerText === "Add to Favourites" || ev.target.innerText === "Remove from Favourites") {
            let status = 1;
            if (ev.target.innerText === "Add to Favourites") {
                status = 0;
            }
            axios.post('/buyer/dashboard/property/addasfav', {
                buttonid: ev.target.id,
                stat: status
            }).then(({ data }) => {
                if (data.auth === false) {
                    window.location.href = 'login.html';
                    return;
                }
                if (data.ok) {
                    if (status === 1) {
                        ev.target.innerText = "Add to Favourites"
                    }
                    else {
                        ev.target.innerText = "Remove from Favourites"
                    }
                }
            }).catch((err) => {
                console.log(err.message);
            })
        }
    }
})

let propdata = undefined;
grid.addEventListener('click', (ev) => {
    const btn = ev.target.closest("button");
    if (!btn) return;
    // console.log(btn.id);
    if (btn.innerText.trim() === "View Details") {
        const modal = document.querySelector(".container").querySelector('.overlay');
        modal.classList.add("active");
        const id = btn.id;
        modal.id = id;
        axios.post('/buyer/dashboard/property/search', {
            id: id
        }).then(({ data }) => {
            buyerid = data.buyerid;
            propdata = data.prop[0];
            console.log(propdata);
            modal.querySelector('.modal-content.initial').classList.add("active");
            modal.querySelector('.modal-content.initial').innerText = '';
            modal.querySelector('.modal-content.initial').innerText = `Hello ${propdata.title}`;
        })
    }
})

modal.addEventListener('click', (ev) => {
    const initialcontent = modal.querySelector('.modal-content.initial');
    const detailscontent = modal.querySelector('.modal-content.details');
    const sellercontent = modal.querySelector('.modal-content.seller');
    const messagecontent = modal.querySelector('.modal-content.message');
    const leftbuttondetail = modal.querySelector('.carousel-btn.left');
    const rightbuttondetail = modal.querySelector('.carousel-btn.right');
    const propcaraousel = modal.querySelector('.carousel-track');
    if (modal.classList.contains("active")) {
        const tar = ev.target.closest('div');
        if (tar.classList.contains("overlay")) {
            modal.classList.remove("active");
            modal.removeAttribute("id");
            initialcontent.classList.remove("none");
            sellercontent.classList.remove("active");
            messagecontent.classList.remove("active");
            detailscontent.classList.remove("active");
            initialcontent.classList.add("active");
            sellercontent.classList.add("none");
            messagecontent.classList.add("none");
            detailscontent.classList.add("none");
            leftbuttondetail.classList.add('hidden');
            rightbuttondetail.classList.add('hidden');
            propcaraousel.style.transform = "translateX(0)";
            propcaraousel.replaceChildren();
            socket.emit('leave-room', buyerid, propdata.seller, propdata._id);
        }
        else if (tar.classList.contains("tab")) {
            if (tar.classList.contains("details-tab")) {
                initialcontent.classList.remove("active");
                sellercontent.classList.remove("active");
                messagecontent.classList.remove("active");
                detailscontent.classList.remove("none");
                initialcontent.classList.add("none");
                sellercontent.classList.add("none");
                messagecontent.classList.add("none");
                detailscontent.classList.add("active");
                console.log(propdata);

                modal.querySelector('#price').innerText = '₹' + propdata.price;
                modal.querySelector('#location').innerText = propdata.location;
                modal.querySelector('#type').innerText = propdata.type;
                modal.querySelector('#size').innerText = propdata.size;
                modal.querySelector('#beds').innerText = propdata.beds;
                modal.querySelector('#baths').innerText = propdata.baths;
                modal.querySelector('#desc').innerText = propdata.desc;
                if (propdata.images.length > 3) {
                    leftbuttondetail.classList.remove('hidden');
                    rightbuttondetail.classList.remove('hidden');
                }
                for (let item of propdata.images) {
                    const img = document.createElement('img');
                    img.src = item;
                    propcaraousel.appendChild(img);
                }
                if (propdata.images.length > 3) {
                    let index = 0;
                    const visibleCount = 3;
                    const maxIndex = propdata.images.length - visibleCount;
                    rightbuttondetail.onclick = () => {
                        if (index < maxIndex) {
                            index++;
                            propcaraousel.style.transform = `translateX(-${index * (100 / visibleCount)}%)`;
                            leftbuttondetail.classList.remove("hidden");
                        }
                        if (index === maxIndex) {
                            rightbuttondetail.classList.add("hidden");
                        }
                    };

                    leftbuttondetail.onclick = () => {
                        if (index > 0) {
                            index--;
                            propcaraousel.style.transform = `translateX(-${index * (100 / visibleCount)}%)`;
                            rightbuttondetail.classList.remove("hidden");
                        }
                        if (index === 0) {
                            leftbuttondetail.classList.add("hidden");
                        }
                    };
                }
            }
            else if (tar.classList.contains("messages-tab")) {
                let isit = false;
                for (let item of propdata.buyerfav) {
                    if (item._id.toString() == buyerid.toString()) {
                        isit = true;
                    }
                }
                if (isit) {
                    initialcontent.classList.remove("active");
                    sellercontent.classList.remove("active");
                    messagecontent.classList.remove("none");
                    detailscontent.classList.remove("active");
                    initialcontent.classList.add("none");
                    sellercontent.classList.add("none");
                    messagecontent.classList.add("active");
                    detailscontent.classList.add("none");
                    socket.emit('join-room', buyerid, propdata.seller, propdata._id);
                }
                else {
                    return alert('this property has not been favourite by you.');
                }
            }
        }
    }
})


logout.addEventListener('click', (ev) => {
    axios.post('/buyer/logout').then(({ data }) => {
        if (data.ok) {
            window.location.href = 'login.html'
            socket.emit("disconnect");
            socket = null;
        }
    }).catch((err) => {
        console.log(err.message);
    })
})


messageform.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const message = document.querySelector('#message-input').value;
    socket.emit("message-sent", buyerid, propdata.seller, propdata._id, message);
    document.querySelector('#message-form').reset();
})