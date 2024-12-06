console.clear();

const baseUrl = "https://livejs-api.hexschool.io";
const apiPath = "hua";
const customerApi = `${baseUrl}/api/livejs/v1/customer/${apiPath}`;
let productData = []; //取得產品列表
const productWrap = document.querySelector(".productWrap"); //渲染產品列表
const productSelect = document.querySelector(".productSelect"); //篩選
let cartData = []; //渲染購物車
let cartTotal = 0; //渲染購物車總金額
const shoppingCartTableBody = document.querySelector(
  ".shoppingCart-table tbody"
); //購物車tbody
const shoppingCartTableFootTotal = document.querySelector(".cartTotal"); //購物車Total
const discardAllBtn = document.querySelector(".discardAllBtn"); //刪除購物車所有商品
const orderInfoBtn = document.querySelector(".orderInfo-btn"); //送出按鈕
const orderInfoForm = document.querySelector(".orderInfo-form"); //表單

//取得產品列表
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
      getCart();
    })
    .catch((err) => {
      alert(err);
    });
}

productWrap.addEventListener("click", (e) => {
  e.preventDefault();
  addCart(e.target.dataset.id);
});

//渲染購物車

function getCart() {
  axios
    .get(`${customerApi}/carts`)
    .then((res) => {
      cartData = res.data.carts;
      cartTotal = res.data.finalTotal;
      renderCart();
    })
    .catch((err) => {
      alert(err);
    });
}

function renderCart() {
  if (cartData.length === 0) {
    shoppingCartTableBody.innerHTML = "購物車目前無商品";
    shoppingCartTableFootTotal.innerHTML = "NT$0";
    discardAllBtn.disabled = true; // 禁用按鈕
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
								<a href="#" class="material-icons" data-id="${item.id}"> clear </a>
							</td>
						</tr>`;
  });
  shoppingCartTableBody.innerHTML = str;
  shoppingCartTableFootTotal.innerHTML = `NT$${cartTotal}`;
  discardAllBtn.disabled = false; // 啟用按鈕
}

//刪除購物車所有商品
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

//刪除購物車單一商品
function deleteCart(id) {
  axios
    .delete(`${customerApi}/carts/${id}`)
    .then((res) => {
      cartData = res.data.carts;
      cartTotal = res.data.finalTotal;
      renderCart();
    })
    .catch((err) => {
      alert(err);
    });
}

shoppingCartTableBody.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.hasAttribute("data-id")) {
    deleteCart(e.target.dataset.id);
  }
});

//訂單送出

function checkForm() {
  const constraints = {
    姓名: {
      presence: {
        message: "^必填",
      },
    },
    電話: {
      presence: {
        message: "^必填",
      },
    },
    Email: {
      presence: {
        message: "^必填",
      },
      email: {
        message: "請輸入正確的信箱格式",
      },
    },
    寄送地址: {
      presence: {
        message: "^必填",
      },
    },
  };
  const errors = validate(orderInfoForm, constraints);

  if (errors) {
    const errorArr = Object.keys(errors);
    errorArr.forEach((item) => {
      const message = document.querySelector(`[data-message="${item}"]`);
      message.textContent = errors[item][0];
    });
  }
  return errors;
}

function sendOrder() {
  if (cartData.length === 0) {
    return;
  }
  if (checkForm()) {
    alert("必填");
    return;
  }
  const customerName = document.querySelector("#customerName");
  const customerPhone = document.querySelector("#customerPhone");
  const customerEmail = document.querySelector("#customerEmail");
  const customerAddress = document.querySelector("#customerAddress");
  const tradeWay = document.querySelector("#tradeWay");
  const data = {
    data: {
      user: {
        name: customerName.value.trim(),
        tel: customerPhone.value.trim(),
        email: customerEmail.value.trim(),
        address: customerAddress.value.trim(),
        payment: tradeWay.value.trim(),
      },
    },
  };
  axios
    .post(`${customerApi}/orders`, data)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      alert(err);
    });
}

orderInfoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  sendOrder();
});

//編輯產品數量
// function updateCart(id, qty) {
//   const data = {
//     data: {
//       id,
//       quantity: qty,
//     },
//   };
//   const item = cartData.find((item) => item.id === id);
//   const qty = Math.max(item.quantity + data.qty, 1); // 最低為1
//   axios
//     .patch(`${customerApi}/carts/${id}`)
//     .then((res) => {
//       cartData = res.data.carts;
//       cartTotal = res.data.finalTotal;
//       renderCart();
//     })
//     .catch((err) => {
//       alert(err);
//     });
// }

// shoppingCartTableBody.addEventListener("click", (e) => {
//   e.preventDefault();
//   if (e.target.classList.contains("addBtn")) {
//     updateCart(e.target.dataset.id, 1);
//   } else if (e.target.classList.contains("minusBtn")) {
//     updateCart(e.target.dataset.id, -1);
//   }
// });

//初始化
function init() {
  getProduct();
  getCart();
}
init();
