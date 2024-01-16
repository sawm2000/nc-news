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
  test("GET 200: should return an array of topic objects with slug and description properties", () => {
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
  test("GET 404: should return 404 status code and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/20")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Article Does Not Exist");
      });
  });

  test("GET 400: should return 400 status code and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/sabreen")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });

  test("PATCH 200: should increment votes property based on newVote object - increment", () => {
    const newVote = {
      inc_votes: 3,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then((response) => {
        expect(response.body.article).toMatchObject({
          article_id: 1,
          votes: 103,
        });
      });
  });

  test("PATCH 200: should increment votes property based on newVote object - decrement", () => {
    const newVote = {
      inc_votes: -10,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then((response) => {
        expect(response.body.article).toMatchObject({
          article_id: 1,
          votes: 90,
        });
      });
  });

  test("PATCH 200: should return original article if inc_votes is missing", () => {
    const newVote = {};
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then((response) => {
        expect(response.body.article).toMatchObject({
          article_id: 1,
          votes: 100,
        });
      });
  });

  test("PATCH 404: should return 404 status code and error message when given a valid but non-existent article_id", () => {
    const newVote = {
      inc_votes: 3,
    };
    return request(app)
      .patch("/api/articles/20")
      .send(newVote)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Article Does Not Exist");
      });
  });

  test("PATCH 400: should return 400 status code and error message when given an invalid article_id", () => {
    const newVote = {
      inc_votes: 3,
    };
    return request(app)
      .patch("/api/articles/sabreen")
      .send(newVote)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });

  test("PATCH 400: should return 400 status code and error message when patch request is missing required fields", () => {
    const newVote = {
      inc_votes: null,
    };
    return request(app)
      .patch("/api/articles/2")
      .send(newVote)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Invalid Patch Query");
      });
  });

  test("PATCH 400: should return 400 status code and error message when patch request contains data with the wrong data type", () => {
    const newVote = {
      inc_votes: "sabreen",
    };
    return request(app)
      .patch("/api/articles/2")
      .send(newVote)
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

  test("GET 200: should filter article objects based on topic query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(12);
        response.body.articles.forEach((article) => {
          expect(article).toMatchObject({
            topic: "mitch",
          });
        });
      });
  });
  test("GET 200: should return an empty array if topic with no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(0);
        response.body.articles.forEach((article) => {
          expect(article).toEqual([]);
        });
      });
  });

  test("GET 404: should return 404 status code and error message when given a valid but non-existent query", () => {
    return request(app)
      .get("/api/articles?topic=sabreen")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Topic Does Not Exist");
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
          });
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

  test("GET 404: should return 404 status code and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/20/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Article Does Not Exist");
      });
  });

  test("GET 400: should return 400 status code and error message when given an invalid id", () => {
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

describe("/api/comments/:comment_id", () => {
  test("DELETE 204: deletes specified comment and sends no body back", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("DELETE 404: should return 404 status code and error message when given a valid but non-existent comment_id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Comment Does Not Exist");
      });
  });

  test("DELETE 400: should return 400 status code and error message when given an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/sabreen")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
});
describe("/api/users", () => {
  test("GET 200: should return an array of user objects with username, name and avatar_url properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users.length).toBe(4);
        response.body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
