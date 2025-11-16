Vue.createApp({
  data() {},
  methods: {
    initialisation_carte () {
      var map = L.map('map').setView([48.8708852, 2.3170585], 15);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      var elysee = L.marker([48.8708852, 2.3170585]);
      var message1 = "Merci beaucoup d'avoir accepté de nous aider. Je commençais à désespérer. Dépechez-vous le temps presse. Le premier ingrédient se trouve dans la silicon valley française.";
      elysee.addTo(map);
      elysee.bindPopup(message1).openPopup();
    },

    ajout_pop_up () {},
    chronometre () {}
  },
}).mount('#jeu');