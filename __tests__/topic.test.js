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

describe("01 GET /api/topics", () => {
  describe("Functionality", () => {
    test("When correctly called, endpoint should return a 200 status code", () => {
      return request(app).get("/api/topics").expect(200);
    });

    test("When called, endpoint should return a body containing an array of topic Objects", () => {
      return request(app)
        .get("/api/topics")
        .then(({ body }) => {
          const { topics } = body;
          expect(topics.constructor).toEqual(Array);
          topics.forEach((topic) => {
            expect(topic.constructor).toEqual(Object);
          });
        });
    });

    test("Returned topic objects should be in the correct format ", () => {
      return request(app)
        .get("/api/topics")
        .then(({ body }) => {
          const { topics } = body;
          topics.forEach;
          (topic) => {
            expect(typeof topic.slug).toEqual("string");
            expect(typeof topic.description).toEqual("string" || null);
          };
        });
    });

    test("Returned topics, should match expected data", () => {
      const expectedData = [
        { slug: "mitch", description: "The man, the Mitch, the legend" },
        { slug: "cats", description: "Not dogs" },
        { slug: "paper", description: "what books are made of" },
      ];

      return request(app)
        .get("/api/topics")
        .then(({ body }) => {
          const { topics } = body;
          expect(topics.length).toEqual(expectedData.length);

          expect(topics).toContainEqual(expectedData[0]);
          expect(topics).toContainEqual(expectedData[1]);
          expect(topics).toContainEqual(expectedData[2]);
        });
    });
  });

  describe("Error Handling", () => {
    test("If the topics table is empty, should return a 404 error", () => {
      return db
        .query("DROP TABLE IF EXISTS comments, articles, users;")
        .then(() => {
          return db.query("TRUNCATE TABLE topics;");
        })
        .then(() => {
          return request(app)
            .get("/api/topics")
            .expect(404)
            .then(({ body }) => {
              const { msg } = body;
              expect(msg).toEqual("Table is Empty");
            });
        });
    });
  });
});

describe("General Errors", () => {
  test("If endpoint does not exist, return a 400 error", () => {
    return request(app)
      .get("/api/notanendpoint")
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toEqual("Bad request");
      });
  });
});
