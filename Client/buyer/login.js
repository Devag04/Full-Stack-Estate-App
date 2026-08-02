const buyerlogin=document.querySelector('.buyer-login-form');
const emailadd=document.querySelector('#email');
const password=document.querySelector('#password');

buyerlogin.addEventListener(('submit'),(ev)=>{
    ev.preventDefault();
    const email=emailadd.value;
    const pass=password.value;
    console.log(email);
    console.log(pass);

    axios.post('/buyer/Login',{
        email: email,
        password: pass
    }).then(({data})=>{
        if(data.err){
            alert(data.err);
        }
        if(data.ok){
            window.location.href='../../buyer/dashboard.html'
        }
    }).catch((err)=>{
        console.log(err);
    })
})