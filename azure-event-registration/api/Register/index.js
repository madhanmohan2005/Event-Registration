// Azure Function: Register participant
const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = "EventDB";
const containerId = "Registrations";

module.exports = async function (context, req) {
  try {
    const client = new CosmosClient({ endpoint, key });
    const container = client.database(databaseId).container(containerId);

    const registration = {
      id: Date.now().toString(), // unique ID
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      event: req.body.event,
      timestamp: new Date().toISOString(),
    };

    await container.items.create(registration);

    context.res = {
      status: 201,
      body: { message: "Registration successful", registration },
    };
  } catch (err) {
    context.log.error("Error saving registration", err.message);
    context.res = {
      status: 500,
      body: { error: "Failed to save registration" },
    };
  }
};
