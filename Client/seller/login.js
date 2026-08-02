const sellerlogin=document.querySelector('.seller-login-form');
const emailadd=document.querySelector('#email');
const password=document.querySelector('#password');

sellerlogin.addEventListener(('submit'),(ev)=>{
    ev.preventDefault();
    const email=emailadd.value;
    const pass=password.value;
    console.log(email);
    console.log(pass);

    axios.post('/seller/Login',{
        email: email,
        password: pass
    }).then(({data})=>{
        if(data.err){
            alert(data.err);
        }
        if(data.ok){
            window.location.href='dashboard.html'
        }
    }).catch((err)=>{
        console.log(err);
    })
})