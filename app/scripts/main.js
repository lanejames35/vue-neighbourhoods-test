//import Vue from 'vue'
//import axios from 'axios'

Vue.component('l-map', window.Vue2Leaflet.LMap);
Vue.component('l-tile-layer', window.Vue2Leaflet.LTileLayer);
Vue.component('l-geo-json', window.Vue2Leaflet.LGeoJson);

const app = new Vue({
  el: '#app',
  data: {
    geojson: [],
    indicators: [],
    selected: null,
    center: [43.9073, -78.9560],
    zoom: 8,
    url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
    fillColor: '#33f4f4',
  },
  computed: {
    styleFunction() {
      const select = this.selected;
      return (feature) => {
        const fill = feature.properties[select] < 20 ? 'blue' : 'pink';
        return {
          weight: 2,
          opacity: 1,
          color: '#eceff1',
          fillColor: fill,
          fillOpacity: 0.5,
        }; 
      };
    },
  },
  created(){
    axios.get('https://opendata.arcgis.com/datasets/29e0d68ac7234bb4b36fa4faf657fa01_29.geojson')
        .then(response => {
          this.geojson = response.data;
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
              v-bind:value="indicator" >
        {{ indicator }}
      </option>
    </select>
    <table>
      <tr v-for="feature in geojson.features">
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