const extract = (event) => {
    try {
      return JSON.stringify(event)
    } catch(e) {
      return { error: e?.message }
    }
}

export const handler = async (event) => {
  const response = {
    statusCode: 200,
    body: extract(event),
  };
  return response;
};
