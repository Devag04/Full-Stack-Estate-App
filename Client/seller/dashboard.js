const sellerform = document.querySelector('.property-form');
const title = document.querySelector('#title');
const propertylocation = document.querySelector('#location');
const price = document.querySelector('#price');
const type = document.querySelector('#type');
const beds = document.querySelector('#beds');
const baths = document.querySelector('#baths');
const size = document.querySelector('#size');
const desc = document.querySelector('#description');
const image = document.querySelector('#imagefile');
const propgrid = document.querySelector('.properties-grid');
const logout = document.querySelector('.logout-btn');
const modal = document.querySelector('.overlay');

function addProperty(item) {
    const prop = document.createElement('div');
    prop.className = "property-card";
    const propimage = document.createElement('div');
    propimage.className = "property-image";
    const propimageholder = document.createElement("img");
    console.log(item.images[0]);
    propimageholder.src = item.images[0]
    propimageholder.alt = item.title || "property";
    propimage.appendChild(propimageholder);
    propimage.style = "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); "
    prop.appendChild(propimage);
    const propdetails = document.createElement('div');
    propdetails.className = "property-details";
    const proptitle = document.createElement('h3');
    proptitle.className = "property-title";
    proptitle.innerText = item.title;
    propdetails.appendChild(proptitle);
    const propaddress = document.createElement('p');
    propaddress.className = "property-location";
    propaddress.innerText = "📍" + item.location;
    propdetails.appendChild(propaddress);
    const propprice = document.createElement('p');
    propprice.className = "property-price";
    propprice.innerText = "₹" + item.price;
    propdetails.appendChild(propprice);
    let propspecs = undefined;
    if (item.beds != undefined || item.baths != undefined || item.size != undefined) {
        propspecs = document.createElement('div');
        propspecs.className = "property-specs";
        propdetails.appendChild(propspecs);
    }
    if (item.beds != undefined) {
        const propbed = document.createElement('span');
        propbed.className = "property-detail";
        propbed.innerText = "🛏️" + item.beds;
        propspecs.appendChild(propbed);
    }
    if (item.baths != undefined) {
        const propbath = document.createElement('span');
        propbath.className = "property-detail";
        propbath.innerText = "🚿" + item.baths;
        propspecs.appendChild(propbath);
    }
    if (item.size != undefined) {
        const propsize = document.createElement('span');
        propsize.className = "property-detail";
        propsize.innerText = "📐" + item.size;
        propspecs.appendChild(propsize);
    }
    const propaction = document.createElement('div');
    propaction.className = "property-actions";
    const editbutton = document.createElement('button');
    editbutton.className = "btn btn-secondary";
    editbutton.innerText = "Edit";
    editbutton.id = item._id;
    propaction.appendChild(editbutton);
    const deletebutton = document.createElement('button');
    deletebutton.className = "btn btn-danger";
    deletebutton.innerText = "Delete";
    deletebutton.id = item._id;
    propaction.appendChild(deletebutton);
    const messagebutton = document.createElement('button');
    messagebutton.className = "btn btn-secondary";
    messagebutton.innerText = "Messages";
    messagebutton.id = item._id;
    propaction.appendChild(messagebutton);
    propdetails.appendChild(propaction);
    prop.appendChild(propdetails);
    return prop;
}


document.addEventListener('DOMContentLoaded', (ev) => {
    axios.get('/seller/dashboard/property/all').then(({ data }) => {
        if (data.auth === false) {
            return window.location.href = 'login.html';
        }
        console.log("RAW:", data);
        if (data.prop.length) {
            propgrid.innerHTML = '';
        }
        for (const item of data.prop) {
            propgrid.appendChild(addProperty(item));
        }
    }).catch((err) => {
        return alert(err.message);
    })
})

sellerform.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const fd = new FormData();

    fd.append("title", title.value);
    fd.append("location", propertylocation.value);
    fd.append("price", price.value);
    fd.append("type", type.value);
    fd.append("beds", beds.value);
    fd.append("baths", baths.value);
    fd.append("size", size.value);
    fd.append("desc", desc.value);
    for (let i = 0; i < image.files.length; i++) {
        fd.append("images", image.files[i]);
    }   // MUST upload image one by one

    axios.post("/seller/dashboard/property/add", fd)
        .then(({ data }) => {
            if (data.auth === false) {
                window.location.href = 'login.html';
            }
            if (data.err) return alert(data.err);
            if (data.ok) {
                propgrid.innerHTML = '';
                for (const item of data.prop) {
                    propgrid.appendChild(addProperty(item))
                }
                sellerform.reset();
            }
        })
        .catch(err => console.log(err.message));

})


logout.addEventListener('click', (ev) => {
    axios.post('/seller/logout').then(({ data }) => {
        if (data.ok) {
            window.location.href = 'login.html'
        }
    }).catch((err) => {
        console.log(err.message);
    })
})


propgrid.addEventListener('click', (ev) => {
    const btn = ev.target.closest('button');
    if (!btn) {
        return;
    }
    if (btn.classList.contains('btn-danger')) {
        const id = btn.id;
        axios.delete('/seller/dashboard/property/delete', {
            data: { id }
        }).then(({ data }) => {
            if (data.err) {
                return alert(data.err.message);
            }
            if (data.ok) {
                propgrid.removeChild(btn.parentElement.parentElement.parentElement);
            }
            if (propgrid.children.length === 0) {
                propgrid.innerHTML = `<div class="empty-state">
                <div class="empty-icon">🏠</div>
                <h2>No Properties Available</h2>
                <p>
                    There are currently no property listings made by you.<br>
                    Please list your properties.
                </p>
            </div>`
            }
        }).catch((err) => {
            console.log(err.message);
        })
    }
})

const prop = undefined;
propgrid.addEventListener('click', (ev) => {
    const btn = ev.target.closest('button');
    if (!btn) {
        return;
    }
    const id = btn.id;
    if (btn.innerText === "Messages") {
        const sidebar = modal.querySelector('.modal-sidebar');
        modal.classList.add('active');
        modal.querySelector('.modal-content.initial').classList.add('active');
        axios.post('/seller/dashboard/property/search', {
            id: id
        }).then(({ data }) => {
            console.log(data);
            console.log(data.prop);
            console.log(data.prop[0].buyerfav);
            sidebar.replaceChildren();
            for (let item of data.prop[0].buyerfav) {
                const newtab = document.createElement('div');
                newtab.classList.add('tab');
                newtab.innerText = item.name;
                newtab.id = item._id.toString();
                sidebar.appendChild(newtab);
            }
        })
    }
})

modal.addEventListener('click', (ev) => {
    const div = ev.target.closest('div');
    const messagearea = modal.querySelector('.modal-content.message');

    if (div.classList.contains('overlay')) {
        modal.classList.remove('active');
        messagearea.classList.remove('active');
    }
    if (div.classList.contains('tab')) {
        const message = modal.querySelector('.messages');
        modal.querySelector('.modal-content.initial').classList.remove('active');
        messagearea.classList.add('active');
        message.replaceChildren();
    }
})





