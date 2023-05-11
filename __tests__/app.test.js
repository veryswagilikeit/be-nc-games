const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const json = require("../endpoints.json");
require("jest-sorted");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("3. GET /api/categories", () => {
    it("200: Should respond with an array of all the category objects", () => {
        return request(app)
            .get("/api/categories")
            .expect(200)
            .then(({ body: categories }) => {
                const categoryArr = categories.categories;
                expect(categoryArr).toHaveLength(4);
                categoryArr.forEach((category) => {
                    expect(category).toEqual(
                        expect.objectContaining({
                            slug: expect.any(String),
                            description: expect.any(String)
                        })
                    );
                });
            });
    });

    describe("Errors", () => {
        it("404: Should return a 'Not Found' error when endpoint doesn't exist", () => {
            return request(app)
                .get("/not-a-route")
                .expect(404)
                .then((res) => {
                    const body = res.body;
                    expect(body).toEqual({ msg: "Not Found" })
                });
        });
    });
});

describe("3.5. GET /api", () => {
    it("200: Should respond with a JSON object describing all the available endpoints on the API", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then((res) => {
                const body = res.body;
                expect(body).toEqual(json);
            });
    });
});

describe("4. GET /api/reviews/:review_id", () => {
    it("200: Should respond with the review object containing all the relevant properties", () => {
        const id = 1;
        return request(app)
            .get(`/api/reviews/${id}`)
            .expect(200)
            .then(({ body }) => {
                expect.objectContaining({
                    review_id: id,
                    title: "Agricola",
                    review_body: "Farmyard fun!",
                    designer: "Uwe Rosenberg",
                    review_img_url: "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700",
                    votes: 1,
                    category: "euro game",
                    owner: "mallionaire",
                    created_at: new Date(1610964020514)
                });
            });
    });

    describe("Errors", () => {
        it("404: Should return a 'Not Found' error when an endpoint with the provided ID doesn't exist", () => {
            return request(app)
                .get("/api/reviews/9999")
                .expect(404)
                .then((res) => {
                    const body = res.body;
                    expect(body).toEqual({ msg: "Not Found" });
                });
        });

        it("400: Should return a 'Bad Request' error when the provided ID is an incorrect data type", () => {
            return request(app)
                .get("/api/reviews/notanumber")
                .expect(400)
                .then((res) => {
                    const body = res.body;
                    expect(body).toEqual({ msg: "Bad Request" });
            });
        });
    });
});

describe("5. GET /api/reviews", () => {
    it("200: Should respond with an array of review objects", () => {
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body: reviews }) => {
                const reviewsArr = reviews.reviews;
                expect(reviewsArr).toHaveLength(13);
                expect(reviewsArr[4].comment_count).toBe(3);
                reviewsArr.forEach((review) => {
                    expect("body" in review).toBe(false);
                    expect(review).toEqual(
                        expect.objectContaining({
                            owner: expect.any(String),
                            title: expect.any(String),
                            review_id: expect.any(Number),
                            category: expect.any(String),
                            review_img_url: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            designer: expect.any(String),
                            comment_count: expect.any(Number),
                        })
                    );
                });
            });
    });

    it("200: Should respond with reviews sorted by date (desc) by default", () => {
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body: { reviews } }) => {
                expect(reviews).toBeSortedBy("created_at", {descending: true});
            });
    });
});

describe("6. GET /api/reviews/:review_id/comments", () => {
    it("200: Should respond with an empty array when there are no comments on the review", () => {
        const id = 1;
        return request(app)
            .get(`/api/reviews/${id}/comments`)
            .expect(200)
            .then(({ body: comments }) => {
                const commentsArr = comments.comments;
                expect(commentsArr).toEqual([]);
            });
    });

    it("200: Should respond with the comment object corresponding to the review ID given", () => {
        const id = 5;
        return request(app)
            .get(`/api/reviews/${id}/comments`)
            .expect(200)
            .then(({ body: comments }) => {
                const commentsArr = comments.comments;
                commentsArr.forEach((comment) => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: expect.any(Number),
                            author: expect.any(String),
                            body: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                        })
                    );
                });
            });
    });

    it("200: Should respond with comments sorted by date (desc) by default", () => {
        const id = 2;
        return request(app)
            .get(`/api/reviews/${id}/comments`)
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(comments).toBeSortedBy("created_at", {descending: true});
            });
    });

    describe("Errors", () => {
        it("404: Should return a 'Not Found' error when an endpoint with the provided ID doesn't exist", () => {
            return request(app)
                .get("/api/reviews/9999/comments")
                .expect(404)
                .then((res) => {
                    const body = res.body;
                    expect(body).toEqual({ msg: "Not Found" });
                });
        });

        it("400: Should return a 'Bad Request' error when the provided ID is an incorrect data type", () => {
            return request(app)
                .get("/api/reviews/notanumber/comments")
                .expect(400)
                .then((res) => {
                    const body = res.body;
                    expect(body).toEqual({ msg: "Bad Request" });
                });
        });
    });
});