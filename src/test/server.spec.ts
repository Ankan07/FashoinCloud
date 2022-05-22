import request from "supertest";
import { expect, assert } from "chai";
import app from '../app'



describe("server checks", function () {
   
  it("server instantiated without error", function (done) {
    request(app).get("/").end((err,res)=>{
        console.log(res.body)
        expect(res.body).to.be.a('string')
        done()
    })
  });
});

describe("get api ", function () {
    it("testing the get all keys api", function (done) {
      request(app).get("/").end((err,res)=>{
          console.log(res.body)
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body).to.have.property('data')
          expect(res.body.data).to.be.an('array');
          done()
      })
    });
  });

  describe("post api ", function () {
    it("testing the post api with adding a new key ", function (done) {
      request(app).post("/samplekey").end((err,res)=>{
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('key')
          expect(res.body).to.have.property('value')
          expect(res.body.status).to.be.a('boolean')
          expect(res.body.key).to.be.a('string');
          expect(res.body.value).to.be.a('string')
          done()
      })
    });
  });

  describe("delete all keys api ", function () {
    it("testing the delete all api  ", function (done) {
      request(app).delete("/v1/cache").end((err,res)=>{
          expect(res.body).to.be.a('object')
          expect(res.body).to.have.property('status')
          expect(res.body).to.have.property('message')
          expect(res.body.status).to.be.a('boolean')
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).to.equal("Deleted all the key successfully");
          done()
      })
    });
  });


