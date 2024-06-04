type Email = string & { _emailBrand: never };

const EMAIL_REGEX =
  /^[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
// Pulled from https://github.com/manishsaraan/email-validator/blob/master/index.js

export function validateEmail(email: string | undefined): email is Email {
  if (!email) return false;
  const emailParts = email.split("@");
  if (emailParts.length !== 2) return false;

  const account = emailParts[0];
  const address = emailParts[1];

  if (account.length > 64 || address.length > 255) return false;

  const domainParts = address.split(".");

  if (
    domainParts.some(function (part) {
      return part.length > 63;
    })
  )
    return false;

  return EMAIL_REGEX.test(email);
}
