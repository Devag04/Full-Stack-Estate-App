import { addProperty } from "../utility/addprop.js";

const grid = document.querySelector('.properties-grid');
const proplocation = document.querySelector('#proplocation');
const proptype = document.querySelector('#proptype');
const minprice = document.querySelector('#minprice');
const maxprice = document.querySelector('#maxprice');
const bedroom = document.querySelector('#beds');
const bathroom = document.querySelector('#baths');
const searchbtn = document.querySelector('.search-btn');
const logout=document.querySelector('.logout-btn');


document.addEventListener('DOMContentLoaded', (ev) => {
    axios.get('/buyer/dashboard/property/all')
        .then(({ data }) => {
            if (data.auth === false) {
                window.location.href = 'login.html';
                return;
            }

            const property = data.prop;

            if (property.length) {
                let count = 0;

                for (let item of property) {
                    item.isfav = false;
                    if (Array.isArray(item.buyerfav)) {
                        for (let id of item.buyerfav) {
                            if (id === data.buyerid) {
                                if (count === 0) {
                                    grid.innerHTML = '';
                                }
                                count++;
                                item.isfav = true;
                                grid.appendChild(addProperty(item));
                                console.log("this one");
                                break;
                            }
                        }
                    }
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

                let count = 0;
                for (let item of property) {
                    item.isfav = false;
                    if (Array.isArray(item.buyerfav)) {
                        for (let id of item.buyerfav) {
                            if (id === data.buyerid) {
                                if (count === 0) {
                                    grid.innerHTML = `
            <div class="empty-state">
            <div class="empty-icon">🏠</div>
            <h2>No Properties Available</h2>
            <p>
                There are currently no property listings available corresponding to the search criteria and your favourite.<br>
                Please check back later.
            </p>
        </div>
            `
                                }
                                item.isfav = true;
                                grid.appendChild(addProperty(item));
                                count++;
                                break;
                            }
                        }
                    }
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
                        console.log(ev.target.parentElement.parentElement.parentElement);
                        if (grid.children.length === 1) {
                            grid.innerHTML = `
                            <div class="empty-state">
                            <div class="empty-icon">🏠</div>
                            <h2>No Properties Available</h2>
                            <p>
                            There are currently no property listings available in your favourites.<br>
                            Please check back later.
                            </p>
                            </div>
                            `;
                        }
                        grid.removeChild(ev.target.parentElement.parentElement.parentElement);
                    }
                }
            }).catch((err) => {
                console.log(err.message);
            })
        }
    }
})

logout.addEventListener('click',(ev)=>{
    axios.post('/buyer/logout').then(({data})=>{
        if(data.ok){
            window.location.href='login.html'
        }
    }).catch((err)=>{
        console.log(err.message);
    })
})