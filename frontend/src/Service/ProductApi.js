import axios from "axios"

const API_URL=import.meta.env.VITE_API_URL||"http://localhost:8080";

const api=axios.create({
    baseURL:API_URL,
    headers:{
        'Content-Type':'application/json',
    }

});

export const getAllProducts=async()=>{
   const response=await api.get(`/api/products`);
    return (response.data);
};

export const getProductById=async(id)=>{
   const response=await api.get(`/api/products/${id}`);
    return (response.data);
};

export const getSearch=async()=>{
   const response=await api.get(`/api/products/search`,{
    params:{name},
   });
    return (response.data);
};

export const getCategory=async(category)=>{
   const response=await api.get(`/api/products/category/${encodeURIComponent(category)}`
); 
    return (response.data);
   
}

export default api;