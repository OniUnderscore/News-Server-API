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

describe("04 GET /api/articles/:article_id", () => {
  describe("Functionality", () => {
    test("Should return an article object ", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article.constructor).toEqual(Object);
        });
    });

    test("Article object should be in the expected format", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              article_img_url: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });

    test("Article should return the expected data", () => {
      const output = {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };

      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toEqual(output);
        });
    });
  });

  describe("Error Handling", () => {
    test("If ID is not a valid format (A number), return a 300 error", () => {
      return request(app)
        .get("/api/articles/notavalidID")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("ID is Malformed");
        });
    });
    test("If ID is valid, but has no content associated with it, should return a 404", () => {
      return request(app)
        .get("/api/articles/6565")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("Article not Found");
        });
    });
  });
});

describe("05 GET /api/articles", () => {
  describe("Functionality", () => {
    test("Should return an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles.constructor).toEqual(Array);
          expect(articles.length).toEqual(13);
          articles.forEach((article) => {
            expect(article.constructor).toEqual(Object);
          });
        });
    });
    test("returned article object should contain the appropriate keys", () => {
      return request(app)
        .get("/api/articles")
        .then(({ body }) => {
          const { articles } = body;
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                author: expect.any(String),
                title: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    test("returned article object should NOT contain a body key", () => {
      return request(app)
        .get("/api/articles")
        .then(({ body }) => {
          const { articles } = body;
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.not.objectContaining({
                body: expect.anything(),
              })
            );
          });
        });
    });
    test("returned articles should be sorted by date descending", () => {
      return request(app)
        .get("/api/articles")
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSorted({
            descending: true,
            key: "created_at",
            coerce: true,
          });
        });
    });
  });
  //The only error that should occur here is if the endpoint doesn't exist, which has already been tested during GET /api/topics
});
