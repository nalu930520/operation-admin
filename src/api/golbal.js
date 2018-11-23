
export function queryCountry() {
  return fetch('https://api.mobimecdn.com/public/country').then((response) => { return response.json() })
}
export function queryCurrency() {
  return fetch('https://api.mobimecdn.com/public/currency').then((response) => { return response.json() })
}
