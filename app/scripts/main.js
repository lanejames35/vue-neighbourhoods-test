//import Vue from 'vue'
//import axios from 'axios'

const app = new Vue({
  el: '#app',
  data: {
    features: [],
    indicators: [],
    selected: ''
  },
  mounted(){
    axios.get('https://opendata.arcgis.com/datasets/29e0d68ac7234bb4b36fa4faf657fa01_29.geojson')
        .then(response => {
          this.features = response.data.features;
          // Get keys fro+m the first object
          // since they're identical
          this.indicators = Object.keys(response.data.features[0].properties);
        })
        .catch(error => {
          console.log(error);
        })
  },
  template: `
  <div>
    <select v-model="selected">
      <option v-for="indicator in indicators"
              v-bind:value="indicator"
      >
        {{ indicator }}
      </option>
    </select>
    <table>
      <tr v-for="feature in features">
        <td>
          {{ feature.properties.COMMON_NAME }}
        </td>
        <td>
          {{ feature.properties[selected] }}
        </td>
      </tr>
    </table>
  </div>
  `,
});