const axios = require('axios');
const parseSearchQuery = require('./parseSearchQuery');

async function getModel(query: Array<string>) {
  const psq = parseSearchQuery(query);
  let pquery = psq.query;
  let sort = psq.sort;
  let author = psq.author;
  let filter = psq.filter;

  // temporary limit, should be 1 when released
  let limit = psq.limit || 10;

  // check if query is empty
  if (query.length <= 0 || !pquery) {
    return undefined;
  }

  // remove every empty string from query
  pquery = pquery.filter((el: string) => {
    return el != "";
  });

  const qjson = {
    "json": {
      "limit": limit,
      "tagFilters": filter ? [filter] : [],
      "search": pquery.join("+"),
      "sortFilter": sort,
      "source": "all",
      "cursor": null
    },
    "meta": {
      "values": {
        "cursor": ["undefined"]
      }
    }
  }

  try {
    const apiUrl = 'https://www.weights.gg/api/trpc/models.getAll?input=' + JSON.stringify(qjson);
    const response = await axios.get(apiUrl);

    // Check if the request was successful (status code 200)
    if (response.status === 200) {
      const resp = response?.data?.result?.data?.json;

      if (author) {
        for (const model of resp) {
          if (model?.content?.discordUser != author.toLowerCase()) {
            resp.splice(resp.indexOf(model), 1);
          }
        }
      }

      return resp;
    } else {
      console.error('Request failed with status:', response.status);
      return undefined;
    }

  } catch (error) {
    console.error('Error:', error);
    return undefined;
  }
}

module.exports = {
  getModel
}