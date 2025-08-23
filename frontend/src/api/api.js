import axios from "axios";

const API = axios.create({
  baseURL: "https://sogwa-81485d33beca.herokuapp.com/api", // Change to heroku backend URL on deploy
});

export const fetchCourses = () => API.get("/courses/");
export const fetchServices = () => API.get("/services/");
export const fetchGallery = () => API.get("/gallery/");
export const fetchNews = () => API.get("/news/");
export const sendEnquiry = (data) => API.post("/enquiries/", data);
export const fetchEnquiries = () => API.get("/enquiries/");
export const deleteEnquiry = (id) => API.delete(`/enquiries/${id}/`);
