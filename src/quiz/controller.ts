import { JsonController, Param, BadRequestError, NotFoundError, Get, Body, Patch } from 'routing-controllers'
import { Quiz, Question, Answer } from './entities'
import { Validate } from 'class-validator'

@JsonController()
export default class QuizController {

  @Patch('/quiz/:id([0-9]+)')
  async updateQuiz(
    @Param('id') quizId: number,
    @Body() updates
  ) {
    const quiz = await Quiz.findOneById(quizId)
    if (!quiz) throw new NotFoundError(`Quiz does not exist!`)

    await Quiz.merge(quiz, updates).save();

    return {
      message: 'You successfully changed quiz'
    }
  }
}
