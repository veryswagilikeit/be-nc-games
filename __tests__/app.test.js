const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");

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
                })
        })
    })
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
                    expect(body).toEqual({ msg: "Bad Request "});
            });
        });
    });
});