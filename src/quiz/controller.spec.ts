import 'jest'
import * as request from 'supertest'
import {app} from '../app'
import setupDb from '../db'
import { Quiz } from './entities'

const createQuiz = {
"title": "Test Quiz",
"question": [
  {
      "text": "What is Test?",
      "type": "radio",
      "answer": [
          {
              "correct": true,
              "text": "passing"
          }
      ]
  }
]
}

const patchQuiz = {
    "id": 1,
    "question": [
        {
            "answer": [
                {
                    "correct": true,
                    "text": "passing"
                }
            ],
            "text": "What is Test?",
            "type": "radio"
        }
    ],
    "title": "Test Quiz"
}



beforeAll(async () => {
  await setupDb()
})

describe('Get all Quizzes', () => {
  test('/quizzes', async () => {
    await request(await app.callback())
    .get('/quizzes')
    .set('Accept', 'application/json')
    .expect(200)
  })
})

describe('Get Quiz by id', () => {
  test('/quizzes/:id([0-9]+)', async () => {
    await request(await app.callback())
    .get('/quizzes')
    .set('Accept', 'application/json')
    .expect(200)
  })
})

// describe('Post Quiz', () => {
//   test('/quizzes', async () => {
//     await request(await app.callback())
//     .post('/quizzes')
//     .set('Accept', 'application/json')
//     .set('x-user-role', 'teacher')
//     .send(createQuiz)
//     .expect(function(res) {
//       res.body.id = 'someid'
//     })
//     .expect(201, {
//       "title": "Test Quiz",
//       "question": [
//         {
//             "text": "What is Test?",
//             "type": "radio",
//             "answer": [
//                 {
//                     "correct": true,
//                     "text": "passing"
//                 }
//             ]
//         }
//       ], "id": 'someid'
//     })
//   })
// })
//
// describe('Patch Quiz', () => {
//   test('/quizzes', async () => {
//     await request(await app.callback())
//     .patch('/quizzes')
//     .set('Accept', 'application/json')
//     .set('x-user-role', 'teacher')
//     .send(patchQuiz)
//     .expect(201)
//   })
// })
//
// describe('Delete Quiz', () => {
//   test('/quizzes/', async () => {
//     await request(await app.callback())
//     .delete(`/quizzes/${TESTQUIZID}`)
//     .set('Accept', 'application/json')
//     .set('x-user-role', 'teacher')
//     .expect(204)
//   })
// })
