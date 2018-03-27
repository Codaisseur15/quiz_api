import { JsonController, Param, BadRequestError, NotFoundError, Get, Body, Patch, Delete, HttpCode, Post, HeaderParam } from 'routing-controllers'
import { Quiz, Question, Answer } from './entities'
import { Validate } from 'class-validator'

@JsonController()
export default class QuizController {

  @Get('/quizzes')
  @HttpCode(201)
  getQuizes() {
   return Quiz.find()
  }

  @Get('/quizzes/:id([0-9]+)')
  @HttpCode(201)
  getQuiz(
    @Param('id') quizId: number
  ) {
   return Quiz.findOneById(quizId)
  }

  @Post("/quiz")
  @HttpCode(201)
  async create(
    @Body()
    quiz: Quiz,
    answer: Answer,
    question: Question,
    @HeaderParam("x-user-role") userRole : string,
    @HeaderParam("x-user-id") userId : number,
  ) {

  if (userRole !== 'teacher' && userId === null) throw new NotFoundError('You are not authorised')
  const entity = await Quiz.create({
      title: quiz.title,
      question: [{
          text: question.text,
          type: question.type,
          answer: [{
              correct: answer.correct,
              text: answer.text
            }]
        }]
    }).save();

    return entity;
  }

  @Patch('/quizzes/:id([0-9]+)')
  @HttpCode(201)
  async updateQuiz(
    @HeaderParam("x-user-role") userRole : string,
    @HeaderParam("x-user-id") userId : number,
    @Param('id') quizId: number,
    @Body() updates
  ) {
    if (userRole !== 'teacher' && userId === null) throw new NotFoundError('You are not authorised')
    const quiz = await Quiz.findOneById(quizId)
    if (!quiz) throw new NotFoundError(`Quiz does not exist!`)

    console.log(quiz)
    console.log(updates)
    await Quiz.merge(quiz, updates).save();

    return {
      message: 'You successfully changed the quiz'
    }
  }

   @Delete('/quizzes/:id([0-9]+)')
   @HttpCode(201)
   async deleteQuiz(
     @Param('id') id: number,
     @HeaderParam("x-user-role") userRole : string,
     @HeaderParam("x-user-id") userId : number
   ) {
     if (userRole !== 'teacher' && userId === null) throw new NotFoundError('You are not authorised')
     const quiz = await Quiz.findOneById(id)
     if (!quiz) throw new NotFoundError(`Quiz does not exist!`)
     await quiz.remove()

     return {
       message: "You succesfully deleted the quiz"
     }
   }
}
