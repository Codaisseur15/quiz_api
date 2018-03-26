import { JsonController, Post, HttpCode, Body, } from "routing-controllers";
import { Quiz, Question, Answer } from "./entities";


@JsonController()
export default class QuizController {



  @Post("/quiz")
  @HttpCode(201)
  async create(
    @Body()
    quiz: Quiz,
    answer: Answer,
    question: Question
  ) {

  const entity = await Quiz.create({
      title: quiz.title,
      question: [{
          text: question.text,
          type: question.type,
          quiz: quiz,
          answer: [{
              correct: answer.correct,
              text: answer.text,
              question: question
            }]
        }]
    }).save();

    return entity;
  }
}
