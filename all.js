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
      productData = res.data.products;
      renderProduct(productData);
    })
    .catch((err) => {
      alert(err);
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
					<a href="#" class="addCardBtn" data-id=${item.id}>加入購物車</a>
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
  filterProduct(e.target.value);
});

//新增購物車
function addCart(id) {
  const data = {
    data: {
      productId: id,
      quantity: 1,
    },
  };
  axios
    .post(`${customerApi}/carts`, data)
    .then((res) => {
      cartData = res.data.carts;
      renderCart();
    })
    .catch((err) => {
      alert(err);
    });
}

productWrap.addEventListener("click", (e) => {
  e.preventDefault();
  addCart(e.target.dataset.id);
});

//刪除購物車所有商品
const discardAllBtn = document.querySelector(".discardAllBtn");

function deleteAllCart() {
  axios
    .delete(`${customerApi}/carts`)
    .then((res) => {
      cartData = res.data.carts;
      renderCart();
    })
    .catch((err) => {
      alert(err);
    });
}

discardAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  deleteAllCart();
});

//渲染購物車
function getCart() {
  axios
    .get(`${customerApi}/carts`)
    .then((res) => {
      cartData = res.data.carts;
      renderCart();
    })
    .catch((err) => {
      alert(err);
    });
}

const shoppingCartTableBody = document.querySelector(
  ".shoppingCart-table tbody"
);
const shoppingCartTableFoot = document.querySelector(
  ".shoppingCart-table tfoot"
);

function renderCart() {
  if (cartData.length === 0) {
    shoppingCartTableBody.innerHTML = "購物車目前無商品";
    shoppingCartTableFoot.innerHTML = "";
    return;
  }
  let str = "";
  cartData.forEach((item) => {
    str += `<tr>
							<td>
								<div class="cardItem-title">
									<img
										src="${item.product.images}"
										alt="" />
									<p>${item.product.title}</p>
								</div>
							</td>
							<td>NT$${item.product.origin_price}</td>
							<td>${item.quantity}</td>
							<td>NT$${item.product.price}</td>
							<td class="discardBtn">
								<a href="#" class="material-icons"> clear </a>
							</td>
						</tr>`;
  });
  shoppingCartTableBody.innerHTML = str;
}

//初始化
function init() {
  getProduct();
  getCart();
}
init();
