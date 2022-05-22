//import request from "supertest";
import { expect, assert } from "chai";
const BASE_URL = "http://localhost:4000/v1/cache";
const request = require("supertest")(BASE_URL);

describe("GET /v1/cache", function () {
  it("test the get api ", async function () {
    const res = await request.get("/");
    expect(res.body).to.be.a("object");
    expect(res.body).to.have.property("status");
    expect(res.body).to.have.property("message");
    expect(res.body).to.have.property("data");
    expect(res.body.data).to.be.an("array");
    expect(res.body.message).to.equal("All keys from cache");
    expect(res.status).to.eql(200);
  });
});

describe("post api ", function () {
  it("testing the post api with adding a new key ", async function () {
    const res = await request.post("/samplekey");
    expect(res.status).to.eql(200);
    expect(res.body).to.be.a("object");
    expect(res.body).to.have.property("status");
    expect(res.body).to.have.property("key");
    expect(res.body).to.have.property("value");
    expect(res.body.status).to.be.a("boolean");
    expect(res.body.key).to.be.a("string");
    expect(res.body.value).to.be.a("string");
  });
  // assumimng time to live is 10 seconds
  it("testing the post api with adding a same key after 8 secomds ", async function () {
    const res = await request.post("/samplekey1");
    const valueBefore = res.body.value;
    setTimeout(async ()=>{
     // call the api with the same key after 8 seconds
     const res = await request.post("/samplekey1");
     const valueAfter = res.body.value;
     expect(valueAfter).to.equal(valueBefore);

    },8000)
  });


  it("testing the post api with adding a same key after 12 secomds ", async function () {
    const res = await request.post("/samplekey2");
    const valueBefore = res.body.value;
    setTimeout(async ()=>{
     // call the api with the same key after 8 seconds
     const res = await request.post("/samplekey2");
     const valueAfter = res.body.value;
     expect(valueAfter).to.not.equal(valueBefore);
    },12000)
  });



});

describe("delete all keys api ", function () {
  it("testing the delete all api  ", async function () {
    const res = await request.delete("/");
    expect(res.status).to.eql(200);
    expect(res.body).to.be.a("object");
    expect(res.body).to.have.property("status");
    expect(res.body).to.have.property("message");
    expect(res.body.status).to.be.a("boolean");
    expect(res.body.message).to.be.a("string");
    expect(res.body.message).to.equal("Deleted all the key successfully");
  });
});

describe("update a single key", function () {
    it("testing the update a single key", async function () {
      const res = await request.put("/").send({
        "key":"test",
        "value":"test_new"
    });
      expect(res.status).to.eql(200);
      expect(res.body).to.be.a("object");
      expect(res.body).to.have.property("status");
      expect(res.body).to.have.property("message");
      expect(res.body.status).to.be.a("boolean");
      expect(res.body.message).to.be.a("string");
    
    });

    it("testing the update key with incorrect parameters", async function () {
        const res = await request.put("/").send({
          "key":["test"],
          "value":"test_new"
        });
        expect(res.status).to.eql(400);
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.property("status");
        expect(res.body).to.have.property("message");
        expect(res.body.status).to.be.a("boolean");
        expect(res.body.message).to.be.a("string");
        expect(res.body.message).to.equal("Invalid Parameters");
        expect(res.body.status).to.equal(false);
      
      });
  });

  


