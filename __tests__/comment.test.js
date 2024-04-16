const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../API/app");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("GET /api/articles/:article_id/comments", () => {
  describe("Functionality", () => {
    test("Should return an Array of comment Objects", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments.length).toEqual(11);
          comments.forEach((comment) => {
            expect(comment.constructor).toEqual(Object);
          });
        });
    });
    test("Comment Objects should be returned in the expected format", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: 1,
              })
            );
          });
        });
    });
    test("Comment Objects should contain the expected data", () => {
      output = {
        comment_id: 2,
        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
        article_id: 1,
        author: "butter_bridge",
        votes: 14,
        created_at: "2020-10-31T03:03:00.000Z",
      };
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments[1]).toEqual(output);
        });
    });
    test("Comment Objects should be sorted in date descending order", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toBeSorted({
            descending: true,
            key: "created_at",
            coerce: true,
          });
        });
    });
  });

  describe("Error Handling", () => {
    test("Should return an error if the article ID given is not valid", () => {
      return request(app)
        .get("/api/articles/one/comments")
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toEqual("Invalid ID");
        });
    });
    test("Should return an error if the article ID IS valid, but the article does not exist", () => {
      return request(app)
        .get("/api/articles/5000/comments")
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toEqual("Article Not Found");
        });
    });
  });
});
