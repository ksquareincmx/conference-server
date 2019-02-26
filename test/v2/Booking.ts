// Import DB setup and models

import { Booking, chai, db, ICredential, IUserId, Room, User } from "../common";
import {
  availableDate,
  timeOutOffice,
  weekendDate,
  pastDate,
  invalidEmail,
  inexistRoom,
  inexistBooking,
  validEmail
} from "../utils";

const apiPath = "/api/v2/booking/";
const server = "http://localhost:8888";

export const bookingTest = (params: ICredential, user: IUserId) => {
  describe("Booking", () => {
    let token;
    let roomId;
    let userId;

    // dates used by post and update booking
    const startTestDate = `${availableDate}T18:00:00.000Z`;
    const endTestDate = `${availableDate}T19:00:00.000Z`;

    const edgeUpperStartDate = `${availableDate}T19:00:00.000Z`;
    const edgeUpperEndDate = `${availableDate}T20:00:00.000Z`;

    const edgeLowerStartDate = `${availableDate}T17:00:00.000Z`;
    const edgeLowerEndDate = `${availableDate}T18:00:00.000Z`;

    // create a room and user that be used in the testing
    before(async () => {
      // Create an room
      try {
        const testRoom = { name: "Conference 1", color: "Red" };
        const createdRoom: any = await Room.create(testRoom);
        roomId = createdRoom.id;

        // Create an user
        const testUser = {
          email: "conference.booking.test@gmail.com",
          password: "12345678"
        };
        const isConnectionOpen = !!db.authenticate();
        if (!isConnectionOpen) {
          await db.sync();
        }
        const createdUser: any = await User.create({
          ...testUser,
          role: "user"
        });

        // We need to do another query because before the profile wasn't ready
        const user: any = await User.findOne({
          where: { id: createdUser.id }
        });

        userId = user.id;

        // get credentials of the test user
        const credentials = await chai
          .request("http://localhost:8888/api/v2/auth/")
          .post("/login")
          .type("form")
          .send({
            email: "conference.booking.test@gmail.com",
            password: "12345678"
          });
        token = credentials.body.token;
      } catch (err) {
        throw err;
      }
    });

    // Delete room and user created for test
    after(async () => {
      try {
        const roomPromise = Room.destroy({ where: { id: roomId } });
        const userPromise = User.destroy({ where: { id: userId } });
        await Promise.all([roomPromise, userPromise]);
      } catch (err) {
        throw err;
      }
    });

    describe("POST", () => {
      const bookingsId = [];

      // delete a created booking
      after(async () => {
        try {
          for (let id of bookingsId) {
            const booking: any = await Booking.findById(id);
            if (booking) {
              await Booking.destroy({ where: { id } });
            }
          }
        } catch (err) {
          throw err;
        }
      });

      it("Should post a booking", done => {
        const booking = {
          description: "Call Varma",
          room_id: roomId,
          start: startTestDate,
          end: endTestDate,
          attendees: [validEmail]
        };

        chai
          .request(server)
          .post(apiPath)
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.status(201);
            res.body.should.be.an("object");
            res.body.should.have.property("id");
            res.body.should.have.property("description");
            res.body.should.have.property("room_id");
            res.body.should.have.property("start");
            res.body.should.have.property("end");
            res.body.should.have.property("user_id");
            res.body.should.have.property("event_id");
            res.body.should.have.property("updated_at");
            res.body.should.have.property("created_at");

            res.body.description.should.equal("Call Varma");
            res.body.room_id.should.deep.equal(roomId);
            res.body.user_id.should.deep.equal(userId);
            res.body.start.should.deep.equal(startTestDate);
            res.body.end.should.deep.equal(endTestDate);
            bookingsId.push(res.body.id);
            done();
          });
      });
      it("Should post a booking. Edge case: start time", done => {
        const booking = {
          description: "Call Varma",
          room_id: roomId,
          start: edgeLowerStartDate,
          end: edgeLowerEndDate,
          attendees: [validEmail]
        };

        chai
          .request(server)
          .post(apiPath)
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(201);
            res.body.should.be.an("object");
            res.body.should.have.property("id");
            res.body.should.have.property("description");
            res.body.should.have.property("room_id");
            res.body.should.have.property("start");
            res.body.should.have.property("end");
            res.body.should.have.property("user_id");
            res.body.should.have.property("event_id");
            res.body.should.have.property("updated_at");
            res.body.should.have.property("created_at");

            res.body.description.should.equal("Call Varma");
            res.body.room_id.should.deep.equal(roomId);
            res.body.start.should.deep.equal(edgeLowerStartDate);
            res.body.end.should.deep.equal(edgeLowerEndDate);
            bookingsId.push(res.body.id);
            done();
          });
      });
      it("Should post a booking. Edge case: end time", done => {
        const booking = {
          description: "Call Varma",
          room_id: roomId,
          start: edgeUpperStartDate,
          end: edgeUpperEndDate,
          attendees: [validEmail]
        };

        chai
          .request(server)
          .post(apiPath)
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(201);
            res.body.should.be.an("object");
            res.body.should.have.property("id");
            res.body.should.have.property("description");

            res.body.should.have.property("room_id");
            res.body.should.have.property("start");
            res.body.should.have.property("end");
            res.body.should.have.property("user_id");
            res.body.should.have.property("event_id");
            res.body.should.have.property("updated_at");
            res.body.should.have.property("created_at");

            res.body.description.should.equal("Call Varma");
            res.body.room_id.should.deep.equal(roomId);
            res.body.start.should.deep.equal(edgeUpperStartDate);
            res.body.end.should.deep.equal(edgeUpperEndDate);
            bookingsId.push(res.body.id);
            done();
          });
      });
      it("Try to schedule in a reserved date.", done => {
        const booking = {
          description: "Call Varma",
          room_id: roomId,
          start: startTestDate,
          end: endTestDate,
          attendees: [validEmail]
        };

        chai
          .request(server)
          .post(apiPath)
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(204);
            done();
          });
      });
      it("Try to schedule with time out of office.", done => {
        const booking = {
          description: "Call Varma",
          room_id: roomId,
          start: timeOutOffice.startDate,
          end: timeOutOffice.endDate,
          attendees: [validEmail]
        };

        chai
          .request(server)
          .post(apiPath)
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(400);
            res.body.should.equal(
              "bad Request: The booking only can have office hours (Monday-Friday, 8AM-6PM)."
            );
            done();
          });
      });
      it("Try to schedule in weekend.", done => {
        const booking = {
          description: "Call Varma",
          room_id: roomId,
          start: weekendDate.startDate,
          end: weekendDate.endDate,
          attendees: [validEmail]
        };

        chai
          .request(server)
          .post(apiPath)
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(400);
            res.body.should.equal(
              "bad Request: The booking only can have office hours (Monday-Friday, 8AM-6PM)."
            );
            done();
          });
      });
      it.skip("Try to schedule a meeting with a past date.", done => {
        const booking = {
          description: "Call Varma",
          room_id: roomId,
          start: pastDate.startDate,
          end: pastDate.endDate,
          attendees: ["admin@example.com"]
        };

        chai
          .request(server)
          .post(apiPath)
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(400);
            res.body.should.equal(
              "bad Request: Bookings in past dates aren't allowed."
            );
            done();
          });
      });
      it("Try to schedule a meeting with an invalid email.", done => {
        const booking = {
          description: "Call Varma",
          room_id: roomId,
          start: startTestDate,
          end: endTestDate,
          attendees: [invalidEmail]
        };

        chai
          .request(server)
          .post(apiPath)
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(400);
            res.body.should.equal("Bad Request: 0 must be a valid email");
            done();
          });
      });
      it("Try to schedule a meeting without start date.", done => {
        const booking = {
          description: "Call Varma",
          room_id: roomId,
          start: "",
          end: endTestDate,
          attendees: [validEmail]
        };

        chai
          .request(server)
          .post(apiPath)
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(400);
            res.body.should.equal(
              "Bad Request: start must be a valid ISO 8601 date"
            );
            done();
          });
      });
      it("Try to schedule a meeting without end date.", done => {
        const booking = {
          description: "Call Varma",
          room_id: roomId,
          start: startTestDate,
          end: "",
          attendees: [validEmail]
        };

        chai
          .request(server)
          .post(apiPath)
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(400);
            res.body.should.equal(
              "Bad Request: end must be a valid ISO 8601 date"
            );
            done();
          });
      });
      it("Try to schedule a meeting without description.", done => {
        const booking = {
          description: "",
          room_id: roomId,
          start: startTestDate,
          end: endTestDate,
          attendees: []
        };

        chai
          .request(server)
          .post(apiPath)
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(400);
            res.body.should.equal(
              "Bad Request: description is not allowed to be empty"
            );
            done();
          });
      });
      it("Try to schedule a meeting without roomId.", done => {
        const booking = {
          description: "Call Varma",
          start: startTestDate,
          end: endTestDate,
          attendees: [validEmail]
        };

        chai
          .request(server)
          .post(apiPath)
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(400);
            res.body.should.equal("Bad Request: room_id is required");
            done();
          });
      });
      it("Try to schedule a meeting with non-exist roomId.", done => {
        const booking = {
          description: "Call Varma",
          room_id: inexistRoom,
          start: startTestDate,
          end: endTestDate,
          attendees: [validEmail]
        };

        chai
          .request(server)
          .post(apiPath)
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(400);
            res.body.should.equal(
              `Bad Request: room ${booking.room_id} not exist.`
            );
            done();
          });
      });
    });

    describe("PUT", () => {
      const bookingsId = [];

      // Create a booking to edit
      before(async () => {
        const bookingToEdit = {
          description: "This is a booking to edit",
          room_id: roomId,
          start: `${availableDate}T15:00:00.000Z`,
          end: `${availableDate}T15:10:00.000Z`,
          attendees: []
        };

        const bookingToEdit2 = {
          description: "This is a booking to edit x2",
          room_id: roomId,
          start: `${availableDate}T16:10:00.000Z`,
          end: `${availableDate}T16:20:00.000Z`,
          attendees: []
        };

        try {
          // create a booking to edit
          const createdBookingToEdit = await chai
            .request(server)
            .post(apiPath)
            .send(bookingToEdit)
            .set("Authorization", `Bearer ${token}`);

          // create a booking, useful for test edge cases and reserved
          const createdBooking = await chai
            .request(server)
            .post(apiPath)
            .send(bookingToEdit2)
            .set("Authorization", `Bearer ${token}`);

          const parsedBookingToEdit = JSON.parse(
            JSON.stringify(createdBookingToEdit)
          );
          const parsedBooking = JSON.parse(JSON.stringify(createdBooking));
          bookingsId.push(JSON.parse(parsedBookingToEdit.text).id);
          bookingsId.push(JSON.parse(parsedBooking.text).id);
        } catch (err) {
          throw err;
        }
      });

      // Removes the bookings from the database
      after(async () => {
        try {
          for (let id of bookingsId) {
            const booking: any = await Booking.findById(id);
            if (booking) {
              await Booking.destroy({ where: { id } });
            }
          }
        } catch (err) {
          throw err;
        }
      });

      it("Should edit a booking.", done => {
        const bookingEdit = {
          description: "This is a booking to edit",
          room_id: roomId,
          start: `${availableDate}T15:20:00.000Z`,
          end: `${availableDate}T15:30:00.000Z`,
          attendees: []
        };

        chai
          .request(server)
          .put(apiPath + bookingsId[0])
          .send(bookingEdit)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(200);
            res.body.should.be.an("object");
            res.body.should.have.property("id");
            res.body.should.have.property("description");
            res.body.should.have.property("room_id");
            res.body.should.have.property("start");
            res.body.should.have.property("end");
            res.body.should.have.property("user_id");
            res.body.should.have.property("event_id");
            res.body.should.have.property("updated_at");
            res.body.should.have.property("created_at");
            res.body.description.should.equal(bookingEdit.description);
            res.body.room_id.should.equal(bookingEdit.room_id);
            res.body.start.should.equal(bookingEdit.start);
            res.body.end.should.equal(bookingEdit.end);
            done();
          });
      });
      it("Should edit a booking. Edge case: start time.", done => {
        const bookingEdit = {
          description: "This is a booking to edit x2",
          room_id: roomId,
          start: `${availableDate}T15:00:00.000Z`,
          end: `${availableDate}T15:20:00.000Z`,
          attendees: []
        };
        chai
          .request(server)
          .put(apiPath + bookingsId[1])
          .send(bookingEdit)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(200);
            res.body.should.be.an("object");
            res.body.should.have.property("id");
            res.body.should.have.property("description");
            res.body.should.have.property("room_id");
            res.body.should.have.property("start");
            res.body.should.have.property("end");
            res.body.should.have.property("user_id");
            res.body.should.have.property("event_id");
            res.body.should.have.property("updated_at");
            res.body.should.have.property("created_at");
            res.body.description.should.deep.equal(bookingEdit.description);
            res.body.room_id.should.deep.equal(bookingEdit.room_id);
            res.body.start.should.deep.equal(bookingEdit.start);
            res.body.end.should.deep.equal(bookingEdit.end);
            done();
          });
      });
      it("Should edit a booking. Edge case: end time.", done => {
        const bookingEdit = {
          description: "This is a booking to edit x3",
          room_id: roomId,
          start: `${availableDate}T15:30:00.000Z`,
          end: `${availableDate}T15:40:00.000Z`,
          attendees: []
        };
        chai
          .request(server)
          .put(apiPath + bookingsId[1])
          .send(bookingEdit)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(200);
            res.body.should.be.an("object");
            res.body.should.have.property("id");
            res.body.should.have.property("description");
            res.body.should.have.property("room_id");
            res.body.should.have.property("start");
            res.body.should.have.property("end");
            res.body.should.have.property("user_id");
            res.body.should.have.property("event_id");
            res.body.should.have.property("updated_at");
            res.body.should.have.property("created_at");
            res.body.description.should.deep.equal(bookingEdit.description);
            res.body.room_id.should.deep.equal(bookingEdit.room_id);
            res.body.start.should.deep.equal(bookingEdit.start);
            res.body.end.should.deep.equal(bookingEdit.end);
            done();
          });
      });
      it("Try to reschedule in a reserved date.", done => {
        const booking = {
          description: "Call Varma",
          room_id: roomId,
          start: `${availableDate}T15:20:00.000Z`,
          end: `${availableDate}T15:30:00.000Z`,
          attendees: []
        };

        chai
          .request(server)
          .put(apiPath + bookingsId[1])
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(204);
            done();
          });
      });
      it("Try to reschedule with time out of office", done => {
        const booking = {
          description: "Call Varma",
          room_id: roomId,
          start: timeOutOffice.startDate,
          end: timeOutOffice.endDate,
          attendees: []
        };

        chai
          .request(server)
          .put(apiPath + bookingsId[0])
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(400);
            res.body.should.deep.equal(
              "bad Request: The booking only can have office hours (Monday-Friday, 8AM-6PM)."
            );
            done();
          });
      });
      it("Try to reschedule in weekend", done => {
        const booking = {
          description: "Call Varma",
          room_id: roomId,
          start: weekendDate.startDate,
          end: weekendDate.endDate,
          attendees: []
        };

        chai
          .request(server)
          .put(apiPath + bookingsId[0])
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(400);
            res.body.should.deep.equal(
              "bad Request: The booking only can have office hours (Monday-Friday, 8AM-6PM)."
            );
            done();
          });
      });
      it.skip("Try to reschedule a meeting with a past date", done => {
        const booking = {
          description: "Call Varma",
          room_id: roomId,
          start: pastDate.startDate,
          end: pastDate.endDate,
          attendees: []
        };

        chai
          .request(server)
          .put(apiPath + bookingsId[0])
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(400);
            res.body.should.equal(
              "bad Request: Bookings in past dates aren't allowed."
            );
            done();
          });
      });
      it("Try to reschedule a meeting with invalid email", done => {
        const booking = {
          description: "Call Varma",
          room_id: roomId,
          start: startTestDate,
          end: endTestDate,
          attendees: [invalidEmail]
        };

        chai
          .request(server)
          .put(apiPath + bookingsId[0])
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(400);
            res.body.should.equal("Bad Request: 0 must be a valid email");
            done();
          });
      });
      it("Try to reschedule a meeting without start date", done => {
        const booking = {
          description: "Call Varma",
          room_id: roomId,
          start: "",
          end: endTestDate,
          attendees: []
        };

        chai
          .request(server)
          .put(apiPath + bookingsId[0])
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(400);
            res.body.should.equal(
              "Bad Request: start must be a valid ISO 8601 date"
            );
            done();
          });
      });
      it("Try to reschedule a meeting without end date", done => {
        const booking = {
          description: "Call Varma",
          room_id: roomId,
          start: startTestDate,
          end: "",
          attendees: []
        };

        chai
          .request(server)
          .put(apiPath + bookingsId[0])
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(400);
            res.body.should.equal(
              "Bad Request: end must be a valid ISO 8601 date"
            );
            done();
          });
      });
      it("Try to reschedule a meeting without description", done => {
        const booking = {
          description: "",
          room_id: roomId,
          start: startTestDate,
          end: endTestDate,
          attendees: []
        };

        chai
          .request(server)
          .put(apiPath + bookingsId[0])
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(400);
            res.body.should.equal(
              "Bad Request: description is not allowed to be empty"
            );
            done();
          });
      });
      it("Try to reschedule a meeting without roomId", done => {
        const booking = {
          description: "Call Varma",
          start: startTestDate,
          end: endTestDate,
          attendees: []
        };

        chai
          .request(server)
          .put(apiPath + bookingsId[0])
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(400);
            res.body.should.equal("Bad Request: room_id is required");
            done();
          });
      });
      it("Try to reschedule a meeting with non-exist roomId", done => {
        const booking = {
          description: "Call Varma",
          room_id: inexistRoom,
          start: startTestDate,
          end: endTestDate,
          attendees: []
        };

        chai
          .request(server)
          .put(apiPath + bookingsId[0])
          .send(booking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(400);
            res.body.should.deep.equal(
              `Bad Request: room ${booking.room_id} not exist.`
            );
            done();
          });
      });
    });

    describe("DELETE", () => {
      const bookingsId = [];
      // Create a bookings useful for testing
      before(async () => {
        const bookingToDelete = {
          description: "This a booking useful for test cases",
          room_id: roomId,
          start: `${availableDate}T23:00:00.000Z`,
          end: `${availableDate}T23:10:00.000Z`,
          attendees: []
        };

        // create a booking to edit
        try {
          const createdBooking = await chai
            .request(server)
            .post(apiPath)
            .send(bookingToDelete)
            .set("Authorization", `Bearer ${token}`);

          const parsedBooking = JSON.parse(JSON.stringify(createdBooking));
          bookingsId.push(JSON.parse(parsedBooking.text).id);
        } catch (err) {
          throw err;
        }
      });

      it("Should delete a booking", done => {
        chai
          .request(server)
          .delete(apiPath + bookingsId[0])
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(204);
            done();
          });
      });
      it("Try to delete a non-exist booking", done => {
        chai
          .request(server)
          .delete(apiPath + inexistBooking)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(404);
            res.body.should.deep.equal("Not Found");
            done();
          });
      });
    });

    describe("GET", () => {
      it("Should get all but not exist anything", done => {
        chai
          .request(server)
          .get(apiPath)
          .set("Authorization", `Bearer ${token}`)
          .end((err, res) => {
            if (err) {
              throw err;
            }

            res.should.have.status(200);
            res.body.should.be.an("array");
            res.body.should.have.length(0);
            done();
          });
      });

      describe("when bookings exist", () => {
        const bookingsId = [];
        const email = "conference.booking.test@gmail.com";

        // insert bookings in the db
        before(async () => {
          const bookings = [
            {
              description: "Call Varma",
              userId,
              roomId: roomId,
              start: "2019-02-11T10:15:00", // 2019-02-11T16:15:00
              end: "2019-02-11T10:30:00" // 2019-02-11T16:30:00
            },
            {
              description: "Call Varma x2",
              userId,
              roomId: roomId,
              start: "2019-02-11T12:10:00", // 2019-02-11T18:10:00
              end: "2019-02-11T12:30:00" // 2019-02-11T18:30:00
            },
            {
              description: "Call Varma x3",
              userId,
              roomId: roomId,
              start: "2019-03-11T10:15:00", // 2019-03-11T16:15:00
              end: "2019-03-11T10:30:00" // 2019-03-11T16:30:00
            }
          ];
          try {
            await db.sync();
            for (let booking of bookings) {
              const createdBooking: any = await Booking.create(booking);
              bookingsId.push(createdBooking.id.toString());
            }
          } catch (err) {
            throw err;
          }
        });

        // delete the booking from the db
        after(async () => {
          try {
            for (let id of bookingsId) {
              const booking: any = await Booking.findById(id);
              if (booking) {
                await Booking.destroy({ where: { id } });
              }
            }
          } catch (err) {
            throw err;
          }
        });

        it("Should get all bookings", done => {
          chai
            .request(server)
            .get(apiPath)
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
              if (err) {
                throw err;
              }
              res.should.have.status(200);
              res.body.should.be.an("array");

              res.body.forEach((booking, index) => {
                res.body[index].should.have.property("id");
                res.body[index].should.have.property("description");
                res.body[index].should.have.property("room_id");
                res.body[index].should.have.property("start");
                res.body[index].should.have.property("end");
                res.body[index].should.have.property("user_id");
                res.body[index].should.have.property("event_id");
                res.body[index].should.have.property("updated_at");
                res.body[index].should.have.property("created_at");
              });

              //Six hours more. Because timezone format when insert in the db
              // check body from booking[0]
              res.body[0].description.should.deep.equal("Call Varma");
              res.body[0].room_id.should.deep.equal(roomId);
              res.body[0].user_id.should.deep.equal(userId);
              res.body[0].start.should.deep.equal("2019-02-11T16:15:00.000Z");
              res.body[0].end.should.deep.equal("2019-02-11T16:30:00.000Z");

              // check body from booking[1]
              res.body[1].description.should.deep.equal("Call Varma x2");
              res.body[1].room_id.should.deep.equal(roomId);
              res.body[1].user_id.should.deep.equal(userId);
              res.body[1].start.should.deep.equal("2019-02-11T18:10:00.000Z");
              res.body[1].end.should.deep.equal("2019-02-11T18:30:00.000Z");

              // check body from booking[2]
              res.body[2].description.should.deep.equal("Call Varma x3");
              res.body[2].room_id.should.deep.equal(roomId);
              res.body[2].user_id.should.deep.equal(userId);
              res.body[2].start.should.deep.equal("2019-03-11T16:15:00.000Z");
              res.body[2].end.should.deep.equal("2019-03-11T16:30:00.000Z");

              done();
            });
        });
        it("Should get one booking", done => {
          chai
            .request(server)
            .get(apiPath + bookingsId[0])
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
              if (err) {
                throw err;
              }
              res.body.should.have.property("id");
              res.body.should.have.property("description");
              res.body.should.have.property("room_id");
              res.body.should.have.property("start");
              res.body.should.have.property("end");
              res.body.should.have.property("user_id");
              res.body.should.have.property("event_id");
              res.body.should.have.property("updated_at");
              res.body.should.have.property("created_at");

              res.body.description.should.deep.equal("Call Varma");
              res.body.room_id.should.deep.equal(roomId);
              res.body.user_id.should.deep.equal(userId);
              res.body.start.should.deep.equal("2019-02-11T16:15:00.000Z");
              res.body.end.should.deep.equal("2019-02-11T16:30:00.000Z");
              done();
            });
        });
        it("Should get bookings fromDate", done => {
          chai
            .request(server)
            .get(apiPath + "?fromDate=2019-03-11")
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
              if (err) {
                throw err;
              }
              res.should.have.status(200);
              res.body.should.be.an("array");
              res.body.should.have.length(1);

              res.body[0].should.be.an("object");
              res.body[0].should.have.property("id");
              res.body[0].should.have.property("description");
              res.body[0].should.have.property("room_id");
              res.body[0].should.have.property("start");
              res.body[0].should.have.property("end");
              res.body[0].should.have.property("user_id");
              res.body[0].should.have.property("event_id");
              res.body[0].should.have.property("updated_at");
              res.body[0].should.have.property("created_at");

              res.body[0].description.should.deep.equal("Call Varma x3");
              res.body[0].room_id.should.deep.equal(roomId);
              res.body[0].user_id.should.deep.equal(userId);
              res.body[0].start.should.deep.equal("2019-03-11T16:15:00.000Z");
              res.body[0].end.should.deep.equal("2019-03-11T16:30:00.000Z");

              done();
            });
        });
        it("Should get bookings toDate", done => {
          chai
            .request(server)
            .get(apiPath + "?toDate=2019-02-11T17:00")
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
              if (err) {
                throw err;
              }
              res.should.have.status(200);
              res.body.should.be.an("array");
              res.body.should.have.length(1);

              res.body[0].should.be.an("object");
              res.body[0].should.have.property("id");
              res.body[0].should.have.property("description");
              res.body[0].should.have.property("room_id");
              res.body[0].should.have.property("start");
              res.body[0].should.have.property("end");
              res.body[0].should.have.property("user_id");
              res.body[0].should.have.property("event_id");
              res.body[0].should.have.property("updated_at");
              res.body[0].should.have.property("created_at");

              res.body[0].description.should.deep.equal("Call Varma");
              res.body[0].room_id.should.deep.equal(roomId);
              res.body[0].user_id.should.deep.equal(userId);
              res.body[0].start.should.deep.equal("2019-02-11T16:15:00.000Z");
              res.body[0].end.should.deep.equal("2019-02-11T16:30:00.000Z");

              done();
            });
        });
        it("Should get bookings fromDate to toDate", done => {
          chai
            .request(server)
            .get(apiPath + "?fromDate=2019-02-11T16:31:00&toDate=2019-03-10")
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
              if (err) {
                throw err;
              }
              res.should.have.status(200);
              res.body.should.be.an("array");
              res.body.should.have.length(1);

              res.body[0].should.be.an("object");
              res.body[0].should.have.property("id");
              res.body[0].should.have.property("description");
              res.body[0].should.have.property("room_id");
              res.body[0].should.have.property("start");
              res.body[0].should.have.property("end");
              res.body[0].should.have.property("user_id");
              res.body[0].should.have.property("event_id");
              res.body[0].should.have.property("updated_at");
              res.body[0].should.have.property("created_at");

              res.body[0].description.should.deep.equal("Call Varma x2");
              res.body[0].room_id.should.deep.equal(roomId);
              res.body[0].user_id.should.deep.equal(userId);
              res.body[0].start.should.deep.equal("2019-02-11T18:10:00.000Z");
              res.body[0].end.should.deep.equal("2019-02-11T18:30:00.000Z");

              done();
            });
        });
        it("Try to get bookings with incorrect fromDate", done => {
          chai
            .request(server)
            .get(apiPath + "?fromDate=assadsad")
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
              if (err) {
                throw err;
              }

              res.should.have.status(400);
              res.body.should.equal(
                "Bad Request: fromDate must be a date in format YYYY-MM-DDTHH:MM."
              );
              done();
            });
        });
        it("Try to get bookigns with incorrect toDate", done => {
          chai
            .request(server)
            .get(apiPath + "?toDate=assadsad")
            .set("Authorization", `Bearer ${token}`)
            .end((err, res) => {
              if (err) {
                throw err;
              }

              res.should.have.status(400);
              res.body.should.equal(
                "Bad Request: toDate must be a date in format YYYY-MM-DDTHH:MM."
              );
              done();
            });
        });
      });
    });
  });
};
