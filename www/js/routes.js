// Espera o dispositivo estar pronto
document.addEventListener('deviceready', onDeviceReady, false);

// Inicialização do Framework7
var app = new Framework7({
  el: '#app',
  name: 'Green Tech',
  id: 'com.myapp.test',
  panel: { swipe: true },
  dialog: { buttonOk: 'Sim', buttonCancel: 'Cancelar' },
  routes: [
    {
      path: '/index/',
      url: 'index.html',
      animate: false,
      on: {
        pageBeforeIn: function () {
          $("#menuPrincipal").show("fast");
        },
        pageInit: function () {
          // Inicializa Swiper principal
          new Swiper(".mySwiper", {
            slidesPerView: 1,
            spaceBetween: 30,
            autoplay: { delay: 3000 },
            breakpoints: {
              640: { slidesPerView: 2, spaceBetween: 30 },
              992: { slidesPerView: 3, spaceBetween: 30 },
              1200: { slidesPerView: 4, spaceBetween: 30 }
            },
            // pagination: { el: ".swiper-pagination", clickable: true }
          });

          // Inicializa Swiper categorias
          new Swiper(".categorias", {
            slidesPerView: 3,
            spaceBetween: 10,
            breakpoints: {
              640: { slidesPerView: 3, spaceBetween: 30 },
              992: { slidesPerView: 3, spaceBetween: 30 },
              1200: { slidesPerView: 4, spaceBetween: 30 }
            },
            // pagination: { el: ".swiper-pagination", clickable: true }
          });

          // Eventos adicionais (ex.: filtro de categorias)
          $(".filter-btn").click(function() {
            $(".filter-btn").removeClass("active");
            $(this).addClass("active");
          });
        }
      }
    },
    {
      path: '/detalhes/',
      url: 'detalhes.html',
      animate: false,
      on: {
        pageBeforeIn: function () {
          $("#menuPrincipal").hide("fast");
        },
        pageInit: function () {
          // Evento botão adicionar ao carrinho
          $(".add-cart").click(function () {
            app.dialog.alert("Produto adicionado ao carrinho!");
          });

          // Botões de ação (favorito / share)
          $(".prod-detail .buttons-top a:nth-child(2)").click(function () {
            app.dialog.alert("Produto adicionado aos favoritos!");
          });
          $(".prod-detail .buttons-top a:nth-child(3)").click(function () {
            app.dialog.alert("Compartilhar produto!");
          });
        }
      }
    },
    {
      path: '/carrinho/',
      url: 'carrinho.html',
      animate: false,
      on: {
        pageBeforeIn: function () {
          $("#menuPrincipal").hide("fast");
        }
      }
    },
    {
      path: '/link2/',
      url: 'link2.html',
      animate: false
    },
    {
      path: '/link3/',
      url: 'link3.html',
      animate: false
    },
    {
      path: '/link4/',
      url: 'link4.html',
      animate: false
    }
  ]
});

// Cria a mainView (usada no navegador e mobile)
var mainView = app.views.create('.view-main', { url: '/index/' });

// Atualiza botão ativo do menu inferior
app.on('routeChange', function (route) {
  var currentRoute = route.url;
  document.querySelectorAll('.tab-link').forEach(el => el.classList.remove('active'));
  var targetEl = document.querySelector('.tab-link[href="' + currentRoute + '"]');
  if (targetEl) targetEl.classList.add('active');
});

// Backbutton Android
function onDeviceReady() {
  document.addEventListener("backbutton", function (e) {
    if (mainView.router.currentRoute.path === '/index/') {
      e.preventDefault();
      app.dialog.confirm('Deseja sair do aplicativo?', function () {
        navigator.app.exitApp();
      });
    } else {
      e.preventDefault();
      mainView.router.back({ force: true });
    }
  }, false);
}
