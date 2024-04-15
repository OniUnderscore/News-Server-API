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

describe("GET /api", () => {
  test("Endpoint should return a JSON Object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body;
        expect(typeof endpoints).toEqual("string");
      });
  });
  test("JSON should parse to an object populated with endpoint objects", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const endpoints = JSON.parse(body.endpoints);

        expect(endpoints.constructor).toEqual(Object);

        const endpointObjs = Object.values(endpoints);

        expect(endpointObjs.length > 0).toEqual(true);

        endpointObjs.forEach((endpoint) => {
          expect(endpoint.constructor).toEqual(Object);
        });
      });
  });
  test("Each endpoint object should contain the expected keys, in the expected format", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const endpoints = Object.values(JSON.parse(body.endpoints));

        expect(endpoints.length > 0).toEqual(true);

        endpoints.forEach((endpoint) => {
          expect(endpoint).toEqual(
            expect.objectContaining({
              description: expect.any(String),
              queries: expect.any(Array),
              exampleResponse: expect.any(Object),
              reqBodyFormat: expect.any(Object),
            })
          );
        });
      });
  });
});
