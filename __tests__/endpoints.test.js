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
          expect(typeof review.comment_count).toBe("string");
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
  // test.only("GET - status 200, responds with review object with correct properties", () => {
  //   return request(app)
  //     .get("/api/reviews/3")
  //     .expect(200)
  //     .then((response) => {
  //       const review = response.body.review;
  //       console.log(review);
  //     });
  // });
});
describe("GET, /api/reviews", () => {
  test("GET - status 200, responds with review objects for all categories by default that sorted by default date and order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const reviews = response.body.reviews;
        expect(reviews).toBeSortedBy("created_at", {
          descending: true,
        });
        expect(reviews.length).toBe(13);
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
  test("GET - status 200, responds with reviews for passed category sorted by default date and order", () => {
    return request(app)
      .get("/api/reviews?category=social deduction")
      .expect(200)
      .then((response) => {
        const reviews = response.body.reviews;
        reviews.forEach((review) => {
          expect(review.category).toBe("social deduction");
        });
        expect(reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("GET - status 200, responds with review objects for all categories by default sorted by passed column and default order", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then((response) => {
        const reviews = response.body.reviews;
        expect(reviews.length).toBe(13);
        expect(reviews).toBeSortedBy("votes", {
          descending: true,
        });
      });
  });
  test("GET - status 200, responds with review objects for all categories by default sorted by default column in passed order", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then((response) => {
        const reviews = response.body.reviews;
        expect(reviews.length).toBe(13);
        expect(reviews).toBeSortedBy("created_at", {
          ascending: true,
        });
      });
  });
  test("GET - status 200, responds with review objects for passed category that sorted by passed date in passed order", () => {
    return request(app)
      .get("/api/reviews?category=social deduction&sort_by=title&order=asc")
      .expect(200)
      .then((response) => {
        const reviews = response.body.reviews;
        reviews.forEach((review) => {
          expect(review.category).toBe("social deduction");
        });
        expect(reviews).toBeSortedBy("title", {
          ascending: true,
        });
      });
  });
  test("GET - status 404 - responds with error when passed non-existent category", () => {
    return request(app)
      .get("/api/reviews?category=something")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Category not found :(");
      });
  });
  test("GET - status 400 - responds with error when passed non-existent sort-by column", () => {
    return request(app)
      .get("/api/reviews?sort_by=wrong")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Sorting query is not valid");
      });
  });
  test("GET - status 400 - responds with error when passed non-existent sorting order", () => {
    return request(app)
      .get("/api/reviews?order=plain")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Sorting order is not valid");
      });
  });
  test("GET - status 200 - responds with review objects ignoring wrong-named query, other queries will be applied", () => {
    return request(app)
      .get("/api/reviews?category=social deduction&sourt_by=title&order=asc")
      .expect(200)
      .then((response) => {
        const reviews = response.body.reviews;
        reviews.forEach((review) => {
          expect(review.category).toBe("social deduction");
        });
        expect(reviews).toBeSortedBy("created_at", {
          ascending: true,
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
describe("POST, /api/reviews/:review_id/comments", () => {
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
      });
  });
  test("POST - status 201 - responds with fresh-posted comment if additional property passed except of necessary ones, additional property has to be ignored", () => {
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
  test("POST - status 404 - responds with error message when non-existent username passed", () => {
    const newComment = {
      username: "Jimmy",
      body: "OMG this game is so good I spent 2 days with no rest playing it",
    };
    return request(app)
      .post("/api/reviews/5/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not found :(");
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
describe("PATCH /api/reviews/:review_id", () => {
  test("PATCH - status 200, responds with successfully updated review object", () => {
    const infoToUpdate = { inc_votes: 15 };
    return request(app)
      .patch("/api/reviews/1")
      .send(infoToUpdate)
      .expect(200)
      .then((response) => {
        const updatedReview = response.body.review;
        expect(updatedReview.votes).toBe(16);
      });
  });
  test("PATCH - status 200 - responds with successfully updated review object if additional property passed except of necessary one, additional property has to be ignored", () => {
    const infoToUpdate = { inc_votes: 15, title: "Something" };
    return request(app)
      .patch("/api/reviews/1")
      .send(infoToUpdate)
      .expect(200)
      .then((response) => {
        const updatedReview = response.body.review;
        expect(updatedReview.votes).toBe(16);
        expect(updatedReview.title).toBe("Agricola");
      });
  });
  test("PATCH - status 400 - responds with error message when required update field is missing", () => {
    const infoToUpdate = {};
    return request(app)
      .patch("/api/reviews/1")
      .send(infoToUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe(
          "Please pass a number of votes to change"
        );
      });
  });
  test("PATCH - status 400 - responds with error message when update field has incorrect type", () => {
    const infoToUpdate = { inc_votes: "15" };
    return request(app)
      .patch("/api/reviews/1")
      .send(infoToUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe(
          "The type of the votes property is not correct, has to be a number"
        );
      });
  });
  test("PATCH - status 404, responds with error message when object with passed review number doesn't exist", () => {
    const infoToUpdate = { inc_votes: 15 };
    return request(app)
      .patch("/api/reviews/88888888")
      .send(infoToUpdate)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Review not found :(");
      });
  });
  test("PATCH - status 400, responds with error message when passed review number is invalid", () => {
    const infoToUpdate = { inc_votes: 15 };
    return request(app)
      .patch("/api/reviews/something")
      .send(infoToUpdate)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad request :(");
      });
  });
});
describe("DELETE, /api/comments/:comment_id", () => {
  test("DELETE - status 204, responds with correct status", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE - status 404 - responds with error when passed unavailable route", () => {
    return request(app).get("/api/comme/1").expect(404);
  });
  test("DELETE - status 404, responds with error message when object with passed comment number doesn't exist", () => {
    return request(app)
      .delete("/api/comments/88888888")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Comment not found :(");
      });
  });
  test("DELETE - status 400, responds with error message when passed comment number is invalid", () => {
    return request(app)
      .delete("/api/comments/something")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad request :(");
      });
  });
});
describe("GET, /api/users", () => {
  test("GET - status 200 - responds with all categories", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body.users;
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
  test("GET - status 404 - responds with error when passed unavailable route", () => {
    return request(app).get("/api/uses").expect(404);
  });
});
