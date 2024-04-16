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

describe("POST /api/articles/:article_id/comments", () => {
  const content = {
    username: "butter_bridge",
    body: "Um, actually I'll think you'll find that that's HANLON's razor, not Occam's",
  };
  describe("Functionality", () => {
    test("When given a valid body, should return the comment object that has been posted ", () => {
      const output = {
        comment_id: 19,
        body: "Um, actually I'll think you'll find that that's HANLON's razor, not Occam's",
        article_id: 1,
        author: "butter_bridge",
        votes: 0,
        created_at: expect.any(String),
      };
      return request(app)
        .post("/api/articles/1/comments", content)
        .send(content)
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toEqual(output);
        });
    });

    test("After a new comment is posted, it should be the newest comment in the database", () => {
      return request(app)
        .post("/api/articles/1/comments", content)
        .send(content)
        .then(({ body }) => {
          const { comment } = body;
          return Promise.all([
            request(app).get("/api/articles/1/comments"),
            comment,
          ]);
        })
        .then(([{ body }, comment]) => {
          const { comments } = body;
          expect(comments[0]).toEqual(comment);
        });
    });
  });

  describe("Error Handling", () => {
    test("If given an article_id that is malformed, should return an error", () => {
      return request(app)
        .post("/api/articles/one/comments", content)
        .send(content)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toEqual("Invalid ID");
        });
    });

    test("If given an article_id that is valid, BUT doesn't exist, should return an error", () => {
      return request(app)
        .post("/api/articles/78897/comments", content)
        .send(content)
        .expect(404)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toEqual("Article Not Found");
        });
    });

    test("If given a malformed body in the quest, should return an error", () => {
      const wrongContent = {
        username: "butter_bridge",
      };

      return request(app)
        .post("/api/articles/1/comments", content)
        .send(wrongContent)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toEqual("Malformed Body");
        });
    });

    test("If given a comment by a user that does not exist should return an error", () => {
      const wrongContent = {
        username: "xXParadoXx",
        body: "If I don't exist how can I be posting this?",
      };

      return request(app)
        .post("/api/articles/1/comments", content)
        .send(wrongContent)
        .expect(400)
        .then(({ body }) => {
          const { msg } = body;
          expect(msg).toEqual("User does not exist");
        });
    });
  });
});
