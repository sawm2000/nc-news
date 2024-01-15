const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/");

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
        expect(response.body.topics.length).toBe(3)
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
        Object.keys(response.body.endpoints).forEach((endpoint)=>{
           const currentEndpoint = response.body.endpoints[endpoint]
           if(endpoint === "GET /api"){
            expect(typeof currentEndpoint.description).toBe("string");
           }else{
           expect(typeof currentEndpoint.description).toBe("string");
           expect(Array.isArray(currentEndpoint.queries)).toBe(true);
           expect(typeof currentEndpoint.exampleResponse).toBe("object");
           }
        })

         })

        
      });
  });

