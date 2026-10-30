import axios from "axios";

const API_URL="http://localhost:8080/api/auth";

export const registerUser=async(userData)=>{
    const response=await axios.post(`${API_URL}/register`,userData);
    return (response.data);
}

export const loginUser=async(credential)=>{
    const response=await axios.post(`${API_URL}/login`,credential);
    return (response.data);
}

export const getCurrentUser=async()=>{
    const response=await axios.get(`${API_URL}/user/me`,{
        headers:{
            Authorization:`Bear ${token}`,
        },
    })
}