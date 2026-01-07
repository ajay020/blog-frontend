import axios from 'axios';

const API_URL = "/api/users/";

const register = async (userData)=>{
    const response = await axios.post(API_URL + "register", userData);

    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
}

const login = async (userData) =>{
    const response = await axios.post(API_URL + 'login', userData);

    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
}

const loginGoogle = async(googleTokenId) =>{
    const response = await axios.post(API_URL + 'auth/google', {googleTokenId});

    // console.log("data", response.data);


    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
}

const bookMarkPost = async (postId, token) =>{
    const config = {
        headers :{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.post(API_URL + "bookmark-post", {postId}, config);
    return response.data; 
}

const getBookMarkPosts = async (token)=>{
    const config = {
        headers :{
            Authorization: `Bearer ${token}`
        }
    }
    const response = await axios.get(API_URL + 'get-bookmark-posts', config);
    // console.log("data>>", response.data);
    return response.data; 
}

const logout = () =>{
    localStorage.removeItem('user');
}

const authService = {
    register,
    login,
    loginGoogle,
    logout ,
    bookMarkPost,
    getBookMarkPosts
}

export default authService;