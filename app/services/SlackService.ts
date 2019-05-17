import {
  IOpenDialogConfig,
  IDialogSubmitResponseParams,
  IDateRoomConfirmationInfo,
  IAppointmentInfo
} from "../interfaces/v2/SlackInterfaces";
import { builder } from "../libraries/slackMessageBuilder";

class SlackService {
  slackApiUri: string;
  accessToken: string;

  constructor() {
    this.slackApiUri = process.env.SLACK_API_URI;
    this.accessToken = process.env.SLACK_ACCESS_TOKEN;
  }

  openDialog = async ({ trigger_id, dialogParams }: IOpenDialogConfig) => {
    const dialog = await builder.dialog({ ...dialogParams });
    const interactiveDialog = {
      trigger_id,
      dialog
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

  sendDialogSubmitResponse = async ({
    toURL,
    responseContent
  }: IDialogSubmitResponseParams) => {
    // Type guard
    const isAppointmentSubmission = (
      responseContent: IDateRoomConfirmationInfo | IAppointmentInfo
    ): responseContent is IAppointmentInfo => {
      return (<IAppointmentInfo>responseContent).slackUserName != undefined;
    };

    const message = isAppointmentSubmission(responseContent)
      ? builder.buildAppointmentConfirmation(responseContent)
      : builder.buildDialogConfirmation(responseContent);

    try {
      return await fetch(toURL, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(message)
      });
    } catch (error) {
      return Promise.reject(new Error(`Submit dialog send failed: ${error}`));
    }
  };

  sendMessage = async ({ type, toURL, text }) => {
    const message = builder.message({ type, text });
    try {
      const res = await fetch(toURL, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(message)
      });
    } catch (error) {
      const { message } = error;
      return Promise.reject(new Error(`Message sending failed: ${message}`));
    }
  };
}

export const slackService = new SlackService();
