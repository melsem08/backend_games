const db = require("../connection");
const Joi = require("joi");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createRef = (arr, key, value) => {
  return arr.reduce((ref, element) => {
    ref[element[key]] = element[value];
    return ref;
  }, {});
};

exports.formatComments = (comments, idLookup) => {
  return comments.map(({ created_by, belongs_to, ...restOfComment }) => {
    const article_id = idLookup[belongs_to];
    return {
      article_id,
      author: created_by,
      ...this.convertTimestampToDate(restOfComment),
    };
  });
};

exports.checkCommentById = (commentId) => {
  const queryString = `SELECT * FROM comments WHERE comment_id=($1)`;
  const queryValue = [commentId];
  return db.query(queryString, queryValue).then((results) => {
    if (results.rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: "Comment not found :(",
      });
    }
    return results.rows;
  });
};

exports.validCategories = (category) => {
  const queryString = `SELECT * FROM categories WHERE slug =($1)`;
  const queryValue = [category];
  return db.query(queryString, queryValue).then((results) => {
    if (results.rows.length === 0 && category !== undefined) {
      return Promise.reject({
        status: 404,
        message: "Category not found :(",
      });
    }
    return results.rows;
  });
};

exports.checkReviewById = (reviewId) => {
  const queryString = `SELECT * FROM reviews WHERE review_id=($1)`;
  const queryValue = [reviewId];
  return db.query(queryString, queryValue).then((results) => {
    if (results.rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: "Review not found :(",
      });
    }
    return results.rows;
  });
};

exports.checkBody = (data) => {
  const schema = Joi.object({
    owner: Joi.string().required(),
    title: Joi.string().required(),
    review_body: Joi.string().required(),
    designer: Joi.string().required(),
    category: Joi.string().required(),
    review_img_url: Joi.string().uri().optional(),
  });
  return schema.validate(data);
};

exports.validUsernames = (username) => {
  const queryString = `SELECT * FROM users WHERE username =($1)`;
  const queryValue = [username];
  return db.query(queryString, queryValue).then((results) => {
    if (results.rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: "Username not found :(",
      });
    }
    return results.rows;
  });
};
