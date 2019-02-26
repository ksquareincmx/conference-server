// Import the dev-dependencies
import { chai, ICredential, IUserId, Room, Booking } from "../common";

const apiPath = "http://localhost:8888/api/v2/Room/";

export const roomTest = (auth: ICredential, user: IUserId) => {
  describe("Room", () => {
    let roomId: string;
    const testRoom = {
      name: "Test Room",
      color: "Test Color"
    };

    const testRoomWithoutName = {
      color: "Created Color"
    };

    const testRoomWithoutColor = {
      name: "Created Room"
    };

    before(async function() {
      try {
        // Create test room
        const createdRoom: any = await Room.create(testRoom);
        roomId = createdRoom.id.toString();
      } catch (err) {
        throw err;
      }
    });

    after(async function() {
      try {
        // Delete room if it still exists after the delete test.
        const room: any = await Room.findOne({
          where: { id: roomId }
        });
        if (room) {
          await Room.destroy({ where: { id: roomId } });
        }
      } catch (err) {
        throw err;
      }
    });

    /*
     * Test the /GET route
     */
    describe("GET", () => {
      const bookingsId = [];
      // Create bookings for test booking/:id/hours

      before(async function() {
        try {
          const bookingsTest = [
            {
              description: "This is a test booking",
              start: "2019-12-12T09:00:00.000Z",
              end: "2019-12-12T10:00:00.000Z",
              roomId,
              userId: user.id
            },
            {
              description: "This is a test booking x2",
              start: "2019-12-12T14:00:00.000Z",
              end: "2019-12-12T15:00:00.000Z",
              roomId,
              userId: user.id
            }
          ];
          const createdBooking1: any = await Booking.create(bookingsTest[0]);
          const createdBooking2: any = await Booking.create(bookingsTest[1]);

          bookingsId.push(createdBooking1.id);
          bookingsId.push(createdBooking2.id);
        } catch (err) {
          throw err;
        }
      });

      after(async function() {
        try {
          await Booking.destroy({ where: { id: bookingsId[0] } });
          await Booking.destroy({ where: { id: bookingsId[1] } });
        } catch (err) {}
      });

      it("it should get the room", done => {
        chai
          .request(apiPath)
          .get(roomId)
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(200);
            res.body.should.be.an("object");
            res.body.should.have.property("id");
            res.body.should.have.property("name");
            res.body.should.have.property("color");
            res.body.should.have.property("presence");
            res.body.should.have.property("updated_at");
            res.body.should.have.property("created_at");
            done();
          });
      });

      it("it should not get the room if it does not exist", done => {
        chai
          .request(apiPath)
          .get("100")
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(404);
            res.body.should.be.an("string").and.equal("Not Found");
            done();
          });
      });

      it("it should not get the room if auth.token is not correct", done => {
        chai
          .request(apiPath)
          .get(roomId)
          .set("Authorization", "")
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              message: "jwt must be provided",
              name: "JsonWebTokenError"
            });
            done();
          });
      });

      it("it should not get the room if auth.token is not provided", done => {
        chai
          .request(apiPath)
          .get(roomId)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.an("string").and.equal("No Token Present");
            done();
          });
      });

      it("it should not get the room if auth.token is blacklisted", done => {
        chai
          .request(apiPath)
          .get(roomId)
          .set("Authorization", auth.blackListedToken)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              name: "Error",
              message: "This Token is blacklisted"
            });
            done();
          });
      });

      it("it should get a hours availables if booking non-exist with default date", done => {
        chai
          .request(apiPath)
          .get(`${roomId}/hours`)
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(200);
            res.body.should.be.an("array");
            res.body[0].should.be.an("object").and.deep.equal({
              start: "08:00",
              end: "18:00"
            });
            done();
          });
      });

      it("it should get a hours availables if bookings exists with input date", done => {
        chai
          .request(apiPath)
          .get(`${roomId}/hours?fromDate=2019-12-12`)
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(200);
            res.body.should.be.an("array");
            res.body[0].should.be.an("object").and.deep.equal({
              start: "08:00",
              end: "09:00"
            });
            res.body[1].should.be.an("object").and.deep.equal({
              start: "10:00",
              end: "14:00"
            });
            res.body[2].should.be.an("object").and.deep.equal({
              start: "15:00",
              end: "18:00"
            });
            done();
          });
      });

      it("it should get a hours availables if bookings non-exists with input date", done => {
        chai
          .request(apiPath)
          .get(`${roomId}/hours?fromDate=2019-12-24`)
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(200);
            res.body.should.be.an("array");
            res.body[0].should.be.an("object").and.deep.equal({
              start: "08:00",
              end: "18:00"
            });
            done();
          });
      });

      it("it should get a bad request if room exists", done => {
        chai
          .request(apiPath)
          .get(`${99999}/hours`)
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(400);
            res.body.should.equal("Room not exist");
            done();
          });
      });
    });

    /*
     * Test the /POST route
     */
    describe("POST", () => {
      const createdRoom = {
        name: "Created Room",
        color: "Created Color"
      };

      after(async function() {
        try {
          // Delete the created room.
          const room: any = await Room.findOne({
            where: createdRoom
          });
          if (room) {
            await Room.destroy({ where: { id: room.id } });
          }
        } catch (err) {
          throw err;
        }
      });

      it("it should create a new room", done => {
        chai
          .request(apiPath)
          .post("")
          .send(createdRoom)
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(200);
            res.body.should.be.an("object");
            res.body.should.have.property("id");
            res.body.should.have.property("name");
            res.body.should.have.property("color");
            res.body.should.have.property("presence");
            res.body.should.have.property("updated_at");
            res.body.should.have.property("created_at");
            done();
          });
      });

      it("it should not create a new room if name and color are not unique", done => {
        chai
          .request(apiPath)
          .post("")
          .send(testRoom)
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(400);
            res.body.should.be
              .a("string")
              .and.equal("Bad Request: name and color must be uniques");
            done();
          });
      });

      it("it should not create a new room if name not exist", done => {
        chai
          .request(apiPath)
          .post("")
          .send(testRoomWithoutName)
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(400);
            res.body.should.be
              .a("string")
              .and.equal("Bad Request: name is required");
            done();
          });
      });

      it("it should not create a new room if color not exist", done => {
        chai
          .request(apiPath)
          .post("")
          .send(testRoomWithoutColor)
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(400);
            res.body.should.be
              .a("string")
              .and.equal("Bad Request: color is required");
            done();
          });
      });

      it("it should not create a new room if auth.token is not correct", done => {
        chai
          .request(apiPath)
          .post("")
          .send(createdRoom)
          .set("Authorization", "")
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              message: "jwt must be provided",
              name: "JsonWebTokenError"
            });
            done();
          });
      });

      it("it should not create a new room if auth.token is not provided", done => {
        chai
          .request(apiPath)
          .post("")
          .send(createdRoom)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.an("string").and.equal("No Token Present");
            done();
          });
      });

      it("it should not create a new room if auth.token is blacklisted", done => {
        chai
          .request(apiPath)
          .post("")
          .send(createdRoom)
          .set("Authorization", auth.blackListedToken)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              name: "Error",
              message: "This Token is blacklisted"
            });
            done();
          });
      });
    });

    /*
     * Test the /PUT route
     */
    describe("PUT", () => {
      const editedRoom = {
        name: "Edited Room",
        color: "Edited Color"
      };

      it("it should edit the room", done => {
        chai
          .request(apiPath)
          .put(roomId)
          .send(editedRoom)
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(200);
            res.body.should.be.an("object");
            res.body.should.have.property("id");
            res.body.should.have.property("name");
            res.body.should.have.property("color");
            res.body.should.have.property("presence");
            res.body.should.have.property("updated_at");
            res.body.should.have.property("created_at");
            done();
          });
      });

      it("it should not create a new room if name not exist", done => {
        chai
          .request(apiPath)
          .put(roomId)
          .send(testRoomWithoutName)
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(400);
            res.body.should.be
              .a("string")
              .and.equal("Bad Request: name is required");
            done();
          });
      });

      it("it should not create a new room if color not exist", done => {
        chai
          .request(apiPath)
          .put(roomId)
          .send(testRoomWithoutColor)
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(400);
            res.body.should.be
              .a("string")
              .and.equal("Bad Request: color is required");
            done();
          });
      });

      it("it should not edit the room if it does not exist", done => {
        chai
          .request(apiPath)
          .put("100")
          .send({
            name: "originalName",
            color: "originalColor"
          })
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(400);
            res.body.should.be
              .an("string")
              .and.deep.equal("Bad Request: Room not exist");
            done();
          });
      });

      it("it should not edit the room if auth.token is not correct", done => {
        chai
          .request(apiPath)
          .put(roomId)
          .send(editedRoom)
          .set("Authorization", "")
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              message: "jwt must be provided",
              name: "JsonWebTokenError"
            });
            done();
          });
      });

      it("it should not edit the room if auth.token is not provided", done => {
        chai
          .request(apiPath)
          .put(roomId)
          .send(editedRoom)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.an("string").and.equal("No Token Present");
            done();
          });
      });

      it("it should not edit the room if auth.token is blacklisted", done => {
        chai
          .request(apiPath)
          .put(roomId)
          .send(editedRoom)
          .set("Authorization", auth.blackListedToken)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              name: "Error",
              message: "This Token is blacklisted"
            });
            done();
          });
      });
    });

    /*
    * Test the /DELETE route
      Needs to be the last test for other tests to work.
    */
    describe("DELETE", () => {
      it("it should delete the room", done => {
        chai
          .request(apiPath)
          .delete(roomId)
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(204);
            res.body.should.be.an("object");
            done();
          });
      });

      it("it should not delete the room if it does not exist", done => {
        chai
          .request(apiPath)
          .delete(roomId)
          .set("Authorization", auth.token)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(404);
            res.body.should.be.an("object").and.deep.equal({});
            done();
          });
      });

      it("it should not delete the room if auth.token is not correct", done => {
        chai
          .request(apiPath)
          .delete(roomId)
          .set("Authorization", "")
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              message: "jwt must be provided",
              name: "JsonWebTokenError"
            });
            done();
          });
      });

      it("it should not delete the room if auth.token is not provided", done => {
        chai
          .request(apiPath)
          .delete(roomId)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.an("string").and.equal("No Token Present");
            done();
          });
      });

      it("it should not delete the room if auth.token is blacklisted", done => {
        chai
          .request(apiPath)
          .delete(roomId)
          .set("Authorization", auth.blackListedToken)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(401);
            res.body.should.be.an("object").and.deep.equal({
              name: "Error",
              message: "This Token is blacklisted"
            });
            done();
          });
      });
    });
  });
};
