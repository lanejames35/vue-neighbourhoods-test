//import Vue from 'vue'
//import axios from 'axios'

Vue.component('l-map', window.Vue2Leaflet.LMap);
Vue.component('l-tile-layer', window.Vue2Leaflet.LTileLayer);
Vue.component('l-geo-json', window.Vue2Leaflet.LGeoJson);

const app = new Vue({
  el: '#app',
  data: {
    features: [],
    indicators: [],
    selected: '',
    center: [43.9073, -78.9560],
    zoom: 10,
    url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
    geojson: null,
  },
  computed: {
    // Set style and fill colour methods here
    fillColor() {
      return this.features.forEach(function(element){
        element.properties[this.selected] < 10 ? 'blue' : 'pink';
      });
    },
    styleFunction() {
      const fill = this.fillColor;
      return () => {
        return {
          weight: 2,
          opacity: 1,
          color: '#eceff1',
          fillColor: fill,
          fillOpacity: 1,
        };
      };
    },
  },
  created(){
    axios.get('https://opendata.arcgis.com/datasets/29e0d68ac7234bb4b36fa4faf657fa01_29.geojson')
        .then(response => {
          this.features = response.data.features;
          // Get keys fro+m the first object
          // since they're identical
          this.indicators = Object.keys(response.data.features[0].properties);
          this.geojson = response.data;
        })
        .catch(error => {
          console.log(error);
        })
  },
  template: `
  <div>
    <select v-model="selected">
      <option v-for="indicator in indicators"
              v-bind:value="indicator" >
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
    <l-map
      :zoom="zoom"
      :center="center"
      style="height: 400px" >
      <l-tile-layer
        :url="url"
        :attribution="attribution" >
      </l-tile-layer>
      <l-geo-json
        :geojson="geojson"
        :options-style="styleFunction" >
      </l-geo-json>
    </l-map>
  </div>
  `,
});