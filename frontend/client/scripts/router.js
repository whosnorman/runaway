Router.configure({
  layoutTemplate: 'mainLayout',
  templateNameConverter: 'upperCamelCase'
});

Router.map(function() {
  this.route('frontPage', {
    path: '/'
  });

  this.route('mapsPage', {
    path: '/maps'
  });

  this.route('thanksPage', {
  	path:'/thanks'
  });
});

