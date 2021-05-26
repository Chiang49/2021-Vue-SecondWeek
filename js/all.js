
const signOutBtn = document.querySelector('#signOut');

const productForm = document.querySelector('#productForm');
const productName = document.querySelector('#title');
const originalPrice = document.querySelector('#originalPrice');
const price = document.querySelector('#price');
const addProduct = document.querySelector('#addProduct');

const deleteAll = document.querySelector('#deleteAll');
const productList = document.querySelector('#productList');

const productPage = {

    //資料
    data:{
        product:[]
    },

    //取得token驗證確認登入狀態
    init(){

        const token = document.cookie.replace(/(?:(?:^|.*;\s*)sixToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;

        axios.post(`${url}api/user/check`)
        .then((res) => {
            // console.log(res);
            if(res.data.success){
                this.getData();
            }else{
                alert("您已被登出");
                window.location = "index.html";
                document.cookie = `sixToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/2021-Vue-SecondWeek;`;
            }
        })
        .catch((res) => {
            console.log(res);
        })
        
    },

    //登出
    signOut(){
        axios.post(`${url}logout`)
        .then((res) => {
            // console.log(res);
            alert("登出成功!");
            window.location = "index.html";
            document.cookie = `sixToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/2021-Vue-SecondWeek;`;
        })
        .catch((err) => {
            console.log(err);
        })
    },

    //取得商品資料
    getData(){
        axios.get(`${url}api/${path}/admin/products`)
        .then((res) => {
            this.data.product = res.data.products;
            console.log(this.data.product);
            this.renderProductList();
        })
    },

    // 產品增加
    addProductData(){
        if(productName.value === "" || originalPrice.value  === "" || price.value === ""){
            alert("產品資料未填寫");
        }else if(originalPrice.value <= 0 || price.value <= 0){
            alert("價錢不能為 0 以下");
        }else{

            let obj =   {
                data: {
                    title: productName.value,
                    category: "衣服2",
                    origin_price: parseInt(originalPrice.value),
                    price: parseInt(price.value),
                    unit: "個",
                    description: "Sit down please 名設計師設計",
                    content: "這是內容",
                    is_enabled: 0,
                    imageUrl : "主圖網址",
                    imagesUrl: [
                        "圖片網址一",
                        "圖片網址二",
                        "圖片網址三",
                        "圖片網址四",
                        "圖片網址五"
                    ]
                }
            }

            axios.post(`${url}api/${path}/admin/product`,obj)
            .then((res) => {
                // console.log(res);
                alert("產品建立成功");
                productForm.reset();
                productPage.getData();
            })
            .catch((res) => {
                console.log(res);
            })

        }
    },

    // 單筆產品刪除
    deleteThisData(productId){

        axios.delete(`${url}api/${path}/admin/product/${productId}`)
        .then((res) => {
            if(res.data.success){
                alert("商品刪除成功!");
                this.getData();
            }else{
                alert(res.data.message);
            }
        })
        .catch((err) => {
            console.log(err);
        })
        
    },

    // 產品啟用狀態
    productStatus(productId,productKey){
        
        if(this.data.product[productKey].is_enabled == 0){   
            this.data.product[productKey].is_enabled = 1;
        }else{
            this.data.product[productKey].is_enabled = 0;
        }
       
        this.statusChange(productKey);

        
    },

    // 狀態變化
    statusChange(key){
        
        const toggle = document.querySelectorAll('div[data-switch="switch"]');
    
        if(!this.data.product[key].is_enabled){
            toggle[key].classList.add('close');
            toggle[key].classList.remove('open');
        }else{
            toggle[key].classList.add('open');
            toggle[key].classList.remove('close');
        }
    },

    // 產品表單渲染
    renderProductList(){
        let content = "";
        if(this.data.product.length === 0){
            content += `<tr class="noProduct">
                            <td colspan="5">目前沒有產品</td>
                        </tr>`;
        }else{
            this.data.product.forEach((item,key) => {
                content += `<tr>
                                <td>${item.title}</td>
                                <td>${item.origin_price}</td>
                                <td>${item.price}</td>
                                <td class="position-relative">
                                    <div class="switch-group">
                                        <div class="switch" data-switch="switch" data-toggle="status" data-ID="${item.id}" data-key="${key}">
                                            <div class="switch-circle" data-toggle="status" data-ID="${item.id}" data-key="${key}"></div>
                                        </div>
                                        <p data-toggle="status" data-ID="${item.id}" data-key="${key}">${item.is_enabled?"啟用":"未啟用"}</p>
                                    </div>
                                </td>
                                <td><button type="button" class="deleteBtn" data-Btn="deleteThis" data-ID="${item.id}">刪除</button></td>
                            </tr>`;
            })
        }
        productList.innerHTML = content;

        this.data.product.forEach((item,key) => {
            this.statusChange(key);
        })

    },

    //監聽
    addEventListener(){

        // 監聽增加產品按鈕
        addProduct.addEventListener('click',this.addProductData);
        
        // 監聽單筆刪除按鈕 & 監聽產品狀態且換
        productList.addEventListener('click',(e) => {
            
            let productId = e.target.getAttribute('data-ID');
            //單筆刪除
            if(e.target.getAttribute('data-Btn') === 'deleteThis'){

                this.deleteThisData(productId);

            }else if(e.target.getAttribute('data-toggle') === 'status'){
                
                let productKey = e.target.getAttribute('data-key');
                this.productStatus(productId,productKey);

            }

        })

        // 登出監聽
        signOutBtn.addEventListener('click', this.signOut);

    },

    //生命週期
    created(){
        this.init();
        this.addEventListener();
    }
}

productPage.created();




