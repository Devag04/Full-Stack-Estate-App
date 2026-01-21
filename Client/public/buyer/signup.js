const signup=document.querySelector('.buyer-signup-form');
const email=document.querySelector('#email');
const buyername=document.querySelector('#name');
const phone=document.querySelector("#phone");
const password=document.querySelector('#password');
const cnfpassword=document.querySelector('#confirm');
const agreement=document.querySelector('#agreement');


signup.addEventListener('submit',(ev)=>{
    ev.preventDefault();

    if(!agreement.checked){
        alert("The terms and conditions need to be agreed upon!!");
        return;
    }
    const emailid=email.value;
    const name=buyername.value;
    const phoneno=phone.value;
    const pass=password.value;
    const confirm=cnfpassword.value;
    if (pass!==confirm){
        alert("The confirm password should match the  password")
        return;
    }
    axios.post('/buyer/signup',{
        email: emailid,
        name:name,
        phone:phoneno,
        password:pass,
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