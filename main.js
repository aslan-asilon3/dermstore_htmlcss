let banner = ["https://www.jiomart.com/images/category/6047/premium-fruits-20220911.jpeg","https://www.jiomart.com/images/category/2/groceries-20210201.jpeg","https://www.jiomart.com/images/category/3/fashion-20200902.jpeg"]

let baseURL = "http://localhost:3000/data";
let itemcount;
let currData = null;
let fetchedData = null;

let cart = JSON.parse(localStorage.getItem("cart")) || []

fetch(`${baseURL}`).then((res)=>res.json()).then((data)=>{
    fetchedData = data;
    // console.log(fetchedData);
    // console.log(data.length)
    itemcount=data.length
})
let cardContainer = document.getElementById("cardContainer")



let price_low_to_high=`http://localhost:3000/data?_sort=price&_order=asc&_limit=12&_page=`
let price_high_to_low=`http://localhost:3000/data?_sort=price&_order=desc&_limit=12&_page=`
let price_without_sort=`http://localhost:3000/data?_limit=12&_page=`



function forapi(api){
    window.addEventListener("load",()=>{
        fetchAndRender()
    })
async function fetchAndRender(page=1){
    let response = await fetch(`${api}${page}`);
    let result = await response.json();
    // console.log(result);
    let totalpage=Math.ceil(itemcount/12)
    // console.log(totalpage)
    paginationpagerenering(totalpage)
    // cardContainer.innerHTML = display(result[0].Electronic)
    // cardContainer.innerHTML = display(result.data)
    currData = result;
    display(result)

}

fetchAndRender()
let filterByPrice = document.getElementById("filterPrice")

filterByPrice.addEventListener("change",()=>{
    if(filterByPrice.value === ""){
        display(result)
    }else if(filterByPrice.value == 5000){
        let filtered = currData.filter((ele)=>ele.price>5000)
        paginationwrapper.innerHTML = null
        display(filtered)    
    }else if(filterByPrice.value == 100){
        let filtered = currData.filter((ele)=>ele.price<100)
        paginationwrapper.innerHTML = null
        display(filtered)    
    }else if(filterByPrice.value == 1000){
        let filtered = currData.filter((ele)=>ele.price>=100 && ele.price<1000)
        paginationwrapper.innerHTML = null
        display(filtered)    
    }else if(filterByPrice.value == 3000){
        let filtered = currData.filter((ele)=>ele.price>=1000 && ele.price<3000)
        paginationwrapper.innerHTML = null
        display(filtered)    
    }else if(filterByPrice.value == 4999){
        let filtered = currData.filter((ele)=>ele.price>=3000 && ele.price<5000)
        paginationwrapper.innerHTML = null
        display(filtered)    
    }
})
let btn = document.querySelectorAll(".filterBtn")
btn.forEach(element => {
    element.addEventListener("click",(e)=>{
        e.preventDefault()
        let filtered = fetchedData.filter((el)=>(el.category === e.target.dataset.val))
        console.log(filtered)
        console.log(e.target.dataset.val)
        paginationwrapper.innerHTML = null

        display(filtered)
    })
});

// `<div class="card">
// <img src="${img}" alt="image">
// <p>${name}</p>
// <div class ="stPrice"><p> ₹${stPrice}</p> <h3> ₹${price}</h3> <p> ${Math.floor(((stPrice-price)/stPrice)*100)}% OFF</p></div>
// <button class="elementToFadeInAndOut">Add +</button>
// </div>
// `
function display(data){
    cardContainer.innerHTML = ""
    data.forEach((elem,ind)=>{
        let card = document.createElement("div")
        card.className = "card"
        let img = document.createElement("img")
        img.src = elem.image

        img.addEventListener("click",()=>{
            localStorage.setItem("singleProduct", JSON.stringify(elem))
            window.location.href="./singleProduct.html"
        })

        let p = document.createElement("p")
        p.textContent = elem.name;

        let div = document.createElement("div")
        div.className = "stPrice"

        let p2 = document.createElement('p')
        p2.textContent = `₹${elem.strikeprice}`

        let h3 = document.createElement("h3")
        h3.textContent = `₹${elem.price}`

        let p3 = document.createElement("p")
        p3.textContent = `${Math.floor(((elem.strikeprice-elem.price)/elem.strikeprice)*100)}% Off`;

        div.append(p2,h3,p3)

        let button = document.createElement("button")
        button.className = "elementToFadeInAndOut"
        button.textContent = "Add +"

        button.addEventListener("click",()=>{
            if(checkDuplicate(elem.id)){
                cart.push({...elem,quantity:1})
                localStorage.setItem("cart",JSON.stringify(cart))
                console.log("Added to the cart")
                Swal.fire(
                    'Added to Cart!',
                    'You are one step ahead of buying the Product!',
                    'success'
                )
            }else{
                console.log("Already Present in the cart")
                Swal.fire(
                    'Item is already present in the cart!',
                    'Go to the cart page!',
                    'error'
                )
            }
        })

        card.append(img,p,div,button)

        cardContainer.append(card)
    })



    // cardContainer.innerHTML=`${data.map((elem)=> getcard(elem.name,elem.image,elem.price,elem.strikeprice)).join("")}`
    

    // cardContainer.innerHTML = AllCards
}

// function getcard(name,img,price,stPrice){
//     return `<div class="card">
//                 <img src="${img}" alt="image">
//                 <p>${name}</p>
//                 <div class ="stPrice"><p> ₹${stPrice}</p> <h3> ₹${price}</h3> <p> ${Math.floor(((stPrice-price)/stPrice)*100)}% OFF</p></div>
//                 <button class="elementToFadeInAndOut">Add +</button>
//             </div>
//             `
// }
///pagination 
let paginationwrapper=document.getElementById("pagination-wrapper")
function paginationpagerenering(pages){
    let btn_arr=[];
    for(let i=1;i<=pages;i++){
      btn_arr.push(` <button class="pagination-button" data-page-number=${i}>${i}</button>
    `)
    }
    paginationwrapper.innerHTML=btn_arr.join("")
    let all_button_check=document.querySelectorAll("#pagination-wrapper button")
   for(let btn of all_button_check){
    btn.addEventListener("click",(e)=>{
        fetchAndRender(e.target.dataset.pageNumber)
    })
   }
  }
}
  forapi(price_without_sort)
let filter=document.getElementById("sort")
filter.addEventListener("change",(e)=>{
    e.preventDefault();
    let filtervalue=filter.value;
    if(filtervalue==""){
        forapi(price_without_sort)
    }else if(filtervalue=="asc"){
        forapi(price_low_to_high)
    }else if(filtervalue=="desc"){
        forapi(price_high_to_low)
    }
})


function checkDuplicate(id){
    // console.log(cart)
    for(let i=0;i<cart.length;i++){
        // console.log(cart[i])
        if(cart[i].id == id){
            return false
        }
    }
    return true
    }

// http://localhost:3000/data?_sort=price&_order=desc&_limit=12&_page=1
