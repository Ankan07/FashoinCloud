//import request from "supertest";
import { expect, assert } from "chai";
const BASE_URL = "http://localhost:4000/v1/cache";
const request = require("supertest")(BASE_URL);

describe("GET /v1/cache", function () {
    it("test the get api ", async function () {
      const res = await request.get("/");
      expect(res.body).to.be.a('object')
      expect(res.body).to.have.property('status')
      expect(res.body).to.have.property('message')
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array');
      expect(res.status).to.eql(200);
    });
  });




  describe("post api ", function () {
    it("testing the post api with adding a new key ", async function () {
      const res = await request.post("/samplekey")
    
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('key')
          expect(res.body).to.have.property('value')
          expect(res.body.status).to.be.a('boolean')
          expect(res.body.key).to.be.a('string');
          expect(res.body.value).to.be.a('string')
       
      
    });
  });

  describe("delete all keys api ", function () {
    it("testing the delete all api  ", async function () {
      const res  = await request.delete("/")
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.status).to.be.a('boolean')
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal("Deleted all the key successfully");
        
      
    });
  });


