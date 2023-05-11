const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const fsSync = require("fs");
const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data/index.js");

beforeEach(() => {
  return seed({ categoryData, commentData, reviewData, userData });
});

afterAll(() => {
  return db.end();
});

describe("/api/categories", () => {
  test("GET - status 200 - responds with all categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        const categories = response.body.categories;
        expect(categories.length).toBe(4);
        categories.forEach((category) => {
          expect(typeof category.slug).toBe("string");
          expect(typeof category.description).toBe("string");
        });
      });
  });
  test("GET - status 404 - responds with error when passed unavailable route", () => {
    return request(app).get("/api/categor").expect(404);
  });
});
describe("/api", () => {
  test("GET - status 200, responds with right JSON object", () => {
    const checkData = fsSync.readFileSync("./endpoints.json", "utf-8");
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const responseData = response.body.api;
        expect(responseData).toEqual(checkData);
      });
  });
  test("GET - status 200, responds with JSON object despite the passed query", () => {
    const checkData = fsSync.readFileSync("./endpoints.json", "utf-8");
    return request(app)
      .get("/api?query=givemesomeapi")
      .expect(200)
      .then((response) => {
        const responseData = response.body.api;
        expect(responseData).toEqual(checkData);
      });
  });
});
describe("/api/reviews/:review_id", () => {
  test("GET - status 200, responds with review object with correct properties", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then((response) => {
        const review = response.body.review;
        review.forEach((review) => {
          expect(typeof review.review_id).toBe("number");
          expect(typeof review.title).toBe("string");
          expect(typeof review.category).toBe("string");
          expect(typeof review.designer).toBe("string");
          expect(typeof review.owner).toBe("string");
          expect(typeof review.review_body).toBe("string");
          expect(typeof review.review_img_url).toBe("string");
          expect(typeof review.created_at).toBe("string");
          expect(typeof review.votes).toBe("number");
        });
      });
  });
  test("GET - status 404 - responds with error when passed unavailable route", () => {
    return request(app).get("/api/revie/1").expect(404);
  });
  test("GET - status 404, responds with error when object with passed review number doesn't exist", () => {
    return request(app).get("/api/review/88888888").expect(404);
  });
  test("GET - status 400, responds with error message when passed review number is invalid", () => {
    return request(app)
      .get("/api/reviews/something")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Review ID is invalid!");
      });
  });
});
