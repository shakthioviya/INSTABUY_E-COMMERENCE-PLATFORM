import { useEffect,useState,useCallback,useRef } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios";
import "./ProductPage.css";

const API="http://localhost:8087";

const getAuthHeaders=()=>({
 headers:{
   Authorization:`Bearer ${localStorage.getItem("token")}`
 }
});

export default function ProductsPage(){

const dealerId=localStorage.getItem("dealerId");
const navigate=useNavigate();
const location=useLocation();

const [products,setProducts]=useState([]);
const [search,setSearch]=useState("");
const [editProduct,setEditProduct]=useState(null);

const [qtyModal,setQtyModal]=useState(null);
const [qtyInput,setQtyInput]=useState("");
const [isSubmitting,setIsSubmitting]=useState(false);

/* prevents duplicate request */
const submittingRef=useRef(false);

/* ================= LOAD ================= */

const loadProducts=useCallback(async()=>{
 try{
   if(!dealerId) return;

   const res=await axios.get(
     `${API}/api/product/dealer/${dealerId}`,
      getAuthHeaders()
   );

   setProducts(res.data);
 }
 catch(err){
   console.error(err);
 }
},[dealerId]);

useEffect(()=>{
 loadProducts();
},[loadProducts]);

/* ================= SEARCH ================= */

const handleSearch=async(value)=>{
setSearch(value);

if(!value.trim()){
 loadProducts();
 return;
}

try{
 const res=await axios.get(
`${API}/api/product/search?keyword=${value}&dealerId=${dealerId}`,
getAuthHeaders()
 );
 setProducts(res.data);
}
catch(err){
 console.error(err);
}
};

/* ================= QTY MODAL ================= */

const openQtyModal=(product,mode)=>{
if(isSubmitting) return;

setQtyInput("");
setQtyModal({
 product,
 mode
});
};

/* ===== FIXED DOUBLE REDUCE ISSUE ===== */

const confirmQty=async()=>{

if(
submittingRef.current ||
isSubmitting ||
!qtyModal
){
 return;
}

const qty=parseInt(qtyInput,10);

if(!qty || qty<=0){
 alert("Enter valid quantity");
 return;
}

/* lock immediately */
submittingRef.current=true;
setIsSubmitting(true);

/* close modal immediately so cannot trigger twice */
const currentModal=qtyModal;
setQtyModal(null);

try{

const endpoint=
currentModal.mode==="add"
?"/api/product/addStock"
:"/api/product/reduce";

await axios.post(
`${API}${endpoint}`,
{
productName:currentModal.product.productName,
dealerId,
quantity:qty
},
getAuthHeaders()
);

setQtyInput("");

await loadProducts();

}
catch(err){
console.error(err);
alert("Stock update failed");
}
finally{
submittingRef.current=false;
setIsSubmitting(false);
}

};

/* ================= DELETE ================= */

const deleteProduct=async(p)=>{

if(!window.confirm(
"Delete this product?"
)) return;

try{

await axios.delete(
`${API}/api/product/delete/${p.productId}`,
getAuthHeaders()
);

alert("Deleted successfully");

loadProducts();

}
catch(err){
console.error(err);
alert("Delete failed");
}

};

/* ================= EDIT ================= */

const handleEditClick=(product)=>{
setEditProduct({
productId:product.productId,
productName:product.productName,
price:product.price,
description:product.description||""
});
};

const handleEditChange=(e)=>{
setEditProduct({
...editProduct,
[e.target.name]:e.target.value
});
};

const saveEdit=async()=>{

if(
!editProduct.productName ||
!editProduct.price
){
alert("Fill all fields");
return;
}

try{

await axios.put(
`${API}/api/product/update`,
{
productId:editProduct.productId,
productName:editProduct.productName,
price:Number(editProduct.price),
description:editProduct.description||""
},
{
headers:{
Authorization:`Bearer ${localStorage.getItem("token")}`,
"Content-Type":"application/json"
}
}
);

alert("Updated Successfully");

setEditProduct(null);

loadProducts();

}
catch(err){
console.error(err);
alert("Update failed");
}

};

/* ================= UI ================= */

return(

<div className="page">

<div className="topbar">
<p className="topbar-text">
Manage your inventory — grow your business 🚀
</p>
</div>

{/* NAVBAR */}
<div className="navbar">

<div className="logo">
DealerHub
</div>

<div className="nav-links">

<span
className={
location.pathname==="/dashboard"
?"active":""
}
onClick={()=>navigate("/dashboard")}
>
Dashboard
</span>

<span
className={
location.pathname==="/products"
?"active":""
}
onClick={()=>navigate("/products")}
>
Products
</span>

<span
className={
location.pathname==="/lowstock"
?"active":""
}
onClick={()=>navigate("/lowstock")}
>
Low Stock
</span>

<span onClick={() => window.location.href = "/orders"}>
  Reports
</span>

</div>

<div className="nav-right">
<span>
Welcome,
{localStorage.getItem("dealerName")
||"Dealer"}
</span>

<span>🔔</span>

<span
style={{cursor:"pointer"}}
onClick={()=>{
localStorage.clear();
window.location.href="/";
}}
>
Logout
</span>

</div>
</div>

{/* SEARCH */}
<div className="search-wrap">
<div className="search-box">

<span className="search-icon">
🔍
</span>

<input
value={search}
placeholder="Search products..."
onChange={(e)=>
handleSearch(
e.target.value
)
}
/>

</div>
</div>

{/* PRODUCTS */}
<div className="grid">

{products.map((p)=>(

<div
className="card"
key={p.productId}
>

<div
className="edit-icon"
onClick={()=>
handleEditClick(p)
}
>
✏️
</div>

<div className="card-content">

<img
src={
p.imageUrl
?`${API}/uploads/${p.imageUrl}`
:"https://via.placeholder.com/300"
}
alt=""
/>

<h4>
{p.productName}
</h4>

<div className="price">
₹{p.price}
</div>

<div className="qty">
{p.quantity} units
</div>

</div>

<div className="actions">

<button
type="button"
disabled={isSubmitting}
onClick={()=>
openQtyModal(
p,
"add"
)
}
>
＋
</button>

<button
type="button"
disabled={isSubmitting}
onClick={()=>
openQtyModal(
p,
"reduce"
)
}
>
－
</button>

<button
type="button"
onClick={()=>
deleteProduct(p)
}
>
🗑
</button>

</div>

</div>

))}

</div>

{/* QTY MODAL */}
{qtyModal && (

<div
className="modal"
onClick={(e)=>{
if(
e.target.className==="modal"
){
setQtyModal(null);
}
}}
>

<div
className="modal-box"
onClick={(e)=>
e.stopPropagation()
}
>

<h3>
{
qtyModal.mode==="add"
?"➕ Add Stock"
:"➖ Reduce Stock"
}
</h3>

<p className="modal-product-name">
{qtyModal.product.productName}
</p>

<input
type="number"
min="1"
value={qtyInput}
onChange={(e)=>
setQtyInput(
e.target.value
)
}
placeholder="Enter quantity"
autoFocus
onKeyDown={(e)=>{
if(
e.key==="Enter"
&& !e.repeat
){
e.preventDefault();
confirmQty();
}
}}
/>

<div className="modal-actions">

<button
type="button"
onClick={confirmQty}
disabled={isSubmitting}
>
{
isSubmitting
?"Please wait..."
:qtyModal.mode==="add"
?"Add"
:"Reduce"
}
</button>

<button
type="button"
onClick={()=>
setQtyModal(null)
}
disabled={isSubmitting}
>
Cancel
</button>

</div>

</div>
</div>

)}

{/* EDIT MODAL */}
{editProduct && (

<div
className="modal"
onClick={(e)=>{
if(
e.target.className==="modal"
){
setEditProduct(null);
}
}}
>

<div
className="modal-box"
onClick={(e)=>
e.stopPropagation()
}
>

<h3>
Edit Product
</h3>

<input
name="productName"
value={editProduct.productName}
onChange={handleEditChange}
/>

<input
type="number"
name="price"
value={editProduct.price}
onChange={handleEditChange}
/>

<textarea
name="description"
value={editProduct.description}
onChange={handleEditChange}
/>

<div className="modal-actions">

<button
onClick={saveEdit}
>
Save
</button>

<button
onClick={()=>
setEditProduct(null)
}
>
Cancel
</button>

</div>

</div>
</div>

)}

</div>

);

}