import * as moment from "moment-timezone";
import {
  ISlashCommandInfo,
  IBookingInfoForResponse,
  IErrorMessageParams
} from "../interfaces/v2/SlackInterfaces";

class SlackService {
  slackApiUri: string;
  accessToken: string;

  constructor() {
    this.slackApiUri = process.env.SLACK_API_URI;
    this.accessToken = process.env.SLACK_ACCESS_TOKEN;
  }

  openDialog = async (slashCommandInfo: ISlashCommandInfo) => {
    const { trigger_id } = slashCommandInfo;
    const dialogComponent = this.buildDialogComponent();
    const interactiveDialog = {
      trigger_id,
      dialog: dialogComponent
    };

    try {
      return await fetch(`${this.slackApiUri}/dialog.open`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${this.accessToken}`
        },
        body: JSON.stringify(interactiveDialog)
      });
    } catch (error) {
      return Promise.reject(new Error(`dialog.open call failed: ${error}`));
    }
  };

  // In the future this can be a entire builder
  buildDialogComponent = () =>
    JSON.stringify({
      title: "New Appointment",
      callback_id: "submit-booking",
      submit_label: "Submit",
      elements: [
        {
          label: "Appointment Date",
          type: "text",
          name: "date",
          hint: "Date format: yyyy-mm-dd."
        },
        {
          label: "Start Hour",
          type: "select",
          name: "startHour",
          value: "Choose an hour",
          options: [
            { label: "08", value: "08" },
            { label: "09", value: "09" },
            { label: "10", value: "10" },
            { label: "11", value: "11" },
            { label: "12", value: "12" },
            { label: "13", value: "13" },
            { label: "14", value: "14" },
            { label: "15", value: "15" },
            { label: "16", value: "16" },
            { label: "17", value: "17" },
            { label: "18", value: "18" }
          ]
        },
        {
          label: "Star Minute",
          type: "select",
          name: "startMinute",
          value: "Choose a minute",
          options: [
            { label: "00", value: "00" },
            { label: "15", value: "15" },
            { label: "30", value: "30" },
            { label: "45", value: "45" }
          ]
        },
        {
          label: "End Hour",
          type: "select",
          name: "endHour",
          value: "Choose an hour",
          options: [
            { label: "08", value: "08" },
            { label: "09", value: "09" },
            { label: "10", value: "10" },
            { label: "11", value: "11" },
            { label: "12", value: "12" },
            { label: "13", value: "13" },
            { label: "14", value: "14" },
            { label: "15", value: "15" },
            { label: "16", value: "16" },
            { label: "17", value: "17" },
            { label: "18", value: "18" }
          ]
        },
        {
          label: "End Minute",
          type: "select",
          name: "endMinute",
          value: "Choose a minute",
          options: [
            { label: "00", value: "00" },
            { label: "15", value: "15" },
            { label: "30", value: "30" },
            { label: "45", value: "45" }
          ]
        },
        {
          label: "Conference Room",
          type: "select",
          name: "roomId",
          value: "Choose a room",
          // Put the correct id's
          options: [
            { label: "DeWitt", value: "1" },
            { label: "Skywalker", value: "2" },
            { label: "Ganondorf", value: "3" },
            { label: "Stark", value: "4" },
            { label: "Dumbledore", value: "5" },
            { label: "Wayne", value: "6" }
          ]
        },
        {
          label: "Appointment Reason",
          type: "textarea",
          name: "description"
        },
        {
          label: "Invite people",
          type: "textarea",
          name: "attendees",
          optional: true,
          hint:
            "Please separete the emails with a dash, without space after it."
        }
      ]
    });

  sendDialogSubmitResponse = async (
    toURL: string,
    bookingInfo: IBookingInfoForResponse
  ) => {
    const component = this.buildResponseComponent(bookingInfo);
    try {
      return await fetch(toURL, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(component)
      });
    } catch (error) {
      return Promise.reject(new Error(`Submit dialog send failed: ${error}`));
    }
  };

  buildResponseComponent = (bookingInfo: IBookingInfoForResponse) => {
    const {
      slackUserName,
      startDate,
      endDate,
      location,
      description,
      attendees
    } = bookingInfo;

    const formatedStartDate = moment(startDate)
      .tz("America/Mexico_city")
      .format("dddd, MMMM Do YYYY, k:mm");
    const formatedEndDate = moment(endDate)
      .tz("America/Mexico_city")
      .format("k:mm a");

    return {
      text: "New Booking!",
      blocks: [
        {
          type: "section",
          text: {
            type: "plain_text",
            emoji: true,
            text: "Looks like you have schedule a new appointment! :smile:"
          }
        },
        {
          type: "divider"
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*User:* ${slackUserName}\n*Date:* ${formatedStartDate}-${formatedEndDate}\n*Reason:* ${description}\n*Guests:* ${
              attendees.length
            }`
          },
          accessory: {
            type: "image",
            image_url:
              "https://api.slack.com/img/blocks/bkb_template_images/notifications.png",
            alt_text: "calendar thumbnail"
          }
        }
      ],
      replace_original: false
    };
  };

  sendErrorMessage = async ({ toURL, message }: IErrorMessageParams) => {
    const errroComponent = this.buildErrorComponent(message);
    try {
      return await fetch(toURL, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(errroComponent)
      });
    } catch (error) {
      return Promise.reject(new Error(`Error message send failed ${error}`));
    }
  };

  buildErrorComponent = (message: string) => {
    return {
      blocks: [
        {
          type: "context",
          elements: [
            {
              type: "image",
              image_url:
                "https://api.slack.com/img/blocks/bkb_template_images/notificationsWarningIcon.png",
              alt_text: "notifications warning icon"
            },
            {
              type: "mrkdwn",
              text: `*${message}*`
            }
          ]
        }
      ]
    };
  };
}

export const slackService = new SlackService();
