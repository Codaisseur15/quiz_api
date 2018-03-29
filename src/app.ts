import 'reflect-metadata'
import {createKoaServer, Action } from "routing-controllers"
import QuizController from './quiz/controller'

export const app = createKoaServer({
  cors: true,
  controllers: [
    QuizController
  ],
  authorizationChecker: (action: Action) => {
    return action.request.headers["x-user-role"] === 'teacher'
  }
})
