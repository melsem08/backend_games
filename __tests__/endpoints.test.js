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
const { response } = require("express");

beforeEach(() => {
  return seed({ categoryData, commentData, reviewData, userData });
});

afterAll(() => {
  return db.end();
});

describe("GET, /api/categories", () => {
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
describe("GET, /api", () => {
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
describe("GET, /api/reviews/:review_id", () => {
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
  test("GET - status 404, responds with error message when object with passed review number doesn't exist", () => {
    return request(app)
      .get("/api/reviews/88888888")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Review not found :(");
      });
  });
  test("GET - status 400, responds with error message when passed review number is invalid", () => {
    return request(app)
      .get("/api/reviews/something")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad request :(");
      });
  });
});
describe("GET, /api/reviews", () => {
  test("GET - status 200, responds with correct review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const reviews = response.body.reviews;
        reviews.forEach((review) => {
          expect(typeof review.review_id).toBe("number");
          expect(typeof review.title).toBe("string");
          expect(typeof review.category).toBe("string");
          expect(typeof review.designer).toBe("string");
          expect(typeof review.owner).toBe("string");
          expect(typeof review.review_img_url).toBe("string");
          expect(typeof review.created_at).toBe("string");
          expect(typeof review.votes).toBe("number");
          expect(typeof review.comment_count).toBe("string");
        });
      });
  });
  test("GET - status 200, responds with review objects sorted by date in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const reviews = response.body.reviews;
        expect(reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET - status 404 - responds with error when passed unavailable route", () => {
    return request(app).get("/api/reviev").expect(404);
  });
});
describe("GET, /api/reviews/:review_id/comments", () => {
  test("GET - status 200 - responds with correct comments object for the given review_id that has comments", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments.length).not.toBe(0);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.review_id).toBe("number");
        });
      });
  });
  test("GET - status 200, responds with correct comments object sorted in descending order", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET - status 200 - responds with empty comments array for the given existing review_id with no comments", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toEqual([]);
      });
  });
  test("GET - status 404, responds with error message when passed review number doesn't exist", () => {
    return request(app)
      .get("/api/reviews/888/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Review not found :(");
      });
  });
  test("GET - status 400, responds with error message when passed review number is invalid", () => {
    return request(app)
      .get("/api/reviews/something/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad request :(");
      });
  });
});
describe.only("POST, /api/reviews/:review_id/comments", () => {
  test("POST - status 201 - responds with fresh-posted comment", () => {
    const newComment = {
      username: "dav3rid",
      body: "OMG this game is so good I spent 2 days with no rest playing it",
    };
    return request(app)
      .post("/api/reviews/5/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment.review_id).toBe(5);
        expect(comment.author).toBe("dav3rid");
        expect(comment.body).toBe(
          "OMG this game is so good I spent 2 days with no rest playing it"
        );
        expect(comment.votes).toBe(0);
      });
  });
  test("POST - status 201 - responds with fresh-posted comment if additional property passed except of necessary", () => {
    const newComment = {
      username: "dav3rid",
      body: "OMG this game is so good I spent 2 days with no rest playing it",
      votes: 10,
    };
    return request(app)
      .post("/api/reviews/5/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment.review_id).toBe(5);
        expect(comment.author).toBe("dav3rid");
        expect(comment.body).toBe(
          "OMG this game is so good I spent 2 days with no rest playing it"
        );
        expect(comment.votes).toBe(0);
      });
  });
  test("POST - status 400 - responds with error message when one or more fields of comment object missing", () => {
    const newComment = {
      username: "dav3rid",
    };
    return request(app)
      .post("/api/reviews/5/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe(
          "Now enough information to post a comment"
        );
      });
  });
  test("POST - status 400 - responds with error message when one or more fields of comment object have incorrect type", () => {
    const newComment = {
      username: "dav3rid",
      body: 8,
    };
    return request(app)
      .post("/api/reviews/5/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe(
          "The type of information you are trying to enter are not correct"
        );
      });
  });
  test("POST - status 400 - responds with error message when non-existent username passed", () => {
    const newComment = {
      username: "Jimmy",
      body: "OMG this game is so good I spent 2 days with no rest playing it",
    };
    return request(app)
      .post("/api/reviews/5/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad request :(");
      });
  });
  test("POST - status 404, responds with error message when object with passed review number doesn't exist", () => {
    const newComment = {
      username: "dav3rid",
      body: "OMG this game is so good I spent 2 days with no rest playing it",
    };
    return request(app)
      .post("/api/reviews/88888888/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Review not found :(");
      });
  });
  test("POST - status 400, responds with error message when passed review number is invalid", () => {
    const newComment = {
      username: "dav3rid",
      body: "OMG this game is so good I spent 2 days with no rest playing it",
    };
    return request(app)
      .post("/api/reviews/something/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad request :(");
      });
  });
});
