import { JsonController, Param, BadRequestError, NotFoundError, Get, Body, Patch, Delete, HttpCode } from 'routing-controllers'
import { Quiz, Question, Answer } from './entities'
import { Validate } from 'class-validator'

@JsonController()
export default class QuizController {

  @Get('/quizzes/:id([0-9]+)')
  @HttpCode(201)
  getQuiz(@Param('id') quizId: number
  ) {
   return Quiz.findOneById(quizId)
  }

  @Get('/quizzes')
  @HttpCode(201)
  getQuizes() {
   return Quiz.find()
  }

  //@Authorized()
  @Patch('/quizzes/:id([0-9]+)')
  @HttpCode(201)
  async updateQuiz(
    @Param('id') quizId: number,
    @Body() updates
  ) {
    const quiz = await Quiz.findOneById(quizId)
    if (!quiz) throw new NotFoundError(`Quiz does not exist!`)

    await Quiz.merge(quiz, updates).save();

    return {
      message: 'You successfully changed the quiz'
    }
  }

   //@Authorized()
   @Delete('/quizzes/:id([0-9]+)')
   @HttpCode(201)
   async deleteQuiz(@Param('id') id: number
   ) {
     const quiz = await Quiz.findOneById(id)
     if (!quiz) throw new NotFoundError(`Quiz does not exist!`)
     await quiz.remove();

     return {
       message: "You succesfully deleted the quiz"
     }
   }
}
