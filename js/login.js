
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const loginBtn = document.querySelector('#loginBtn');

const url = 'https://vue3-course-api.hexschool.io/';


function login(){
    
    const user = {
        "username": email.value,
        "password": password.value
    }
    
    if(user.username === "" || user.password === ""){

        alert("帳號或密碼未填!!");

    }else{

        axios.post(`${url}admin/signin`,user)
        .then((res) => {
            // console.log(res);
            if(res.data.success){

                const {expired,token} = res.data
                document.cookie = `sixToken=${token};expired=${new Date(expired)}`;  //將token與expired 存到 cookie
                
                alert("登入成功");
                window.location ="product.html";

            }else{
                alert(res.data.message);
                email.value = "";
                password.value = "";
            }
        })
        .catch((err) => {
            console.log(err);
        })

    }

}

loginBtn.addEventListener('click',login);