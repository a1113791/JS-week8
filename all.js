console.clear();

const baseUrl = "https://livejs-api.hexschool.io";
const apiPath = "hua";
const customerApi = `${baseUrl}/api/livejs/v1/customer/${apiPath}`;

//取得產品列表
let productData = [];

function getProduct() {
  axios
    .get(`${customerApi}/products`)
    .then((res) => {
      //   console.log(res.data.products);
      productData = res.data.products;
      renderProduct(productData);
    })
    .catch((err) => {
      console.log(err);
    });
}

//渲染產品列表
const productWrap = document.querySelector(".productWrap");

function renderProduct(data) {
  let str = "";
  data.forEach((item) => {
    str += `<li class="productCard">
					<h4 class="productType">新品</h4>
					<img
						src="${item.images}"
						alt="" />
					<a href="#" class="addCardBtn">加入購物車</a>
					<h3>${item.title}</h3>
					<del class="originPrice">NT$${item.origin_price}</del>
					<p class="nowPrice">NT$${item.price}</p>
				</li>`;
  });
  productWrap.innerHTML = str;
}

//篩選
const productSelect = document.querySelector(".productSelect");
function filterProduct(value) {
  const result = [];
  productData.forEach((item) => {
    if (item.category === value) {
      result.push(item);
    }
    if (value === "全部") {
      result.push(item);
    }
  });
  renderProduct(result);
}
productSelect.addEventListener("change", (e) => {
  //   console.log(e.target.value);
  filterProduct(e.target.value);
});

//初始化
function init() {
  getProduct();
}
init();
