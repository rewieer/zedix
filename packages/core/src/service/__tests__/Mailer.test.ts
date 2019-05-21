import Mailer from "../Mailer";
import * as nodemailer from "nodemailer";

jest.mock("nodemailer", () => {
  return {
    createTransport: jest.fn(() => {
      return {
        sendMail: jest.fn((data, callback) => {
          callback(null, null);
        })
      };
    })
  };
});

it("should send a mail", async () => {
  const mailer = new Mailer(
    {
      host: "test.com",
      port: 123,
      secure: false
    },
    {}
  );

  await mailer.send({
    from: "rewieer@gmail.com",
    to: "johndoe@gmail.com",
    text: "Hey"
  });

  // @ts-ignore
  expect(mailer.mailer.sendMail.mock.calls[0][0]).toEqual({
    from: "rewieer@gmail.com",
    to: "johndoe@gmail.com",
    text: "Hey"
  });
});
