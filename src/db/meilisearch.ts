import MeiliSearch from "meilisearch";


const meili: MeiliSearch = new MeiliSearch({
    host: 'http://127.0.0.1:7700',
    apiKey: '',
  })


export default meili