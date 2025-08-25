// Azure Function: Get all registrations
const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = "EventDB";
const containerId = "Registrations";

module.exports = async function (context, req) {
  try {
    const client = new CosmosClient({ endpoint, key });
    const container = client.database(databaseId).container(containerId);

    const query = "SELECT * FROM c ORDER BY c.timestamp DESC";
    const { resources: registrations } = await container.items
      .query(query)
      .fetchAll();

    context.res = {
      status: 200,
      body: registrations,
    };
  } catch (err) {
    context.log.error("Error fetching registrations", err.message);
    context.res = {
      status: 500,
      body: { error: "Failed to fetch registrations" },
    };
  }
};
