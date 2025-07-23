import axios from "axios";
const backendUrl = "https://ai-quiz-backend-b2ul.onrender.com/api";
const API = axios.create({
    baseURL: backendUrl,
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);

export const generateQuiz = (data) => API.post("/quiz/generate", data);
export const submitQuiz = (data) => API.post("/quiz/submit", data);
export const retryQuiz = (data) => API.post("/quiz/retry", data);
export const getAttempts = () => API.get("/quiz/attempts");
export const filterAttempts = (data) => API.post("/quiz/filter", data);
export const getQuizById = (quizId) => API.get(`/quiz/${quizId}`);