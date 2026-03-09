import axiosInstance from "../utils/axiosInstance.js";

const register = async({userName, email, password}) => {
    try {
        const response = await axiosInstance.post("/api/auth/register", {
            userName, email, password
        }) 

        return response.data;
    } catch (error) {
        console.log(error);
    }
}

const login = async({ email, password}) => {
    try {
        const response = await axiosInstance.post("/api/auth/login", {
            email, password
        }) 

        return response.data;
    } catch (error) {
        console.log(error);
    }
}

const logout = async() => {
    try {
        const response = await axiosInstance.post("/api/auth/logout");
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

const profile = async() => {
    try {
        const response = await axiosInstance.get("/api/auth/profile");
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export {login, register, profile, logout};