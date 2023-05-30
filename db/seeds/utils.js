const db = require("../connection");

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

// exports.validSorting = (sort_by_category) => {
//   console.log("IN UTIL FUNC validSorting");
//   const queryString = `SELECT * FROM categories WHERE slug =($1)`;
//   const queryValue = [category];
//   return db.query(queryString, queryValue).then((results) => {
//     console.log("CHECK MADE");
//     if (results.rows.length === 0) {
//       return Promise.reject({
//         status: 404,
//         message: "Review not found :(",
//       });
//     }
//     return results.rows;
//   });
// };
