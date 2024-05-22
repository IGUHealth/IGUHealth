import React from "react";

export const template = `
<!doctype html>
<html>
  <body>
    <div
      style='background-color:#F2F5F7;color:#242424;font-family:"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0.15008px;line-height:1.5;margin:0;padding:32px 0;min-height:100%;width:100%'
    >
      <table
        align="center"
        width="100%"
        style="margin:0 auto;max-width:600px;background-color:#FFFFFF"
        role="presentation"
        cellspacing="0"
        cellpadding="0"
        border="0"
      >
        <tbody>
          <tr style="width:100%">
            <td>
              <div style="padding:24px 24px 24px 24px">
                <img
                  alt="IGUHealth"
                  src="https://api.iguhealth.app/public/img/logo.svg"
                  width="100"
                  style="width:100px;outline:none;border:none;text-decoration:none;vertical-align:middle;display:inline-block;max-width:100%"
                />
              </div>
              <div style="font-weight:normal;padding:0px 24px 16px 24px">
                Hi 👋,
              </div>
              <div style="font-weight:normal;padding:0px 24px 16px 24px">
                You&#x27;ve been invited to join IGUHealth tenant
                &#x27;{{tenant}}&#x27;. Accept the invite below to set your
                password. If this is not you please disregard this email.
              </div>
              <div style="padding:16px 24px 24px 24px">
                <a
                  href="https://api.iguhealth.app/auth/invite/{{token}}"
                  style="color:#FFFFFF;font-size:14px;font-weight:bold;background-color:#6366F1;display:inline-block;padding:12px 20px;text-decoration:none"
                  target="_blank"
                  ><span
                    ><!--[if mso
                      ]><i
                        style="letter-spacing: 20px;mso-font-width:-100%;mso-text-raise:30"
                        hidden
                        >&nbsp;</i
                      ><!
                    [endif]--></span
                  ><span>Accept Invite</span
                  ><span
                    ><!--[if mso
                      ]><i
                        style="letter-spacing: 20px;mso-font-width:-100%"
                        hidden
                        >&nbsp;</i
                      ><!
                    [endif]--></span
                  ></a
                >
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>`;

export function Image({ url, alt }: { url: string; alt: string }) {
  return React.createElement(
    "div",
    {
      style: {
        padding: "24px 24px 24px 24px",
      },
    },
    React.createElement("img", {
      alt: alt,
      src: url,
      width: "100",
      style: {
        width: "100px",
        outline: "none",
        border: "none",
        textDecoration: "none",
        verticalAlign: "middle",
        display: "inline-block",
        maxWidth: "100%",
      },
    }),
  );
}

export function Text({ text }: { text: string }) {
  return React.createElement(
    "div",
    {
      style: {
        fontWeight: "normal",
        padding: "0px 24px 16px 24px",
      },
    },
    text,
  );
}

export function Email({ children }: { children: React.ReactNode }) {
  return React.createElement(
    "html",
    null,
    React.createElement(
      "body",
      null,
      React.createElement(
        "div",
        {
          style: {
            backgroundColor: "#F2F5F7",
            color: "#242424",
            fontFamily:
              '"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif',
            fontSize: "16px",
            fontWeight: 400,
            letterSpacing: "0.15008px",
            lineHeight: 1.5,
            margin: 0,
            padding: "32px 0",
            minHeight: "100%",
            width: "100%",
          },
        },
        React.createElement(
          "table",
          {
            align: "center",
            width: "100%",
            style: {
              margin: "0 auto",
              maxWidth: "600px",
              backgroundColor: "#FFFFFF",
            },
            role: "presentation",
            cellspacing: 0,
            cellpadding: 0,
            border: 0,
          },
          React.createElement(
            "tbody",
            null,
            React.createElement(
              "tr",
              {
                style: {
                  width: "100%",
                },
              },
              React.createElement("td", null, children),
            ),
          ),
        ),
      ),
    ),
  );
}

export function Button({ href, title }: { href: string; title: string }) {
  return React.createElement(
    "div",
    {
      style: {
        padding: "16px 24px 24px 24px",
      },
    },
    React.createElement(
      "a",
      {
        href,
        style: {
          color: "#FFFFFF",
          fontSize: "14px",
          fontWeight: "bold",
          backgroundColor: "#6366F1",
          display: "inline-block",
          padding: "12px 20px",
          textDecoration: "none",
        },
        target: "_blank",
        clicktracking: "off",
      },
      React.createElement("span", null, title),
    ),
  );
}
