function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.clientName || "",
      data.clientEmail || "",
      data.clientPhone || "",
      data.roomType || "",
      data.roomArea || ""
    ]);

    MailApp.sendEmail(
      "jcronje223@gmail.com",
      "New Quote Request",
      "New quote from " + data.clientName
    );

    sendWhatsAppAlert(data);

    return ContentService.createTextOutput(JSON.stringify({
      success: true
    }));

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    }));
  }
}

function sendWhatsAppAlert(data) {

  const accountSid = "AC568d9505d09382956b95103c630e5554";
  const authToken = "33dfb3b3fa0f3bb9395d21820c1b35e8";

  const url = "https://api.twilio.com/2010-04-01/Accounts/" + accountSid + "/Messages.json";

  const payload = {
    To: "whatsapp:+27765712206",
    From: "whatsapp:+14155238886",
    Body: "🚨 NEW QUOTE 🚨\nName: " + data.clientName + "\nPhone: " + data.clientPhone
  };

  const options = {
    method: "post",
    payload: payload,
    headers: {
      Authorization: "Basic " + Utilities.base64Encode(accountSid + ":" + authToken)
    }
  };

  UrlFetchApp.fetch(url, options);
}
