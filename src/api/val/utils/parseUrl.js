const parseUrl = (uri) => {
  let url = new URL(uri);
  let params = new URLSearchParams(url.hash.substring(1));
  let access_token = params.get("access_token");
  let id_token = params.get("id_token");
  let expires_in = parseInt(params.get("expires_in"));

  return { access_token, id_token, expires_in };
};

module.exports = { parseUrl };
