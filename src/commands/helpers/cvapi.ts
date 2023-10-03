const parseSearchQuery = require('./parseSearchQuery');

async function getModel(bot: any, query: Array<string>) {
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

  let queryBuild = "";
  if (pquery) {
    queryBuild += "query=" + pquery.join("+");
  }
  if (author) {
    queryBuild += "&username=" + author;
  }
  if (filter) {
    queryBuild += "&tag=" + filter;
  }
  if (sort) {
    if (sort == "downloads") {
      queryBuild += "&sort=" + "Most Downloaded";
    } else if (sort == "rating") {
      queryBuild += "&sort=" + "Highest Rated";
    } else if (sort == "newest") {
      queryBuild += "&sort=" + "Newest";
    }
  }
  queryBuild += "&limit=" + limit;

  try {
    const apiUrl = 'https://civitai.com/api/v1/models?' + queryBuild;
    //console.log(apiUrl);
    const response = await bot.axios.get(apiUrl);

    // Check if the request was successful (status code 200)
    if (response.status === 200) {
      //console.log(response?.data);
      const resp = response?.data?.items;
      const image = await getImage(bot, resp[0].id);
      resp[0].image = image;
      return resp
    } else {
      //console.error('Request failed with status:', response.status);
      bot.logger.error({text: `Request failed with status: ${response.status}`});
      return undefined;
    }

  } catch (error) {
    //console.error('Error:', error);
    bot.logger.error({text: error});
    return undefined;
  }
}

async function getImage(bot: any, id: string) {
  try {
    const apiUrl = 'https://civitai.com/api/v1/models/' + id
    const response = await bot.axios.get(apiUrl);

    return response?.data?.modelVersions[0]?.images[0]?.url;
  } catch (error) {
    //console.error('Error:', error);
    bot.logger.error({text: error});
    return undefined;
  }
}

module.exports = {
  getModel,
  getImage
}