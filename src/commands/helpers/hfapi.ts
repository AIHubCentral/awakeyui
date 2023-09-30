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
    // temporary, remove when released
    limit: undefined as number | undefined,
  };

  let tmpStr: string;
  const qlength = parseInt(query.length.toString()); // pls don't kill me
  for (let i = 0; i < qlength; i++) {
    //console.log(query[i]);
    if (query[i]?.startsWith("-")) {
      if (query[i] == "-s" || query[i] == "--sort") {
        //console.log("sort");
        //console.log(query[i + 1]);
        try {
          tmpStr = query[i + 1].toLowerCase();
          if (tmpStr == "downloads" || tmpStr == "author" || tmpStr == "name" || tmpStr == "created" || tmpStr == "updated" || tmpStr == "size") {
            // cut off the -s or --sort and the sort type
            query[i] = ""
            query[i + 1] = ""
            returnObject.sort = tmpStr;
          } else {
            // cut off the -s or --sort
            query[i] = ""
          }
        } catch (err) {
          // cut off the -s or --sort
          query[i] = ""
        }
      } else if (query[i] == "-a" || query[i] == "--author") {
        //console.log("author");
        //console.log(query[i + 1]);
        try {
          tmpStr = query[i + 1];
          // cut off the -a or --author and the author name
          query[i] = ""
          query[i + 1] = ""
          returnObject.author = tmpStr;
        } catch (err) {
          // cut off the -a or --author
          query[i] = ""
        }
      } else if (query[i] == "-f" || query[i] == "--filter") {
        //console.log("filter");
        //console.log(query[i + 1]);
        try {
          tmpStr = query[i + 1].toLowerCase();
          // cut off the -f or --filter and the filter type
          query[i] = ""
          query[i + 1] = ""
          returnObject.filter = tmpStr;
        } catch (err) {
          // cut off the -f or --filter
          query[i] = ""
        }
        // temporary, remove when released
      } else if (query[i] == "-l" || query[i] == "--limit") {
        //console.log("limit");
        //console.log(query[i + 1]);
        try {
          tmpStr = query[i + 1];
          // cut off the -l or --limit and the limit
          query[i] = ""
          query[i + 1] = ""
          returnObject.limit = parseInt(tmpStr);
        } catch (err) {
          // cut off the -l or --limit
          query[i] = ""
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
  //console.log(returnObject);
  return returnObject;

}

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
  pquery = pquery.filter((el) => {
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
    const response = await axios.get(apiUrl);

    // Check if the request was successful (status code 200)
    if (response.status === 200) {
      // Parse the JSON response
      // Return the data or do other processing as needed
      return response.data;
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