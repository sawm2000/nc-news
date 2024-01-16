const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/");
const endpoints = require("../endpoints.json");
const sorted = require("jest-sorted");

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
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
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

        expect(response.body.endpoints).toEqual(endpoints);
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
          created_at: expect.any(String),
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("GET 404: should return 404 status code an error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/20")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Article Does Not Exist");
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
describe("/api/articles", () => {
  test("GET 200: should return an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(13);
        response.body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  
  test("GET 200: should return an array of article objects - sorted by date in descending order.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
        expect(response.body.articles[0]).toMatchObject({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          author: "icellusedkars",
          topic: "mitch",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: "2",
        });
      });
  });
});
describe("/api/articles/:article_id/comments", () => {
  test("GET 200: should return an array of comments for a given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(11);
        response.body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          })
        });
      });
  });
  test("GET 200: should return an empty array when given an article with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toEqual([]);
      });
  });

  test("GET 200: should return an array of comments for a given article_id - sorted by most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
        expect(response.body.comments[0]).toMatchObject({
          comment_id: 5,
          body: "I hate streaming noses",
          article_id: 1,
          author: "icellusedkars",
          votes: 0,
          created_at: "2020-11-03T21:00:00.000Z",
        });
      });
  });

  test("GET 404: should return 404 status code an error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/20/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Article Does Not Exist");
      });
  });

  test("GET 400: should return 400 status code an error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/sabreen/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
  test("POST 201: should post comments with body and username and return the posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Charming",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "Charming",
          article_id: 2,
          author: "butter_bridge",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });

  test("POST 404: should return 404 status code and error message when given a valid but non-existent article_id ", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Charming",
    };
    return request(app)
      .post("/api/articles/20/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("article_id Does Not Exist");
      });
  });

  test("POST 400: should return 400 status code and error message when given an invalid username", () => {
    const newComment = {
      username: "sabreen",
      body: "Charming",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Invalid Username");
      });
  });

  test("POST 400: should return 400 status code and error message when post request is missing required fields - username", () => {
    const newComment = {
      body: "Charming",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Missing Required Fields");
      });
  });

  test("POST 400: should return 400 status code and error message when post request is missing required fields - body", () => {
    const newComment = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Missing Required Fields");
      });
  });

  test("POST 400: should return 400 status code and error message when given invalid article_id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Charming",
    };
    return request(app)
      .post("/api/articles/sabreen/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
});
