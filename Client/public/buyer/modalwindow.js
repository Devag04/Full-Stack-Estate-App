grid.addEventListener('click',(ev)=>{
    const btn = ev.target.closest("button");

    if (btn && btn.innerText.trim() === "View Details") {
        const modal = document.querySelector(".container").querySelector('.overlay');
        modal.classList.add("active");
        const id=btn.id;
        
    }
})

modal.addEventListener('click',(ev)=>{
    if(modal.classList.contains("active")){
        const tar=ev.target.closest('div');
        if(tar.classList.contains("overlay")){
            modal.classList.remove("active");
        }
    }
})