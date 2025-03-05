export function hubspot() {
  let hubspot = document.createElement('script');
  hubspot.setAttribute('src', 'https://js-eu1.hs-scripts.com/145110231.js');
  document.getElementsByTagName('head')[0].appendChild(hubspot);
};

export default hubspot;