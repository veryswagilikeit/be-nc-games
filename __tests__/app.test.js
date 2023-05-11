const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");
const json = require("../endpoints.json");

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
                    expect(body).toEqual({ msg: "Not Found "})
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








describe("5. GET /api/reviews", () => {
    it("200: Should respond with an array of review objects", () => {
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({ body: reviews }) => {
                const reviewsArr = reviews.reviews;
                expect(reviewsArr).toHaveLength(13);
                reviewsArr.forEach((review) => {
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
                expect(
                    reviews.every((review, index) => {
                        return (index === 0 || review.created_at <= reviews[index - 1].created_at);
                    })
                ).toBe(true);
            });
    });
});