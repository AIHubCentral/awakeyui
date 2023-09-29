const axios = require('axios');

function parseSearchQuery(query: Array<string>) {
  // checkl for:
  // -s or --sort // can be: downloads, author, name, created, updated, size
  // -a or --author // string
  // -f or --filter // tags such as text-classification or spacy

  let returnObject = {
    sort: undefined as string | undefined,
    author: undefined as string | undefined,
    filter: undefined as string | undefined,
    query: undefined as Array<string> | undefined,
  };

  let tmpStr;
  for (let i = 0; i < query.length; i++) {
    if (query[i].startsWith("-")) {
      if (query[i] == "-s" || query[i] == "--sort") {
        try {
          tmpStr = query[i + 1].toLowerCase();
          if (tmpStr == "downloads" || tmpStr == "author" || tmpStr == "name" || tmpStr == "created" || tmpStr == "updated" || tmpStr == "size") {
            // cut off the -s or --sort and the sort type
            query.splice(i, 2);
            returnObject.sort = tmpStr;
          } else {
            // cut off the -s or --sort
            query.splice(i, 1);
          }
        } catch (err) {
          // cut off the -s or --sort
          query.splice(i, 1);
        }
      } else if (query[i] == "-a" || query[i] == "--author") {
        try {
          tmpStr = query[i + 1];
          // cut off the -a or --author and the author name
          query.splice(i, 2);
          returnObject.author = tmpStr;
        } catch (err) {
          // cut off the -a or --author
          query.splice(i, 1);
        }
      } else if (query[i] == "-f" || query[i] == "--filter") {
        try {
          tmpStr = query[i + 1].toLowerCase();
          // cut off the -f or --filter and the filter type
          query.splice(i, 2);
          returnObject.filter = tmpStr;
        } catch (err) {
          // cut off the -f or --filter
          query.splice(i, 1);
        }
      }
    }
  }

  // return object with:
  // {
  //   sort: "sort",
  //   author: "author"
  //   filter: "filter"
  //   query: ["query", "array"]
  // }

  returnObject.query = query;
  console.log(returnObject);
  return returnObject;

}

async function getModel(query: Array<string>) {
  const psq = parseSearchQuery(query);
  let pquery = psq.query;
  let sort = psq.sort;
  let author = psq.author;
  let filter = psq.filter;

  // check if query is empty
  if (query.length <= 0 || !pquery) {
    return undefined;
  }

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
  queryBuild += "&limit=10";

  // request json from https://huggingface.co/api/models? + queryBuild

  try {
    const apiUrl = 'https://huggingface.co/api/models?' + queryBuild;
    const response = await axios.get(apiUrl);

    // Check if the request was successful (status code 200)
    if (response.status === 200) {
      // Parse the JSON response
      const data = response.data;

      // You can now work with the JSON data here
      console.log(data);

      // Return the data or do other processing as needed
      return data;
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