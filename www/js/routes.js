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

          // app.views.main.router.navigate('/detalhes/');
          // app.views.main.router.navigate('/carrinho/');

          // $.getScript('js/detalhes.js');

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

          app.views.main.router.navigate('/detalhes/');
          $.getScript('js/detalhes.js');
          
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
      options: {
        transition: 'f7-push',
      },
      on: {
        pageBeforeIn: function () {
          $("#menuPrincipal").hide("fast");
        },
        pageInit: function(event, page) {
          $.getScript('js/carrinho.js');
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
    animate: false,
    on: {
      pageInit: function (event, page) {
        const $page = $(page.el);

        // Alternar tabs login/cadastro
        $page.find('.tab-link').on('click', function (e) {
          e.preventDefault();
          $page.find('.tab-link').removeClass('active');
          $(this).addClass('active');
          const tab = $(this).data('tab');
          $page.find('.tab-content').removeClass('active');
          $page.find('#' + tab).addClass('active');
        });

        // Login
        $page.find('#btn-login').on('click', function () {
          const email = $page.find('#login-email').val().trim();
          const senha = $page.find('#login-senha').val().trim();
          const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
          const usuario = usuarios.find(u => u.email === email && u.senha === senha);

          if (usuario) {
            app.toast.create({ text: `Bem-vindo, ${usuario.nome}!`, position: 'center', closeTimeout: 2000 }).open();
            app.views.main.router.navigate('/index/');
          } else {
            app.dialog.alert('E-mail ou senha inválidos!');
          }
        });

        // Cadastro
        $page.find('#btn-cadastrar').on('click', function () {
          const nome = $page.find('#cad-nome').val().trim();
          const email = $page.find('#cad-email').val().trim();
          const senha = $page.find('#cad-senha').val().trim();

          if (!nome || !email || !senha) {
            app.dialog.alert('Preencha todos os campos!');
            return;
          }

          let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
          if (usuarios.find(u => u.email === email)) {
            app.dialog.alert('E-mail já cadastrado!');
            return;
          }

          usuarios.push({ nome, email, senha });
          localStorage.setItem('usuarios', JSON.stringify(usuarios));

          app.toast.create({ text: 'Cadastro realizado com sucesso!', position: 'center', closeTimeout: 2000 }).open();

          // Limpar campos
          $page.find('#cad-nome').val('');
          $page.find('#cad-email').val('');
          $page.find('#cad-senha').val('');

          // Alternar para login
          $page.find('.tab-link[data-tab="login"]').click();
        });
      }
    }
  }
  ]
});

// Cria a mainView (usada no navegador e mobile)
var mainView = app.views.create('.view-main', { url: '/index/' });

// https://www.youtube.com/watch?v=JG2lcJeQuO8
//OBS - Comandos -> adb devices -> cordova run android

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