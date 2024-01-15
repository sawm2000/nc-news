const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/");
const endpoints = require("../endpoints.json")

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  test("GET 200: should return an array of topic objects with slug and description property", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});
describe("/api", () => {
  test("GET 200: should return an object describing all the available endpoints on your API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        // Object.keys(response.body.endpoints).forEach((endpoint) => {
        //   const currentEndpoint = response.body.endpoints[endpoint];
        //   if (endpoint === "GET /api") {
        //     expect(typeof currentEndpoint.description).toBe("string");
        //   } else {
        //     expect(typeof currentEndpoint.description).toBe("string");
        //     expect(Array.isArray(currentEndpoint.queries)).toBe(true);
        //     expect(typeof currentEndpoint.exampleResponse).toBe("object");
        //   }
        // });

        expect(response.body.endpoints).toEqual(endpoints)
      });
  });
});
describe("/api/articles/:article_id", () => {
  test("GET 200: should return a single article object based on article_id given", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
        expect(typeof response.body.article.created_at).toBe("string")
      });
  });
  test("GET 404: should return 404 status code an error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/20")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("article does not exist");
      });
  });

  test("GET 400: should return 400 status code an error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/sabreen")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
});
