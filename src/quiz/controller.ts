import { JsonController, Param, BadRequestError, NotFoundError, Get, Body, Patch, Delete, HttpCode, Post, HeaderParam, Authorized } from 'routing-controllers'
import { Quiz, Question, Answer } from './entities'
import { Validate } from 'class-validator'
import * as request from 'superagent'

const eventUrl = process.env.EVENT_URL || 'localhost:4009/events'

@JsonController()
export default class QuizController {

  @Get('/quizzes')
  @HttpCode(200)
  getQuizes() {
   return Quiz.find()

   const TestQuiz = Quiz.findOne({title: 'Test Quiz'})
   console.log(TestQuiz)
  }

  @Get('/quizzes/:id([0-9]+)')
  @HttpCode(200)
  getQuiz(
    @Param('id') quizId: number
  ) {
   return Quiz.findOneById(quizId)
  }

  @Authorized()
  @Post("/quizzes")
  @HttpCode(201)
  async create(
    @Body() quiz: Quiz,
  ) {
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

  @Authorized()
  @Patch('/quizzes')
  @HttpCode(201)
  async updateQuiz(
    @Body() updates : Quiz
  ) {
    const quiz = await Quiz.findOneById(updates.id)
    if (!quiz) throw new NotFoundError(`Quiz does not exist!`)
    await Quiz.merge(quiz, updates).save()

    const allQuestions = await Promise.all(updates.question.map(async question => {
      if (question.id === undefined) {
        const entity = await Question.create({
            quiz: quiz,
            text: question.text,
            type: question.type
          }).save()
         await question.answer.map(async answer => {
            await Answer.create({
            question: entity,
            text: answer.text,
            correct: answer.correct
          }).save()
        })
        }
      else {
        let old_question = await Question.findOneById(question.id)
        let questionMerge = await Question.merge(old_question, question).save()
      }

    const allAnswers = await Promise.all(question.answer.map(async answer => {
        if (answer.id === undefined) {
          await Answer.create({
            question: question,
            text: answer.text,
            correct: answer.correct
          }).save()
      }
      else {
          let old_answer = await Answer.findOneById(answer.id)
           let answerMerge = await Question.merge(old_answer, answer).save()
        }
      }))
    }))

    return {quiz}
  }

  @Authorized()
  @Delete('/quizzes/:id([0-9]+)')
  @HttpCode(201)
  async deleteQuiz(
    @Param('id') id: number
  ) {
    const quiz = await Quiz.findOneById(id)
    if (!quiz) throw new NotFoundError(`Quiz does not exist!`)
    await quiz.remove()

    return {
      message: "You succesfully deleted the quiz"
    }
  }
}
