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