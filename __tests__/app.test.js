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
            .then(({ body: {categories} }) => {
                expect(categories).toHaveLength(4);
                categories.forEach((category) => {
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
                .then(({ body }) => {
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
            .then(({ body }) => {
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
                .then(({ body }) => {
                    expect(body).toEqual({ msg: "Not Found" });
                });
        });

        it("400: Should return a 'Bad Request' error when the provided ID is an incorrect data type", () => {
            return request(app)
                .get("/api/reviews/notanumber")
                .expect(400)
                .then(({ body }) => {
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
            .then(({ body: {reviews} }) => {
                expect(reviews).toHaveLength(13);
                expect(reviews[4].comment_count).toBe(3);
                reviews.forEach((review) => {
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
            .then(({ body: {reviews} }) => {
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
            .then(({ body: {comments} }) => {
                expect(comments).toEqual([]);
            });
    });

    it("200: Should respond with the comment object corresponding to the review ID given", () => {
        const id = 5;
        return request(app)
            .get(`/api/reviews/${id}/comments`)
            .expect(200)
            .then(({ body: {comments} }) => {
                comments.forEach((comment) => {
                    expect(comment).toEqual(
                        expect.objectContaining({
                            comment_id: expect.any(Number),
                            author: expect.any(String),
                            body: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number),
                            review_id: expect.any(Number)
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
            .then(({ body: {comments} }) => {
                expect(comments).toBeSortedBy("created_at", {descending: true});
            });
    });

    describe("Errors", () => {
        it("404: Should return a 'Not Found' error when an endpoint with the provided ID doesn't exist", () => {
            return request(app)
                .get("/api/reviews/9999/comments")
                .expect(404)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: "Not Found" });
                });
        });

        it("400: Should return a 'Bad Request' error when the provided ID is an incorrect data type", () => {
            return request(app)
                .get("/api/reviews/notanumber/comments")
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: "Bad Request" });
                });
        });
    });
});

describe("7. POST /api/reviews/:review_id/comments", () => {
    it("201: Should respond with the posted comment", () => {
        const requestBody = {
            username: "mallionaire",
            body: "very cool very swag i like it"
        };
        return request(app)
            .post("/api/reviews/1/comments")
            .send(requestBody)
            .expect(201)
            .then(({ body: {comment} }) => {
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        review_id: expect.any(Number)
                    })
                );
            });
    });

    it("201: Should ignore all properties in requestBody except username and body", () => {
        const requestBody = {
            username: "mallionaire",
            body: "very cool very swag i like it",
            ignoreme: ">:-("
        };
        return request(app)
            .post("/api/reviews/1/comments")
            .send(requestBody)
            .expect(201)
            .then(({ body: {comment} }) => {
                expect(comment).toEqual(
                    expect.objectContaining({
                        comment_id: expect.any(Number),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        review_id: expect.any(Number)
                    })
                );
            });
    });

    describe("Errors", () => {
        it("404: Should return a 'Not Found' error when an endpoint with the provided ID doesn't exist", () => {
            const requestBody = {
                username: "mallionaire",
                body: "very cool very swag i like it"
            };
            return request(app)
                .post("/api/reviews/9999/comments")
                .send(requestBody)
                .expect(404)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: "Not Found" });
                });
        });

        it("400: Should return a 'Bad Request' error when the provided ID is an incorrect data type", () => {
            const requestBody = {
                username: "mallionaire",
                body: "very cool very swag i like it"
            };
            return request(app)
                .post("/api/reviews/notanumber/comments")
                .send(requestBody)
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: "Bad Request" });
                });
        });

        it("400: Should return a 'Bad Request' error when when passed an invalid object", () => {
            const requestBody = {};
            return request(app)
                .post("/api/reviews/1/comments")
                .send(requestBody)
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: "Bad Request" });
                });
        });

        it("400: Should return a 'Bad Request' error when when passed a comment body with incorrect data type", () => {
            const requestBody = {
                username: "mallionaire",
                body: 10
            };
            return request(app)
                .post("/api/reviews/1/comments")
                .send(requestBody)
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: "Bad Request" });
                });
        });

        it("404: Should return a 'Not Found' error when when passed a username that doesn't exist", () => {
            const requestBody = {
                username: "jameswhite",
                body: "very cool very swag i like it"
            };
            return request(app)
                .post("/api/reviews/1/comments")
                .send(requestBody)
                .expect(404)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: "Not Found" });
                });
        });
    });
});

describe("8. PATCH /api/reviews/:review_id", () => {
    it("200: Should respond with the updated review (positive votes value)", () => {
        return request(app)
            .patch("/api/reviews/1")
            .send({ inc_votes: 100 })
            .expect(200)
            .then(({ body: {review} }) => {
                expect(review.votes).toBe(101);
                expect(review).toEqual(
                    expect.objectContaining({
                        category: expect.any(String),
                        created_at: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_body: expect.any(String),
                        review_id: expect.any(Number),
                        review_img_url: expect.any(String),
                        title: expect.any(String),
                        votes: expect.any(Number)
                    })
                );
            });
    });

    it("200: Should respond with the updated review (negative votes value)", () => {
        return request(app)
            .patch("/api/reviews/1")
            .send({ inc_votes: -100 })
            .expect(200)
            .then(({ body: {review} }) => {
                expect(review.votes).toBe(-99);
                expect(review).toEqual(
                    expect.objectContaining({
                        category: expect.any(String),
                        created_at: expect.any(String),
                        designer: expect.any(String),
                        owner: expect.any(String),
                        review_body: expect.any(String),
                        review_id: expect.any(Number),
                        review_img_url: expect.any(String),
                        title: expect.any(String),
                        votes: expect.any(Number)
                    })
                );
            });
    });

    describe("Errors", () => {
        it("404: Should return a 'Not Found' error when an endpoint with the provided ID doesn't exist", () => {
            return request(app)
                .patch("/api/reviews/9999")
                .send({ inc_votes: 100 })
                .expect(404)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: "Not Found" });
                });
        });

        it("400: Should return a 'Bad Request' error when the provided ID is an incorrect data type", () => {
            return request(app)
                .patch("/api/reviews/notanumber")
                .send({ inc_votes: 100 })
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: "Bad Request" });
                });
        });

        it("400: Should return a 'Bad Request' error when when passed an invalid object", () => {
            return request(app)
                .patch("/api/reviews/1")
                .send({})
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: "Bad Request" });
                });
        });

        it("400: Should return a 'Bad Request' error when when passed a comment body with incorrect data type", () => {
            return request(app)
                .patch("/api/reviews/1")
                .send({ inc_votes: "not a number" })
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: "Bad Request" });
                });
        });
    });
});

describe("9. DELETE /api/comments/:comment:id", () => {
    it("204: Should respond with no content", () => {
        return request(app)
            .delete("/api/comments/6")
            .expect(204, '');
    });

    describe("Errors", () => {
        it("404: Should return a 'Not Found' error when an endpoint with the provided ID doesn't exist", () => {
            return request(app)
                .delete("/api/comments/9999")
                .expect(404)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: "Not Found" });
                });
        });

        it("400: Should return a 'Bad Request' error when the provided ID is an incorrect data type", () => {
            return request(app)
                .delete("/api/comments/notanumber")
                .expect(400)
                .then(({ body }) => {
                    expect(body).toEqual({ msg: "Bad Request" });
                });
        });
    });
});