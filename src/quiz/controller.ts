import { JsonController, Param, BadRequestError, NotFoundError, Get, Body, Patch, Delete, HttpCode, Post, HeaderParam } from 'routing-controllers'
import { Quiz, Question, Answer } from './entities'
import { Validate } from 'class-validator'
import * as request from 'superagent'

const eventUrl = process.env.EVENT_URL || 'localhost:4009/events'

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

  @Post("/quizzes")
  @HttpCode(201)
  async create(
    @Body() quiz: Quiz,
    @HeaderParam("x-user-role") userRole : string,
    @HeaderParam("x-user-id") userId : number,
  ) {

    if (userRole !== 'teacher' && userId === null) throw new NotFoundError('You are not authorised')
    const entityQuiz = await Quiz.create(quiz).save();

    for (let i = 0; i < quiz.question.length; i++) {
      const entityQuestion = await Question.create({
        quiz: entityQuiz,
        text: quiz.question[i].text,
        type: quiz.question[i].type
      }).save();

      for (let j = 0; j < quiz.question[i].answer.length; j++) {
        await Answer.create({
          question: entityQuestion,
          text: quiz.question[i].answer[j].text,
          correct: quiz.question[i].answer[j].correct
        }).save();
      }
  }

const {hasId, save, remove, ...eventData} = entityQuiz

 await request.post(eventUrl)
 .send({
   event: 'newquiz',
   data: eventData
 })

  return entityQuiz;
}

  @Patch('/quizzes')
  @HttpCode(201)
  async updateQuiz(
    @HeaderParam("x-user-role") userRole : string,
    @HeaderParam("x-user-id") userId : number,
    @Body() updates
  ) {
    if (userRole !== 'teacher' && userId === null) throw new NotFoundError('You are not authorised')
    const quiz = await Quiz.findOneById(updates.id)
    if (!quiz) throw new NotFoundError(`Quiz does not exist!`)
    await Quiz.merge(quiz, updates).save();

    updates.question.map(question => {
      if (question.id === undefined) Question.create({
            quiz: quiz,
            text: question.text,
            type: question.type
          }).save()
      else {
        let old_question = Question.findOneById(question.id)
        Question.merge(old_question, question)
      }

      question.answer.map(answer => {
        if (answer.id === undefined) Answer.create({
              question: question,
              text: answer.text,
              correct: answer.correct
            }).save()
        else {
          let old_answer = Answer.findOneById(answer.id)
          Question.merge(old_answer, answer)
        }
      })
    })

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
