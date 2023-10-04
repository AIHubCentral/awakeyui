async function getModel(bot: any, psq: any) {
  let pquery = psq.query;
  let sort = psq.sort;
  let author = psq.author;
  let filter = psq.filter;

  let limit = psq.limit || 10;

  // check if query is empty
  if (pquery.length <= 0 || !pquery) {
    return undefined;
  }

  // remove every empty string from query
  pquery = pquery.filter((el: string) => {
    return el != "";
  });

  // GET https://huggingface.co/api/models
  // Payload:
  // params = {
  //     "search":"search",
  //     "author":"author",
  //     "filter":"filter",
  //     "sort":"sort",
  //     "direction":"direction",
  //     "limit":"limit",
  //     "full":"full",
  //     "config":"config"
  // }

  let queryBuild = "";
  if (pquery) {
    queryBuild += "search=" + pquery.join("+");
  }
  if (author) {
    queryBuild += "&author=" + author;
  }
  if (filter) {
    queryBuild += "&filter=" + filter;
  }
  if (sort) {
    queryBuild += "&sort=" + sort;
  }
  queryBuild += "&limit=" + limit;

  queryBuild += "&direction=-1";

  // request json from https://huggingface.co/api/models? + queryBuild
  try {
    const apiUrl = 'https://huggingface.co/api/models?' + queryBuild;
    const response = await bot.axios.get(apiUrl);

    // Check if the request was successful (status code 200)
    if (response.status === 200) {
      // Parse the JSON response
      // Return the data or do other processing as needed
      return response.data;
    } else {
      bot.logger.error({text: `Request failed with status: ${response.status}`});
      return undefined;
    }
  } catch (error) {
    bot.logger.error({text: error});
    return undefined;
  }
}

module.exports = {
  getModel
}