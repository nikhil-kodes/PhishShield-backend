import express from "express";
import questions from "../utils/phishing_questions_v2.json" with { type: "json" };
import { protect } from "../middlewares/authMiddleware.js";

function getRandomQuestions(num = 5) {
	return questions.sort(() => 0.5 - Math.random()).slice(0, num);
}

const random_questions = getRandomQuestions();
const router = express.Router()

router.get("/", protect, (req, res)=>{
    res.json({...random_questions})
})

export default router;