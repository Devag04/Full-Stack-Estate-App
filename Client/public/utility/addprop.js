export function addProperty(item) {
    const prop = document.createElement('div');
    prop.className = "property-card";
    const propimage = document.createElement('div');
    propimage.className = "property-image";
    const propimageholder = document.createElement("img");
    propimageholder.src = item.images[0];
    propimageholder.alt = item.title || "property";
    propimage.appendChild(propimageholder)
    prop.appendChild(propimage);
    const propinfo = document.createElement('div');
    propinfo.className = "property-info";
    const proptitle = document.createElement('h3');
    proptitle.className = "property-title";
    proptitle.innerText = item.title;
    propinfo.appendChild(proptitle);
    const propprice = document.createElement('div');
    propprice.className = "property-price";
    propprice.innerText = "₹" + item.price;
    propinfo.appendChild(propprice);
    const propaddress = document.createElement('div');
    propaddress.className = "property-address";
    propaddress.innerText = "📍" + item.location;
    propinfo.appendChild(propaddress);
    let propdetails = undefined;
    if (item.bed != undefined || item.bath != undefined || item.size != undefined) {
        propdetails = document.createElement('div');
        propdetails.className = "property-details";
        propinfo.appendChild(propdetails);
    }
    if (item.bed != undefined) {
        const propbed = document.createElement('span');
        propbed.className = "property-detail";
        propbed.innerText = "🛏️" + item.bed;
        propdetails.appendChild(propbed);
    }
    if (item.bath != undefined) {
        const propbath = document.createElement('span');
        propbath.className = "property-detail";
        propbath.innerText = "🚿" + item.bath;
        propdetails.appendChild(propbath);
    }
    if (item.size != undefined) {
        const propsize = document.createElement('span');
        propsize.className = "property-detail";
        propsize.innerText = "📐" + item.size;
        propdetails.appendChild(propsize);
    }
    const propdesc = document.createElement('p');
    propdesc.className = "property-description";
    propdesc.innerText = item.desc;
    propinfo.appendChild(propdesc);
    const btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";

    const detailbutton = document.createElement('button');
    detailbutton.type = "button";
    detailbutton.className = "btn-interest";
    detailbutton.innerText = "View Details";
    detailbutton.id = item._id.toString();
    const favbutton = document.createElement('button');
    favbutton.type = "button";
    favbutton.className = "btn-interest";
    if (item.isfav === true) {
        favbutton.innerText = "Remove from Favourites";
    }
    else {
        favbutton.innerText = "Add to Favourites";
    }
    favbutton.id = item._id.toString();
    console.log(item._id.toString());
    btnGroup.appendChild(detailbutton);
    btnGroup.appendChild(favbutton);
    propinfo.appendChild(btnGroup);
    prop.appendChild(propinfo);

    return prop;
}

