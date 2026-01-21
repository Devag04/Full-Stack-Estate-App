const signup=document.querySelector('.seller-signup-form');
const email=document.querySelector('#email');
const sellername=document.querySelector('#name');
const phone=document.querySelector("#phone");
const password=document.querySelector('#password');
const cnfpassword=document.querySelector('#confirm');
const agreement=document.querySelector('#agreement');
const company=document.querySelector('#company');

signup.addEventListener('submit',(ev)=>{
    ev.preventDefault();

    if(!agreement.checked){
        alert("The terms and conditions need to be agreed upon!!");
        return;
    }
    const emailid=email.value;
    const name=sellername.value;
    const phoneno=phone.value;
    const pass=password.value;
    const confirm=cnfpassword.value;
    const companyname=company.value;
    if (pass!==confirm){
        alert("The confirm password should match the  password")
        return;
    }
    axios.post('/seller/signup',{
        email: emailid,
        name:name,
        phone:phoneno,
        password:pass,
        company:companyname
    }).then(({data})=>{
        if(data.err){
            alert(data.err);
        }
        if(data.ok){
            alert("User Signed Up successfully");
        }
    }).catch((err)=>{
        console.log("Unable to send signup request");
    })
})