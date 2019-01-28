import React from "react";
import BookigList from "components/AppointmentCard/BookingList/BookingList";
import { shallow } from "enzyme";

it("renders with empty array", () => {
  shallow(<BookigList bookingItems={[]} clicked={null} />);
});
